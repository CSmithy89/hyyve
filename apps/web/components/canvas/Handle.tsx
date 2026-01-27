'use client';

/**
 * Handle Component - Connection points for nodes
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC8: Handle components for connections
 *
 * Features:
 * - Input handles (left side) with Position.Left
 * - Output handles (right side) with Position.Right
 * - Styled as white circles with primary border
 * - Hover scale animation
 *
 * @see hyyve_module_builder/code.html lines 261, 295-296
 */

import * as React from 'react';
// import Handle from @xyflow/react for connection points
import { Handle as XYFlowHandle, Position, type HandleProps as XYFlowHandleProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

/**
 * Handle Props
 */
export interface HandleProps
  extends Omit<XYFlowHandleProps, 'position' | 'type'> {
  /** Handle type: source (output) or target (input) */
  type: 'source' | 'target';
  /** Optional position override */
  position?: Position;
  /** Optional color for colored handles */
  color?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Handle Component
 *
 * Renders connection points for flow nodes with consistent styling.
 * Input handles appear on the left (Position.Left).
 * Output handles appear on the right (Position.Right).
 */
export function Handle({
  type,
  position,
  color,
  className,
  style,
  ...props
}: HandleProps) {
  // Default position based on type
  const defaultPosition = type === 'source' ? Position.Right : Position.Left;
  const finalPosition = position ?? defaultPosition;

  // Build custom styles for colored handles
  const customStyle: React.CSSProperties = {
    ...style,
    ...(color && {
      backgroundColor: color,
      borderColor: '#1c1a2e', // Match node background
    }),
  };

  return (
    <XYFlowHandle
      type={type}
      position={finalPosition}
      className={cn(
        // Base styles
        'size-3 bg-white border-2 border-primary rounded-full',
        // Cursor
        'cursor-crosshair',
        // Hover animation
        'hover:scale-125 transition-transform',
        // Custom class
        className
      )}
      style={customStyle}
      {...props}
    />
  );
}

/**
 * InputHandle - Convenience component for input handles
 */
export function InputHandle(props: Omit<HandleProps, 'type'>) {
  return <Handle type="target" {...props} />;
}

/**
 * OutputHandle - Convenience component for output handles
 */
export function OutputHandle(props: Omit<HandleProps, 'type'>) {
  return <Handle type="source" {...props} />;
}

export default Handle;
