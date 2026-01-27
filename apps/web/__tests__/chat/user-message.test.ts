/**
 * UserMessage Component - Acceptance Tests
 *
 * Story: 0-2-5 Create Agent Chat Component
 * AC2: Message list with user bubbles
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const CHAT_DIR = path.resolve(__dirname, '../../components/chat');
const USER_MESSAGE_PATH = path.join(CHAT_DIR, 'UserMessage.tsx');

const EXPECTED_CLASSES = {
  messageMaxWidth: 'max-w-[85%]',
  messageBubble: 'bg-primary',
  roundedBubble: 'rounded-2xl',
  reverseLayout: 'flex-row-reverse',
  timestampClass: 'text-[10px]',
} as const;

describe('Story 0-2-5: UserMessage Component', () => {
  let userMessageContent = '';

  beforeAll(() => {
    if (fs.existsSync(USER_MESSAGE_PATH)) {
      userMessageContent = fs.readFileSync(USER_MESSAGE_PATH, 'utf-8');
    }
  });

  it('should have UserMessage.tsx file', () => {
    expect(fs.existsSync(USER_MESSAGE_PATH)).toBe(true);
  });

  it('should be a client component', () => {
    expect(userMessageContent).toContain("'use client'");
  });

  it('should render user bubble with correct layout', () => {
    expect(userMessageContent).toContain(EXPECTED_CLASSES.reverseLayout);
    expect(userMessageContent).toContain(EXPECTED_CLASSES.messageMaxWidth);
    expect(userMessageContent).toContain(EXPECTED_CLASSES.roundedBubble);
  });

  it('should use primary background for user bubble', () => {
    expect(userMessageContent).toContain(EXPECTED_CLASSES.messageBubble);
  });

  it('should include timestamp styling', () => {
    expect(userMessageContent).toContain(EXPECTED_CLASSES.timestampClass);
  });

  it('should use material symbol for user avatar', () => {
    expect(userMessageContent).toMatch(/material-symbols-outlined/);
    expect(userMessageContent).toMatch(/person/);
  });
});
