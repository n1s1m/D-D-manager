import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema } from '../auth';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'secret',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true);
    }
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'a@b.co',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('accepts valid signup data with matching passwords', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects when passwords do not match', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('confirmPassword'));
      expect(confirmError).toBeDefined();
    }
  });

  it('rejects password shorter than 6 characters', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional name', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: 'Alice',
    });
    expect(result.success).toBe(true);
  });
});
