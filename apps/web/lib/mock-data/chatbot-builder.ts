/**
 * Chatbot Builder Mock Data
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 *
 * Mock data for the chatbot builder including intents, entities,
 * conversation nodes, and Wendy AI messages.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface Intent {
  id: string;
  name: string;
  utteranceCount: number;
  confidence: number;
  isActive?: boolean;
}

export interface Entity {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'custom';
  exampleCount: number;
}

export interface Variable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: string;
}

export interface ConversationNode {
  id: string;
  type: 'start' | 'decision' | 'bot_says' | 'user_input' | 'action' | 'end';
  label: string;
  icon: string;
  iconColor: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  isActive?: boolean;
}

export interface ConversationEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: 'solid' | 'dashed';
}

export interface ChatbotMetadata {
  id: string;
  name: string;
  projectName: string;
  trainingStatus: 'up_to_date' | 'needs_training' | 'training';
  lastTrained: string;
}

// =============================================================================
// INTENTS DATA
// =============================================================================

export const INTENTS: Intent[] = [
  {
    id: 'intent-1',
    name: '#greeting',
    utteranceCount: 24,
    confidence: 99,
    isActive: true,
  },
  {
    id: 'intent-2',
    name: '#order_status',
    utteranceCount: 12,
    confidence: 85,
  },
  {
    id: 'intent-3',
    name: '#product_inquiry',
    utteranceCount: 45,
    confidence: 92,
  },
  {
    id: 'intent-4',
    name: '#refund_policy',
    utteranceCount: 8,
    confidence: 45,
  },
  {
    id: 'intent-5',
    name: '#goodbye',
    utteranceCount: 16,
    confidence: 97,
  },
];

// =============================================================================
// ENTITIES DATA
// =============================================================================

export const ENTITIES: Entity[] = [
  {
    id: 'entity-1',
    name: '@order_id',
    type: 'text',
    exampleCount: 12,
  },
  {
    id: 'entity-2',
    name: '@product_name',
    type: 'text',
    exampleCount: 45,
  },
  {
    id: 'entity-3',
    name: '@email',
    type: 'email',
    exampleCount: 8,
  },
  {
    id: 'entity-4',
    name: '@phone',
    type: 'phone',
    exampleCount: 6,
  },
];

// =============================================================================
// VARIABLES DATA
// =============================================================================

export const VARIABLES: Variable[] = [
  {
    id: 'var-1',
    name: 'user_name',
    type: 'string',
  },
  {
    id: 'var-2',
    name: 'order_total',
    type: 'number',
    defaultValue: '0',
  },
  {
    id: 'var-3',
    name: 'is_authenticated',
    type: 'boolean',
    defaultValue: 'false',
  },
];

// =============================================================================
// CONVERSATION NODES
// =============================================================================

export const CONVERSATION_NODES: ConversationNode[] = [
  {
    id: 'start-1',
    type: 'start',
    label: 'Start',
    icon: 'bolt',
    iconColor: 'text-primary',
    position: { x: 20, y: 370 },
    config: {},
  },
  {
    id: 'decision-1',
    type: 'decision',
    label: 'Identify Intent',
    icon: 'alt_route',
    iconColor: 'text-amber-400',
    position: { x: 280, y: 340 },
    config: {
      waitForInput: true,
    },
  },
  {
    id: 'bot-greeting',
    type: 'bot_says',
    label: 'Greeting Response',
    icon: 'forum',
    iconColor: 'text-primary',
    position: { x: 630, y: 180 },
    config: {
      trigger: '#greeting',
      message:
        "Hi there! 👋 Welcome to Hyyve Retail Support. How can I help you today?",
    },
    isActive: true,
  },
  {
    id: 'bot-order',
    type: 'bot_says',
    label: 'Order Status Response',
    icon: 'forum',
    iconColor: 'text-text-secondary',
    position: { x: 630, y: 480 },
    config: {
      trigger: '#order_status',
      message: 'Sure, I can help with that. Please provide your order ID.',
    },
  },
];

// =============================================================================
// CONVERSATION EDGES
// =============================================================================

export const CONVERSATION_EDGES: ConversationEdge[] = [
  {
    id: 'edge-1',
    source: 'start-1',
    target: 'decision-1',
    animated: true,
  },
  {
    id: 'edge-2',
    source: 'decision-1',
    target: 'bot-greeting',
    style: 'dashed',
    animated: true,
  },
  {
    id: 'edge-3',
    source: 'decision-1',
    target: 'bot-order',
    style: 'solid',
  },
];

// =============================================================================
// CHATBOT METADATA
// =============================================================================

export const CHATBOT_METADATA: ChatbotMetadata = {
  id: 'chatbot-1',
  name: 'Main Flow',
  projectName: 'Retail Support Bot',
  trainingStatus: 'up_to_date',
  lastTrained: '2026-01-27T10:00:00Z',
};

// =============================================================================
// WENDY AI MESSAGES
// =============================================================================

export interface WendyMessage {
  id: string;
  type: 'wendy' | 'user' | 'suggestion';
  content: string;
  timestamp?: string;
  suggestions?: string[];
  actions?: { label: string; variant: 'primary' | 'secondary' }[];
}

export const WENDY_MESSAGES: WendyMessage[] = [
  {
    id: 'wendy-1',
    type: 'wendy',
    content:
      "I've analyzed your flow structure. It looks solid, but I found an optimization opportunity.",
    timestamp: '10:23 AM',
  },
  {
    id: 'wendy-2',
    type: 'suggestion',
    content:
      'The intent #order_status has low confidence (85%). Consider adding these 3 generated phrases:',
    suggestions: [
      'Where is my stuff?',
      'Track package 123',
      'Is my delivery late?',
    ],
    actions: [{ label: 'Add to Training', variant: 'primary' }],
  },
  {
    id: 'wendy-3',
    type: 'wendy',
    content:
      'You also have a disconnected node at the bottom. Should I connect it to the fallback flow?',
    actions: [
      { label: 'Yes, fix it', variant: 'secondary' },
      { label: 'Ignore', variant: 'secondary' },
    ],
  },
];
