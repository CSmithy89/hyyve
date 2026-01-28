/**
 * Onboarding Server Actions
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 *
 * Server actions for:
 * - Creating organization during onboarding
 * - Updating user preferences (builder selection)
 *
 * NOTE: These are stub implementations that return success.
 * Actual implementation will integrate with Supabase/AgentOS.
 */

'use server';

import { z } from 'zod';

/**
 * Organization creation input schema
 */
const CreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name must be no more than 50 characters'),
  type: z.string().min(1, 'Organization type is required'),
  teamSize: z.string().min(1, 'Team size is required'),
});

/**
 * User preferences input schema
 */
const UpdatePreferencesSchema = z.object({
  preferredBuilder: z.string().min(1, 'Builder preference is required'),
});

/**
 * Action result interface
 */
export interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Create organization during onboarding
 *
 * @param data - Organization data from form
 * @returns Success result with organization ID
 */
export async function createOrganization(data: {
  name: string;
  type: string;
  teamSize: string;
}): Promise<ActionResult> {
  try {
    // Validate input
    const validated = CreateOrganizationSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid organization data',
      };
    }

    // TODO: Implement actual organization creation with Supabase
    // 1. Get current user from Clerk session
    // 2. Create organization in database
    // 3. Create default workspace for organization
    // 4. Link user as organization owner

    // Stub: Return success
    return {
      success: true,
      data: {
        organizationId: `org_${Date.now()}`,
        workspaceId: `ws_${Date.now()}`,
      },
    };
  } catch (error) {
    console.error('Failed to create organization:', error);
    return {
      success: false,
      error: 'Failed to create organization',
    };
  }
}

/**
 * Update user preferences (builder selection)
 *
 * @param data - User preferences data
 * @returns Success result
 */
export async function updateUserPreferences(data: {
  preferredBuilder: string;
}): Promise<ActionResult> {
  try {
    // Validate input
    const validated = UpdatePreferencesSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid preferences data',
      };
    }

    // TODO: Implement actual preference update
    // 1. Get current user from Clerk session
    // 2. Update user metadata with builder preference
    // 3. Mark onboarding as complete

    // Stub: Return success
    return {
      success: true,
      data: {
        preferredBuilder: data.preferredBuilder,
        onboardingComplete: true,
      },
    };
  } catch (error) {
    console.error('Failed to update preferences:', error);
    return {
      success: false,
      error: 'Failed to save preferences',
    };
  }
}

/**
 * Skip organization setup and create default workspace
 *
 * @returns Success result with default workspace ID
 */
export async function skipOrganizationSetup(): Promise<ActionResult> {
  try {
    // TODO: Implement actual default workspace creation
    // 1. Get current user from Clerk session
    // 2. Create personal workspace with default name
    // 3. Set user as workspace owner

    // Stub: Return success
    return {
      success: true,
      data: {
        workspaceId: `ws_default_${Date.now()}`,
        isDefault: true,
      },
    };
  } catch (error) {
    console.error('Failed to skip organization setup:', error);
    return {
      success: false,
      error: 'Failed to create default workspace',
    };
  }
}
