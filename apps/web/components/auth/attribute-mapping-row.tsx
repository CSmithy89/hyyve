/**
 * Attribute Mapping Row Component
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Wireframe: enterprise_sso_configuration/code.html (lines 160-205)
 *
 * Features:
 * - Display IdP attribute mapping to Hyyve field
 * - Editable input for IdP attribute name
 * - Arrow indicator between Hyyve field and IdP attribute
 *
 * Design tokens from wireframe:
 * - Background: bg-background-dark (#121121)
 * - Border: border-border-dark (#272546)
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for AttributeMappingRow component
 */
export interface AttributeMappingRowProps {
  /** Display label for the Hyyve field */
  label: string;
  /** Attribute identifier (used for data-testid) */
  attribute: string;
  /** Current IdP attribute value */
  value: string;
  /** Callback when value changes */
  onChange: (attribute: string, value: string) => void;
  /** Whether this field is required */
  required?: boolean;
  /** Placeholder text for input */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AttributeMappingRow Component
 *
 * A row in the attribute mapping table that maps
 * IdP attributes to Hyyve user fields.
 */
export function AttributeMappingRow({
  label,
  attribute,
  value,
  onChange,
  required = false,
  placeholder = 'Enter IdP attribute',
  className,
}: AttributeMappingRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(attribute, e.target.value);
  };

  const inputId = `mapping-input-${attribute}`;

  return (
    <div
      data-testid={`mapping-${attribute}`}
      className={cn(
        'flex items-center justify-between border-b border-border-dark/50 p-4',
        'transition-colors hover:bg-white/5',
        className
      )}
    >
      {/* Hyyve Field Label */}
      <div className="flex-1 px-4">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-white"
        >
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      </div>

      {/* Arrow Indicator */}
      <div
        data-testid="mapping-arrow"
        className="flex items-center justify-center px-4"
      >
        <span className="material-symbols-outlined text-primary">
          arrow_forward
        </span>
      </div>

      {/* IdP Attribute Input */}
      <div className="flex-1 px-4">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-border-dark bg-background-dark px-3 py-1.5',
            'text-sm text-white placeholder:text-text-secondary',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            'transition-colors'
          )}
        />
      </div>
    </div>
  );
}

export default AttributeMappingRow;
