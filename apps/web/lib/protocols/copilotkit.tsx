'use client';

/**
 * CopilotKit Provider Component
 *
 * This module provides the CopilotKit provider for agent-to-UI communication.
 * It wraps the application to enable CopilotKit's chat UI and agent interaction features.
 *
 * @example
 * ```typescript
 * import { CopilotKitProvider } from '@/lib/protocols/copilotkit';
 *
 * // In your root layout or providers
 * export function Providers({ children }: { children: React.ReactNode }) {
 *   return (
 *     <CopilotKitProvider>
 *       {children}
 *     </CopilotKitProvider>
 *   );
 * }
 * ```
 */

import { CopilotKit } from '@copilotkit/react-core';
import type { ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface CopilotKitProviderProps {
  children: ReactNode;
  /**
   * Override the default runtime URL
   * @default '/api/copilotkit'
   */
  runtimeUrl?: string;
  /**
   * Additional properties to configure CopilotKit
   */
  properties?: Record<string, unknown>;
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * CopilotKit Provider Component
 *
 * Wraps children with the CopilotKit context provider, enabling:
 * - Chat UI components
 * - Agent interaction hooks
 * - Runtime communication
 *
 * @param props - Provider configuration
 * @returns CopilotKit-wrapped children
 */
export function CopilotKitProvider({
  children,
  runtimeUrl = '/api/copilotkit',
  properties,
}: CopilotKitProviderProps) {
  return (
    <CopilotKit runtimeUrl={runtimeUrl} properties={properties}>
      {children}
    </CopilotKit>
  );
}

// ============================================================================
// Re-exports from CopilotKit packages
// ============================================================================

// Re-export commonly used components and hooks for convenience
export { CopilotKit } from '@copilotkit/react-core';
