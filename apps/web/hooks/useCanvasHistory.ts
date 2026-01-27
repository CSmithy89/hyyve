'use client';

/**
 * Canvas History Hook - Undo/Redo for Flow Canvas
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC10: Undo/redo infrastructure
 *
 * Provides keyboard shortcuts and history management
 * for the flow canvas editor.
 *
 * Features:
 * - undo() action
 * - redo() action
 * - canUndo selector
 * - canRedo selector
 * - Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
 *
 * @see hyyve_module_builder/code.html lines 207-343
 */

import { useCallback, useEffect } from 'react';
import { useCanvasStore, canUndo, canRedo } from '@/lib/stores/canvas-store';

/**
 * Hook return type
 */
interface UseCanvasHistoryReturn {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  past: unknown[];
  future: unknown[];
}

/**
 * useCanvasHistory Hook
 *
 * Provides undo/redo functionality with keyboard shortcuts
 * for the flow canvas editor.
 */
export function useCanvasHistory(): UseCanvasHistoryReturn {
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const past = useCanvasStore((state) => state.past);
  const future = useCanvasStore((state) => state.future);

  const canUndoValue = useCanvasStore(canUndo);
  const canRedoValue = useCanvasStore(canRedo);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      const isModifierKey = event.ctrlKey || event.metaKey;

      if (isModifierKey && event.key === 'z') {
        event.preventDefault();

        if (event.shiftKey) {
          // Ctrl+Shift+Z = Redo
          if (canRedoValue) {
            redo();
          }
        } else {
          // Ctrl+Z = Undo
          if (canUndoValue) {
            undo();
          }
        }
      }

      // Alternative redo: Ctrl+Y
      if (isModifierKey && event.key === 'y') {
        event.preventDefault();
        if (canRedoValue) {
          redo();
        }
      }
    },
    [undo, redo, canUndoValue, canRedoValue]
  );

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    undo,
    redo,
    canUndo: canUndoValue,
    canRedo: canRedoValue,
    past,
    future,
  };
}

export default useCanvasHistory;
