/**
 * Phone Input Component
 *
 * Story: 1-1-10 MFA SMS Verification
 *
 * Features:
 * - Phone number input with country code selector
 * - Common country codes dropdown
 * - Numeric-only input filtering
 * - Error state styling
 * - Accessible with proper ARIA labels
 *
 * Design tokens from wireframe:
 * - Input: bg-gray-50 dark:bg-background-dark
 * - Border: border-gray-300 dark:border-surface-border
 * - Focus: focus:ring-2 focus:ring-primary focus:border-primary
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Country code data
 */
interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const DEFAULT_COUNTRY: Country = { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' };

const COUNTRIES: Country[] = [
  DEFAULT_COUNTRY,
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
];

/**
 * Props for the PhoneInput component
 */
export interface PhoneInputProps {
  /** Phone number value (without country code) */
  value: string;
  /** Country dial code (e.g., '+1') */
  countryCode: string;
  /** Callback when phone number changes */
  onChange: (value: string) => void;
  /** Callback when country code changes */
  onCountryCodeChange: (code: string) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to show error styling */
  error?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PhoneInput Component
 *
 * Phone number input with country code selector.
 * Filters non-numeric characters and provides country code dropdown.
 */
export function PhoneInput({
  value,
  countryCode,
  onChange,
  onCountryCodeChange,
  disabled = false,
  error = false,
  placeholder = '(555) 123-4567',
  className,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Find current country by dial code
  const currentCountry = COUNTRIES.find((c) => c.dialCode === countryCode) ?? DEFAULT_COUNTRY;

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Handle input change - filter non-numeric characters
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    onChange(numericValue);
  };

  /**
   * Format phone number for display (US format)
   */
  const formatPhoneNumber = (num: string): string => {
    if (!num) return '';
    if (num.length <= 3) return num;
    if (num.length <= 6) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
    return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 10)}`;
  };

  /**
   * Handle country selection
   */
  const handleCountrySelect = (country: Country) => {
    onCountryCodeChange(country.dialCode);
    setIsOpen(false);
    setSearchQuery('');
    inputRef.current?.focus();
  };

  /**
   * Handle keyboard navigation in dropdown
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('flex gap-2', className)}>
      {/* Country Code Selector */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          role="combobox"
          aria-label="Country code"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex items-center gap-2 px-3 h-12',
            'bg-gray-50 dark:bg-background-dark',
            'border rounded-lg',
            'text-gray-900 dark:text-white font-medium',
            'transition-all',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 dark:border-surface-border focus:ring-2 focus:ring-primary focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'hover:bg-gray-100 dark:hover:bg-surface-dark'
          )}
        >
          <span className="text-lg">{currentCountry.flag}</span>
          <span>{currentCountry.dialCode}</span>
          <span className="material-symbols-outlined text-[18px] text-gray-400">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            role="listbox"
            aria-label="Select country"
            className={cn(
              'absolute z-50 mt-1 w-64',
              'bg-white dark:bg-surface-dark',
              'border border-gray-200 dark:border-surface-border',
              'rounded-lg shadow-lg',
              'max-h-64 overflow-hidden'
            )}
          >
            {/* Search input */}
            <div className="p-2 border-b border-gray-200 dark:border-surface-border">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..."
                className={cn(
                  'w-full px-3 py-2',
                  'bg-gray-50 dark:bg-background-dark',
                  'border border-gray-300 dark:border-surface-border rounded-md',
                  'text-sm text-gray-900 dark:text-white',
                  'placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-48">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  role="option"
                  aria-selected={country.dialCode === countryCode}
                  onClick={() => handleCountrySelect(country)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2',
                    'text-left text-sm',
                    'text-gray-900 dark:text-white',
                    'hover:bg-gray-100 dark:hover:bg-primary/10',
                    'transition-colors',
                    country.dialCode === countryCode && 'bg-primary/5 dark:bg-primary/20'
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-gray-500">{country.dialCode}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        role="textbox"
        aria-label="Phone number"
        value={formatPhoneNumber(value)}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'flex-1 h-12 px-4',
          'bg-gray-50 dark:bg-background-dark',
          'border rounded-lg',
          'text-gray-900 dark:text-white',
          'placeholder-gray-400',
          'transition-all',
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-surface-border focus:ring-2 focus:ring-primary focus:border-primary',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
}

export default PhoneInput;
