/**
 * SCIM User Provisioning Unit Tests
 *
 * Story: 1-1-14 SCIM User Provisioning
 * Wireframe: team_&_permissions_management, org_hierarchy_manager
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-14:
 * - AC2: SCIM endpoint display
 * - AC3: Bearer token generation
 * - AC4: Token regeneration
 * - AC5: Enable/disable toggle
 * - AC6: Provisioned users list
 * - AC7: Accessibility
 */

 
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Components to be implemented (will fail in RED phase)
import { ScimConfigPanel, ScimUsersList } from '../index';

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
 * Mock SCIM Users Data
 */
const mockScimUsers = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    status: 'active',
    lastSynced: '2026-01-28T10:30:00Z',
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    status: 'suspended',
    lastSynced: '2026-01-28T09:15:00Z',
  },
  {
    id: 'user_3',
    name: 'Bob Wilson',
    email: 'bob.wilson@acme.com',
    status: 'pending',
    lastSynced: '2026-01-28T08:00:00Z',
  },
];

/**
 * ScimConfigPanel Component Tests
 */
describe('ScimConfigPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders SCIM configuration heading', () => {
      render(<ScimConfigPanel />);

      expect(
        screen.getByRole('heading', { name: /scim.*configuration|user provisioning/i })
      ).toBeInTheDocument();
    });

    it('renders SCIM status toggle', () => {
      render(<ScimConfigPanel />);

      expect(screen.getByRole('switch', { name: /scim|provisioning/i })).toBeInTheDocument();
    });

    it('renders SCIM endpoint URL section', () => {
      render(<ScimConfigPanel />);

      expect(screen.getByTestId('scim-endpoint-section')).toBeInTheDocument();
    });

    it('renders bearer token section', () => {
      render(<ScimConfigPanel />);

      expect(screen.getByTestId('scim-token-section')).toBeInTheDocument();
    });

    it('renders regenerate token button', () => {
      render(<ScimConfigPanel />);

      expect(
        screen.getByRole('button', { name: /regenerate|generate.*new.*token/i })
      ).toBeInTheDocument();
    });
  });

  describe('SCIM Endpoint Display (AC2)', () => {
    it('displays SCIM endpoint URL', () => {
      render(
        <ScimConfigPanel
          scimEndpoint="https://api.hyyve.com/scim/v2"
        />
      );

      expect(screen.getByTestId('scim-endpoint-url')).toHaveTextContent(
        'https://api.hyyve.com/scim/v2'
      );
    });

    it('has copy button for endpoint', () => {
      render(<ScimConfigPanel scimEndpoint="https://api.hyyve.com/scim/v2" />);

      expect(screen.getByTestId('copy-scim-endpoint')).toBeInTheDocument();
    });

    it('copies endpoint to clipboard when clicking copy button', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel scimEndpoint="https://api.hyyve.com/scim/v2" />);

      await user.click(screen.getByTestId('copy-scim-endpoint'));

      expect(mockWriteText).toHaveBeenCalledWith('https://api.hyyve.com/scim/v2');
    });

    it('shows copied feedback after copying', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel scimEndpoint="https://api.hyyve.com/scim/v2" />);

      await user.click(screen.getByTestId('copy-scim-endpoint'));

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });
  });

  describe('Bearer Token (AC3)', () => {
    it('displays bearer token field', () => {
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      expect(screen.getByTestId('scim-bearer-token')).toBeInTheDocument();
    });

    it('token is masked by default', () => {
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      const tokenField = screen.getByTestId('scim-bearer-token');
      expect(tokenField).toHaveAttribute('data-masked', 'true');
    });

    it('has visibility toggle button', () => {
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      expect(
        screen.getByRole('button', { name: /show|hide|visibility/i })
      ).toBeInTheDocument();
    });

    it('toggles token visibility when clicking toggle button', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      const tokenField = screen.getByTestId('scim-bearer-token');
      const toggleButton = screen.getByRole('button', { name: /show|hide|visibility/i });

      // Initially masked
      expect(tokenField).toHaveAttribute('data-masked', 'true');

      // Click to show
      await user.click(toggleButton);
      expect(tokenField).toHaveAttribute('data-masked', 'false');

      // Click to hide
      await user.click(toggleButton);
      expect(tokenField).toHaveAttribute('data-masked', 'true');
    });

    it('has copy button for token', () => {
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      expect(screen.getByTestId('copy-scim-token')).toBeInTheDocument();
    });

    it('copies token to clipboard when clicking copy button', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      await user.click(screen.getByTestId('copy-scim-token'));

      expect(mockWriteText).toHaveBeenCalledWith('hv_scim_abc123xyz');
    });
  });

  describe('Token Regeneration (AC4)', () => {
    it('shows confirmation dialog when clicking regenerate', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      await user.click(screen.getByRole('button', { name: /regenerate/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('dialog contains warning about breaking integrations', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      await user.click(screen.getByRole('button', { name: /regenerate/i }));

      expect(screen.getByText(/break.*integration|invalidate/i)).toBeInTheDocument();
    });

    it('dialog has confirm and cancel buttons', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      await user.click(screen.getByRole('button', { name: /regenerate/i }));

      expect(screen.getByRole('button', { name: /confirm|regenerate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('closes dialog when clicking cancel', async () => {
      const user = userEvent.setup();
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      await user.click(screen.getByRole('button', { name: /regenerate/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('calls onRegenerateToken when confirming', async () => {
      const onRegenerateToken = vi.fn().mockResolvedValue({ token: 'hv_scim_new123' });
      const user = userEvent.setup();
      render(
        <ScimConfigPanel
          bearerToken="hv_scim_abc123xyz"
          onRegenerateToken={onRegenerateToken}
        />
      );

      await user.click(screen.getByRole('button', { name: /regenerate/i }));
      await user.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(onRegenerateToken).toHaveBeenCalled();
      });
    });

    it('shows success message after regeneration', async () => {
      const onRegenerateToken = vi.fn().mockResolvedValue({ token: 'hv_scim_new123' });
      const user = userEvent.setup();
      render(
        <ScimConfigPanel
          bearerToken="hv_scim_abc123xyz"
          onRegenerateToken={onRegenerateToken}
        />
      );

      await user.click(screen.getByRole('button', { name: /regenerate/i }));
      await user.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(screen.getByText(/token.*regenerated|new.*token/i)).toBeInTheDocument();
      });
    });
  });

  describe('SCIM Toggle (AC5)', () => {
    it('toggle is unchecked by default when disabled', () => {
      render(<ScimConfigPanel enabled={false} />);

      const toggle = screen.getByRole('switch', { name: /scim|provisioning/i });
      expect(toggle).not.toBeChecked();
    });

    it('toggle is checked when enabled', () => {
      render(<ScimConfigPanel enabled={true} />);

      const toggle = screen.getByRole('switch', { name: /scim|provisioning/i });
      expect(toggle).toBeChecked();
    });

    it('calls onToggle when toggle is clicked', async () => {
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(<ScimConfigPanel enabled={false} onToggle={onToggle} />);

      await user.click(screen.getByRole('switch', { name: /scim|provisioning/i }));

      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it('shows enabled message when SCIM is on', () => {
      render(<ScimConfigPanel enabled={true} />);

      expect(screen.getByText(/users.*automatically.*synced|provisioning.*enabled/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility (AC7)', () => {
    it('toggle has proper ARIA attributes', () => {
      render(<ScimConfigPanel enabled={false} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('buttons have type="button"', () => {
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      const regenerateButton = screen.getByRole('button', { name: /regenerate/i });
      expect(regenerateButton).toHaveAttribute('type', 'button');
    });

    it('copy buttons have proper aria-labels', () => {
      render(
        <ScimConfigPanel
          scimEndpoint="https://api.hyyve.com/scim/v2"
          bearerToken="hv_scim_abc123xyz"
        />
      );

      expect(screen.getByTestId('copy-scim-endpoint')).toHaveAttribute('aria-label');
      expect(screen.getByTestId('copy-scim-token')).toHaveAttribute('aria-label');
    });

    it('has proper heading hierarchy', () => {
      render(<ScimConfigPanel />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Styling', () => {
    it('uses dark theme colors', () => {
      render(<ScimConfigPanel />);

      const container = screen.getByTestId('scim-config-panel');
      expect(container).toHaveClass('bg-background-dark');
    });

    it('regenerate button has danger styling', () => {
      render(<ScimConfigPanel bearerToken="hv_scim_abc123xyz" />);

      const regenerateButton = screen.getByRole('button', { name: /regenerate/i });
      expect(regenerateButton).toHaveClass('border');
    });
  });
});

/**
 * ScimUsersList Component Tests
 */
describe('ScimUsersList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders users section heading', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(
        screen.getByRole('heading', { name: /provisioned users|synced users/i })
      ).toBeInTheDocument();
    });

    it('renders empty state when no users', () => {
      render(<ScimUsersList users={[]} />);

      expect(screen.getByText(/no.*users.*provisioned/i)).toBeInTheDocument();
    });

    it('renders users table when users exist', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByTestId('scim-users-table')).toBeInTheDocument();
    });

    it('renders correct number of user rows', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const rows = screen.getAllByTestId('scim-user-row');
      expect(rows).toHaveLength(3);
    });
  });

  describe('User Row Display (AC6)', () => {
    it('displays user name', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('displays user email', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText('john.doe@acme.com')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@acme.com')).toBeInTheDocument();
      expect(screen.getByText('bob.wilson@acme.com')).toBeInTheDocument();
    });

    it('displays status badge for each user', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText(/active/i)).toBeInTheDocument();
      expect(screen.getByText(/suspended/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('active status has success styling', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const activeBadge = screen.getByText(/active/i).closest('[data-testid="user-status-badge"]');
      expect(activeBadge).toHaveClass('text-emerald-500');
    });

    it('suspended status has warning styling', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const suspendedBadge = screen.getByText(/suspended/i).closest('[data-testid="user-status-badge"]');
      expect(suspendedBadge).toHaveClass('text-amber-500');
    });

    it('pending status has neutral styling', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const pendingBadge = screen.getByText(/pending/i).closest('[data-testid="user-status-badge"]');
      expect(pendingBadge).toHaveClass('text-slate-400');
    });

    it('displays last synced timestamp', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      // Should display relative or formatted time
      const syncedElements = screen.getAllByTestId('last-synced');
      expect(syncedElements).toHaveLength(3);
    });

    it('displays resync button for each user', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const resyncButtons = screen.getAllByTestId('resync-user-button');
      expect(resyncButtons).toHaveLength(3);
    });
  });

  describe('Resync Functionality', () => {
    it('resync button triggers onResync callback', async () => {
      const onResync = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<ScimUsersList users={mockScimUsers} onResync={onResync} />);

      const resyncButtons = screen.getAllByTestId('resync-user-button');
      await user.click(resyncButtons[0]);

      expect(onResync).toHaveBeenCalledWith('user_1');
    });

    it('shows loading state when resyncing', async () => {
      const onResync = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      const user = userEvent.setup();
      render(<ScimUsersList users={mockScimUsers} onResync={onResync} />);

      const resyncButtons = screen.getAllByTestId('resync-user-button');
      await user.click(resyncButtons[0]);

      expect(resyncButtons[0]).toHaveAttribute('aria-busy', 'true');
    });

    it('shows success indicator after sync', async () => {
      const onResync = vi.fn().mockResolvedValue({ success: true });
      const user = userEvent.setup();
      render(<ScimUsersList users={mockScimUsers} onResync={onResync} />);

      const resyncButtons = screen.getAllByTestId('resync-user-button');
      await user.click(resyncButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/synced|updated/i)).toBeInTheDocument();
      });
    });
  });

  describe('Table Headers', () => {
    it('displays Member column header', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText(/member|user/i)).toBeInTheDocument();
    });

    it('displays Status column header', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText(/status/i)).toBeInTheDocument();
    });

    it('displays Last Synced column header', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText(/last synced|synced/i)).toBeInTheDocument();
    });

    it('displays Actions column header', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByText(/actions/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('table has proper structure', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
    });

    it('resync buttons have accessible names', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const resyncButtons = screen.getAllByTestId('resync-user-button');
      resyncButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Styling', () => {
    it('uses dark theme table styling', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const table = screen.getByTestId('scim-users-table');
      expect(table).toHaveClass('border-[#383663]');
    });

    it('row has hover effect', () => {
      render(<ScimUsersList users={mockScimUsers} />);

      const rows = screen.getAllByTestId('scim-user-row');
      expect(rows[0]).toHaveClass('hover:bg-white/5');
    });
  });
});

/**
 * Integration Tests
 */
describe('SCIM Configuration Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('full SCIM enable flow works', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <ScimConfigPanel
        enabled={false}
        scimEndpoint="https://api.hyyve.com/scim/v2"
        bearerToken="hv_scim_abc123xyz"
        onToggle={onToggle}
      />
    );

    // Enable SCIM
    await user.click(screen.getByRole('switch', { name: /scim|provisioning/i }));
    expect(onToggle).toHaveBeenCalledWith(true);

    // Copy endpoint
    await user.click(screen.getByTestId('copy-scim-endpoint'));
    expect(mockWriteText).toHaveBeenCalledWith('https://api.hyyve.com/scim/v2');

    // Copy token
    await user.click(screen.getByTestId('copy-scim-token'));
    expect(mockWriteText).toHaveBeenCalledWith('hv_scim_abc123xyz');
  });

  it('token regeneration flow works', async () => {
    const onRegenerateToken = vi.fn().mockResolvedValue({ token: 'hv_scim_new123' });
    const user = userEvent.setup();

    render(
      <ScimConfigPanel
        enabled={true}
        scimEndpoint="https://api.hyyve.com/scim/v2"
        bearerToken="hv_scim_abc123xyz"
        onRegenerateToken={onRegenerateToken}
      />
    );

    // Click regenerate
    await user.click(screen.getByRole('button', { name: /regenerate/i }));

    // Confirm dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Confirm
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(onRegenerateToken).toHaveBeenCalled();
    });
  });

  it('users list with resync flow works', async () => {
    const onResync = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<ScimUsersList users={mockScimUsers} onResync={onResync} />);

    // Find and click resync for first user
    const resyncButtons = screen.getAllByTestId('resync-user-button');
    await user.click(resyncButtons[0]);

    await waitFor(() => {
      expect(onResync).toHaveBeenCalledWith('user_1');
    });
  });
});
