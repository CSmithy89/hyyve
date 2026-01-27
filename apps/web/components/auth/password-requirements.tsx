/**
 * Password Requirements Component
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Wireframe: hyyve_registration_-_step_1 (lines 120-133)
 *
 * Features:
 * - List of requirements with check/circle icons
 * - Real-time validation state for each requirement
 * - Green for met requirements, muted for unmet
 *
 * Design tokens from wireframe:
 * - Gap between items: gap-1.5
 * - Icon size: text-[14px]
 * - Text size: text-xs
 * - Met color: text-[#4ade80] (green-400)
 * - Unmet color: text-text-muted (#9795c6)
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { validatePassword } from '@/lib/validations/auth';

export interface PasswordRequirementsProps {
  password: string;
}

interface RequirementItemProps {
  testId: string;
  isMet: boolean;
  text: string;
}

/**
 * Individual requirement item with icon and text
 */
function RequirementItem({ testId, isMet, text }: RequirementItemProps) {
  return (
    <li
      data-testid={testId}
      data-met={isMet.toString()}
      className={cn(
        'flex items-center gap-2 text-xs',
        isMet ? 'text-[#4ade80]' : 'text-text-muted'
      )}
    >
      {isMet ? (
        <span
          data-icon="check"
          className="material-symbols-outlined text-[14px] filled"
        >
          check_circle
        </span>
      ) : (
        <span
          data-icon="circle"
          className="material-symbols-outlined text-[14px]"
        >
          radio_button_unchecked
        </span>
      )}
      <span>{text}</span>
    </li>
  );
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { requirements } = validatePassword(password);

  return (
    <ul className="flex flex-col gap-1.5 mt-1" aria-live="polite">
      <RequirementItem
        testId="requirement-min-length"
        isMet={requirements.minLength}
        text="At least 8 characters"
      />
      <RequirementItem
        testId="requirement-number"
        isMet={requirements.hasNumber}
        text="Contains a number"
      />
      <RequirementItem
        testId="requirement-symbol"
        isMet={requirements.hasSymbol}
        text="Contains a symbol or uppercase letter"
      />
    </ul>
  );
}
