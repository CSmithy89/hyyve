/**
 * Password Strength Indicator Component
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Wireframe: hyyve_registration_-_step_1 (lines 107-118)
 *
 * Features:
 * - 4-segment strength meter with color coding
 * - Text feedback (Weak/Medium/Strong)
 * - Real-time updates as password changes
 *
 * Design tokens from wireframe:
 * - Segment height: h-1.5
 * - Segment gap: gap-1.5
 * - Inactive color: bg-[#383663]
 * - Weak: bg-red-500
 * - Medium: bg-yellow-500
 * - Strong: bg-green-500
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  calculatePasswordStrength,
  strengthToColor,
  strengthToSegments,
  type PasswordStrength,
} from '@/lib/validations/auth';

export interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * Maps strength to display text
 */
function strengthToText(strength: PasswordStrength): string {
  const textMap: Record<PasswordStrength, string> = {
    none: '',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  };
  return textMap[strength];
}

/**
 * Maps strength to text color class
 */
function strengthToTextColor(strength: PasswordStrength): string {
  const colorMap: Record<PasswordStrength, string> = {
    none: 'text-text-muted',
    weak: 'text-red-500',
    medium: 'text-yellow-500',
    strong: 'text-green-500',
  };
  return colorMap[strength];
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);
  const activeSegments = strengthToSegments(strength);
  const color = strengthToColor(strength);
  const inactiveColor = 'bg-[#383663]';

  const strengthText = strengthToText(strength);

  return (
    <div className="flex flex-col gap-1">
      {/* Strength Meter - 4 segments */}
      <div
        data-testid="password-strength-meter"
        role="progressbar"
        aria-valuenow={activeSegments}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label={strength !== 'none' ? `Password strength: ${strengthText}` : 'Password strength indicator'}
        className="flex gap-1.5 mt-1"
      >
        {[0, 1, 2, 3].map((index) => {
          const isActive = index < activeSegments;
          return (
            <div
              key={index}
              data-testid={`strength-segment-${index}`}
              data-active={isActive.toString()}
              data-segment="true"
              className={cn('h-1.5 flex-1 rounded-full', isActive ? color : inactiveColor)}
            />
          );
        })}
      </div>

      {/* Text Feedback */}
      <p
        data-testid="password-strength-text"
        className={cn('text-xs font-medium', strengthToTextColor(strength))}
      >
        {strengthText}
        {strength !== 'none' && ' strength'}
      </p>
    </div>
  );
}
