/**
 * Canvas Store - Zustand state management for flow canvas
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC9: Canvas state with Zustand
 * AC10: Undo/redo infrastructure
 *
 * Features:
 * - nodes array state
 * - edges array state
 * - onNodesChange handler
 * - onEdgesChange handler
 * - addNode, removeNode, updateNodeData actions
 * - Undo/redo with history stack
 *
 * @see hyyve_module_builder/code.html lines 207-343
 */

import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

/**
 * History state for undo/redo
 */
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Canvas Store State Interface
 */
interface CanvasState {
  // Core state
  nodes: Node[];
  edges: Edge[];

  // History for undo/redo
  past: HistoryState[];
  future: HistoryState[];

  // Change handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;

  // Node actions
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;

  // Edge actions
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;

  // Undo/redo actions
  undo: () => void;
  redo: () => void;

  // State setters
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  // Utility
  saveToHistory: () => void;
}

/**
 * Maximum history stack size
 */
const MAX_HISTORY_SIZE = 50;

/**
 * Canvas Store with Zustand
 */
export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  past: [],
  future: [],

  // Save current state to history before making changes
  saveToHistory: () => {
    const { nodes, edges, past } = get();
    const newPast = [...past, { nodes, edges }].slice(-MAX_HISTORY_SIZE);
    set({ past: newPast, future: [] });
  },

  // Handle node changes from ReactFlow
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // Handle edge changes from ReactFlow
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // Add a new node
  addNode: (node) => {
    get().saveToHistory();
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  // Remove a node by ID
  removeNode: (nodeId) => {
    get().saveToHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      // Also remove any connected edges
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    }));
  },

  // Update node data
  updateNodeData: (nodeId, data) => {
    get().saveToHistory();
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    }));
  },

  // Add a new edge
  addEdge: (edge) => {
    get().saveToHistory();
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  // Remove an edge by ID
  removeEdge: (edgeId) => {
    get().saveToHistory();
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    }));
  },

  // Undo last action
  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    if (!previous) return;

    const newPast = past.slice(0, -1);

    set({
      past: newPast,
      nodes: previous.nodes,
      edges: previous.edges,
      future: [{ nodes, edges }, ...future],
    });
  },

  // Redo last undone action
  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[0];
    if (!next) return;

    const newFuture = future.slice(1);

    set({
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
    });
  },

  // Set nodes directly (for initialization)
  setNodes: (nodes) => {
    set({ nodes });
  },

  // Set edges directly (for initialization)
  setEdges: (edges) => {
    set({ edges });
  },
}));

/**
 * Selector: Can undo?
 */
export const canUndo = (state: CanvasState) => state.past.length > 0;

/**
 * Selector: Can redo?
 */
export const canRedo = (state: CanvasState) => state.future.length > 0;

export default useCanvasStore;
