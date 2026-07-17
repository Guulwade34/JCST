import type { AuthUser } from '@jcst/shared';
import type { RequestHandler } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../../app.js';
import type { AuthServiceContract } from './auth.types.js';

const user: AuthUser = {
  id: '507f1f77bcf86cd799439011',
  email: 'admin@jcst.edu.so',
  firstName: 'System',
  lastName: 'Administrator',
  displayName: 'System Administrator',
  roles: ['super-admin'],
  status: 'active',
  emailVerified: true,
  lastLoginAt: '2026-07-11T00:00:00.000Z',
};

const createService = (): AuthServiceContract => ({
  login: vi.fn().mockResolvedValue({
    user,
    accessToken: 'access-token',
    refreshToken: 'refresh-token-1',
  }),
  refresh: vi.fn().mockResolvedValue({
    user,
    accessToken: 'access-token-2',
    refreshToken: 'refresh-token-2',
  }),
  logout: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockResolvedValue(user),
});

const authenticated: RequestHandler = (req, _res, next) => {
  req.auth = {
    userId: user.id,
    roles: ['super-admin'],
    permissions: [],
  };
  next();
};

describe('authentication routes', () => {
  it('validates login, returns the safe user, and sets an HTTP-only cookie', async () => {
    const service = createService();
    const app = createApp({ authService: service, authenticate: authenticated });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'ADMIN@JCST.EDU.SO',
      password: 'ChangeMe-Immediately-2026!',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe('admin@jcst.edu.so');
    expect(response.body.data.accessToken).toBe('access-token');
    expect(response.body.data.refreshToken).toBeUndefined();
    expect(response.headers['set-cookie']?.[0]).toContain('HttpOnly');
    expect(service.login).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'admin@jcst.edu.so' }),
      expect.objectContaining({ ipAddress: expect.any(String) }),
    );
  });

  it('rejects an invalid login body before calling the service', async () => {
    const service = createService();
    const app = createApp({ authService: service, authenticate: authenticated });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'not-an-email',
      password: 'short',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
    expect(service.login).not.toHaveBeenCalled();
  });

  it('rotates the refresh cookie', async () => {
    const service = createService();
    const app = createApp({ authService: service, authenticate: authenticated });
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'admin@jcst.edu.so',
      password: 'ChangeMe-Immediately-2026!',
    });
    const response = await agent.post('/api/v1/auth/refresh');

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBe('access-token-2');
    expect(service.refresh).toHaveBeenCalledWith(
      'refresh-token-1',
      expect.objectContaining({ ipAddress: expect.any(String) }),
    );
    expect(response.headers['set-cookie']?.[0]).toContain('HttpOnly');
  });

  it('clears the cookie during logout and keeps logout idempotent', async () => {
    const service = createService();
    const app = createApp({ authService: service, authenticate: authenticated });
    const agent = request.agent(app);

    await agent.post('/api/v1/auth/login').send({
      email: 'admin@jcst.edu.so',
      password: 'ChangeMe-Immediately-2026!',
    });
    const response = await agent.post('/api/v1/auth/logout');

    expect(response.status).toBe(200);
    expect(service.logout).toHaveBeenCalledWith('refresh-token-1');
    expect(response.headers['set-cookie']?.[0]).toContain('Expires=Thu, 01 Jan 1970');
  });

  it('returns the authenticated current user', async () => {
    const service = createService();
    const app = createApp({ authService: service, authenticate: authenticated });

    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(200);
    expect(response.body.data.user.id).toBe(user.id);
    expect(service.getCurrentUser).toHaveBeenCalledWith(user.id);
  });
});
