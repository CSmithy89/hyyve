/**
 * Guardrail Tests: Custom Auth Flows must use Clerk
 */

import { describe, it, expect } from 'vitest';
import { readRequiredFile } from '../support/file-helpers';

const clerkImportPattern = /@clerk\/nextjs/;

describe('Custom Auth Flows use Clerk', () => {
  it('login form uses Clerk hooks', () => {
    const content = readRequiredFile('components/auth/login-form.tsx');
    expect(content).toMatch(clerkImportPattern);
    expect(content).toMatch(/useSignIn/);
  });

  it('forgot password form uses Clerk hooks', () => {
    const content = readRequiredFile('components/auth/forgot-password-form.tsx');
    expect(content).toMatch(clerkImportPattern);
    expect(content).toMatch(/useSignIn/);
  });

  it('reset password form uses Clerk hooks', () => {
    const content = readRequiredFile('components/auth/reset-password-form.tsx');
    expect(content).toMatch(clerkImportPattern);
    expect(content).toMatch(/useSignIn/);
  });

  it('registration form uses Clerk hooks', () => {
    const content = readRequiredFile('components/auth/registration-form.tsx');
    expect(content).toMatch(clerkImportPattern);
    expect(content).toMatch(/useSignUp/);
  });
});
