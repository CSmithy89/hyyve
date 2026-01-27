# Story 0.2.6: Create Flow Canvas Base (xyflow)

## Story

As a **developer**,
I want **a base flow canvas component using @xyflow/react**,
So that **Module Builder, Chatbot Builder, and Canvas Builder share a foundation**.

## Acceptance Criteria

- **AC1:** FlowCanvas component renders with:
  - Dot grid background pattern (bg-dot-grid class)
  - Responsive sizing (fills container)
  - Canvas dark background (#0f1115)

- **AC2:** Zoom controls include:
  - Zoom in button (+)
  - Zoom out button (-)
  - Fit to screen button
  - Positioned bottom-left with dark panel styling

- **AC3:** Minimap component:
  - Shows node positions overview
  - Dark styled to match theme
  - Positioned below zoom controls

- **AC4:** Pan and zoom interactions:
  - Mouse wheel zoom
  - Click-drag to pan
  - Touch support for mobile
  - Cursor changes (grab/grabbing)

- **AC5:** Connection lines support:
  - Bezier curve paths
  - Animated dash patterns for pending connections
  - Color-coded by type (success: green, error: red)

- **AC6:** NodeWrapper component:
  - Colored top border (gradient or solid)
  - Dark panel background (#1c1a2e)
  - Border radius (rounded-xl)
  - Hover state with primary border
  - Shadow on hover

- **AC7:** CustomEdge component:
  - Animated stroke-dasharray
  - Configurable colors
  - Path labels support

- **AC8:** Handle components:
  - Input handles (left side)
  - Output handles (right side)
  - Styled as white circles with primary border
  - Hover scale animation

- **AC9:** Canvas state with Zustand:
  - nodes array state
  - edges array state
  - onNodesChange handler
  - onEdgesChange handler
  - addNode action
  - removeNode action
  - updateNodeData action

- **AC10:** Undo/redo infrastructure:
  - History stack for state changes
  - undo() action
  - redo() action
  - canUndo/canRedo selectors

## Technical Notes

- Uses @xyflow/react v12.10.0 (already installed)
- Uses Zustand v5.0.8 for state management
- Follows xyflow best practices for performance
- Dot grid pattern defined in globals.css

## Source Reference

`hyyve_module_builder/code.html` lines 207-343

## Creates

- components/canvas/FlowCanvas.tsx
- components/canvas/CanvasControls.tsx
- components/canvas/NodeWrapper.tsx
- components/canvas/CustomEdge.tsx
- components/canvas/Handle.tsx
- components/canvas/index.ts
- lib/stores/canvas-store.ts
- hooks/useCanvasHistory.ts

## Implementation Tasks

1. Create canvas-store.ts with Zustand state
2. Create useCanvasHistory.ts hook
3. Create Handle.tsx for connection points
4. Create NodeWrapper.tsx for node styling
5. Create CustomEdge.tsx for edge rendering
6. Create CanvasControls.tsx for zoom/minimap
7. Create FlowCanvas.tsx as main composition
8. Add bg-dot-grid pattern to globals.css
9. Add unit tests for all components
10. Export from components/canvas/index.ts
