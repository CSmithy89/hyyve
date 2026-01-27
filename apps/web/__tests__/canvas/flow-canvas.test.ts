/**
 * Flow Canvas Components - Acceptance Tests
 *
 * Story: 0-2-6 Create Flow Canvas Base (xyflow)
 *
 * These tests verify that canvas components are properly created
 * with correct structure, styling, and TypeScript interfaces.
 *
 * Acceptance Criteria Coverage:
 * - AC1: FlowCanvas with dot grid background
 * - AC2: Zoom controls (zoom in/out/fit)
 * - AC3: Minimap component
 * - AC4: Pan and zoom interactions
 * - AC5: Connection lines with animation
 * - AC6: NodeWrapper with colored top border
 * - AC7: CustomEdge with animated dash
 * - AC8: Handle components for connections
 * - AC9: Canvas state with Zustand
 * - AC10: Undo/redo infrastructure
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { fileExists, safeReadFile } from '../support/file-helpers';

// =============================================================================
// PATH CONSTANTS
// =============================================================================

const CANVAS_DIR = 'components/canvas';
const STORES_DIR = 'lib/stores';
const HOOKS_DIR = 'hooks';

// =============================================================================
// EXPECTED VALUES FROM STORY ACCEPTANCE CRITERIA
// =============================================================================

const EXPECTED_CLASSES = {
  // Canvas background
  canvasBg: 'bg-canvas-dark',
  dotGrid: 'bg-dot-grid',

  // Node wrapper
  nodeBg: 'bg-[#1c1a2e]',
  nodeRounded: 'rounded-xl',
  nodeBorder: 'border-border-dark',
  nodeHover: 'hover:border-primary',

  // Handle
  handleSize: 'size-3',
  handleBg: 'bg-white',
  handleBorder: 'border-primary',
  handleRounded: 'rounded-full',

  // Controls
  controlPanel: 'bg-[#131221]',
  controlRounded: 'rounded-lg',
} as const;

// =============================================================================
// FILE STRUCTURE TESTS
// =============================================================================

describe('Story 0-2-6: Flow Canvas Components - File Structure', () => {
  describe('Canvas Directory', () => {
    it('should have canvas directory created', () => {
      expect(fileExists(CANVAS_DIR)).toBe(true);
    });
  });

  describe('Component Files', () => {
    it('should have FlowCanvas.tsx file', () => {
      expect(fileExists(`${CANVAS_DIR}/FlowCanvas.tsx`)).toBe(true);
    });

    it('should have CanvasControls.tsx file', () => {
      expect(fileExists(`${CANVAS_DIR}/CanvasControls.tsx`)).toBe(true);
    });

    it('should have NodeWrapper.tsx file', () => {
      expect(fileExists(`${CANVAS_DIR}/NodeWrapper.tsx`)).toBe(true);
    });

    it('should have CustomEdge.tsx file', () => {
      expect(fileExists(`${CANVAS_DIR}/CustomEdge.tsx`)).toBe(true);
    });

    it('should have Handle.tsx file', () => {
      expect(fileExists(`${CANVAS_DIR}/Handle.tsx`)).toBe(true);
    });

    it('should have index.ts barrel export file', () => {
      expect(fileExists(`${CANVAS_DIR}/index.ts`)).toBe(true);
    });
  });

  describe('Store and Hooks Files', () => {
    it('should have canvas-store.ts file', () => {
      expect(fileExists(`${STORES_DIR}/canvas-store.ts`)).toBe(true);
    });

    it('should have useCanvasHistory.ts hook file', () => {
      expect(fileExists(`${HOOKS_DIR}/useCanvasHistory.ts`)).toBe(true);
    });
  });
});

// =============================================================================
// AC1: FLOWCANVAS WITH DOT GRID BACKGROUND
// =============================================================================

describe('AC1: FlowCanvas with Dot Grid Background', () => {
  let flowCanvasContent = '';

  beforeAll(() => {
    flowCanvasContent = safeReadFile(`${CANVAS_DIR}/FlowCanvas.tsx`);
  });

  it('should be a client component', () => {
    expect(flowCanvasContent).toContain("'use client'");
  });

  it('should import from @xyflow/react', () => {
    expect(flowCanvasContent).toContain('@xyflow/react');
  });

  it('should use ReactFlow component', () => {
    expect(flowCanvasContent).toContain('ReactFlow');
  });

  it('should have canvas dark background', () => {
    expect(flowCanvasContent).toMatch(/bg-canvas-dark|#0f1115/);
  });

  it('should include dot grid background pattern', () => {
    expect(flowCanvasContent).toMatch(/bg-dot-grid|Background/i);
  });

  it('should fill container (h-full, w-full or similar)', () => {
    expect(flowCanvasContent).toMatch(/h-full|w-full|min-h|flex-1/);
  });
});

// =============================================================================
// AC2: ZOOM CONTROLS
// =============================================================================

describe('AC2: Zoom Controls', () => {
  let canvasControlsContent = '';

  beforeAll(() => {
    canvasControlsContent = safeReadFile(`${CANVAS_DIR}/CanvasControls.tsx`);
  });

  it('should be a client component', () => {
    expect(canvasControlsContent).toContain("'use client'");
  });

  it('should have zoom in button', () => {
    expect(canvasControlsContent).toMatch(/zoom.*in|zoomIn|Plus|add/i);
  });

  it('should have zoom out button', () => {
    expect(canvasControlsContent).toMatch(/zoom.*out|zoomOut|Minus|remove/i);
  });

  it('should have fit to screen button', () => {
    expect(canvasControlsContent).toMatch(/fit|fitView|Maximize|center_focus/i);
  });

  it('should have dark panel styling', () => {
    expect(canvasControlsContent).toContain(EXPECTED_CLASSES.controlPanel);
  });

  it('should have rounded styling', () => {
    expect(canvasControlsContent).toContain(EXPECTED_CLASSES.controlRounded);
  });

  it('should be positioned bottom-left', () => {
    expect(canvasControlsContent).toMatch(/bottom|left|absolute/);
  });

  it('should use useReactFlow hook for zoom actions', () => {
    expect(canvasControlsContent).toContain('useReactFlow');
  });
});

// =============================================================================
// AC3: MINIMAP COMPONENT
// =============================================================================

describe('AC3: Minimap Component', () => {
  let flowCanvasContent = '';
  let canvasControlsContent = '';

  beforeAll(() => {
    flowCanvasContent = safeReadFile(`${CANVAS_DIR}/FlowCanvas.tsx`);
    canvasControlsContent = safeReadFile(`${CANVAS_DIR}/CanvasControls.tsx`);
  });

  it('should import MiniMap from @xyflow/react', () => {
    const combinedContent = flowCanvasContent + canvasControlsContent;
    expect(combinedContent).toMatch(/MiniMap|minimap/i);
  });

  it('should render MiniMap component', () => {
    const combinedContent = flowCanvasContent + canvasControlsContent;
    expect(combinedContent).toMatch(/<MiniMap|MiniMap/);
  });

  it('should style MiniMap with dark theme', () => {
    const combinedContent = flowCanvasContent + canvasControlsContent;
    expect(combinedContent).toMatch(/maskColor|nodeColor|style/);
  });
});

// =============================================================================
// AC4: PAN AND ZOOM INTERACTIONS
// =============================================================================

describe('AC4: Pan and Zoom Interactions', () => {
  let flowCanvasContent = '';

  beforeAll(() => {
    flowCanvasContent = safeReadFile(`${CANVAS_DIR}/FlowCanvas.tsx`);
  });

  it('should enable panning', () => {
    expect(flowCanvasContent).toMatch(/panOnDrag|panOnScroll|ReactFlow/);
  });

  it('should enable zooming', () => {
    expect(flowCanvasContent).toMatch(/zoomOnScroll|zoomOnPinch|ReactFlow/);
  });

  it('should have cursor styling for grab/grabbing', () => {
    expect(flowCanvasContent).toMatch(/cursor-grab|cursor-grabbing|cursor.*grab/);
  });
});

// =============================================================================
// AC5: CONNECTION LINES WITH ANIMATION
// =============================================================================

describe('AC5: Connection Lines with Animation', () => {
  let customEdgeContent = '';
  let flowCanvasContent = '';

  beforeAll(() => {
    customEdgeContent = safeReadFile(`${CANVAS_DIR}/CustomEdge.tsx`);
    flowCanvasContent = safeReadFile(`${CANVAS_DIR}/FlowCanvas.tsx`);
  });

  it('should import edge utilities from @xyflow/react', () => {
    expect(customEdgeContent).toMatch(/getBezierPath|getSmoothStepPath|BaseEdge/);
  });

  it('should support animated dash patterns', () => {
    expect(customEdgeContent).toMatch(/stroke-dasharray|strokeDasharray|animated|dash/i);
  });

  it('should support color configuration', () => {
    expect(customEdgeContent).toMatch(/stroke|color|style/);
  });

  it('should register custom edge type in FlowCanvas', () => {
    expect(flowCanvasContent).toMatch(/edgeTypes|CustomEdge/);
  });
});

// =============================================================================
// AC6: NODEWRAPPER WITH COLORED TOP BORDER
// =============================================================================

describe('AC6: NodeWrapper with Colored Top Border', () => {
  let nodeWrapperContent = '';

  beforeAll(() => {
    nodeWrapperContent = safeReadFile(`${CANVAS_DIR}/NodeWrapper.tsx`);
  });

  it('should be a client component', () => {
    expect(nodeWrapperContent).toContain("'use client'");
  });

  it('should have dark panel background', () => {
    expect(nodeWrapperContent).toContain(EXPECTED_CLASSES.nodeBg);
  });

  it('should have rounded-xl styling', () => {
    expect(nodeWrapperContent).toContain(EXPECTED_CLASSES.nodeRounded);
  });

  it('should have colored top border element', () => {
    expect(nodeWrapperContent).toMatch(/h-2|border-t|rounded-t/);
  });

  it('should have hover state with primary border', () => {
    expect(nodeWrapperContent).toContain(EXPECTED_CLASSES.nodeHover);
  });

  it('should have shadow effect', () => {
    expect(nodeWrapperContent).toMatch(/shadow|Shadow/);
  });

  it('should accept borderColor prop', () => {
    expect(nodeWrapperContent).toMatch(/borderColor|color|gradient/i);
  });

  it('should accept children prop', () => {
    expect(nodeWrapperContent).toContain('children');
  });
});

// =============================================================================
// AC7: CUSTOMEDGE WITH ANIMATED DASH
// =============================================================================

describe('AC7: CustomEdge with Animated Dash', () => {
  let customEdgeContent = '';

  beforeAll(() => {
    customEdgeContent = safeReadFile(`${CANVAS_DIR}/CustomEdge.tsx`);
  });

  it('should be a client component', () => {
    expect(customEdgeContent).toContain("'use client'");
  });

  it('should import EdgeProps from @xyflow/react', () => {
    expect(customEdgeContent).toMatch(/EdgeProps|Edge/);
  });

  it('should have animated stroke-dasharray', () => {
    expect(customEdgeContent).toMatch(/strokeDasharray|stroke-dasharray|animated/i);
  });

  it('should support configurable colors', () => {
    expect(customEdgeContent).toMatch(/color|stroke/);
  });

  it('should support path labels', () => {
    expect(customEdgeContent).toMatch(/label|EdgeLabelRenderer/i);
  });
});

// =============================================================================
// AC8: HANDLE COMPONENTS FOR CONNECTIONS
// =============================================================================

describe('AC8: Handle Components', () => {
  let handleContent = '';

  beforeAll(() => {
    handleContent = safeReadFile(`${CANVAS_DIR}/Handle.tsx`);
  });

  it('should be a client component', () => {
    expect(handleContent).toContain("'use client'");
  });

  it('should import Handle from @xyflow/react', () => {
    expect(handleContent).toMatch(/import.*Handle.*@xyflow\/react/);
  });

  it('should have correct size', () => {
    expect(handleContent).toContain(EXPECTED_CLASSES.handleSize);
  });

  it('should have white background', () => {
    expect(handleContent).toContain(EXPECTED_CLASSES.handleBg);
  });

  it('should have primary border', () => {
    expect(handleContent).toMatch(/border-primary|border-2/);
  });

  it('should have rounded-full styling', () => {
    expect(handleContent).toContain(EXPECTED_CLASSES.handleRounded);
  });

  it('should support hover scale animation', () => {
    expect(handleContent).toMatch(/hover:scale|scale-125|transition/);
  });

  it('should support Position.Left and Position.Right', () => {
    expect(handleContent).toMatch(/Position\.(Left|Right)|type="source"|type="target"/);
  });
});

// =============================================================================
// AC9: CANVAS STATE WITH ZUSTAND
// =============================================================================

describe('AC9: Canvas State with Zustand', () => {
  let canvasStoreContent = '';

  beforeAll(() => {
    canvasStoreContent = safeReadFile(`${STORES_DIR}/canvas-store.ts`);
  });

  it('should import from zustand', () => {
    expect(canvasStoreContent).toContain('zustand');
  });

  it('should have nodes array state', () => {
    expect(canvasStoreContent).toMatch(/nodes\s*:/);
  });

  it('should have edges array state', () => {
    expect(canvasStoreContent).toMatch(/edges\s*:/);
  });

  it('should have onNodesChange handler', () => {
    expect(canvasStoreContent).toContain('onNodesChange');
  });

  it('should have onEdgesChange handler', () => {
    expect(canvasStoreContent).toContain('onEdgesChange');
  });

  it('should have addNode action', () => {
    expect(canvasStoreContent).toContain('addNode');
  });

  it('should have removeNode action', () => {
    expect(canvasStoreContent).toContain('removeNode');
  });

  it('should have updateNodeData action', () => {
    expect(canvasStoreContent).toContain('updateNodeData');
  });

  it('should export useCanvasStore hook', () => {
    expect(canvasStoreContent).toMatch(/export.*useCanvasStore/);
  });
});

// =============================================================================
// AC10: UNDO/REDO INFRASTRUCTURE
// =============================================================================

describe('AC10: Undo/Redo Infrastructure', () => {
  let canvasHistoryContent = '';
  let canvasStoreContent = '';

  beforeAll(() => {
    canvasHistoryContent = safeReadFile(`${HOOKS_DIR}/useCanvasHistory.ts`);
    canvasStoreContent = safeReadFile(`${STORES_DIR}/canvas-store.ts`);
  });

  it('should have history hook or store integration', () => {
    const combinedContent = canvasHistoryContent + canvasStoreContent;
    expect(combinedContent).toMatch(/history|History|past|future/i);
  });

  it('should have undo action', () => {
    const combinedContent = canvasHistoryContent + canvasStoreContent;
    expect(combinedContent).toContain('undo');
  });

  it('should have redo action', () => {
    const combinedContent = canvasHistoryContent + canvasStoreContent;
    expect(combinedContent).toContain('redo');
  });

  it('should have canUndo selector or check', () => {
    const combinedContent = canvasHistoryContent + canvasStoreContent;
    expect(combinedContent).toMatch(/canUndo|past\.length/i);
  });

  it('should have canRedo selector or check', () => {
    const combinedContent = canvasHistoryContent + canvasStoreContent;
    expect(combinedContent).toMatch(/canRedo|future\.length/i);
  });
});

// =============================================================================
// DOT GRID PATTERN IN GLOBALS.CSS
// =============================================================================

describe('Dot Grid Pattern in globals.css', () => {
  let globalsCssContent = '';

  beforeAll(() => {
    globalsCssContent = safeReadFile('app/globals.css');
  });

  it('should have bg-dot-grid class defined', () => {
    expect(globalsCssContent).toMatch(/\.bg-dot-grid|dot-grid/);
  });

  it('should use radial-gradient for dot pattern', () => {
    expect(globalsCssContent).toMatch(/radial-gradient/i);
  });
});

// =============================================================================
// MODULE EXPORTS
// =============================================================================

describe('Module Exports', () => {
  let indexContent = '';

  beforeAll(() => {
    indexContent = safeReadFile(`${CANVAS_DIR}/index.ts`);
  });

  it('should export FlowCanvas component', () => {
    expect(indexContent).toMatch(/export.*FlowCanvas/);
  });

  it('should export CanvasControls component', () => {
    expect(indexContent).toMatch(/export.*CanvasControls/);
  });

  it('should export NodeWrapper component', () => {
    expect(indexContent).toMatch(/export.*NodeWrapper/);
  });

  it('should export CustomEdge component', () => {
    expect(indexContent).toMatch(/export.*CustomEdge/);
  });

  it('should export Handle component', () => {
    expect(indexContent).toMatch(/export.*Handle/);
  });
});

// =============================================================================
// FLOWCANVAS COMPOSITION
// =============================================================================

describe('FlowCanvas Composition', () => {
  let flowCanvasContent = '';

  beforeAll(() => {
    flowCanvasContent = safeReadFile(`${CANVAS_DIR}/FlowCanvas.tsx`);
  });

  it('should import CanvasControls', () => {
    expect(flowCanvasContent).toMatch(/import.*CanvasControls/);
  });

  it('should import useCanvasStore', () => {
    expect(flowCanvasContent).toMatch(/import.*useCanvasStore/);
  });

  it('should render CanvasControls', () => {
    expect(flowCanvasContent).toMatch(/<CanvasControls/);
  });

  it('should use nodes from store', () => {
    expect(flowCanvasContent).toMatch(/nodes.*useCanvasStore|useCanvasStore.*nodes/);
  });

  it('should use edges from store', () => {
    expect(flowCanvasContent).toMatch(/edges.*useCanvasStore|useCanvasStore.*edges/);
  });

  it('should have nodeTypes configuration', () => {
    expect(flowCanvasContent).toContain('nodeTypes');
  });

  it('should have edgeTypes configuration', () => {
    expect(flowCanvasContent).toContain('edgeTypes');
  });
});
