import { describe, expect, it } from 'vitest';
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './token.service.js';

describe('token service', () => {
  it('creates and verifies a typed access token', () => {
    const token = createAccessToken('user-123', ['registrar']);
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.type).toBe('access');
    expect(payload.roles).toEqual(['registrar']);
  });

  it('creates and verifies a refresh token with rotation identifiers', () => {
    const token = createRefreshToken('user-123', 'session-456', 'family-789');
    const payload = verifyRefreshToken(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.sid).toBe('session-456');
    expect(payload.fid).toBe('family-789');
    expect(payload.jti).toBeTruthy();
    expect(hashToken(token)).toHaveLength(64);
  });
});
