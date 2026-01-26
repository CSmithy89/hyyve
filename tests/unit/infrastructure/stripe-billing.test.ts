import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.11: Configure Stripe Billing
 *
 * ATDD Tests for Stripe Billing Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Stripe Package Installed
 * - AC2: Stripe Client Configured
 * - AC3: Webhook Handler Created
 * - AC4: Webhook Signature Verification
 * - AC5: Event Types Defined
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-11-configure-stripe-billing.md
 */

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.11: Configure Stripe Billing', () => {
  describe('AC1: Stripe Package Installed', () => {
    let packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(WEB_APP_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have stripe package installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['stripe']).toBeDefined();
    });

    it('should have stripe version >= 20.0.0', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const version = deps['stripe'];
      expect(version).toBeDefined();
      // Extract major version number (handles ^20.0.0, ~20.0.0, 20.0.0, etc.)
      const majorVersion = parseInt(version?.replace(/[\^~>=<]/g, '').split('.')[0] ?? '0', 10);
      expect(majorVersion).toBeGreaterThanOrEqual(20);
    });
  });

  describe('AC2: Stripe Client Configured', () => {
    it('should have stripe.ts file', () => {
      const stripePath = path.join(WEB_APP_PATH, 'lib', 'billing', 'stripe.ts');
      expect(fs.existsSync(stripePath)).toBe(true);
    });

    describe('stripe.ts content', () => {
      let stripeContent: string;

      beforeAll(() => {
        const stripePath = path.join(WEB_APP_PATH, 'lib', 'billing', 'stripe.ts');
        if (fs.existsSync(stripePath)) {
          stripeContent = fs.readFileSync(stripePath, 'utf-8');
        } else {
          stripeContent = '';
        }
      });

      it('should import Stripe from stripe package', () => {
        expect(stripeContent).toContain("from 'stripe'");
      });

      it('should use STRIPE_SECRET_KEY from environment', () => {
        expect(stripeContent).toContain('STRIPE_SECRET_KEY');
      });

      it('should export a Stripe client', () => {
        const hasExport =
          stripeContent.includes('export const stripe') ||
          stripeContent.includes('export function') ||
          stripeContent.includes('export default');
        expect(hasExport).toBe(true);
      });

      it('should configure Stripe API version', () => {
        expect(stripeContent).toContain('apiVersion');
      });
    });
  });

  describe('AC3: Webhook Handler Created', () => {
    it('should have stripe webhook route.ts file', () => {
      const routePath = path.join(WEB_APP_PATH, 'app', 'api', 'webhooks', 'stripe', 'route.ts');
      expect(fs.existsSync(routePath)).toBe(true);
    });

    describe('webhook route.ts content', () => {
      let routeContent: string;

      beforeAll(() => {
        const routePath = path.join(WEB_APP_PATH, 'app', 'api', 'webhooks', 'stripe', 'route.ts');
        if (fs.existsSync(routePath)) {
          routeContent = fs.readFileSync(routePath, 'utf-8');
        } else {
          routeContent = '';
        }
      });

      it('should export POST handler', () => {
        expect(routeContent).toContain('export');
        expect(routeContent).toContain('POST');
      });

      it('should import stripe client', () => {
        const hasStripeImport =
          routeContent.includes("from '@/lib/billing") ||
          routeContent.includes("from '../../../lib/billing");
        expect(hasStripeImport).toBe(true);
      });
    });
  });

  describe('AC4: Webhook Signature Verification', () => {
    let routeContent: string;

    beforeAll(() => {
      const routePath = path.join(WEB_APP_PATH, 'app', 'api', 'webhooks', 'stripe', 'route.ts');
      if (fs.existsSync(routePath)) {
        routeContent = fs.readFileSync(routePath, 'utf-8');
      } else {
        routeContent = '';
      }
    });

    it('should use STRIPE_WEBHOOK_SECRET', () => {
      expect(routeContent).toContain('STRIPE_WEBHOOK_SECRET');
    });

    it('should verify webhook signature', () => {
      const hasVerification =
        routeContent.includes('constructEvent') ||
        routeContent.includes('webhooks.construct') ||
        routeContent.includes('stripe-signature');
      expect(hasVerification).toBe(true);
    });

    it('should get stripe-signature header', () => {
      expect(routeContent).toContain('stripe-signature');
    });
  });

  describe('AC5: Event Types Defined', () => {
    it('should have types.ts file', () => {
      const typesPath = path.join(WEB_APP_PATH, 'lib', 'billing', 'types.ts');
      expect(fs.existsSync(typesPath)).toBe(true);
    });

    describe('types.ts content', () => {
      let typesContent: string;

      beforeAll(() => {
        const typesPath = path.join(WEB_APP_PATH, 'lib', 'billing', 'types.ts');
        if (fs.existsSync(typesPath)) {
          typesContent = fs.readFileSync(typesPath, 'utf-8');
        } else {
          typesContent = '';
        }
      });

      it('should define subscription event types', () => {
        const hasSubscription =
          typesContent.includes('subscription.created') ||
          typesContent.includes('SUBSCRIPTION_CREATED') ||
          typesContent.includes('SubscriptionEvent');
        expect(hasSubscription).toBe(true);
      });

      it('should define invoice event types', () => {
        const hasInvoice =
          typesContent.includes('invoice.paid') ||
          typesContent.includes('INVOICE_PAID') ||
          typesContent.includes('InvoiceEvent');
        expect(hasInvoice).toBe(true);
      });

      it('should define checkout event types', () => {
        const hasCheckout =
          typesContent.includes('checkout.session') ||
          typesContent.includes('CHECKOUT_SESSION') ||
          typesContent.includes('CheckoutEvent');
        expect(hasCheckout).toBe(true);
      });
    });
  });

  describe('Package Exports', () => {
    it('should have billing index.ts file', () => {
      const indexPath = path.join(WEB_APP_PATH, 'lib', 'billing', 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    describe('index.ts exports', () => {
      let indexContent: string;

      beforeAll(() => {
        const indexPath = path.join(WEB_APP_PATH, 'lib', 'billing', 'index.ts');
        if (fs.existsSync(indexPath)) {
          indexContent = fs.readFileSync(indexPath, 'utf-8');
        } else {
          indexContent = '';
        }
      });

      it('should export from stripe module', () => {
        expect(indexContent).toContain('./stripe');
      });

      it('should export from types module', () => {
        expect(indexContent).toContain('./types');
      });
    });
  });

  describe('Environment Variables', () => {
    let envExampleContent: string;

    beforeAll(() => {
      const envPath = path.join(PROJECT_ROOT, '.env.example');
      if (fs.existsSync(envPath)) {
        envExampleContent = fs.readFileSync(envPath, 'utf-8');
      } else {
        envExampleContent = '';
      }
    });

    it('should document STRIPE_SECRET_KEY', () => {
      expect(envExampleContent).toContain('STRIPE_SECRET_KEY');
    });

    it('should document STRIPE_WEBHOOK_SECRET', () => {
      expect(envExampleContent).toContain('STRIPE_WEBHOOK_SECRET');
    });

    it('should document NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', () => {
      expect(envExampleContent).toContain('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    });
  });
});
