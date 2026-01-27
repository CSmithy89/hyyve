/**
 * Module Builder Mock Data
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 *
 * Mock data for the module builder including workflow nodes, edges,
 * and knowledge base files.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'llm' | 'branch' | 'integration' | 'action';
  label: string;
  icon: string;
  iconColor: string;
  gradient: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  isActive?: boolean;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'default' | 'success' | 'failure';
  animated?: boolean;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'txt' | 'json' | 'folder';
  size?: string;
  icon: string;
  iconColor: string;
  isSelected?: boolean;
}

export interface WorkflowMetadata {
  id: string;
  name: string;
  projectName: string;
  workspaceName: string;
  lastModified: string;
  status: 'draft' | 'published' | 'running';
}

// =============================================================================
// WORKFLOW NODES
// =============================================================================

export const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    label: 'Input Trigger',
    icon: 'bolt',
    iconColor: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-500',
    position: { x: 80, y: 100 },
    config: {
      webhookUrl: '/api/v1/trigger',
      method: 'POST',
    },
  },
  {
    id: 'llm-1',
    type: 'llm',
    label: 'LLM Processing',
    icon: 'psychology',
    iconColor: 'text-primary',
    gradient: 'bg-primary',
    position: { x: 420, y: 80 },
    config: {
      model: 'GPT-4-Turbo',
      temperature: 0.7,
      maxTokens: 2048,
      contextFiles: ['Product_Manual.pdf'],
    },
    isActive: true,
  },
  {
    id: 'branch-1',
    type: 'branch',
    label: 'Branch Logic',
    icon: 'alt_route',
    iconColor: 'text-orange-400',
    gradient: 'from-orange-400 to-red-400',
    position: { x: 740, y: 90 },
    config: {
      conditions: [
        { path: 'success', condition: 'response.success === true' },
        { path: 'failure', condition: 'response.success === false' },
      ],
    },
  },
  {
    id: 'slack-1',
    type: 'integration',
    label: 'Slack Notify',
    icon: 'tag',
    iconColor: 'text-[#4A154B]',
    gradient: 'bg-[#4A154B]',
    position: { x: 1000, y: 230 },
    config: {
      channel: '#alerts-ai',
      messageTemplate: 'Workflow completed: {{result}}',
    },
  },
];

// =============================================================================
// WORKFLOW EDGES
// =============================================================================

export const WORKFLOW_EDGES: WorkflowEdge[] = [
  {
    id: 'edge-1',
    source: 'trigger-1',
    target: 'llm-1',
    animated: true,
  },
  {
    id: 'edge-2',
    source: 'llm-1',
    target: 'branch-1',
    animated: true,
  },
  {
    id: 'edge-3',
    source: 'branch-1',
    sourceHandle: 'success',
    target: 'slack-1',
    type: 'success',
    animated: true,
  },
];

// =============================================================================
// KNOWLEDGE BASE FILES
// =============================================================================

export const KNOWLEDGE_FOLDERS: KnowledgeFile[] = [
  {
    id: 'folder-1',
    name: 'Financial Data',
    type: 'folder',
    icon: 'folder',
    iconColor: 'text-primary',
  },
];

export const KNOWLEDGE_FILES: KnowledgeFile[] = [
  {
    id: 'file-1',
    name: 'Product_Manual.pdf',
    type: 'pdf',
    size: '2.4 MB',
    icon: 'description',
    iconColor: 'text-blue-400',
    isSelected: true,
  },
  {
    id: 'file-2',
    name: 'Q3_Financials.csv',
    type: 'csv',
    size: '156 KB',
    icon: 'table_chart',
    iconColor: 'text-green-400',
  },
  {
    id: 'file-3',
    name: 'Support_Logs.txt',
    type: 'txt',
    size: '89 KB',
    icon: 'article',
    iconColor: 'text-orange-400',
  },
];

// =============================================================================
// WORKFLOW METADATA
// =============================================================================

export const WORKFLOW_METADATA: WorkflowMetadata = {
  id: 'workflow-1',
  name: 'Workflow 1',
  projectName: 'Project Alpha',
  workspaceName: 'Hyyve',
  lastModified: '2026-01-27T10:23:00Z',
  status: 'draft',
};

// =============================================================================
// AGENT BOND MESSAGES
// =============================================================================

export interface AgentMessage {
  id: string;
  type: 'agent' | 'user';
  content: string;
  timestamp: string;
  actions?: { label: string; variant: 'primary' | 'secondary' }[];
  isTyping?: boolean;
}

export const AGENT_BOND_MESSAGES: AgentMessage[] = [
  {
    id: 'msg-1',
    type: 'agent',
    content:
      "I've analyzed the Product_Manual.pdf you just uploaded.",
    timestamp: '10:23 AM',
  },
  {
    id: 'msg-2',
    type: 'agent',
    content:
      'Should I automatically connect it as a context source to the LLM Processing node?',
    timestamp: '10:23 AM',
    actions: [
      { label: 'Yes, connect it', variant: 'primary' },
      { label: 'No, show summary', variant: 'secondary' },
    ],
  },
  {
    id: 'msg-3',
    type: 'user',
    content: 'Yes, go ahead. Also increase the temperature to 0.8.',
    timestamp: 'Just now',
  },
  {
    id: 'msg-4',
    type: 'agent',
    content: '',
    timestamp: '',
    isTyping: true,
  },
];
