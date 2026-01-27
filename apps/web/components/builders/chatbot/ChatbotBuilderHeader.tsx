/**
 * ChatbotBuilderHeader Component
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * AC5: Top Navigation Bar
 *
 * Top navigation bar with breadcrumbs, training status, Preview, and Deploy buttons.
 * Matches wireframe design from chatbot_builder_main/code.html lines 38-79.
 */

'use client';

import Link from 'next/link';
import { Play, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HyyveLogo } from '@/components/nav/HyyveLogo';
import { cn } from '@/lib/utils';

export type TrainingStatus = 'up_to_date' | 'needs_training' | 'training';

export interface ChatbotBuilderHeaderProps {
  workspaceName?: string;
  projectName?: string;
  flowName?: string;
  trainingStatus?: TrainingStatus;
  className?: string;
}

const STATUS_CONFIG = {
  up_to_date: {
    label: 'Training up to date',
    color: 'bg-emerald-500',
  },
  needs_training: {
    label: 'Needs training',
    color: 'bg-amber-500',
  },
  training: {
    label: 'Training in progress...',
    color: 'bg-primary animate-pulse',
  },
};

export function ChatbotBuilderHeader({
  workspaceName = 'Hyyve Projects',
  projectName = 'Retail Support Bot',
  flowName = 'Main Flow',
  trainingStatus = 'up_to_date',
  className,
}: ChatbotBuilderHeaderProps) {
  const statusConfig = STATUS_CONFIG[trainingStatus];

  return (
    <header
      className={cn(
        'h-16 flex-none flex items-center justify-between border-b border-border-dark bg-background-dark px-6 z-20',
        className
      )}
    >
      {/* Left: Logo and Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <HyyveLogo className="size-8 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-white">Hyyve</h1>
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-border-dark" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="text-text-secondary hover:text-white transition-colors"
          >
            {workspaceName}
          </Link>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">
            chevron_right
          </span>
          <Link
            href="/projects"
            className="text-text-secondary hover:text-white transition-colors"
          >
            {projectName}
          </Link>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">
            chevron_right
          </span>
          <span className="font-medium text-white px-2 py-0.5 rounded bg-[#1b1a2d] border border-border-dark text-xs">
            {flowName}
          </span>
        </nav>
      </div>

      {/* Right: Status and Actions */}
      <div className="flex items-center gap-4">
        {/* Training Status Indicator */}
        <div className="flex items-center gap-2 mr-4">
          <span className={cn('flex h-2 w-2 rounded-full', statusConfig.color)} />
          <span className="text-xs font-medium text-text-secondary">
            {statusConfig.label}
          </span>
        </div>

        {/* Preview Button */}
        <Button
          variant="secondary"
          className="gap-2 bg-[#1b1a2d] hover:bg-border-dark text-white border border-border-dark"
          size="sm"
        >
          <Play className="h-4 w-4" />
          <span>Preview</span>
        </Button>

        {/* Deploy Button */}
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(80,72,229,0.3)]"
          size="sm"
        >
          <Rocket className="h-4 w-4" />
          <span>Deploy</span>
        </Button>

        {/* User Avatar */}
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src="/avatars/user.png" alt="User" />
          <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-primary text-white text-sm">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default ChatbotBuilderHeader;
