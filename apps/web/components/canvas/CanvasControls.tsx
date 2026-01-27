'use client';

/**
 * CanvasControls Component - Zoom controls and minimap
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC2: Zoom controls (zoom in/out/fit)
 * AC3: Minimap component
 *
 * Features:
 * - Zoom in button (+)
 * - Zoom out button (-)
 * - Fit to screen button
 * - Positioned bottom-left with dark panel styling
 * - MiniMap with dark theme
 *
 * @see hyyve_module_builder/code.html lines 211-231
 */

import * as React from 'react';
import { MiniMap, useReactFlow } from '@xyflow/react';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * CanvasControls Props
 */
export interface CanvasControlsProps {
  /** Show minimap */
  showMiniMap?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Control button component
 */
function ControlButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'size-8 flex items-center justify-center',
        'text-white hover:bg-[#272546]',
        'rounded transition-colors'
      )}
    >
      {children}
    </button>
  );
}

/**
 * CanvasControls Component
 *
 * Renders zoom controls and minimap in the bottom-left
 * corner of the flow canvas.
 */
export function CanvasControls({
  showMiniMap = true,
  className,
}: CanvasControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleZoomIn = React.useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = React.useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  const handleFitView = React.useCallback(() => {
    fitView({ duration: 300, padding: 0.2 });
  }, [fitView]);

  return (
    <div
      className={cn(
        'absolute bottom-6 left-6 z-30',
        'flex flex-col gap-2',
        className
      )}
    >
      {/* Zoom Controls Panel */}
      <div
        className={cn(
          'bg-[#131221] border border-border-dark',
          'rounded-lg p-1 shadow-xl',
          'flex flex-col'
        )}
      >
        {/* Zoom In */}
        <ControlButton onClick={handleZoomIn} title="Zoom In">
          <Plus className="size-5" aria-hidden="true" />
        </ControlButton>

        {/* Zoom Out */}
        <ControlButton onClick={handleZoomOut} title="Zoom Out">
          <Minus className="size-5" aria-hidden="true" />
        </ControlButton>

        {/* Divider */}
        <div className="h-px bg-border-dark my-0.5" aria-hidden="true" />

        {/* Fit to Screen */}
        <ControlButton onClick={handleFitView} title="Fit to Screen">
          <Maximize2 className="size-4" aria-hidden="true" />
        </ControlButton>
      </div>

      {/* MiniMap */}
      {showMiniMap && (
        <div
          className={cn(
            'bg-[#131221] border border-border-dark',
            'rounded-lg shadow-xl overflow-hidden',
            'relative'
          )}
          title="Minimap"
        >
          <MiniMap
            nodeColor="#5048e5"
            nodeStrokeColor="#272546"
            nodeBorderRadius={8}
            maskColor="rgba(19, 18, 33, 0.8)"
            style={{
              backgroundColor: '#131221',
              width: 120,
              height: 80,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CanvasControls;
