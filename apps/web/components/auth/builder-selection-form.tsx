/**
 * Builder Selection Form Component
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 * Wireframe: hyyve_registration_-_step_3
 *
 * Features:
 * - 2x2 grid of builder cards (radio buttons)
 * - Default selection: chatbot
 * - Check icon on selected card
 * - Go Back link/button, Get Started button
 * - Loading state during submission
 *
 * Design tokens from wireframe:
 * - Primary: #5048e5
 * - Background dark: #121121
 * - Card dark: #1c1b32
 * - Border dark: #383663
 * - Text secondary: #9795c6
 * - Surface dark: #1e1c30
 * - Surface hover: #272546
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Blocks,
  Bot,
  Mic,
  Paintbrush,
  Check,
  Loader2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  BUILDER_OPTIONS,
  DEFAULT_BUILDER,
  ONBOARDING_ROUTES,
} from '@/lib/constants/onboarding';
import { validateBuilderSelection } from '@/lib/validations/onboarding';
import { updateUserPreferences } from '@/actions/onboarding';

export interface BuilderSelectionFormProps {
  /** Callback when form is successfully submitted */
  onComplete?: (data: { preferredBuilder: string }) => void;
  /** Callback when back button is clicked */
  onBack?: () => void;
}

/**
 * Icon component mapping for builder options
 */
function BuilderIcon({
  icon,
  className,
  testId,
}: {
  icon: string;
  className?: string;
  testId?: string;
}) {
  const iconProps = { className, 'data-testid': testId };

  switch (icon) {
    case 'view_module':
      return <Blocks {...iconProps} />;
    case 'smart_toy':
      return <Bot {...iconProps} />;
    case 'mic':
      return <Mic {...iconProps} />;
    case 'brush':
      return <Paintbrush {...iconProps} />;
    default:
      return <Blocks {...iconProps} />;
  }
}

/**
 * BuilderSelectionForm Component
 *
 * Renders the builder selection form for Step 3 of onboarding.
 * Allows user to select their preferred builder to start with.
 */
export function BuilderSelectionForm({
  onComplete,
  onBack,
}: BuilderSelectionFormProps) {
  const router = useRouter();

  // Form state - default to chatbot
  const [selectedBuilder, setSelectedBuilder] = React.useState(DEFAULT_BUILDER);

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);

  /**
   * Handle builder selection
   */
  const handleBuilderChange = (value: string) => {
    setSelectedBuilder(value);
    setGeneralError(null);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validate selection
    const result = validateBuilderSelection(selectedBuilder);
    if (!result.isValid) {
      setGeneralError(result.error || 'Please select a builder');
      return;
    }

    // Submit the form
    setIsSubmitting(true);

    try {
      const response = await updateUserPreferences({
        preferredBuilder: selectedBuilder,
      });

      if (response.success) {
        if (onComplete) {
          onComplete({ preferredBuilder: selectedBuilder });
        } else {
          // Default behavior: navigate to dashboard
          router.replace(ONBOARDING_ROUTES.dashboard);
        }
      } else {
        setGeneralError(response.error || 'Failed to save preferences');
      }
    } catch {
      setGeneralError('Failed to save preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = (e?: React.MouseEvent) => {
    if (onBack) {
      e?.preventDefault();
      onBack();
    }
  };

  return (
    <form
      data-testid="builder-selection-form"
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto"
    >
      {/* Page Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          What do you want to build first?
        </h1>
        <p className="text-[#9795c6] text-sm">
          Select a starting point to customize your Hyyve workspace experience.
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

      {/* Builder Cards Grid */}
      <div
        role="radiogroup"
        aria-label="Builder selection"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        {BUILDER_OPTIONS.map((option) => {
          const isSelected = selectedBuilder === option.value;

          return (
            <label
              key={option.value}
              data-testid={`builder-card-${option.value}`}
              className={cn(
                'relative flex flex-col p-5 rounded-xl cursor-pointer',
                'border-2 transition-all duration-200',
                'focus-within:ring-2 focus-within:ring-primary/50',
                isSubmitting && 'opacity-50 cursor-not-allowed',
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-[#1c1b32] border-[#383663] hover:border-[#5048e5]/50 hover:bg-[#272546]'
              )}
            >
              <input
                type="radio"
                name="builder"
                value={option.value}
                checked={isSelected}
                onChange={() => handleBuilderChange(option.value)}
                disabled={isSubmitting}
                className="sr-only"
                aria-label={option.label}
              />

              {/* Check icon for selected card - always rendered for testing, visibility toggled */}
              <div
                data-testid="builder-check-icon"
                className="absolute top-3 right-3"
                style={{ display: isSelected ? 'block' : 'none' }}
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              </div>

              {/* Builder Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                  isSelected ? 'bg-primary/20' : 'bg-[#272546]'
                )}
              >
                <BuilderIcon
                  icon={option.icon}
                  testId={`builder-icon-${option.value}`}
                  className={cn(
                    'w-6 h-6',
                    isSelected ? 'text-primary' : 'text-[#9795c6]'
                  )}
                />
              </div>

              {/* Builder Label */}
              <h3 className="text-base font-semibold text-white mb-1">
                {option.label}
              </h3>

              {/* Builder Description */}
              <p className="text-sm text-[#9795c6] leading-relaxed">
                {option.description}
              </p>
            </label>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Get Started Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Get Started"
          className={cn(
            'w-full h-12 rounded-lg text-white text-sm font-medium',
            'bg-primary transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary/90'
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 data-testid="submit-loading" className="w-4 h-4 animate-spin" />
              Setting up...
            </span>
          ) : (
            'Get Started'
          )}
        </button>

        {/* Go Back - Button when onBack is provided, Link otherwise */}
        <div className="text-center">
          {onBack ? (
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
              Go Back
            </button>
          ) : (
            <a
              href={ONBOARDING_ROUTES.organization}
              onClick={handleBack}
              className={cn(
                'text-sm font-medium text-[#9795c6] hover:text-white',
                'transition-colors duration-200',
                'focus:outline-none focus:underline',
                isSubmitting && 'pointer-events-none opacity-50'
              )}
            >
              Go Back
            </a>
          )}
        </div>
      </div>

    </form>
  );
}
