/**
 * WendyPanel Component
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * AC6: Wendy panel with suggestion cards and quick actions
 *
 * Right panel with Wendy agent chat and contextual suggestion cards
 * for chatbot flow optimization.
 */

'use client';

import * as React from 'react';
import { AgentChat } from '@/components/chat/AgentChat';
import type { Message } from '@/components/chat/types';
import { cn } from '@/lib/utils';

export interface WendySuggestion {
  id: string;
  icon: string;
  title: string;
  description: string;
  action?: () => void;
}

export interface WendyPanelProps {
  messages?: Message[];
  isTyping?: boolean;
  className?: string;
  onSuggestionClick?: (suggestion: WendySuggestion) => void;
}

const DEFAULT_SUGGESTIONS: WendySuggestion[] = [
  {
    id: 'suggest-1',
    icon: 'psychology',
    title: 'Analyze Intent Coverage',
    description: 'Check if all user scenarios are handled by your intents',
  },
  {
    id: 'suggest-2',
    icon: 'auto_fix_high',
    title: 'Optimize Training Data',
    description: 'Suggest additional phrases to improve accuracy',
  },
  {
    id: 'suggest-3',
    icon: 'account_tree',
    title: 'Review Flow Logic',
    description: 'Identify dead ends and suggest improvements',
  },
  {
    id: 'suggest-4',
    icon: 'translate',
    title: 'Add Language Support',
    description: 'Expand your bot to support more languages',
  },
];

export function WendyPanel({
  messages = [],
  isTyping = false,
  className,
  onSuggestionClick,
}: WendyPanelProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(
    messages.length === 0
  );

  const handleSuggestionClick = (suggestion: WendySuggestion) => {
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  return (
    <aside
      className={cn(
        'w-80 flex-none bg-[#131221] border-l border-border-dark flex flex-col overflow-hidden',
        className
      )}
    >
      {/* Panel Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border-dark bg-[#1c1a2e]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full ring-2 ring-[#1c1a2e]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Wendy</h3>
            <span className="text-xs text-emerald-400">Online</span>
          </div>
        </div>
        <button className="text-text-secondary hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            more_vert
          </span>
        </button>
      </div>

      {/* Suggestion Cards */}
      {showSuggestions && (
        <div className="p-4 border-b border-border-dark bg-[#1c1a2e]/50">
          <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider font-medium">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'flex flex-col items-start p-3 rounded-lg',
                  'bg-[#272546]/50 border border-border-dark',
                  'hover:bg-[#272546] hover:border-primary/30',
                  'transition-all text-left group'
                )}
              >
                <span className="material-symbols-outlined text-primary text-[20px] mb-2 group-hover:scale-110 transition-transform">
                  {suggestion.icon}
                </span>
                <span className="text-white text-xs font-medium leading-tight">
                  {suggestion.title}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSuggestions(false)}
            className="w-full mt-3 text-xs text-text-secondary hover:text-primary transition-colors"
          >
            Dismiss suggestions
          </button>
        </div>
      )}

      {/* Agent Chat */}
      <div className="flex-1 overflow-hidden">
        <AgentChat
          agentId="wendy"
          messages={messages}
          isTyping={isTyping}
          status="online"
          className="h-full border-0"
        />
      </div>
    </aside>
  );
}

export default WendyPanel;
