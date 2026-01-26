/**
 * ATDD Tests for Story 0.1.21: Configure Resend Email Service
 *
 * Validates Resend email service configuration and templates.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const webAppPath = join(projectRoot, 'apps/web');
const emailTemplatesPath = join(projectRoot, 'packages/@platform/email-templates');

describe('Story 0.1.21: Configure Resend Email Service', () => {
  let webPackageJson: Record<string, unknown>;

  beforeAll(() => {
    const webPackagePath = join(webAppPath, 'package.json');
    if (existsSync(webPackagePath)) {
      webPackageJson = JSON.parse(readFileSync(webPackagePath, 'utf-8'));
    }
  });

  describe('Resend Package', () => {
    it('should have resend dependency in apps/web', () => {
      const deps = {
        ...(webPackageJson?.dependencies as Record<string, string>),
        ...(webPackageJson?.devDependencies as Record<string, string>),
      };
      expect('resend' in deps).toBe(true);
    });
  });

  describe('Email Service', () => {
    let emailServiceContent: string;

    beforeAll(() => {
      const servicePath = join(webAppPath, 'lib/email/resend.ts');
      if (existsSync(servicePath)) {
        emailServiceContent = readFileSync(servicePath, 'utf-8');
      }
    });

    it('should have lib/email directory', () => {
      expect(existsSync(join(webAppPath, 'lib/email'))).toBe(true);
    });

    it('should have resend.ts email service', () => {
      expect(existsSync(join(webAppPath, 'lib/email/resend.ts'))).toBe(true);
    });

    it('should import from resend', () => {
      expect(emailServiceContent).toMatch(/from ['"]resend['"]/);
    });

    it('should reference RESEND_API_KEY', () => {
      expect(emailServiceContent).toMatch(/RESEND_API_KEY/);
    });

    it('should have sendEmail function', () => {
      expect(emailServiceContent).toMatch(/sendEmail|send.*Email/);
    });
  });

  describe('Email Templates Package', () => {
    it('should have packages/@platform/email-templates directory', () => {
      expect(existsSync(emailTemplatesPath)).toBe(true);
    });

    it('should have package.json with @platform/email-templates name', () => {
      const packagePath = join(emailTemplatesPath, 'package.json');
      expect(existsSync(packagePath)).toBe(true);

      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      expect(packageJson.name).toBe('@platform/email-templates');
    });

    it('should have @react-email/components dependency', () => {
      const packagePath = join(emailTemplatesPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      const deps = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };
      expect('@react-email/components' in deps).toBe(true);
    });
  });

  describe('Email Templates', () => {
    it('should have email verification template', () => {
      const templatePath = join(
        emailTemplatesPath,
        'src/templates/verification.tsx'
      );
      expect(existsSync(templatePath)).toBe(true);

      const content = readFileSync(templatePath, 'utf-8');
      expect(content).toMatch(/verif|confirm/i);
    });

    it('should have password reset template', () => {
      const templatePath = join(
        emailTemplatesPath,
        'src/templates/password-reset.tsx'
      );
      expect(existsSync(templatePath)).toBe(true);

      const content = readFileSync(templatePath, 'utf-8');
      expect(content).toMatch(/password|reset/i);
    });

    it('should have team invitation template', () => {
      const templatePath = join(
        emailTemplatesPath,
        'src/templates/team-invitation.tsx'
      );
      expect(existsSync(templatePath)).toBe(true);

      const content = readFileSync(templatePath, 'utf-8');
      expect(content).toMatch(/invit|team/i);
    });

    it('should have workflow completion template', () => {
      const templatePath = join(
        emailTemplatesPath,
        'src/templates/workflow-completion.tsx'
      );
      expect(existsSync(templatePath)).toBe(true);

      const content = readFileSync(templatePath, 'utf-8');
      expect(content).toMatch(/workflow|complete/i);
    });

    it('should have budget alert template', () => {
      const templatePath = join(
        emailTemplatesPath,
        'src/templates/budget-alert.tsx'
      );
      expect(existsSync(templatePath)).toBe(true);

      const content = readFileSync(templatePath, 'utf-8');
      expect(content).toMatch(/budget|alert/i);
    });

    it('should have templates index exporting all templates', () => {
      const indexPath = join(emailTemplatesPath, 'src/templates/index.ts');
      expect(existsSync(indexPath)).toBe(true);
    });
  });

  describe('Webhook Handler', () => {
    let webhookContent: string;

    beforeAll(() => {
      const webhookPath = join(
        webAppPath,
        'app/api/webhooks/resend/route.ts'
      );
      if (existsSync(webhookPath)) {
        webhookContent = readFileSync(webhookPath, 'utf-8');
      }
    });

    it('should have webhook route handler', () => {
      expect(
        existsSync(join(webAppPath, 'app/api/webhooks/resend/route.ts'))
      ).toBe(true);
    });

    it('should export POST handler', () => {
      expect(webhookContent).toMatch(/export.*POST/);
    });

    it('should handle delivery status events', () => {
      expect(webhookContent).toMatch(
        /delivered|bounced|complained|status/i
      );
    });
  });

  describe('Environment Variables', () => {
    let envExampleContent: string;

    beforeAll(() => {
      const envPath = join(projectRoot, '.env.example');
      if (existsSync(envPath)) {
        envExampleContent = readFileSync(envPath, 'utf-8');
      }
    });

    it('should document RESEND_API_KEY', () => {
      expect(envExampleContent).toMatch(/RESEND_API_KEY/);
    });

    it('should document RESEND_FROM_EMAIL', () => {
      expect(envExampleContent).toMatch(/RESEND_FROM_EMAIL/);
    });
  });

  describe('Package Exports', () => {
    it('should have main index.ts exporting templates', () => {
      const indexPath = join(emailTemplatesPath, 'src/index.ts');
      expect(existsSync(indexPath)).toBe(true);

      const content = readFileSync(indexPath, 'utf-8');
      expect(content).toMatch(/export.*from.*templates/);
    });

    it('should have tsconfig.json', () => {
      expect(existsSync(join(emailTemplatesPath, 'tsconfig.json'))).toBe(true);
    });
  });
});
