/**
 * IntentsPanel Component
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * AC2: Left Panel - Intents & Training
 *
 * Left panel with tabs for Intents, Entities, Variables.
 * Matches wireframe design from chatbot_builder_main/code.html lines 82-162.
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  INTENTS,
  ENTITIES,
  VARIABLES,
  type Intent,
} from '@/lib/mock-data/chatbot-builder';

type TabType = 'intents' | 'entities' | 'variables';

export interface IntentsPanelProps {
  className?: string;
  onIntentSelect?: (intent: Intent) => void;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (confidence >= 70) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-red-500/10 text-red-400 border-red-500/20';
}

export function IntentsPanel({ className, onIntentSelect }: IntentsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('intents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(
    'intent-1'
  );

  const handleIntentClick = (intent: Intent) => {
    setSelectedIntentId(intent.id);
    onIntentSelect?.(intent);
  };

  const filteredIntents = INTENTS.filter((intent) =>
    intent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEntities = ENTITIES.filter((entity) =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVariables = VARIABLES.filter((variable) =>
    variable.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalIntents = INTENTS.length;
  const avgConfidence = Math.round(
    INTENTS.reduce((sum, i) => sum + i.confidence, 0) / INTENTS.length
  );

  return (
    <aside
      className={cn(
        'w-80 flex-none bg-background-dark border-r border-border-dark flex flex-col z-10',
        className
      )}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border-dark/50">
        <h2 className="font-bold text-white">Intents & Training</h2>
        <button className="text-text-secondary hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
          <Input
            type="text"
            placeholder="Search intents (#)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1a2d] border-border-dark rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-secondary focus:border-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-4 text-sm font-medium border-b border-border-dark/50 mb-2">
        <button
          onClick={() => setActiveTab('intents')}
          className={cn(
            'pb-3 transition-colors',
            activeTab === 'intents'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-white'
          )}
        >
          Intents
        </button>
        <button
          onClick={() => setActiveTab('entities')}
          className={cn(
            'pb-3 transition-colors',
            activeTab === 'entities'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-white'
          )}
        >
          Entities
        </button>
        <button
          onClick={() => setActiveTab('variables')}
          className={cn(
            'pb-3 transition-colors',
            activeTab === 'variables'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-white'
          )}
        >
          Variables
        </button>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {activeTab === 'intents' &&
          filteredIntents.map((intent) => {
            const isSelected = selectedIntentId === intent.id;
            return (
              <div
                key={intent.id}
                onClick={() => handleIntentClick(intent)}
                className={cn(
                  'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 transition-all',
                  isSelected
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-[#1b1a2d] border border-transparent hover:border-border-dark'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md',
                      isSelected
                        ? 'bg-primary/20 text-primary'
                        : 'bg-[#1b1a2d] text-text-secondary group-hover:bg-border-dark group-hover:text-white'
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      tag
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{intent.name}</p>
                    <p className="text-xs text-text-secondary">
                      {intent.utteranceCount} utterances
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-bold border',
                    getConfidenceColor(intent.confidence)
                  )}
                >
                  {intent.confidence}%
                </span>
              </div>
            );
          })}

        {activeTab === 'entities' &&
          filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 hover:bg-[#1b1a2d] border border-transparent hover:border-border-dark transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1b1a2d] text-text-secondary group-hover:bg-border-dark group-hover:text-white">
                  <span className="material-symbols-outlined text-[18px]">
                    data_object
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{entity.name}</p>
                  <p className="text-xs text-text-secondary">
                    {entity.type} • {entity.exampleCount} examples
                  </p>
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'variables' &&
          filteredVariables.map((variable) => (
            <div
              key={variable.id}
              className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 hover:bg-[#1b1a2d] border border-transparent hover:border-border-dark transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1b1a2d] text-text-secondary group-hover:bg-border-dark group-hover:text-white">
                  <span className="material-symbols-outlined text-[18px]">
                    code
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{variable.name}</p>
                  <p className="text-xs text-text-secondary">
                    {variable.type}
                    {variable.defaultValue && ` = ${variable.defaultValue}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Bottom Stats */}
      <div className="p-4 border-t border-border-dark text-xs text-text-secondary flex justify-between">
        <span>Total Intents: {totalIntents}</span>
        <span>Avg Conf: {avgConfidence}%</span>
      </div>
    </aside>
  );
}

export default IntentsPanel;
