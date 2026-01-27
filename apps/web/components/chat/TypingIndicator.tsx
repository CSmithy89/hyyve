'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { TypingIndicatorProps } from './types';
import { getAgentAvatarStyle } from './types';

/**
 * TypingIndicator Component
 *
 * Shows bouncing dots animation when agent is typing
 * AC4: Typing indicator with bouncing dots
 *
 * Features:
 * - Three bouncing dots with staggered animation
 * - Agent avatar on left side
 * - Agent bubble background styling
 *
 * @see hyyve_module_builder/code.html lines 403-413
 */
export function TypingIndicator({ agentId, className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      {/* Agent Avatar */}
      <div
        className="size-8 rounded-full flex items-center justify-center flex-none mt-1"
        style={getAgentAvatarStyle(agentId)}
      >
        <span className="material-symbols-outlined text-[18px] text-white" aria-hidden="true">
          smart_toy
        </span>
      </div>

      {/* Typing Dots */}
      <div className="bg-[#272546] rounded-2xl rounded-tl-none p-4 w-16 flex items-center gap-1">
        <div
          className="size-1.5 bg-gray-400 rounded-full animate-bounce"
          aria-hidden="true"
        />
        <div
          className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"
          aria-hidden="true"
        />
        <div
          className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default TypingIndicator;
