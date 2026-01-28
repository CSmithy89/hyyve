/**
 * OTP Input Component
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Wireframe: mfa_authenticator_setup/code.html (lines 101-110)
 *
 * Features:
 * - 6-digit OTP input with individual boxes
 * - Auto-advance to next input on digit entry
 * - Backspace navigation to previous input
 * - Paste support for 6-digit codes
 * - Error state styling with red border
 * - Dash separator between groups (3 - 3 format)
 * - Accessible with proper ARIA labels
 *
 * Design tokens from wireframe:
 * - Input: w-10 h-12 sm:w-12 sm:h-14
 * - Background: bg-gray-50 dark:bg-background-dark
 * - Border: border-gray-300 dark:border-surface-border
 * - Focus: focus:ring-2 focus:ring-primary focus:border-primary
 * - Text: text-xl font-bold text-gray-900 dark:text-white
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the OtpInput component
 */
export interface OtpInputProps {
  /** Array of 6 digit values */
  value: string[];
  /** Callback when value changes */
  onChange: (value: string[]) => void;
  /** Whether inputs are disabled */
  disabled?: boolean;
  /** Whether to show error styling */
  error?: boolean;
  /** Whether to auto-focus first input on mount */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * OtpInput Component
 *
 * A 6-digit OTP input with auto-advance, backspace navigation,
 * and paste support. Used for TOTP verification during MFA setup.
 */
export function OtpInput({
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
  className,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount if autoFocus is true
  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  /**
   * Handle input change
   */
  const handleChange = (index: number, inputValue: string) => {
    // Only accept numeric input
    const digit = inputValue.replace(/\D/g, '').slice(-1);

    if (digit === '' && inputValue !== '') {
      // Non-numeric input, ignore
      return;
    }

    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-advance to next input if a digit was entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle key down events
   */
  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace on empty input
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      event.preventDefault();
      // Clear previous input and focus it
      const newValue = [...value];
      newValue[index - 1] = '';
      onChange(newValue);
      inputRefs.current[index - 1]?.focus();
    }

    // Handle left arrow
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle paste event
   */
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newValue = [...value];
      for (let i = 0; i < 6; i++) {
        newValue[i] = digits[i] || '';
      }
      onChange(newValue);

      // Focus the appropriate input after paste
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  /**
   * Handle focus - select content
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <div className={cn('flex gap-2 sm:gap-3', className)}>
      {[0, 1, 2].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of 6`}
          placeholder="-"
          className={cn(
            'w-10 h-12 sm:w-12 sm:h-14',
            'text-center text-xl font-bold',
            'bg-gray-50 dark:bg-background-dark',
            'border rounded-lg',
            'outline-none transition-all',
            'text-gray-900 dark:text-white',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-surface-border focus:ring-2 focus:ring-primary focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}

      {/* Dash separator */}
      <div className="flex items-center justify-center text-gray-400">-</div>

      {[3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of 6`}
          placeholder="-"
          className={cn(
            'w-10 h-12 sm:w-12 sm:h-14',
            'text-center text-xl font-bold',
            'bg-gray-50 dark:bg-background-dark',
            'border rounded-lg',
            'outline-none transition-all',
            'text-gray-900 dark:text-white',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-surface-border focus:ring-2 focus:ring-primary focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  );
}

export default OtpInput;
