import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.service.js';

describe('password service', () => {
  it('hashes a password and verifies only the matching value', async () => {
    const hash = await hashPassword('Correct-Horse-Battery-Staple-2026!');

    expect(hash).not.toContain('Correct-Horse');
    await expect(verifyPassword('Correct-Horse-Battery-Staple-2026!', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });
});
