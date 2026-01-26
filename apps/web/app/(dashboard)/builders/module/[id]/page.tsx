'use client';

import * as React from 'react';
import {
  Bot,
  FileText,
  FolderOpen,
  Zap,
  Brain,
  GitBranch,
  Table,
} from 'lucide-react';

import {
  BuilderHeader,
  SidePanel,
  FileItem,
  PanelSection,
} from '@/components/features/layout';
import {
  WorkflowCanvas,
  WorkflowNode,
  NodeSetting,
  NodeContext,
} from '@/components/features/builder';
import { ChatPanel, ChatMessage } from '@/components/features/chat';

// =============================================================================
// MOCK DATA - Replace with real data from AgentOS/API
// =============================================================================

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "I've analyzed the Product_Manual.pdf you just uploaded.",
    timestamp: '10:23 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Should I automatically connect it as a context source to the LLM Processing node?',
    quickReplies: ['Yes, connect it', 'No, show summary'],
  },
  {
    id: '3',
    role: 'user',
    content: 'Yes, go ahead. Also increase the temperature to 0.8.',
    timestamp: 'Just now',
  },
];

const mockFiles = [
  { name: 'Product_Manual.pdf', size: '2.4 MB', type: 'pdf' as const },
  { name: 'Q3_Financials.csv', size: '156 KB', type: 'csv' as const },
  { name: 'Support_Logs.txt', size: '89 KB', type: 'txt' as const },
];

const mockFolders = [{ name: 'Financial Data' }];

// =============================================================================
// MODULE BUILDER PAGE
// =============================================================================

interface ModuleBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function ModuleBuilderPage({ params }: ModuleBuilderPageProps) {
  const resolvedParams = React.use(params);
  const [zoom, setZoom] = React.useState(1);
  const [messages, setMessages] = React.useState<ChatMessage[]>(mockMessages);
  const [isStreaming, setIsStreaming] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(
    'Product_Manual.pdf'
  );

  // Simulate streaming ending after mount
  React.useEffect(() => {
    const timer = setTimeout(() => setIsStreaming(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsStreaming(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'll make that change for you right away.",
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsStreaming(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'csv':
        return <Table className="h-4 w-4 text-green-400" />;
      default:
        return <FileText className="h-4 w-4 text-orange-400" />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <BuilderHeader
        breadcrumbs={[
          { label: 'Hyyve', href: '/workspace' },
          { label: 'Project Alpha', href: `/workspace/projects/${resolvedParams.id}` },
          { label: 'Workflow 1' },
        ]}
        onRun={() => console.log('Run workflow')}
        onSave={() => console.log('Save workflow')}
        onExport={() => console.log('Export workflow')}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        canUndo={true}
        canRedo={false}
        user={{ name: 'Alex Chen' }}
      />

      {/* Main Workspace */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Panel: Knowledge Base */}
        <SidePanel
          title="Knowledge Base"
          subtitle="Manage context sources"
          searchPlaceholder="Search files..."
          onSearch={(query) => console.log('Search:', query)}
          onAdd={() => console.log('Add source')}
          addLabel="Add Source"
        >
          {/* Folders Section */}
          <PanelSection title="Folders" onAdd={() => console.log('Add folder')}>
            {mockFolders.map((folder) => (
              <FileItem
                key={folder.name}
                icon={<FolderOpen className="h-4 w-4 text-primary" />}
                name={folder.name}
                onClick={() => console.log('Open folder:', folder.name)}
              />
            ))}
          </PanelSection>

          {/* Files Section */}
          <PanelSection title="Files" onAdd={() => console.log('Upload file')}>
            {mockFiles.map((file) => (
              <FileItem
                key={file.name}
                icon={getFileIcon(file.type)}
                name={file.name}
                size={file.size}
                selected={selectedFile === file.name}
                onClick={() => setSelectedFile(file.name)}
              />
            ))}
          </PanelSection>
        </SidePanel>

        {/* Center: Workflow Canvas */}
        <WorkflowCanvas
          zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
          onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
          onFitToScreen={() => setZoom(1)}
        >
          {/* Node 1: Input Trigger */}
          <WorkflowNode
            id="trigger-1"
            type="trigger"
            title="Input Trigger"
            icon={<Zap className="h-4 w-4 text-purple-400" />}
            position={{ x: 80, y: 100 }}
          >
            <div className="rounded bg-muted p-2">
              <p className="font-mono text-xs text-muted-foreground">
                Webhook: /api/v1/trigger
              </p>
            </div>
          </WorkflowNode>

          {/* Node 2: LLM Processing */}
          <WorkflowNode
            id="llm-1"
            type="llm"
            title="LLM Processing"
            icon={<Brain className="h-4 w-4 text-primary" />}
            isActive={true}
            badge="Active"
            position={{ x: 420, y: 80 }}
          >
            <div className="space-y-2">
              <NodeSetting label="Model" value="GPT-4-Turbo" />
              <NodeSetting label="Temperature" value="0.7" />
            </div>
            <div className="mt-2 border-t border-dashed border-border pt-2">
              <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">
                Context
              </p>
              <div className="flex flex-wrap gap-1">
                <NodeContext
                  icon={<FileText className="h-2.5 w-2.5" />}
                  label="Manual.pdf"
                />
              </div>
            </div>
          </WorkflowNode>

          {/* Node 3: Branch Logic */}
          <WorkflowNode
            id="branch-1"
            type="branch"
            title="Branch Logic"
            icon={<GitBranch className="h-4 w-4 text-orange-400" />}
            position={{ x: 740, y: 90 }}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded border border-green-500/30 bg-muted p-1.5">
                <span className="text-xs text-green-400">Success</span>
              </div>
              <div className="flex items-center justify-between rounded border border-red-500/30 bg-muted p-1.5">
                <span className="text-xs text-red-400">Failure</span>
              </div>
            </div>
          </WorkflowNode>

          {/* Node 4: Slack Integration */}
          <WorkflowNode
            id="slack-1"
            type="integration"
            title="Slack Notify"
            icon={<Bot className="h-4 w-4" />}
            gradient="from-[#4A154B] to-[#611f69]"
            position={{ x: 1000, y: 230 }}
          >
            <div className="rounded bg-muted p-2">
              <p className="text-xs text-muted-foreground">
                Channel: #alerts-ai
              </p>
            </div>
          </WorkflowNode>
        </WorkflowCanvas>

        {/* Right Panel: Agent Bond Chat */}
        <ChatPanel
          zoneId="module-builder-bond"
          agentName="Agent Bond"
          isOnline={true}
          messages={messages}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onQuickReply={handleQuickReply}
          user={{ name: 'Alex Chen' }}
          placeholder="Ask Bond to edit workflow..."
          disclaimer="Bond can make mistakes. Verify important logic."
        />
      </div>
    </div>
  );
}
