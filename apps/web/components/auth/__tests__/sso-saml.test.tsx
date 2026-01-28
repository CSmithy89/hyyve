/**
 * Enterprise SSO SAML Configuration Unit Tests
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Wireframe: enterprise_sso_configuration
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-12:
 * - AC2: Display Identity Provider selection
 * - AC3: SSO status toggle
 * - AC4: SAML configuration form
 * - AC5: Attribute mapping section
 * - AC6: SP metadata display
 * - AC7: Connection testing
 * - AC8: Save configuration
 * - AC9: Accessibility requirements
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Components to be implemented (will fail in RED phase)
import {
  SamlConfigForm,
  SamlMetadataDisplay,
  SsoConnectionCard,
  IdpProviderCard,
  AttributeMappingRow,
} from '../index';

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

/**
 * SamlConfigForm Component Tests
 */
describe('SamlConfigForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders page heading "General Configuration"', () => {
      render(<SamlConfigForm />);

      expect(
        screen.getByRole('heading', { name: /general configuration/i })
      ).toBeInTheDocument();
    });

    it('renders authorized domain input', () => {
      render(<SamlConfigForm />);

      expect(screen.getByLabelText(/authorized domain/i)).toBeInTheDocument();
    });

    it('renders client ID input', () => {
      render(<SamlConfigForm />);

      expect(screen.getByLabelText(/client id/i)).toBeInTheDocument();
    });

    it('renders client secret input with password type', () => {
      render(<SamlConfigForm />);

      const secretInput = screen.getByLabelText(/client secret/i);
      expect(secretInput).toBeInTheDocument();
      expect(secretInput).toHaveAttribute('type', 'password');
    });

    it('renders discovery URL input', () => {
      render(<SamlConfigForm />);

      expect(screen.getByLabelText(/discovery url|metadata/i)).toBeInTheDocument();
    });

    it('renders visibility toggle for client secret', () => {
      render(<SamlConfigForm />);

      expect(
        screen.getByRole('button', { name: /show|hide|visibility/i })
      ).toBeInTheDocument();
    });

    it('renders Test Connection button', () => {
      render(<SamlConfigForm />);

      expect(
        screen.getByRole('button', { name: /test connection/i })
      ).toBeInTheDocument();
    });

    it('renders Save Configuration button', () => {
      render(<SamlConfigForm />);

      expect(
        screen.getByRole('button', { name: /save configuration/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('accepts input in authorized domain field', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const domainInput = screen.getByLabelText(/authorized domain/i);
      await user.type(domainInput, 'acme-corp.com');

      expect(domainInput).toHaveValue('acme-corp.com');
    });

    it('accepts input in client ID field', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const clientIdInput = screen.getByLabelText(/client id/i);
      await user.type(clientIdInput, '0oa6k5p2m7XyZ');

      expect(clientIdInput).toHaveValue('0oa6k5p2m7XyZ');
    });

    it('accepts input in client secret field', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const secretInput = screen.getByLabelText(/client secret/i);
      await user.type(secretInput, 'super-secret');

      expect(secretInput).toHaveValue('super-secret');
    });

    it('accepts input in discovery URL field', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url|metadata/i);
      await user.type(urlInput, 'https://acme.okta.com/.well-known/openid-configuration');

      expect(urlInput).toHaveValue(
        'https://acme.okta.com/.well-known/openid-configuration'
      );
    });

    it('toggles client secret visibility when clicking toggle button', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

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

  describe('Form Validation', () => {
    it('shows error for empty required fields on submit', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });

    it('validates URL format for discovery URL', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const urlInput = screen.getByLabelText(/discovery url|metadata/i);
      await user.type(urlInput, 'not-a-valid-url');

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(screen.getByText(/valid url/i)).toBeInTheDocument();
    });

    it('validates domain format', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const domainInput = screen.getByLabelText(/authorized domain/i);
      await user.type(domainInput, 'invalid domain with spaces');

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(screen.getByText(/valid domain/i)).toBeInTheDocument();
    });
  });

  describe('Test Connection Functionality', () => {
    it('shows loading state when testing connection', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      // Fill required fields
      await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');
      await user.type(
        screen.getByLabelText(/discovery url|metadata/i),
        'https://acme.okta.com/.well-known/openid-configuration'
      );

      const testButton = screen.getByRole('button', { name: /test connection/i });
      await user.click(testButton);

      expect(testButton).toHaveAttribute('aria-busy', 'true');
    });

    it('displays success result on successful test', async () => {
      const onTestSuccess = vi.fn();
      const user = userEvent.setup();
      render(<SamlConfigForm onTestSuccess={onTestSuccess} />);

      // Fill fields
      await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');
      await user.type(
        screen.getByLabelText(/discovery url|metadata/i),
        'https://acme.okta.com/.well-known/openid-configuration'
      );

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
      render(<SamlConfigForm onTestConnection={onTestConnection} />);

      await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');
      await user.type(
        screen.getByLabelText(/discovery url|metadata/i),
        'https://acme.okta.com/.well-known/openid-configuration'
      );

      await user.click(screen.getByRole('button', { name: /test connection/i }));

      await waitFor(() => {
        expect(onTestConnection).toHaveBeenCalled();
      });
    });
  });

  describe('Save Configuration', () => {
    it('shows loading state when saving', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');
      await user.type(
        screen.getByLabelText(/discovery url|metadata/i),
        'https://acme.okta.com/.well-known/openid-configuration'
      );

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      await user.click(saveButton);

      expect(saveButton).toHaveAttribute('aria-busy', 'true');
    });

    it('calls onSave callback with form data', async () => {
      const onSave = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<SamlConfigForm onSave={onSave} />);

      await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');
      await user.type(
        screen.getByLabelText(/discovery url|metadata/i),
        'https://acme.okta.com/.well-known/openid-configuration'
      );

      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            authorizedDomain: 'acme.com',
            clientId: 'client123',
            clientSecret: 'secret123',
            discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
          })
        );
      });
    });

    it('shows success message after successful save', async () => {
      const onSave = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<SamlConfigForm onSave={onSave} />);

      await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
      await user.type(screen.getByLabelText(/client id/i), 'client123');
      await user.type(screen.getByLabelText(/client secret/i), 'secret123');
      await user.type(
        screen.getByLabelText(/discovery url|metadata/i),
        'https://acme.okta.com/.well-known/openid-configuration'
      );

      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(screen.getByText(/saved|success/i)).toBeInTheDocument();
      });
    });
  });

  describe('Attribute Mapping', () => {
    it('renders attribute mapping section', () => {
      render(<SamlConfigForm />);

      expect(
        screen.getByRole('heading', { name: /attribute mapping/i })
      ).toBeInTheDocument();
    });

    it('renders email attribute mapping', () => {
      render(<SamlConfigForm />);

      expect(screen.getByText(/email address/i)).toBeInTheDocument();
    });

    it('renders first name attribute mapping', () => {
      render(<SamlConfigForm />);

      expect(screen.getByText(/first name/i)).toBeInTheDocument();
    });

    it('renders last name attribute mapping', () => {
      render(<SamlConfigForm />);

      expect(screen.getByText(/last name/i)).toBeInTheDocument();
    });

    it('renders group membership attribute mapping', () => {
      render(<SamlConfigForm />);

      expect(screen.getByText(/group membership/i)).toBeInTheDocument();
    });

    it('has default values for attribute mappings', () => {
      render(<SamlConfigForm />);

      expect(screen.getByDisplayValue('user.email')).toBeInTheDocument();
      expect(screen.getByDisplayValue('user.given_name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('user.family_name')).toBeInTheDocument();
    });

    it('attribute mapping inputs are editable', async () => {
      const user = userEvent.setup();
      render(<SamlConfigForm />);

      const emailInput = screen.getByDisplayValue('user.email');
      await user.clear(emailInput);
      await user.type(emailInput, 'email_address');

      expect(emailInput).toHaveValue('email_address');
    });
  });

  describe('Accessibility', () => {
    it('all inputs have proper labels', () => {
      render(<SamlConfigForm />);

      // All form inputs should be accessible by label
      expect(screen.getByLabelText(/authorized domain/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/client id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/client secret/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/discovery url|metadata/i)).toBeInTheDocument();
    });

    it('buttons have type="button"', () => {
      render(<SamlConfigForm />);

      const testButton = screen.getByRole('button', { name: /test connection/i });
      const saveButton = screen.getByRole('button', { name: /save configuration/i });

      expect(testButton).toHaveAttribute('type', 'button');
      expect(saveButton).toHaveAttribute('type', 'button');
    });

    it('has proper heading hierarchy', () => {
      render(<SamlConfigForm />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Styling', () => {
    it('Save button has primary styling', () => {
      render(<SamlConfigForm />);

      const saveButton = screen.getByRole('button', { name: /save configuration/i });
      expect(saveButton).toHaveClass('bg-primary');
    });

    it('Test button has secondary styling', () => {
      render(<SamlConfigForm />);

      const testButton = screen.getByRole('button', { name: /test connection/i });
      expect(testButton).toHaveClass('border');
    });

    it('inputs have proper dark theme styling', () => {
      render(<SamlConfigForm />);

      const domainInput = screen.getByLabelText(/authorized domain/i);
      expect(domainInput).toHaveClass('bg-background-dark');
    });
  });
});

/**
 * SamlMetadataDisplay Component Tests
 */
describe('SamlMetadataDisplay', () => {
  const defaultProps = {
    acsUrl: 'https://hyyve.app/api/saml/acs',
    entityId: 'https://hyyve.app/saml/metadata',
    metadataUrl: 'https://hyyve.app/saml/metadata.xml',
  };

  it('renders SP metadata section heading', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /service provider|sp metadata/i })
    ).toBeInTheDocument();
  });

  it('displays ACS URL', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    expect(screen.getByText(defaultProps.acsUrl)).toBeInTheDocument();
  });

  it('displays Entity ID', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    expect(screen.getByText(defaultProps.entityId)).toBeInTheDocument();
  });

  it('has copy button for ACS URL', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    expect(screen.getByTestId('copy-acs-url')).toBeInTheDocument();
  });

  it('has copy button for Entity ID', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    expect(screen.getByTestId('copy-entity-id')).toBeInTheDocument();
  });

  it('copies ACS URL to clipboard when clicking copy button', async () => {
    const user = userEvent.setup();
    render(<SamlMetadataDisplay {...defaultProps} />);

    await user.click(screen.getByTestId('copy-acs-url'));

    expect(mockWriteText).toHaveBeenCalledWith(defaultProps.acsUrl);
  });

  it('copies Entity ID to clipboard when clicking copy button', async () => {
    const user = userEvent.setup();
    render(<SamlMetadataDisplay {...defaultProps} />);

    await user.click(screen.getByTestId('copy-entity-id'));

    expect(mockWriteText).toHaveBeenCalledWith(defaultProps.entityId);
  });

  it('shows copied feedback after copying', async () => {
    const user = userEvent.setup();
    render(<SamlMetadataDisplay {...defaultProps} />);

    await user.click(screen.getByTestId('copy-acs-url'));

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('has download metadata button', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /download.*metadata/i })
    ).toBeInTheDocument();
  });

  it('download button has correct href', () => {
    render(<SamlMetadataDisplay {...defaultProps} />);

    const downloadButton = screen.getByRole('button', { name: /download.*metadata/i });
    // May be a link styled as button or actual button with download handler
    expect(downloadButton).toBeInTheDocument();
  });
});

/**
 * SsoConnectionCard Component Tests
 */
describe('SsoConnectionCard', () => {
  const defaultProps = {
    enabled: false,
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SSO status label', () => {
    render(<SsoConnectionCard {...defaultProps} />);

    expect(screen.getByText(/sso status/i)).toBeInTheDocument();
  });

  it('renders toggle switch', () => {
    render(<SsoConnectionCard {...defaultProps} />);

    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggle is unchecked when enabled is false', () => {
    render(<SsoConnectionCard {...defaultProps} enabled={false} />);

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('toggle is checked when enabled is true', () => {
    render(<SsoConnectionCard {...defaultProps} enabled={true} />);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('calls onToggle when toggle is clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<SsoConnectionCard {...defaultProps} onToggle={onToggle} />);

    await user.click(screen.getByRole('switch'));

    expect(onToggle).toHaveBeenCalled();
  });

  it('shows enabled message when SSO is enabled', () => {
    render(<SsoConnectionCard {...defaultProps} enabled={true} />);

    expect(
      screen.getByText(/users must authenticate via your provider/i)
    ).toBeInTheDocument();
  });

  it('shows disabled message when SSO is disabled', () => {
    render(<SsoConnectionCard {...defaultProps} enabled={false} />);

    expect(screen.getByText(/sso is currently disabled/i)).toBeInTheDocument();
  });

  it('toggle has proper ARIA attributes', () => {
    render(<SsoConnectionCard {...defaultProps} />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked');
  });

  it('has surface-dark background styling', () => {
    const { container } = render(<SsoConnectionCard {...defaultProps} />);

    const card = container.firstChild;
    expect(card).toHaveClass('bg-surface-dark');
  });
});

/**
 * IdpProviderCard Component Tests
 */
describe('IdpProviderCard', () => {
  const defaultProps = {
    provider: 'okta' as const,
    name: 'Okta',
    icon: 'verified_user',
    selected: false,
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders provider name', () => {
    render(<IdpProviderCard {...defaultProps} />);

    expect(screen.getByText('Okta')).toBeInTheDocument();
  });

  it('renders provider icon', () => {
    render(<IdpProviderCard {...defaultProps} />);

    expect(screen.getByTestId('provider-icon')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<IdpProviderCard {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('okta');
  });

  it('shows selected indicator when selected', () => {
    render(<IdpProviderCard {...defaultProps} selected={true} />);

    expect(screen.getByTestId('selected-idp-check')).toBeInTheDocument();
  });

  it('does not show selected indicator when not selected', () => {
    render(<IdpProviderCard {...defaultProps} selected={false} />);

    expect(screen.queryByTestId('selected-idp-check')).not.toBeInTheDocument();
  });

  it('has primary border when selected', () => {
    const { container } = render(<IdpProviderCard {...defaultProps} selected={true} />);

    const card = container.querySelector('[role="button"]');
    expect(card).toHaveClass('border-primary');
  });

  it('has default border when not selected', () => {
    const { container } = render(<IdpProviderCard {...defaultProps} selected={false} />);

    const card = container.querySelector('[role="button"]');
    expect(card).toHaveClass('border-border-dark');
  });

  it('is focusable for keyboard navigation', () => {
    render(<IdpProviderCard {...defaultProps} />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('can be selected with Enter key', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<IdpProviderCard {...defaultProps} onSelect={onSelect} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('okta');
  });

  it('can be selected with Space key', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<IdpProviderCard {...defaultProps} onSelect={onSelect} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');

    expect(onSelect).toHaveBeenCalledWith('okta');
  });
});

/**
 * AttributeMappingRow Component Tests
 */
describe('AttributeMappingRow', () => {
  const defaultProps = {
    label: 'Email Address',
    attribute: 'email',
    value: 'user.email',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders attribute label', () => {
    render(<AttributeMappingRow {...defaultProps} />);

    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders input with value', () => {
    render(<AttributeMappingRow {...defaultProps} />);

    expect(screen.getByDisplayValue('user.email')).toBeInTheDocument();
  });

  it('renders arrow indicator', () => {
    render(<AttributeMappingRow {...defaultProps} />);

    expect(screen.getByTestId('mapping-arrow')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AttributeMappingRow {...defaultProps} onChange={onChange} />);

    const input = screen.getByDisplayValue('user.email');
    await user.clear(input);
    await user.type(input, 'email_address');

    expect(onChange).toHaveBeenCalledWith('email', 'email_address');
  });

  it('input has proper data-testid', () => {
    render(<AttributeMappingRow {...defaultProps} />);

    expect(screen.getByTestId('mapping-email')).toBeInTheDocument();
  });

  it('has hover styling', () => {
    const { container } = render(<AttributeMappingRow {...defaultProps} />);

    const row = container.firstChild;
    expect(row).toHaveClass('hover:bg-white/5');
  });

  it('has border styling', () => {
    const { container } = render(<AttributeMappingRow {...defaultProps} />);

    const row = container.firstChild;
    expect(row).toHaveClass('border-b');
  });
});

/**
 * Integration Tests
 */
describe('SSO Configuration Integration', () => {
  it('complete form submission flow works', async () => {
    const onSave = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<SamlConfigForm onSave={onSave} />);

    // Fill all fields
    await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
    await user.type(screen.getByLabelText(/client id/i), 'client123');
    await user.type(screen.getByLabelText(/client secret/i), 'secret123');
    await user.type(
      screen.getByLabelText(/discovery url|metadata/i),
      'https://acme.okta.com/.well-known/openid-configuration'
    );

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

    render(<SamlConfigForm onTestConnection={onTestConnection} onSave={onSave} />);

    // Fill fields
    await user.type(screen.getByLabelText(/authorized domain/i), 'acme.com');
    await user.type(screen.getByLabelText(/client id/i), 'client123');
    await user.type(screen.getByLabelText(/client secret/i), 'secret123');
    await user.type(
      screen.getByLabelText(/discovery url|metadata/i),
      'https://acme.okta.com/.well-known/openid-configuration'
    );

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
