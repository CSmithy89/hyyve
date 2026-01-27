/**
 * AgentChat Component Stories
 *
 * Story: 0-2-15 Create Storybook Visual Regression Baseline
 * Reference: Agent chat panel component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AgentChat } from '@/components/chat/AgentChat';
import type { Message } from '@/components/chat/types';

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'agent',
    content: "Hello! I'm Bond, your AI concierge. How can I help you today?",
    timestamp: new Date(),
    quickActions: [
      { id: '1', label: 'Create a workflow', variant: 'primary' },
      { id: '2', label: 'Browse templates', variant: 'secondary' },
    ],
  },
  {
    id: '2',
    role: 'user',
    content: 'I want to create a new workflow for customer support',
    timestamp: new Date(),
  },
  {
    id: '3',
    role: 'agent',
    content:
      'Great choice! I can help you set up a customer support workflow. Would you like to start with a template or build from scratch?',
    timestamp: new Date(),
  },
];

const meta: Meta<typeof AgentChat> = {
  title: 'Chat/AgentChat',
  component: AgentChat,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Agent chat panel with message history, quick actions, and input field. Supports different agent personalities (Bond, Wendy, Morgan, Artie).',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Bond: Story = {
  args: {
    agentId: 'bond',
    messages: mockMessages,
    isTyping: false,
    onSendMessage: () => {},
    className: 'w-[400px] h-[600px]',
  },
};

export const Wendy: Story = {
  args: {
    agentId: 'wendy',
    messages: [
      {
        id: '1',
        role: 'agent',
        content:
          "Hi there! I'm Wendy, your workflow assistant. Ready to help you build something amazing!",
        timestamp: new Date(),
      },
    ],
    isTyping: false,
    onSendMessage: () => {},
    className: 'w-[400px] h-[600px]',
  },
};

export const Loading: Story = {
  args: {
    agentId: 'bond',
    messages: mockMessages,
    isTyping: true,
    onSendMessage: () => {},
    className: 'w-[400px] h-[600px]',
  },
};

export const Empty: Story = {
  args: {
    agentId: 'bond',
    messages: [],
    isTyping: false,
    onSendMessage: () => {},
    className: 'w-[400px] h-[600px]',
  },
};
