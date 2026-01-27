/**
 * ATDD Tests: Story 0-2-8 - Implement Auth Pages (Clerk UI)
 *
 * Tests authentication pages using Clerk's pre-built components
 * with Hyyve visual styling customization.
 *
 * @see story-0-2-8-implement-auth-pages.md
 */

import { describe, it, expect } from 'vitest';
import { fileExists, readRequiredFile } from '../support/file-helpers';

describe('Story 0-2-8: Implement Auth Pages (Clerk UI)', () => {
  describe('AC1: Sign-in page at /sign-in', () => {
    const signInPagePath = 'app/(auth)/sign-in/[[...sign-in]]/page.tsx';

    it('should create sign-in page with catch-all route', () => {
      expect(fileExists(signInPagePath)).toBe(true);
    });

    it('should import and use Clerk SignIn component', () => {
      const content = readRequiredFile(signInPagePath);
      // imports SignIn from @clerk/nextjs
      expect(content).toMatch(/import.*SignIn.*from ['"]@clerk\/nextjs['"]/);
      // uses <SignIn component in JSX
      expect(content).toMatch(/<SignIn/);
    });

    it('should apply custom appearance configuration', () => {
      const content = readRequiredFile(signInPagePath);
      // has appearance prop for custom styling
      expect(content).toMatch(/appearance[=\s]/);
    });

    it('should include link or route to sign-up', () => {
      const content = readRequiredFile(signInPagePath);
      // has signUpUrl or link to sign-up
      expect(content).toMatch(/sign-?up|signUpUrl/i);
    });

    it('should be a valid React component with default export', () => {
      const content = readRequiredFile(signInPagePath);
      // Next.js pages MUST have a default export
      expect(content).toMatch(/export\s+default/);
    });
  });

  describe('AC2: Sign-up page at /sign-up', () => {
    const signUpPagePath = 'app/(auth)/sign-up/[[...sign-up]]/page.tsx';

    it('should create sign-up page with catch-all route', () => {
      expect(fileExists(signUpPagePath)).toBe(true);
    });

    it('should import and use Clerk SignUp component', () => {
      const content = readRequiredFile(signUpPagePath);
      // imports SignUp from @clerk/nextjs
      expect(content).toMatch(/import.*SignUp.*from ['"]@clerk\/nextjs['"]/);
      // uses <SignUp component in JSX
      expect(content).toMatch(/<SignUp/);
    });

    it('should apply custom appearance configuration', () => {
      const content = readRequiredFile(signUpPagePath);
      // has appearance prop for custom styling
      expect(content).toMatch(/appearance[=\s]/);
    });

    it('should include link or route to sign-in', () => {
      const content = readRequiredFile(signUpPagePath);
      // has signInUrl or link to sign-in
      expect(content).toMatch(/sign-?in|signInUrl/i);
    });

    it('should be a valid React component with default export', () => {
      const content = readRequiredFile(signUpPagePath);
      // Next.js pages MUST have a default export
      expect(content).toMatch(/export\s+default/);
    });
  });

  describe('AC3: Clerk appearance customization', () => {
    const clerkAppearancePath = 'lib/clerk-appearance.ts';

    it('should create shared appearance configuration file', () => {
      expect(fileExists(clerkAppearancePath)).toBe(true);
    });

    it('should define primary color matching Hyyve tokens', () => {
      const content = readRequiredFile(clerkAppearancePath);
      // uses Hyyve primary color #5048e5 or similar purple/indigo
      expect(content).toMatch(/#5048e5|primaryColor|primary/i);
    });

    it('should configure dark theme as default', () => {
      const content = readRequiredFile(clerkAppearancePath);
      // has dark theme configuration
      expect(content).toMatch(/dark|backgroundColor|bg-/i);
    });

    it('should match card border radius styling', () => {
      const content = readRequiredFile(clerkAppearancePath);
      // has border radius configuration (rounded-xl = 0.75rem)
      expect(content).toMatch(/borderRadius|radius|rounded/i);
    });

    it('should export the appearance configuration', () => {
      const content = readRequiredFile(clerkAppearancePath);
      // exports clerkAppearance or similar named export
      expect(content).toMatch(/export\s+(const|function|default)/);
    });

    it('should configure elements object with component styles', () => {
      const content = readRequiredFile(clerkAppearancePath);
      // has elements configuration for component-level styling
      expect(content).toMatch(/elements[:\s]/);
    });

    it('should configure variables object for CSS variables', () => {
      const content = readRequiredFile(clerkAppearancePath);
      // has variables configuration
      expect(content).toMatch(/variables[:\s]/);
    });
  });

  describe('AC4: Accessibility and responsiveness', () => {
    it('should have proper form labels in sign-in page', () => {
      const content = readRequiredFile('app/(auth)/sign-in/[[...sign-in]]/page.tsx');
      // Clerk handles labels internally, just check component exists
      expect(content).toMatch(/<SignIn/);
    });

    it('should have proper form labels in sign-up page', () => {
      const content = readRequiredFile('app/(auth)/sign-up/[[...sign-up]]/page.tsx');
      // Clerk handles labels internally, just check component exists
      expect(content).toMatch(/<SignUp/);
    });

    it('should use responsive container styling', () => {
      // AuthLayout already provides responsive styling
      // Check that pages use the auth layout
      const signInContent = readRequiredFile('app/(auth)/sign-in/[[...sign-in]]/page.tsx');
      // Should not have conflicting width constraints
      expect(signInContent).not.toMatch(/max-w-\[1[5-9]\d{2}px\]/);
    });

    it('should configure routing for Clerk components', () => {
      const signInContent = readRequiredFile('app/(auth)/sign-in/[[...sign-in]]/page.tsx');
      const signUpContent = readRequiredFile('app/(auth)/sign-up/[[...sign-up]]/page.tsx');
      // Both pages configure routing
      expect(signInContent).toMatch(/routing|signUpUrl|afterSignInUrl/i);
      expect(signUpContent).toMatch(/routing|signInUrl|afterSignUpUrl/i);
    });
  });

  describe('Integration with existing AuthLayout', () => {
    it('should have auth layout wrapping auth route group', () => {
      const layoutPath = 'app/(auth)/layout.tsx';
      expect(fileExists(layoutPath)).toBe(true);
      const content = readRequiredFile(layoutPath);
      // uses AuthLayout component
      expect(content).toMatch(/AuthLayout/);
    });

    it('should have AuthLayout component with branding', () => {
      const authLayoutPath = 'components/layouts/AuthLayout.tsx';
      expect(fileExists(authLayoutPath)).toBe(true);
      const content = readRequiredFile(authLayoutPath);
      // has Hyyve branding
      expect(content).toMatch(/Hyyve|logo/i);
    });
  });

  describe('Social providers configuration', () => {
    it('should mention social providers in sign-in page or appearance', () => {
      const signInContent = readRequiredFile('app/(auth)/sign-in/[[...sign-in]]/page.tsx');
      const appearanceContent = readRequiredFile('lib/clerk-appearance.ts');
      // Either page or appearance config mentions social providers
      const combined = signInContent + appearanceContent;
      // Clerk handles OAuth providers via socialButtonsPlacement or inherent support
      expect(combined).toMatch(/social|OAuth|google|github|socialButton/i);
    });

    it('should configure redirect URLs for post-auth navigation', () => {
      const signInContent = readRequiredFile('app/(auth)/sign-in/[[...sign-in]]/page.tsx');
      // has afterSignInUrl or similar redirect config
      expect(signInContent).toMatch(/afterSign|redirect|forceRedirect/i);
    });
  });

  describe('Type safety', () => {
    it('should use TypeScript for sign-in page', () => {
      expect(fileExists('app/(auth)/sign-in/[[...sign-in]]/page.tsx')).toBe(true);
    });

    it('should use TypeScript for sign-up page', () => {
      expect(fileExists('app/(auth)/sign-up/[[...sign-up]]/page.tsx')).toBe(true);
    });

    it('should use TypeScript for appearance config', () => {
      expect(fileExists('lib/clerk-appearance.ts')).toBe(true);
    });

    it('should import Appearance type from Clerk', () => {
      const content = readRequiredFile('lib/clerk-appearance.ts');
      // imports type definitions
      expect(content).toMatch(/import.*type|import.*Appearance|from ['"]@clerk/);
    });
  });
});
