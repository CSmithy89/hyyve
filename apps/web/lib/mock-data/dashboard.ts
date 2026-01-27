/**
 * Dashboard Mock Data
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 *
 * Mock data for dashboard components. Will be replaced with
 * real API data in future stories.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'primary' | 'blue' | 'purple' | 'emerald';
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  version: string;
  description?: string;
  thumbnail?: string;
  status: 'active' | 'training' | 'paused' | 'draft';
  lastModified: string;
  type: 'chatbot' | 'module' | 'voice' | 'canvas';
}

export interface ActivityItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  subtitle?: string;
  timestamp: string;
  icon: string;
}

export interface UsageStats {
  apiCalls: {
    used: number;
    limit: number;
    resetDays: number;
  };
  cost: {
    current: number;
    limit: number;
    currency: string;
  };
  plan: string;
}

// =============================================================================
// QUICK ACTIONS
// =============================================================================

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'module-builder',
    title: 'Module Builder',
    description: 'Create logic blocks for your AI.',
    icon: 'extension',
    href: '/builders/module',
    color: 'primary',
  },
  {
    id: 'chatbot-builder',
    title: 'Chatbot Builder',
    description: 'Design conversational flows.',
    icon: 'smart_toy',
    href: '/builders/chatbot',
    color: 'blue',
  },
  {
    id: 'voice-agent',
    title: 'Voice Agent',
    description: 'Configure voice synthesis.',
    icon: 'graphic_eq',
    href: '/builders/voice',
    color: 'purple',
  },
  {
    id: 'canvas-builder',
    title: 'Canvas Builder',
    description: 'Map out complex architectures.',
    icon: 'account_tree',
    href: '/builders/canvas',
    color: 'emerald',
  },
];

// =============================================================================
// RECENT PROJECTS
// =============================================================================

export const RECENT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Customer Support Bot',
    owner: 'Hyyve Labs',
    version: '1.2',
    description: 'AI-powered customer service chatbot',
    thumbnail: 'https://picsum.photos/seed/proj1/400/200',
    status: 'active',
    lastModified: '2h ago',
    type: 'chatbot',
  },
  {
    id: 'proj-2',
    name: 'Sales Lead Qualifier',
    owner: 'Revenue Ops',
    version: '0.9',
    description: 'Automated lead scoring and qualification',
    thumbnail: 'https://picsum.photos/seed/proj2/400/200',
    status: 'training',
    lastModified: 'Yesterday',
    type: 'module',
  },
  {
    id: 'proj-3',
    name: 'Sentiment Analysis',
    owner: 'Research Team',
    version: '2.1',
    description: 'Social media sentiment tracking',
    thumbnail: 'https://picsum.photos/seed/proj3/400/200',
    status: 'draft',
    lastModified: '3 days ago',
    type: 'module',
  },
];

// =============================================================================
// ALL PROJECTS (for project browser)
// =============================================================================

export const ALL_PROJECTS: Project[] = [
  ...RECENT_PROJECTS,
  {
    id: 'proj-4',
    name: 'FAQ Bot',
    owner: 'Customer Experience',
    version: '1.4',
    description: 'Knowledge base Q&A system',
    thumbnail: 'https://picsum.photos/seed/proj4/400/200',
    status: 'active',
    lastModified: '5h ago',
    type: 'chatbot',
  },
  {
    id: 'proj-5',
    name: 'Voice Assistant',
    owner: 'Support Ops',
    version: '0.8',
    description: 'Voice-enabled customer support',
    thumbnail: 'https://picsum.photos/seed/proj5/400/200',
    status: 'paused',
    lastModified: '1 week ago',
    type: 'voice',
  },
  {
    id: 'proj-6',
    name: 'Data Pipeline',
    owner: 'Platform Team',
    version: '3.0',
    description: 'ETL workflow automation',
    thumbnail: 'https://picsum.photos/seed/proj6/400/200',
    status: 'active',
    lastModified: '2 days ago',
    type: 'canvas',
  },
];

// =============================================================================
// ACTIVITY FEED
// =============================================================================

export const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'success',
    title: 'Deployment Successful',
    subtitle: 'Support Bot v2.1',
    timestamp: '10 minutes ago',
    icon: 'check',
  },
  {
    id: 'act-2',
    type: 'error',
    title: 'Execution Failed',
    subtitle: 'Lead Qualifier • Timeout Error',
    timestamp: '2 hours ago',
    icon: 'priority_high',
  },
  {
    id: 'act-3',
    type: 'info',
    title: 'New Model Training Started',
    subtitle: 'Project: Sentiment Analysis',
    timestamp: '5 hours ago',
    icon: 'bolt',
  },
  {
    id: 'act-4',
    type: 'warning',
    title: 'Usage Threshold Reached',
    subtitle: '75% of monthly limit',
    timestamp: 'Yesterday',
    icon: 'warning',
  },
];

// =============================================================================
// USAGE STATS
// =============================================================================

export const USAGE_STATS: UsageStats = {
  apiCalls: {
    used: 124592,
    limit: 500000,
    resetDays: 12,
  },
  cost: {
    current: 42.5,
    limit: 120,
    currency: 'USD',
  },
  plan: 'Pro Plan',
};

// =============================================================================
// PROJECT FOLDERS (for project browser sidebar)
// =============================================================================

export interface ProjectFolder {
  id: string;
  name: string;
  projectCount: number;
  isOpen?: boolean;
  projects?: { id: string; name: string; type: Project['type'] }[];
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
}

export const WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Hyyve Labs', plan: 'Pro' },
  { id: 'ws-2', name: 'Acme Support', plan: 'Team' },
  { id: 'ws-3', name: 'Internal R&D', plan: 'Enterprise' },
];

export const PROJECT_FOLDERS: ProjectFolder[] = [
  {
    id: 'folder-1',
    name: 'Customer Facing',
    projectCount: 2,
    isOpen: true,
    projects: [
      { id: 'proj-1', name: 'FAQ Bot', type: 'chatbot' },
      { id: 'proj-2', name: 'Ticket Workflow', type: 'chatbot' },
    ],
  },
  {
    id: 'folder-2',
    name: 'Support Tools',
    projectCount: 3,
  },
  {
    id: 'folder-3',
    name: 'Sales Intelligence',
    projectCount: 4,
  },
  {
    id: 'folder-4',
    name: 'Internal Research',
    projectCount: 2,
  },
];
