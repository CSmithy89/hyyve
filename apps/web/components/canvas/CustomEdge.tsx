'use client';

/**
 * CustomEdge Component - Animated edge for flow canvas
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC5: Connection lines with animation
 * AC7: CustomEdge with animated dash
 *
 * Features:
 * - Bezier curve paths
 * - Animated stroke-dasharray for pending connections
 * - Color-coded by type (success: green, error: red)
 * - Configurable colors
 * - Path labels support
 *
 * @see hyyve_module_builder/code.html lines 233-242
 */

import * as React from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';

/**
 * Custom Edge Data
 */
export interface CustomEdgeData extends Record<string, unknown> {
  /** Edge label text */
  label?: string;
  /** Edge color */
  color?: string;
  /** Edge type: default, success, error */
  edgeType?: 'default' | 'success' | 'error';
  /** Is edge animated? */
  animated?: boolean;
}

/**
 * Edge type colors
 */
const EDGE_COLORS: Record<string, string> = {
  default: '#5048e5', // Primary purple
  success: '#10b981', // Green
  error: '#ef4444', // Red
};

/**
 * CustomEdge Component
 *
 * Renders animated bezier curve edges with color-coding
 * and optional labels.
 */
export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerEnd,
  selected,
}: EdgeProps<Edge<CustomEdgeData>>) {
  // Get bezier path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine color
  const edgeType = data?.edgeType ?? 'default';
  const color = data?.color ?? EDGE_COLORS[edgeType] ?? EDGE_COLORS.default;
  const isAnimated = data?.animated ?? true;

  // Animation styles
  const animationStyle: React.CSSProperties = isAnimated
    ? {
        strokeDasharray: '5, 5',
        animation: 'dash 0.5s linear infinite',
      }
    : {};

  return (
    <>
      {/* Shadow/glow effect */}
      <path
        id={`${id}-shadow`}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeOpacity={0.15}
        className="pointer-events-none"
      />

      {/* Main edge path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={selected ? 3 : 2}
        style={{
          ...style,
          ...animationStyle,
          filter: `drop-shadow(0 0 3px ${color}40)`,
        }}
        className="transition-all duration-200"
        markerEnd={markerEnd}
      />

      {/* Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-auto px-2 py-1 rounded text-xs font-medium"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              backgroundColor: '#1c1a2e',
              color: color,
              border: `1px solid ${color}40`,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* CSS for dash animation */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}
      </style>
    </>
  );
}

export default CustomEdge;
