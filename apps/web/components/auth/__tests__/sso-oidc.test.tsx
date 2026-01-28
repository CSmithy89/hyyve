/**
 * Enterprise SSO OIDC Configuration Unit Tests
 *
 * Story: 1-1-13 Enterprise SSO OIDC Configuration
 * Wireframe: enterprise_sso_configuration
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-13:
 * - AC2: OIDC configuration form
 * - AC3: Auto-discovery feature
 * - AC4: Scopes configuration
 * - AC5: Redirect URI display
 * - AC6: Connection testing
 * - AC7: Save configuration
 * - AC8: Accessibility requirements
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Component to be implemented (will fail in RED phase)
import { OidcConfigForm } from '../index';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock Clerk hooks
const mockOrganization = {
  id: 'org_123',
  name: 'Acme Corp',
  slug: 'acme-corp',
};

vi.mock('@clerk/nextjs', () => ({
  useOrganization: () => ({
    organization: mockOrganization,
    isLoaded: true,
  }),
  useUser: () => ({
    user: { id: 'user_123' },
    isLoaded: true,
  }),
}));

// Mock clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock fetch for discovery
global.fetch = vi.fn();

/**
 * OidcConfigForm Component Tests
 */
describe('OidcConfigForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        issuer: 'https://accounts.google.com',
        authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_endpoint: 'https://oauth2.googleapis.com/token',
        userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      }),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders page heading "OIDC Configuration"', () => {
      render(<OidcConfigForm />);

      expect(
        screen.getByRole('heading', { name: /oidc configuration|openid connect/i })
      ).toBeInTheDocument();
    });

    it('renders discovery URL input', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/discovery url/i)).toBeInTheDocument();
    });

    it('renders client ID input', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/client id/i)).toBeInTheDocument();
    });

    it('renders client secret input with password type', () => {
      render(<OidcConfigForm />);

      const secretInput = screen.getByLabelText(/client secret/i);
      expect(secretInput).toBeInTheDocument();
      expect(secretInput).toHaveAttribute('type', 'password');
    });

    it('renders visibility toggle for client secret', () => {
      render(<OidcConfigForm />);

      expect(
        screen.getByRole('button', { name: /show|hide|visibility/i })
      ).toBeInTheDocument();
    });

    it('renders Discover button', () => {
      render(<OidcConfigForm />);

      expect(
        screen.getByRole('button', { name: /discover/i })
      ).toBeInTheDocument();
    });

    it('renders Test Connection button', () => {
      render(<OidcConfigForm />);

      expect(
        screen.getByRole('button', { name: /test connection/i })
      ).toBeInTheDocument();
    });

    it('renders Save Configuration button', () => {
      render(<OidcConfigForm />);

      expect(
        screen.getByRole('button', { name: /save configuration/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('accepts input in discovery URL field', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url/i);
      await user.type(urlInput, 'https://accounts.google.com/.well-known/openid-configuration');

      expect(urlInput).toHaveValue(
        'https://accounts.google.com/.well-known/openid-configuration'
      );
    });

    it('accepts input in client ID field', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const clientIdInput = screen.getByLabelText(/client id/i);
      await user.type(clientIdInput, 'test-client-id-12345');

      expect(clientIdInput).toHaveValue('test-client-id-12345');
    });

    it('accepts input in client secret field', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const secretInput = screen.getByLabelText(/client secret/i);
      await user.type(secretInput, 'super-secret');

      expect(secretInput).toHaveValue('super-secret');
    });

    it('toggles client secret visibility when clicking toggle button', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const secretInput = screen.getByLabelText(/client secret/i);
      const toggleButton = screen.getByRole('button', { name: /show|hide|visibility/i });

      // Initially password type
      expect(secretInput).toHaveAttribute('type', 'password');

      // Click to show
      await user.click(toggleButton);
      expect(secretInput).toHaveAttribute('type', 'text');

      // Click to hide
      await user.click(toggleButton);
      expect(secretInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Scopes Configuration (AC4)', () => {
    it('renders scopes section heading', () => {
      render(<OidcConfigForm />);

      expect(
        screen.getByRole('heading', { name: /scopes/i })
      ).toBeInTheDocument();
    });

    it('renders openid scope checkbox (checked by default)', () => {
      render(<OidcConfigForm />);

      const openidCheckbox = screen.getByLabelText(/^openid$/i);
      expect(openidCheckbox).toBeInTheDocument();
      expect(openidCheckbox).toBeChecked();
    });

    it('renders profile scope checkbox', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/^profile$/i)).toBeInTheDocument();
    });

    it('renders email scope checkbox', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    });

    it('renders groups scope checkbox', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/groups/i)).toBeInTheDocument();
    });

    it('renders offline_access scope checkbox', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/offline.access/i)).toBeInTheDocument();
    });

    it('scopes can be toggled', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const profileCheckbox = screen.getByLabelText(/^profile$/i);

      // Initially unchecked (or check initial state)
      const wasChecked = profileCheckbox.checked;

      // Toggle
      await user.click(profileCheckbox);
      expect(profileCheckbox.checked).toBe(!wasChecked);
    });

    it('has custom scope input field', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/custom scope/i)).toBeInTheDocument();
    });

    it('can add custom scopes', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const customInput = screen.getByLabelText(/custom scope/i);
      await user.type(customInput, 'custom_scope_1');

      expect(customInput).toHaveValue('custom_scope_1');
    });
  });

  describe('Auto-Discovery (AC3)', () => {
    it('shows loading state when discovering', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url/i);
      await user.type(urlInput, 'https://accounts.google.com/.well-known/openid-configuration');

      const discoverButton = screen.getByRole('button', { name: /discover/i });
      await user.click(discoverButton);

      expect(discoverButton).toHaveAttribute('aria-busy', 'true');
    });

    it('displays discovered issuer on successful discovery', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url/i);
      await user.type(urlInput, 'https://accounts.google.com/.well-known/openid-configuration');

      const discoverButton = screen.getByRole('button', { name: /discover/i });
      await user.click(discoverButton);

      await waitFor(() => {
        expect(screen.getByTestId('discovery-result')).toBeInTheDocument();
      });
    });

    it('shows error for invalid discovery URL', async () => {
      (global.fetch as vi.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url/i);
      await user.type(urlInput, 'https://invalid-url.com/not-found');

      const discoverButton = screen.getByRole('button', { name: /discover/i });
      await user.click(discoverButton);

      await waitFor(() => {
        expect(screen.getByText(/error|invalid|failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Redirect URI Display (AC5)', () => {
    it('renders redirect URI section', () => {
      render(<OidcConfigForm />);

      expect(screen.getByTestId('redirect-uri-section')).toBeInTheDocument();
    });

    it('displays redirect URI', () => {
      render(<OidcConfigForm redirectUri="https://hyyve.app/api/oidc/callback" />);

      expect(screen.getByTestId('redirect-uri')).toHaveTextContent('https://hyyve.app');
    });

    it('has copy button for redirect URI', () => {
      render(<OidcConfigForm redirectUri="https://hyyve.app/api/oidc/callback" />);

      expect(screen.getByTestId('copy-redirect-uri')).toBeInTheDocument();
    });

    it('copies redirect URI to clipboard when clicking copy button', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm redirectUri="https://hyyve.app/api/oidc/callback" />);

      await user.click(screen.getByTestId('copy-redirect-uri'));

      expect(mockWriteText).toHaveBeenCalledWith('https://hyyve.app/api/oidc/callback');
    });

    it('shows copied feedback after copying', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm redirectUri="https://hyyve.app/api/oidc/callback" />);

      await user.click(screen.getByTestId('copy-redirect-uri'));

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty required fields on submit', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });

    it('validates URL format for discovery URL', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url/i);
      await user.type(urlInput, 'not-a-valid-url');

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(screen.getByText(/valid url/i)).toBeInTheDocument();
    });
  });

  describe('Test Connection Functionality (AC6)', () => {
    it('shows loading state when testing connection', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      // Fill required fields
      await user.type(
        screen.getByLabelText(/discovery url/i),
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');

      const testButton = screen.getByRole('button', { name: /test connection/i });
      await user.click(testButton);

      expect(testButton).toHaveAttribute('aria-busy', 'true');
    });

    it('displays success result on successful test', async () => {
      const onTestSuccess = vi.fn();
      const user = userEvent.setup();
      render(<OidcConfigForm onTestSuccess={onTestSuccess} />);

      // Fill fields
      await user.type(
        screen.getByLabelText(/discovery url/i),
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');

      const testButton = screen.getByRole('button', { name: /test connection/i });
      await user.click(testButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('test-result-success') ||
            screen.getByTestId('test-result-error')
        ).toBeInTheDocument();
      });
    });

    it('calls onTestConnection callback when testing', async () => {
      const onTestConnection = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<OidcConfigForm onTestConnection={onTestConnection} />);

      await user.type(
        screen.getByLabelText(/discovery url/i),
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');

      await user.click(screen.getByRole('button', { name: /test connection/i }));

      await waitFor(() => {
        expect(onTestConnection).toHaveBeenCalled();
      });
    });
  });

  describe('Save Configuration (AC7)', () => {
    it('shows loading state when saving', async () => {
      const user = userEvent.setup();
      render(<OidcConfigForm />);

      await user.type(
        screen.getByLabelText(/discovery url/i),
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(saveButton).toHaveAttribute('aria-busy', 'true');
    });

    it('calls onSave callback with form data', async () => {
      const onSave = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<OidcConfigForm onSave={onSave} />);

      await user.type(
        screen.getByLabelText(/discovery url/i),
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');

      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
            clientId: 'client123',
            clientSecret: 'secret123',
          })
        );
      });
    });

    it('shows success message after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<OidcConfigForm onSave={onSave} />);

      await user.type(
        screen.getByLabelText(/discovery url/i),
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');

      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(screen.getByText(/saved|success/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility (AC8)', () => {
    it('all inputs have proper labels', () => {
      render(<OidcConfigForm />);

      // All form inputs should be accessible by label
      expect(screen.getByLabelText(/discovery url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/client id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/client secret/i)).toBeInTheDocument();
    });

    it('buttons have type="button"', () => {
      render(<OidcConfigForm />);

      const discoverButton = screen.getByRole('button', { name: /discover/i });
      const testButton = screen.getByRole('button', { name: /test connection/i });
      const saveButton = screen.getByRole('button', { name: /save configuration/i });

      expect(discoverButton).toHaveAttribute('type', 'button');
      expect(testButton).toHaveAttribute('type', 'button');
      expect(saveButton).toHaveAttribute('type', 'button');
    });

    it('has proper heading hierarchy', () => {
      render(<OidcConfigForm />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('checkboxes have proper labels', () => {
      render(<OidcConfigForm />);

      expect(screen.getByLabelText(/^openid$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^profile$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('Save button has primary styling', () => {
      render(<OidcConfigForm />);

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      expect(saveButton).toHaveClass('bg-primary');
    });

    it('Test button has secondary styling', () => {
      render(<OidcConfigForm />);

      const testButton = screen.getByRole('button', { name: /test connection/i });
      expect(testButton).toHaveClass('border');
    });

    it('inputs have proper dark theme styling', () => {
      render(<OidcConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url/i);
      expect(urlInput).toHaveClass('bg-background-dark');
    });
  });
});

/**
 * Integration Tests
 */
describe('OIDC Configuration Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        issuer: 'https://accounts.google.com',
        authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        token_endpoint: 'https://oauth2.googleapis.com/token',
      }),
    });
  });

  it('complete form submission flow works', async () => {
    const onSave = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<OidcConfigForm onSave={onSave} />);

    // Fill all fields
    await user.type(
      screen.getByLabelText(/discovery url/i),
      'https://accounts.google.com/.well-known/openid-configuration'
    );
    await user.type(screen.getByLabelText(/client id/i), 'client123');
    await user.type(screen.getByLabelText(/client secret/i), 'secret123');

    // Enable scopes
    await user.click(screen.getByLabelText(/^profile$/i));
    await user.click(screen.getByLabelText(/^email$/i));

    // Save
    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });

  it('discover then save flow works', async () => {
    const onSave = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<OidcConfigForm onSave={onSave} />);

    // Fill discovery URL
    await user.type(
      screen.getByLabelText(/discovery url/i),
      'https://accounts.google.com/.well-known/openid-configuration'
    );

    // Discover
    await user.click(screen.getByRole('button', { name: /discover/i }));

    // Wait for discovery
    await waitFor(() => {
      expect(screen.getByTestId('discovery-result')).toBeInTheDocument();
    });

    // Fill remaining fields
    await user.type(screen.getByLabelText(/client id/i), 'client123');
    await user.type(screen.getByLabelText(/client secret/i), 'secret123');

    // Save
    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });

  it('test connection before save flow works', async () => {
    const onTestConnection = vi.fn().mockResolvedValue({ success: true });
    const onSave = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<OidcConfigForm onTestConnection={onTestConnection} onSave={onSave} />);

    // Fill fields
    await user.type(
      screen.getByLabelText(/discovery url/i),
      'https://accounts.google.com/.well-known/openid-configuration'
    );
    await user.type(screen.getByLabelText(/client id/i), 'client123');
    await user.type(screen.getByLabelText(/client secret/i), 'secret123');

    // Test connection first
    await user.click(screen.getByRole('button', { name: /test connection/i }));
    await waitFor(() => {
      expect(onTestConnection).toHaveBeenCalled();
    });

    // Then save
    await user.click(screen.getByRole('button', { name: /save configuration/i }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});
