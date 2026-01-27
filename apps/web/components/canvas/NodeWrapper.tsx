'use client';

/**
 * NodeWrapper Component - Styled container for flow nodes
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC6: NodeWrapper with colored top border
 *
 * Features:
 * - Colored top border (gradient or solid)
 * - Dark panel background (#1c1a2e)
 * - Border radius (rounded-xl)
 * - Hover state with primary border
 * - Shadow on hover
 *
 * @see hyyve_module_builder/code.html lines 246-262
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * NodeWrapper Props
 */
export interface NodeWrapperProps {
  /** Node content */
  children: React.ReactNode;
  /** Top border color (solid color or gradient string) */
  borderColor?: string;
  /** Optional gradient (from-to colors) */
  gradient?: {
    from: string;
    to: string;
  };
  /** Is node selected? */
  selected?: boolean;
  /** Additional class names */
  className?: string;
  /** Node width */
  width?: number | string;
}

/**
 * NodeWrapper Component
 *
 * Wraps flow nodes with consistent dark panel styling
 * and colored top border as shown in wireframes.
 */
export function NodeWrapper({
  children,
  borderColor,
  gradient,
  selected = false,
  className,
  width = 200,
}: NodeWrapperProps) {
  // Compute top border style
  const topBorderStyle: React.CSSProperties = gradient
    ? {
        background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
      }
    : borderColor
      ? { backgroundColor: borderColor }
      : { backgroundColor: '#5048e5' }; // Default to primary

  return (
    <div
      className={cn(
        // Container
        'flex flex-col',
        // Background
        'bg-[#1c1a2e]',
        // Border
        'border border-border-dark',
        'rounded-xl',
        // Hover state
        'hover:border-primary',
        // Shadow
        'shadow-lg',
        'hover:shadow-[0_0_20px_rgba(80,72,229,0.15)]',
        // Transition
        'transition-all duration-200',
        // Selected state
        selected && 'border-primary shadow-[0_0_20px_rgba(80,72,229,0.15)]',
        // Custom class
        className
      )}
      style={{ width }}
    >
      {/* Colored top border */}
      <div
        className="h-2 rounded-t-xl"
        style={topBorderStyle}
        aria-hidden="true"
      />

      {/* Node content */}
      {children}
    </div>
  );
}

export default NodeWrapper;
