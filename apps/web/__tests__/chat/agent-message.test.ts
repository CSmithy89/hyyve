/**
 * AgentMessage Component - Acceptance Tests
 *
 * Story: 0-2-5 Create Agent Chat Component
 * AC2: Message list with agent bubbles
 * AC5: Quick action buttons
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const CHAT_DIR = path.resolve(__dirname, '../../components/chat');
const AGENT_MESSAGE_PATH = path.join(CHAT_DIR, 'AgentMessage.tsx');

const EXPECTED_CLASSES = {
  avatarSize: 'size-8',
  messageMaxWidth: 'max-w-[85%]',
  messageBubble: 'bg-[#272546]',
  roundedBubble: 'rounded-2xl',
  quickAction: 'QuickActionButton',
} as const;

describe('Story 0-2-5: AgentMessage Component', () => {
  let agentMessageContent = '';

  beforeAll(() => {
    if (fs.existsSync(AGENT_MESSAGE_PATH)) {
      agentMessageContent = fs.readFileSync(AGENT_MESSAGE_PATH, 'utf-8');
    }
  });

  it('should have AgentMessage.tsx file', () => {
    expect(fs.existsSync(AGENT_MESSAGE_PATH)).toBe(true);
  });

  it('should be a client component', () => {
    expect(agentMessageContent).toContain("'use client'");
  });

  it('should render avatar and bubble structure', () => {
    expect(agentMessageContent).toContain(EXPECTED_CLASSES.avatarSize);
    expect(agentMessageContent).toContain(EXPECTED_CLASSES.messageMaxWidth);
    expect(agentMessageContent).toContain(EXPECTED_CLASSES.roundedBubble);
  });

  it('should use agent bubble background color', () => {
    expect(agentMessageContent).toContain(EXPECTED_CLASSES.messageBubble);
  });

  it('should render quick action buttons when provided', () => {
    expect(agentMessageContent).toContain(EXPECTED_CLASSES.quickAction);
  });

  it('should use material symbol for agent avatar', () => {
    expect(agentMessageContent).toMatch(/material-symbols-outlined/);
    expect(agentMessageContent).toMatch(/smart_toy/);
  });
});
