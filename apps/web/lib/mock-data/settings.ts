/**
 * Settings Mock Data
 *
 * Story: 0-2-10 Implement Settings Pages
 *
 * Mock data for settings pages including user profile, API keys,
 * workspace settings, and active sessions.
 */

// =============================================================================
// Types
// =============================================================================

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  organization: string;
  bio: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface NotificationPreference {
  id: string;
  eventType: string;
  description: string;
  inApp: boolean;
  inAppLocked: boolean;
  email: boolean;
  emailLocked: boolean;
  push: boolean;
  slack: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  lastUsed: string;
  scopes: string[];
  environment: 'production' | 'development' | 'staging';
  rateLimitPerMinute: number;
  rateLimitPerDay: number;
  allowedOrigins: string[];
  allowedIps: string[];
  expiresAt: string | null;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  iconUrl: string;
  plan: string;
  defaultProvider: string;
  defaultModel: string;
  temperature: number;
  auditLogging: boolean;
  piiRedaction: boolean;
  enforce2fa: boolean;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected';
  description: string;
  channel?: string;
}

// =============================================================================
// Mock Data
// =============================================================================

export const USER_PROFILE: UserProfile = {
  id: 'usr_1',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@hyyve.ai',
  jobTitle: 'Lead Engineer',
  organization: 'Hyyve Inc.',
  bio: 'Passionate about building scalable AI infrastructure.',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  theme: 'dark',
  fontSize: 14,
  reduceMotion: false,
  highContrast: false,
};

export const NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  {
    id: 'notif_1',
    eventType: 'System Alerts',
    description: 'Maintenance & downtime warnings',
    inApp: true,
    inAppLocked: true,
    email: true,
    emailLocked: false,
    push: false,
    slack: true,
  },
  {
    id: 'notif_2',
    eventType: 'Project Updates',
    description: 'Model training complete, deployment status',
    inApp: true,
    inAppLocked: false,
    email: false,
    emailLocked: false,
    push: true,
    slack: true,
  },
  {
    id: 'notif_3',
    eventType: 'Billing & Plan',
    description: 'Invoices, usage limits, payment failure',
    inApp: true,
    inAppLocked: false,
    email: true,
    emailLocked: false,
    push: false,
    slack: false,
  },
  {
    id: 'notif_4',
    eventType: 'Security',
    description: 'New device login, password changes',
    inApp: true,
    inAppLocked: true,
    email: true,
    emailLocked: true,
    push: true,
    slack: false,
  },
];

export const API_KEYS: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production-01',
    maskedKey: 'sk-live-••••••••••••••••••••••••X9z2',
    status: 'active',
    createdAt: 'Oct 24, 2023',
    lastUsed: '2 mins ago',
    scopes: ['module:read', 'module:write', 'analytics:read'],
    environment: 'production',
    rateLimitPerMinute: 1000,
    rateLimitPerDay: 25000,
    allowedOrigins: ['https://client.com'],
    allowedIps: ['203.0.113.10'],
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'key_2',
    name: 'Development-Test',
    maskedKey: 'sk-test-••••••••••••••••••••••••B7k1',
    status: 'active',
    createdAt: 'Nov 02, 2023',
    lastUsed: '4 days ago',
    scopes: ['chatbot:invoke', 'voice:read'],
    environment: 'development',
    rateLimitPerMinute: 60,
    rateLimitPerDay: 10000,
    allowedOrigins: [],
    allowedIps: [],
    expiresAt: null,
  },
];

export const SESSIONS: Session[] = [
  {
    id: 'sess_1',
    device: 'Macbook Pro 16"',
    browser: 'Chrome',
    os: 'MacOS',
    location: 'San Francisco, CA',
    ipAddress: '192.168.1.1',
    lastActive: 'Active now',
    isCurrent: true,
  },
  {
    id: 'sess_2',
    device: 'iPhone 14 Pro',
    browser: 'Safari',
    os: 'iOS 16',
    location: 'Austin, TX',
    ipAddress: '104.23.12.98',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
];

export const WORKSPACE: Workspace = {
  id: 'ws_1',
  name: 'Acme Corp AI Team',
  slug: 'acme-corp',
  iconUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop',
  plan: 'Enterprise Plan',
  defaultProvider: 'OpenAI',
  defaultModel: 'GPT-4 Turbo',
  temperature: 0.7,
  auditLogging: true,
  piiRedaction: true,
  enforce2fa: false,
};

export const INTEGRATIONS: Integration[] = [
  {
    id: 'int_1',
    name: 'Slack',
    icon: 'chat',
    status: 'connected',
    description: 'Receive alerts and notifications',
    channel: '#ai-alerts',
  },
  {
    id: 'int_2',
    name: 'GitHub',
    icon: 'code',
    status: 'disconnected',
    description: 'Sync prompts and manage version control directly from your repositories.',
  },
];

export const MFA_STATUS = {
  enabled: true,
  method: 'authenticator',
  backupCodesRemaining: 8,
};

export const SECURITY_INFO = {
  passwordLastChanged: '3 months ago',
  mfaEnabled: true,
};
