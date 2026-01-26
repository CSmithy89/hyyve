import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution.
 *
 * Combines clsx for conditional classes with tailwind-merge to properly
 * resolve conflicting Tailwind utility classes (e.g., p-4 and p-2 -> p-2).
 *
 * @example
 * cn('p-4 text-red-500', 'p-2') // => 'text-red-500 p-2'
 * cn('base', false && 'hidden', true && 'visible') // => 'base visible'
 * cn('base', undefined, null) // => 'base'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
