'use client';

import * as React from 'react';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentMessageProps } from './types';
import { getAgentAvatarStyle } from './types';
import { QuickActionButton } from './QuickActionButton';

/**
 * AgentMessage Component
 *
 * Displays a message from an agent with avatar and bubble styling
 * AC2: Message list with agent/user bubbles
 *
 * Features:
 * - Avatar on left side with agent color
 * - Message bubble with rounded corners
 * - Sequential messages show spacer instead of avatar
 * - Quick action buttons support
 *
 * @see hyyve_module_builder/code.html lines 363-390
 */
export function AgentMessage({
  content,
  showAvatar = true,
  agentId,
  quickActions,
  className,
}: AgentMessageProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      {/* Avatar or Spacer */}
      {showAvatar ? (
        <div
          className="size-8 rounded-full flex items-center justify-center flex-none mt-1"
          style={getAgentAvatarStyle(agentId)}
        >
          <Bot className="size-4 text-white" aria-hidden="true" />
        </div>
      ) : (
        <div className="w-8 flex-none" aria-hidden="true" />
      )}

      {/* Message Content */}
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div className="bg-[#272546] rounded-2xl rounded-tl-none p-3 text-sm text-gray-200 shadow-sm">
          <p>{content}</p>
        </div>

        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <div className="flex gap-2 mt-1">
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.id}
                label={action.label}
                variant={action.variant}
                onClick={action.onClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentMessage;
