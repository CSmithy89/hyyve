/**
 * Organization Setup Form Component
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 * Wireframe: hyyve_registration_-_step_2
 *
 * Features:
 * - Organization name input with validation
 * - Organization type dropdown
 * - Team size radio group in 2x4 grid with icons
 * - Form validation with error messages
 * - Skip for now, Back, Continue buttons
 * - Loading state during submission
 *
 * Design tokens from wireframe:
 * - Background dark: #121121
 * - Input dark: #131221
 * - Card dark: #1c1b32
 * - Border dark: #383663
 * - Text secondary: #9795c6
 * - Primary: #5048e5
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Users, Building, Loader2, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  ORGANIZATION_TYPES,
  TEAM_SIZE_OPTIONS,
  ONBOARDING_ROUTES,
} from '@/lib/constants/onboarding';
import { validateOrganizationForm } from '@/lib/validations/onboarding';
import { createOrganization, skipOrganizationSetup } from '@/actions/onboarding';

export interface OrganizationSetupFormProps {
  /** Callback when form is successfully submitted */
  onSuccess?: (data: { organizationId: string }) => void;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Callback when skip button is clicked */
  onSkip?: () => void;
}

/**
 * Icon component mapping for team size options
 */
function TeamSizeIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case 'person':
      return <User className={className} />;
    case 'group':
      return <Users className={className} />;
    case 'diversity_3':
      return <Users className={className} />;
    case 'domain':
      return <Building className={className} />;
    default:
      return <User className={className} />;
  }
}

/**
 * OrganizationSetupForm Component
 *
 * Renders the organization setup form for Step 2 of onboarding.
 * Collects organization name, type, and team size.
 */
export function OrganizationSetupForm({
  onSuccess,
  onBack,
  onSkip,
}: OrganizationSetupFormProps) {
  const router = useRouter();

  // Form state
  const [orgName, setOrgName] = React.useState('');
  const [orgType, setOrgType] = React.useState('');
  const [teamSize, setTeamSize] = React.useState('');

  const formValidation = React.useMemo(
    () =>
      validateOrganizationForm({
        name: orgName,
        type: orgType,
        teamSize,
      }),
    [orgName, orgType, teamSize]
  );

  const errors = formValidation.errors;
  const isFormValid = formValidation.isValid;

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);



  /**
   * Validate organization name on change
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrgName(value);
    setGeneralError(null);
  };

  /**
   * Handle organization type change
   */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOrgType(value);
    setGeneralError(null);
  };

  /**
   * Handle team size selection
   */
  const handleTeamSizeChange = (value: string) => {
    setTeamSize(value);
    setGeneralError(null);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!formValidation.isValid) {
      return;
    }

    // Submit the form
    setIsSubmitting(true);

    try {
      const result = await createOrganization({
        name: orgName,
        type: orgType,
        teamSize: teamSize,
      });

      if (result.success) {
        // Handle both formats: { data: { organizationId } } and { organizationId }
        const resultAny = result as unknown as { data?: { organizationId?: string }; organizationId?: string };
        const organizationId = (resultAny.data?.organizationId || resultAny.organizationId) as string;
        if (onSuccess) {
          onSuccess({ organizationId });
        } else {
          // Default behavior: navigate to personalization page
          router.push(ONBOARDING_ROUTES.personalize);
        }
      } else {
        setGeneralError(result.error || 'Failed to create organization');
      }
    } catch {
      setGeneralError('Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle skip button click
   */
  const handleSkip = async () => {
    if (onSkip) {
      onSkip();
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const result = await skipOrganizationSetup();

      if (result.success) {
        router.push(ONBOARDING_ROUTES.personalize);
      } else {
        setGeneralError(result.error || 'Failed to skip setup');
      }
    } catch {
      setGeneralError('Failed to skip setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle back button click
   */
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.push(ONBOARDING_ROUTES.account);
  };

  return (
    <form
      data-testid="org-setup-form"
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
    >
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Tell us about your team
        </h1>
        <p className="text-[#9795c6] text-sm">
          This helps us customize your Hyyve workspace experience.
        </p>
      </div>

      {/* General error alert */}
      {generalError && (
        <div
          role="alert"
          className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
        >
          {generalError}
        </div>
      )}

      {/* Organization Name */}
      <div className="mb-6">
        <label
          htmlFor="org-name"
          className="block text-sm font-medium text-white mb-2"
        >
          Organization Name
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Building2
              data-testid="org-name-business-icon"
              className="w-5 h-5 text-[#9795c6]"
            />
          </div>
          <input
            id="org-name"
            data-testid="org-name-input"
            type="text"
            value={orgName}
            onChange={handleNameChange}
            disabled={isSubmitting}
            placeholder="e.g. Acme AI Labs"
            aria-describedby={errors.name ? 'org-name-error' : undefined}
            aria-invalid={!!errors.name}
            className={cn(
              'w-full h-11 pl-10 pr-4 rounded-lg',
              'bg-[#131221] border text-white text-sm',
              'placeholder:text-[#9795c6]',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-[#383663] focus:border-primary'
            )}
          />
        </div>
        {errors.name && (
          <p
            id="org-name-error"
            data-testid="org-name-error"
            role="alert"
            className="mt-1 text-xs text-red-500"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Organization Type */}
      <div className="mb-6">
        <label
          htmlFor="org-type"
          className="block text-sm font-medium text-white mb-2"
        >
          Organization Type
        </label>
        <select
          id="org-type"
          data-testid="org-type-select"
          value={orgType}
          onChange={handleTypeChange}
          disabled={isSubmitting}
          aria-describedby={errors.type ? 'org-type-error' : undefined}
          aria-invalid={!!errors.type}
          aria-label="Organization Type"
          className={cn(
            'w-full h-11 px-4 rounded-lg',
            'bg-[#131221] border text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'transition-colors duration-200 cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            orgType ? 'text-white' : 'text-[#9795c6]',
            errors.type
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#383663] focus:border-primary'
          )}
        >
          <option value="" disabled>
            Select organization type
          </option>
          {ORGANIZATION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p
            id="org-type-error"
            data-testid="org-type-error"
            role="alert"
            className="mt-1 text-xs text-red-500"
          >
            {errors.type}
          </p>
        )}
      </div>

      {/* Team Size */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-2">
          Team Size
        </label>
        <div
          role="radiogroup"
          aria-label="Team Size"
          data-testid="team-size-grid"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {TEAM_SIZE_OPTIONS.map((option) => {
            const isSelected = teamSize === option.value;

            return (
              <label
                key={option.value}
                data-testid={`team-size-${option.value}`}
                className={cn(
                  'relative flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer',
                  'border transition-all duration-200',
                  'focus-within:ring-2 focus-within:ring-primary/50',
                  isSubmitting && 'opacity-50 cursor-not-allowed',
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-[#1c1b32] border-[#383663] hover:border-[#5048e5]/50'
                )}
              >
                <input
                  type="radio"
                  name="teamSize"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleTeamSizeChange(option.value)}
                  disabled={isSubmitting}
                  className="sr-only"
                  aria-label={option.label}
                />
                <div data-testid={`team-size-icon-${option.value}`}>
                  <TeamSizeIcon
                    icon={option.icon}
                    className={cn(
                      'w-6 h-6 mb-2',
                      isSelected ? 'text-primary' : 'text-[#9795c6]'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-white' : 'text-[#9795c6]'
                  )}
                >
                  {option.label}
                </span>
                {isSelected && (
                  <div
                    data-testid={`team-size-check-${option.value}`}
                    className="absolute top-2 right-2"
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
        {errors.teamSize && (orgName || orgType || teamSize) && (
          <p
            id="team-size-error"
            data-testid="team-size-error"
            role="alert"
            className="mt-2 text-xs text-red-500"
          >
            {errors.teamSize}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Continue Button - disabled until form is valid or while submitting */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          aria-label="Continue"
          className={cn(
            'w-full h-11 rounded-lg text-white text-sm font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            !isFormValid || isSubmitting
              ? 'bg-primary/50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 data-testid="submit-loading" className="w-4 h-4 animate-spin" />
              Creating...
            </span>
          ) : (
            'Continue'
          )}
        </button>

        {/* Secondary Actions */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className={cn(
              'text-sm font-medium text-[#9795c6] hover:text-white',
              'transition-colors duration-200',
              'focus:outline-none focus:underline',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className={cn(
              'text-sm font-medium text-[#9795c6] hover:text-white',
              'transition-colors duration-200',
              'focus:outline-none focus:underline',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            Skip for now
          </button>
        </div>
      </div>
    </form>
  );
}
