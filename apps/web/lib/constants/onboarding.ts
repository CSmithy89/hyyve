/**
 * Onboarding Constants
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 * Wireframes: hyyve_registration_-_step_2, hyyve_registration_-_step_3
 *
 * Contains constant values for:
 * - Organization types dropdown options
 * - Team size radio button options
 * - Builder selection card options
 */

/**
 * Organization type option interface
 */
export interface OrganizationType {
  value: string;
  label: string;
}

/**
 * Team size option interface
 */
export interface TeamSizeOption {
  value: string;
  label: string;
  icon: string;
}

/**
 * Builder option interface
 */
export interface BuilderOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

/**
 * Organization types for dropdown
 * From wireframe hyyve_registration_-_step_2 lines 122-128
 */
export const ORGANIZATION_TYPES: OrganizationType[] = [
  { value: 'startup', label: 'Startup' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'agency', label: 'Agency / Dev Shop' },
  { value: 'research', label: 'Research Lab' },
  { value: 'freelance', label: 'Freelance / Personal' },
  { value: 'nonprofit', label: 'Non-profit / Education' },
];

/**
 * Team size options for radio group
 * From wireframe hyyve_registration_-_step_2
 * Icons reference Material Symbols: person, group, diversity_3, domain
 */
export const TEAM_SIZE_OPTIONS: TeamSizeOption[] = [
  { value: '1', label: 'Just me', icon: 'person' },
  { value: '2-10', label: '2-10', icon: 'group' },
  { value: '11-50', label: '11-50', icon: 'diversity_3' },
  { value: '50+', label: '50+', icon: 'domain' },
];

/**
 * Builder options for selection cards
 * From wireframe hyyve_registration_-_step_3
 */
export const BUILDER_OPTIONS: BuilderOption[] = [
  {
    value: 'module',
    label: 'Module Builder',
    description: 'Construct custom logic blocks and backend workflows visually.',
    icon: 'view_module',
  },
  {
    value: 'chatbot',
    label: 'Chatbot Builder',
    description: 'Design intelligent conversational flows and automated responses.',
    icon: 'smart_toy',
  },
  {
    value: 'voice',
    label: 'Voice Agent',
    description: 'Deploy voice-responsive AI assistants for phone or web.',
    icon: 'mic',
  },
  {
    value: 'canvas',
    label: 'Canvas Builder',
    description: 'Freeform visually guided AI creation on an infinite canvas.',
    icon: 'brush',
  },
];

/**
 * Default builder selection
 */
export const DEFAULT_BUILDER = 'chatbot';

/**
 * Onboarding step labels
 */
export const ONBOARDING_STEPS = ['Account', 'Organization', 'Usage'] as const;

/**
 * Onboarding routes
 */
export const ONBOARDING_ROUTES = {
  account: '/sign-up',
  organization: '/auth/register/org',
  personalize: '/auth/register/personalize',
  dashboard: '/dashboard',
} as const;
