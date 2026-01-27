/**
 * KnowledgeBasePanel Component
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 * AC1: Left panel - Knowledge Base file browser
 *
 * Left panel with search, folders, and files for knowledge base management.
 * Matches wireframe design from hyyve_module_builder/code.html lines 133-205.
 */

'use client';

import { useState } from 'react';
import { Search, Plus, MoreVertical, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  KNOWLEDGE_FOLDERS,
  KNOWLEDGE_FILES,
  type KnowledgeFile,
} from '@/lib/mock-data/module-builder';

export interface KnowledgeBasePanelProps {
  className?: string;
  onFileSelect?: (file: KnowledgeFile) => void;
}

export function KnowledgeBasePanel({
  className,
  onFileSelect,
}: KnowledgeBasePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>('file-1');

  const handleFileClick = (file: KnowledgeFile) => {
    setSelectedFileId(file.id);
    onFileSelect?.(file);
  };

  const filteredFiles = KNOWLEDGE_FILES.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        'w-72 flex-none bg-[#131221] border-r border-border-dark flex flex-col z-10',
        className
      )}
    >
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-border-dark">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
          Knowledge Base
        </h3>
        <p className="text-text-secondary text-xs">Manage context sources</p>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1a2e] border-[#272546] rounded-md py-2 pl-9 pr-3 text-sm text-white focus:border-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1">
        {/* Section: Folders */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-3 py-1 mb-1 group cursor-pointer">
            <span className="text-xs font-semibold text-text-secondary group-hover:text-white transition-colors">
              FOLDERS
            </span>
            <Plus className="h-3.5 w-3.5 text-text-secondary" />
          </div>

          {KNOWLEDGE_FOLDERS.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272546] cursor-pointer transition-colors group"
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px]',
                  folder.iconColor
                )}
              >
                {folder.icon}
              </span>
              <span className="text-sm text-gray-300 group-hover:text-white">
                {folder.name}
              </span>
            </div>
          ))}
        </div>

        {/* Section: Files */}
        <div>
          <div className="flex items-center justify-between px-3 py-1 mb-1 group cursor-pointer">
            <span className="text-xs font-semibold text-text-secondary group-hover:text-white transition-colors">
              FILES
            </span>
            <Upload className="h-3.5 w-3.5 text-text-secondary" />
          </div>

          {filteredFiles.map((file) => {
            const isSelected = selectedFileId === file.id;

            return (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group relative transition-colors',
                  isSelected
                    ? 'bg-[#272546] border border-primary/20'
                    : 'hover:bg-[#272546]/50'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center rounded bg-[#1c1a2e] p-1.5',
                    file.iconColor
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {file.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      isSelected ? 'text-white' : 'text-gray-300'
                    )}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-text-secondary">{file.size}</p>
                </div>
                <MoreVertical className="h-4 w-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-border-dark">
        <Button
          variant="secondary"
          className="w-full gap-2 bg-[#272546] hover:bg-primary text-white border-0 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Source</span>
        </Button>
      </div>
    </aside>
  );
}

export default KnowledgeBasePanel;
