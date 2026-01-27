/**
 * ChatInput Component - Acceptance Tests
 *
 * Story: 0-2-5 Create Agent Chat Component
 * AC6: Input area with attachment and send
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const CHAT_DIR = path.resolve(__dirname, '../../components/chat');
const CHAT_INPUT_PATH = path.join(CHAT_DIR, 'ChatInput.tsx');

const EXPECTED_CLASSES = {
  inputMaxHeight: 'max-h-24',
  inputBorder: 'border-border-dark',
  inputFocus: 'focus-within:border-primary',
} as const;

describe('Story 0-2-5: ChatInput Component', () => {
  let chatInputContent = '';

  beforeAll(() => {
    if (fs.existsSync(CHAT_INPUT_PATH)) {
      chatInputContent = fs.readFileSync(CHAT_INPUT_PATH, 'utf-8');
    }
  });

  it('should have ChatInput.tsx file', () => {
    expect(fs.existsSync(CHAT_INPUT_PATH)).toBe(true);
  });

  it('should be a client component', () => {
    expect(chatInputContent).toContain("'use client'");
  });

  it('should include correct input styling', () => {
    expect(chatInputContent).toContain(EXPECTED_CLASSES.inputMaxHeight);
    expect(chatInputContent).toContain(EXPECTED_CLASSES.inputBorder);
    expect(chatInputContent).toContain(EXPECTED_CLASSES.inputFocus);
  });

  it('should include attachment and send buttons', () => {
    expect(chatInputContent).toMatch(/add_circle/);
    expect(chatInputContent).toMatch(/send/);
  });
});
