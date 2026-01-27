/**
 * Registration Stepper Component
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Wireframe: hyyve_registration_-_step_1 (lines 47-75)
 *
 * Features:
 * - 3-step progress indicator (Account -> Organization -> Review)
 * - Active/completed/pending states with appropriate styling
 * - Progress line that fills based on current step
 *
 * Design tokens from wireframe:
 * - Step circle size: w-8 h-8
 * - Active bg: bg-primary (#5048e5)
 * - Pending bg: bg-[#2a2845] with border-[#383663]
 * - Completed: same as active
 * - Progress line: h-1 rounded-full
 * - Active text: text-white
 * - Pending text: text-[#9795c6]
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface RegistrationStepperProps {
  currentStep: number;
  steps: string[];
}

type StepState = 'active' | 'completed' | 'pending';

/**
 * Determines the state of a step based on current step index
 */
function getStepState(stepIndex: number, currentStep: number): StepState {
  if (stepIndex < currentStep) {
    return 'completed';
  }
  if (stepIndex === currentStep) {
    return 'active';
  }
  return 'pending';
}

/**
 * Calculates progress line width percentage
 * Each step represents ~33% of the line
 * Step 0 = 33%, Step 1 = 66%, Step 2 = 100%
 */
function calculateProgressWidth(
  currentStep: number,
  totalSteps: number
): string {
  // Use floor to match exact expected percentages
  // (currentStep + 1) / totalSteps gives us the fraction
  // For 3 steps: step 0 = 1/3 = 33%, step 1 = 2/3 = 66%, step 2 = 3/3 = 100%
  const percentage = Math.min(
    Math.floor(((currentStep + 1) / totalSteps) * 100),
    100
  );
  return `${percentage}%`;
}

export function RegistrationStepper({
  currentStep,
  steps,
}: RegistrationStepperProps) {
  const progressWidth = calculateProgressWidth(currentStep, steps.length);

  return (
    <div className="w-full px-2">
      <div className="relative flex items-center justify-between w-full">
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
        {steps.map((label, index) => {
          const state = getStepState(index, currentStep);
          const isActive = state === 'active';
          const isCompleted = state === 'completed';
          const isPending = state === 'pending';

          return (
            <div
              key={index}
              data-testid={`step-${index}`}
              data-state={state}
              className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-full shadow-[0_0_0_4px_#121121]',
                isActive || isCompleted
                  ? 'bg-primary'
                  : 'bg-[#2a2845] border-2 border-[#383663]'
              )}
            >
              <span
                className={cn(
                  'text-sm',
                  isActive || isCompleted ? 'font-bold' : 'font-medium',
                  isPending ? 'text-[#9795c6]' : 'text-white'
                )}
              >
                {index + 1}
              </span>
              {/* Step label positioned below */}
              <span
                className={cn(
                  'absolute -bottom-6 text-xs font-medium whitespace-nowrap',
                  isPending ? 'text-[#9795c6]' : 'text-white'
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
