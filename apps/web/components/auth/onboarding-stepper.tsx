/**
 * Onboarding Stepper Component
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 * Wireframes: hyyve_registration_-_step_2, hyyve_registration_-_step_3
 *
 * Features:
 * - 3-step progress indicator (Account -> Organization -> Usage)
 * - Active/completed/pending states with appropriate styling
 * - Progress line that fills based on current step
 * - Checkmark for completed steps
 * - Step labels hidden on mobile (sm:block)
 * - Optional step count text ("Step X of Y")
 *
 * Design tokens from wireframe:
 * - Primary: #5048e5
 * - Background dark: #121121
 * - Border dark: #383663
 * - Text secondary: #9795c6
 * - Completed: green-500
 */

'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Step configuration interface
 */
export interface OnboardingStep {
  label: string;
  description?: string;
}

export interface OnboardingStepperProps {
  /** Current step index (0-indexed: 0, 1, or 2) */
  currentStep: number;
  /** Array of step configurations */
  steps: OnboardingStep[];
  /** Show step count text (e.g., "Step 3 of 3") */
  showStepCount?: boolean;
  /** Additional CSS classes */
  className?: string;
}

type StepState = 'active' | 'completed' | 'pending';

/**
 * Determines the state of a step based on current step index
 * Per test expectations: step 0 is completed when currentStep >= 1
 */
function getStepState(stepIndex: number, currentStep: number): StepState {
  // The tests indicate that for currentStep=1, step 0 should be completed
  // and step 1 should be active, step 2 pending
  // For currentStep=2, steps 0 and 1 are completed, step 2 is active
  if (stepIndex < currentStep) {
    return 'completed';
  }
  if (stepIndex === currentStep) {
    return 'active';
  }
  return 'pending';
}

/**
 * Calculates progress line width percentage based on current step
 * Per test: Step 1 (currentStep=1) = 50%, Step 2 (currentStep=2) = 100%
 */
function calculateProgressWidth(currentStep: number, totalSteps: number): string {
  if (currentStep <= 0) {
    return '0%';
  }
  // Calculate based on current step position
  // currentStep 1 of 3 = 50%, currentStep 2 of 3 = 100%
  const percentage = Math.min((currentStep / (totalSteps - 1)) * 100, 100);
  return `${Math.round(percentage)}%`;
}

/**
 * OnboardingStepper Component
 *
 * Renders a 3-step progress indicator for the onboarding flow.
 * Shows completed steps with checkmarks and active step with primary styling.
 */
export function OnboardingStepper({
  currentStep,
  steps,
  showStepCount = false,
  className,
}: OnboardingStepperProps) {
  const progressWidth = calculateProgressWidth(currentStep, steps.length);

  return (
    <div
      data-testid="onboarding-stepper"
      className={cn('w-full px-4', className)}
    >
      <div className="relative flex items-center justify-between w-full max-w-md mx-auto">
        {/* Background line */}
        <div
          data-testid="progress-line"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#2a2845] rounded-full -z-10"
        />

        {/* Active/progress line */}
        <div
          data-testid="progress-line-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
          style={{ width: progressWidth }}
        />

        {/* Step circles */}
        {steps.map((step, index) => {
          const state = getStepState(index, currentStep);
          const isActive = state === 'active';
          const isCompleted = state === 'completed';
          const isPending = state === 'pending';

          return (
            <div
              key={index}
              data-testid={`onboarding-step-${index}`}
              data-state={state}
              className={cn(
                'relative flex flex-col items-center',
                isPending && 'opacity-50'
              )}
            >
              {/* Step circle */}
              <div
                data-testid="step-circle"
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300',
                  'shadow-[0_0_0_4px_#121121]',
                  isActive && 'bg-primary',
                  isCompleted && 'bg-green-500',
                  isPending && 'bg-[#2a2845] border-2 border-[#383663]'
                )}
              >
                {isCompleted ? (
                  <Check
                    data-testid="step-check-icon"
                    className="w-4 h-4 text-white"
                    strokeWidth={3}
                    aria-label="Completed"
                  />
                ) : (
                  <span
                    className={cn(
                      'text-sm',
                      isActive ? 'font-bold text-white' : 'font-medium',
                      isPending && 'text-[#9795c6]'
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step label - hidden on mobile */}
              <span
                data-testid={`step-label-${index}`}
                className={cn(
                  'absolute -bottom-6 text-xs font-medium whitespace-nowrap',
                  'hidden sm:block',
                  isPending ? 'text-[#9795c6]' : 'text-white'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step count text */}
      {showStepCount && (
        <div className="text-center mt-10">
          <span className="text-xs text-[#9795c6]">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      )}
    </div>
  );
}
