'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * BreadcrumbItem Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * AC4: Breadcrumbs Component
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** Optional URL - if not provided, item is rendered as text */
  href?: string;
}

/**
 * BreadcrumbsProps Interface
 */
export interface BreadcrumbsProps {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumbs Component
 *
 * Dynamic breadcrumb navigation with:
 * - Chevron separators between items
 * - Clickable links for non-current items
 * - Current page badge styling (bg-[#272546])
 * - ARIA attributes for accessibility
 *
 * @see hyyve_module_builder/code.html lines 97-103 for wireframe reference
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !isLast && item.href;

        return (
          <React.Fragment key={index}>
            {/* Separator (except for first item) */}
            {index > 0 && (
              <span
                className="material-symbols-outlined text-[18px] text-text-secondary flex-shrink-0"
                aria-hidden="true"
              >
                chevron_right
              </span>
            )}

            {/* Breadcrumb Item */}
            {isLast ? (
              // Current page - styled as badge
              <span
                className="text-white font-medium bg-[#272546] px-2 py-0.5 rounded text-xs"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : isClickable ? (
              // Clickable link
              <Link
                href={item.href!}
                className="text-text-secondary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              >
                {item.label}
              </Link>
            ) : (
              // Non-clickable text (no href provided)
              <span className="text-text-secondary">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
