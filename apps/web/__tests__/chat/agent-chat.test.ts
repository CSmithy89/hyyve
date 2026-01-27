/**
 * Agent Chat Components - Acceptance Tests
 *
 * Story: 0-2-5 Create Agent Chat Component
 *
 * These tests verify that chat components are properly created
 * with correct structure, styling, and TypeScript interfaces.
 *
 * TDD RED PHASE: These tests MUST fail initially as chat components
 * do not exist yet. The green phase will implement the components.
 *
 * Acceptance Criteria Coverage:
 * - AC1: AgentChat header with status indicator
 * - AC2: Message list with agent/user bubbles
 * - AC3: Date dividers between message groups
 * - AC4: Typing indicator with bouncing dots
 * - AC5: Quick action buttons in agent messages
 * - AC6: Input area with attachment and send
 * - AC7: Component props (agentId, messages, onSendMessage, etc.)
 * - AC8: Agent personality colors
 * - AC9: Accessibility requirements
 * - AC10: All components pass unit tests
 *
 * Test Strategy:
 * 1. File existence tests - verify component files are created
 * 2. Export tests - verify components are properly exported
 * 3. Structure tests - verify correct Tailwind classes
 * 4. Interface tests - verify TypeScript types are exported
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// PATH CONSTANTS
// =============================================================================

const CHAT_DIR = path.resolve(__dirname, '../../components/chat');
const AGENT_CHAT_PATH = path.join(CHAT_DIR, 'AgentChat.tsx');
const AGENT_MESSAGE_PATH = path.join(CHAT_DIR, 'AgentMessage.tsx');
const USER_MESSAGE_PATH = path.join(CHAT_DIR, 'UserMessage.tsx');
const CHAT_INPUT_PATH = path.join(CHAT_DIR, 'ChatInput.tsx');
const TYPING_INDICATOR_PATH = path.join(CHAT_DIR, 'TypingIndicator.tsx');
const DATE_DIVIDER_PATH = path.join(CHAT_DIR, 'DateDivider.tsx');
const QUICK_ACTION_BUTTON_PATH = path.join(CHAT_DIR, 'QuickActionButton.tsx');
const TYPES_PATH = path.join(CHAT_DIR, 'types.ts');
const INDEX_PATH = path.join(CHAT_DIR, 'index.ts');

// =============================================================================
// EXPECTED VALUES FROM STORY ACCEPTANCE CRITERIA
// =============================================================================

const EXPECTED_DIMENSIONS = {
  // Panel width (right sidebar)
  panelWidth: 'w-80', // 320px

  // Avatar size
  avatarSize: 'size-8', // 32px

  // Message max width
  messageMaxWidth: 'max-w-[85%]',

  // Input max height
  inputMaxHeight: 'max-h-24',
} as const;

const EXPECTED_CLASSES = {
  // Agent header
  headerBorder: 'border-b',
  headerBorderColor: 'border-border-dark',

  // Status indicator
  statusOnline: 'bg-green-500',
  statusPulse: 'animate-pulse',

  // Message bubbles
  agentBubble: 'bg-[#272546]',
  userBubble: 'bg-primary',
  bubbleRounded: 'rounded-2xl',

  // Typing indicator
  typingDot: 'animate-bounce',

  // Quick action buttons
  actionRounded: 'rounded-full',
  primaryAction: 'border-primary/30',
  secondaryAction: 'border-border-dark',

  // Input area
  inputBorder: 'border-border-dark',
  inputFocus: 'focus-within:border-primary',
} as const;

const AGENT_IDS = ['bond', 'wendy', 'morgan', 'artie'] as const;

// =============================================================================
// FILE STRUCTURE TESTS
// =============================================================================

describe('Story 0-2-5: Agent Chat Components - File Structure', () => {
  describe('Chat Directory', () => {
    it('should have chat directory created', () => {
      expect(fs.existsSync(CHAT_DIR)).toBe(true);
    });
  });

  describe('Component Files', () => {
    it('should have AgentChat.tsx file', () => {
      expect(fs.existsSync(AGENT_CHAT_PATH)).toBe(true);
    });

    it('should have AgentMessage.tsx file', () => {
      expect(fs.existsSync(AGENT_MESSAGE_PATH)).toBe(true);
    });

    it('should have UserMessage.tsx file', () => {
      expect(fs.existsSync(USER_MESSAGE_PATH)).toBe(true);
    });

    it('should have ChatInput.tsx file', () => {
      expect(fs.existsSync(CHAT_INPUT_PATH)).toBe(true);
    });

    it('should have TypingIndicator.tsx file', () => {
      expect(fs.existsSync(TYPING_INDICATOR_PATH)).toBe(true);
    });

    it('should have DateDivider.tsx file', () => {
      expect(fs.existsSync(DATE_DIVIDER_PATH)).toBe(true);
    });

    it('should have QuickActionButton.tsx file', () => {
      expect(fs.existsSync(QUICK_ACTION_BUTTON_PATH)).toBe(true);
    });

    it('should have types.ts file', () => {
      expect(fs.existsSync(TYPES_PATH)).toBe(true);
    });

    it('should have index.ts barrel export file', () => {
      expect(fs.existsSync(INDEX_PATH)).toBe(true);
    });
  });
});

// =============================================================================
// AC1: AGENT HEADER WITH STATUS INDICATOR
// =============================================================================

describe('AC1: AgentChat Header with Status Indicator', () => {
  let agentChatContent: string;

  beforeAll(() => {
    if (fs.existsSync(AGENT_CHAT_PATH)) {
      agentChatContent = fs.readFileSync(AGENT_CHAT_PATH, 'utf-8');
    }
  });

  it('should be a client component', () => {
    expect(agentChatContent).toContain("'use client'");
  });

  it('should have header section with border-b styling', () => {
    expect(agentChatContent).toContain(EXPECTED_CLASSES.headerBorder);
    expect(agentChatContent).toContain(EXPECTED_CLASSES.headerBorderColor);
  });

  it('should display agent name dynamically', () => {
    // Should reference agentId or agent name in some way
    expect(agentChatContent).toMatch(/agent(Id|Name)|Agent\s+(Bond|Wendy|Morgan|Artie)/i);
  });

  it('should have status indicator with green color when online', () => {
    expect(agentChatContent).toContain(EXPECTED_CLASSES.statusOnline);
  });

  it('should have pulse animation on status indicator', () => {
    expect(agentChatContent).toContain(EXPECTED_CLASSES.statusPulse);
  });

  it('should have more options button (MoreVertical icon)', () => {
    expect(agentChatContent).toMatch(/MoreVertical|more_vert|EllipsisVertical/i);
  });

  it('should accept status prop for online/offline/busy states', () => {
    expect(agentChatContent).toMatch(/status\s*[?:]?\s*['"]?(online|offline|busy)['"]?/);
  });
});

// =============================================================================
// AC2: MESSAGE LIST WITH AGENT/USER BUBBLES
// =============================================================================

describe('AC2: Message List with Agent and User Bubbles', () => {
  let agentMessageContent: string;
  let userMessageContent: string;

  beforeAll(() => {
    if (fs.existsSync(AGENT_MESSAGE_PATH)) {
      agentMessageContent = fs.readFileSync(AGENT_MESSAGE_PATH, 'utf-8');
    }
    if (fs.existsSync(USER_MESSAGE_PATH)) {
      userMessageContent = fs.readFileSync(USER_MESSAGE_PATH, 'utf-8');
    }
  });

  describe('AgentMessage Component', () => {
    it('should be a client component', () => {
      expect(agentMessageContent).toContain("'use client'");
    });

    it('should have avatar on left side', () => {
      // Avatar should come before message in flex layout
      expect(agentMessageContent).toContain('flex');
      expect(agentMessageContent).toContain('gap-3');
    });

    it('should have avatar with correct size', () => {
      expect(agentMessageContent).toContain(EXPECTED_DIMENSIONS.avatarSize);
    });

    it('should have message bubble with agent background color', () => {
      expect(agentMessageContent).toContain(EXPECTED_CLASSES.agentBubble);
    });

    it('should have rounded bubble styling', () => {
      expect(agentMessageContent).toContain(EXPECTED_CLASSES.bubbleRounded);
    });

    it('should have max-width constraint on bubble', () => {
      expect(agentMessageContent).toContain(EXPECTED_DIMENSIONS.messageMaxWidth);
    });

    it('should handle sequential messages with spacer instead of avatar', () => {
      // Should have logic to hide avatar for sequential messages
      expect(agentMessageContent).toMatch(/sequential|showAvatar|hideAvatar|isFirst|isConsecutive/i);
    });
  });

  describe('UserMessage Component', () => {
    it('should be a client component', () => {
      expect(userMessageContent).toContain("'use client'");
    });

    it('should have flex-row-reverse for right alignment', () => {
      expect(userMessageContent).toContain('flex-row-reverse');
    });

    it('should have avatar with gradient border', () => {
      expect(userMessageContent).toMatch(/gradient|from-.*to-/);
    });

    it('should have message bubble with primary background', () => {
      expect(userMessageContent).toContain(EXPECTED_CLASSES.userBubble);
    });

    it('should have rounded bubble with different corner', () => {
      expect(userMessageContent).toContain(EXPECTED_CLASSES.bubbleRounded);
      expect(userMessageContent).toContain('rounded-tr-none');
    });

    it('should have max-width constraint on bubble', () => {
      expect(userMessageContent).toContain(EXPECTED_DIMENSIONS.messageMaxWidth);
    });

    it('should display timestamp below message', () => {
      expect(userMessageContent).toMatch(/timestamp|time|createdAt/i);
    });
  });
});

// =============================================================================
// AC3: DATE DIVIDERS BETWEEN MESSAGE GROUPS
// =============================================================================

describe('AC3: Date Dividers Between Message Groups', () => {
  let dateDividerContent: string;

  beforeAll(() => {
    if (fs.existsSync(DATE_DIVIDER_PATH)) {
      dateDividerContent = fs.readFileSync(DATE_DIVIDER_PATH, 'utf-8');
    }
  });

  it('should be a client component', () => {
    expect(dateDividerContent).toContain("'use client'");
  });

  it('should have centered text', () => {
    expect(dateDividerContent).toContain('justify-center');
  });

  it('should have uppercase styling', () => {
    expect(dateDividerContent).toContain('uppercase');
  });

  it('should have tracking-widest letter spacing', () => {
    expect(dateDividerContent).toContain('tracking-widest');
  });

  it('should have text-secondary color', () => {
    expect(dateDividerContent).toContain('text-text-secondary');
  });

  it('should have small text size', () => {
    expect(dateDividerContent).toMatch(/text-\[10px\]|text-xs/);
  });

  it('should accept date prop for formatting', () => {
    expect(dateDividerContent).toMatch(/date\s*[?:]|timestamp/i);
  });
});

// =============================================================================
// AC4: TYPING INDICATOR WITH BOUNCING DOTS
// =============================================================================

describe('AC4: Typing Indicator with Bouncing Dots', () => {
  let typingIndicatorContent: string;

  beforeAll(() => {
    if (fs.existsSync(TYPING_INDICATOR_PATH)) {
      typingIndicatorContent = fs.readFileSync(TYPING_INDICATOR_PATH, 'utf-8');
    }
  });

  it('should be a client component', () => {
    expect(typingIndicatorContent).toContain("'use client'");
  });

  it('should have three dots', () => {
    // Should have 3 dot elements
    const dotMatches = typingIndicatorContent.match(/animate-bounce/g);
    expect(dotMatches?.length).toBeGreaterThanOrEqual(3);
  });

  it('should have bouncing animation on dots', () => {
    expect(typingIndicatorContent).toContain(EXPECTED_CLASSES.typingDot);
  });

  it('should have staggered animation delays', () => {
    expect(typingIndicatorContent).toContain('[animation-delay:0.2s]');
    expect(typingIndicatorContent).toContain('[animation-delay:0.4s]');
  });

  it('should have dot size of 1.5', () => {
    expect(typingIndicatorContent).toContain('size-1.5');
  });

  it('should have agent avatar on left', () => {
    expect(typingIndicatorContent).toContain(EXPECTED_DIMENSIONS.avatarSize);
  });

  it('should have agent bubble background', () => {
    expect(typingIndicatorContent).toContain(EXPECTED_CLASSES.agentBubble);
  });
});

// =============================================================================
// AC5: QUICK ACTION BUTTONS IN AGENT MESSAGES
// =============================================================================

describe('AC5: Quick Action Buttons in Agent Messages', () => {
  let quickActionContent: string;

  beforeAll(() => {
    if (fs.existsSync(QUICK_ACTION_BUTTON_PATH)) {
      quickActionContent = fs.readFileSync(QUICK_ACTION_BUTTON_PATH, 'utf-8');
    }
  });

  it('should be a client component', () => {
    expect(quickActionContent).toContain("'use client'");
  });

  it('should have rounded-full styling', () => {
    expect(quickActionContent).toContain(EXPECTED_CLASSES.actionRounded);
  });

  it('should support primary variant with border-primary styling', () => {
    expect(quickActionContent).toContain(EXPECTED_CLASSES.primaryAction);
  });

  it('should support secondary variant with border-dark styling', () => {
    expect(quickActionContent).toContain(EXPECTED_CLASSES.secondaryAction);
  });

  it('should have text-xs font size', () => {
    expect(quickActionContent).toContain('text-xs');
  });

  it('should have px-3 py-1.5 padding', () => {
    expect(quickActionContent).toContain('px-3');
    expect(quickActionContent).toContain('py-1.5');
  });

  it('should accept onClick callback', () => {
    expect(quickActionContent).toContain('onClick');
  });

  it('should accept variant prop for primary/secondary', () => {
    expect(quickActionContent).toMatch(/variant\s*[?:]?\s*['"]?(primary|secondary)['"]?/);
  });
});

// =============================================================================
// AC6: INPUT AREA WITH ATTACHMENT AND SEND
// =============================================================================

describe('AC6: Input Area with Attachment and Send', () => {
  let chatInputContent: string;

  beforeAll(() => {
    if (fs.existsSync(CHAT_INPUT_PATH)) {
      chatInputContent = fs.readFileSync(CHAT_INPUT_PATH, 'utf-8');
    }
  });

  it('should be a client component', () => {
    expect(chatInputContent).toContain("'use client'");
  });

  it('should have attachment button', () => {
    // Should have PlusCircle or add_circle icon
    expect(chatInputContent).toMatch(/PlusCircle|Paperclip|add_circle/i);
  });

  it('should have textarea for input', () => {
    expect(chatInputContent).toContain('textarea');
  });

  it('should have max-height constraint on textarea', () => {
    expect(chatInputContent).toContain(EXPECTED_DIMENSIONS.inputMaxHeight);
  });

  it('should have resize-none on textarea', () => {
    expect(chatInputContent).toContain('resize-none');
  });

  it('should have send button with primary styling', () => {
    expect(chatInputContent).toContain('bg-primary');
    expect(chatInputContent).toMatch(/Send|send/i);
  });

  it('should have border styling with focus state', () => {
    expect(chatInputContent).toContain(EXPECTED_CLASSES.inputBorder);
    expect(chatInputContent).toContain(EXPECTED_CLASSES.inputFocus);
  });

  it('should have disclaimer text below input', () => {
    expect(chatInputContent).toMatch(/mistake|verify|disclaimer/i);
  });

  it('should have onSend callback prop', () => {
    expect(chatInputContent).toMatch(/onSend|onSubmit/i);
  });

  it('should have placeholder text', () => {
    expect(chatInputContent).toContain('placeholder');
  });
});

// =============================================================================
// AC7: COMPONENT PROPS (agentId, messages, onSendMessage, etc.)
// =============================================================================

describe('AC7: Component Props Interface', () => {
  let typesContent: string;
  let agentChatContent: string;

  beforeAll(() => {
    if (fs.existsSync(TYPES_PATH)) {
      typesContent = fs.readFileSync(TYPES_PATH, 'utf-8');
    }
    if (fs.existsSync(AGENT_CHAT_PATH)) {
      agentChatContent = fs.readFileSync(AGENT_CHAT_PATH, 'utf-8');
    }
  });

  describe('Types File', () => {
    it('should export AgentId type', () => {
      expect(typesContent).toMatch(/export\s+(type|interface)\s+AgentId/);
    });

    it('should define bond, wendy, morgan, artie as agent IDs', () => {
      AGENT_IDS.forEach((id) => {
        expect(typesContent).toContain(`'${id}'`);
      });
    });

    it('should export Message interface', () => {
      expect(typesContent).toMatch(/export\s+(type|interface)\s+Message/);
    });

    it('should have Message with id, content, role, timestamp fields', () => {
      expect(typesContent).toContain('id');
      expect(typesContent).toContain('content');
      expect(typesContent).toMatch(/role|sender/i);
      expect(typesContent).toMatch(/timestamp|createdAt/i);
    });

    it('should export AgentChatProps interface', () => {
      expect(typesContent).toMatch(/export\s+(type|interface)\s+AgentChatProps/);
    });

    it('should export QuickAction interface', () => {
      expect(typesContent).toMatch(/export\s+(type|interface)\s+QuickAction/);
    });
  });

  describe('AgentChat Props', () => {
    it('should accept agentId prop', () => {
      expect(agentChatContent).toContain('agentId');
    });

    it('should accept messages prop', () => {
      expect(agentChatContent).toContain('messages');
    });

    it('should accept onSendMessage callback', () => {
      expect(agentChatContent).toContain('onSendMessage');
    });

    it('should accept isTyping prop', () => {
      expect(agentChatContent).toContain('isTyping');
    });

    it('should accept status prop', () => {
      expect(agentChatContent).toContain('status');
    });

    it('should accept className prop for customization', () => {
      expect(agentChatContent).toContain('className');
    });
  });
});

// =============================================================================
// AC8: AGENT PERSONALITY COLORS
// =============================================================================

describe('AC8: Agent Personality Colors', () => {
  let typesContent: string;
  let agentChatContent: string;

  beforeAll(() => {
    if (fs.existsSync(TYPES_PATH)) {
      typesContent = fs.readFileSync(TYPES_PATH, 'utf-8');
    }
    if (fs.existsSync(AGENT_CHAT_PATH)) {
      agentChatContent = fs.readFileSync(AGENT_CHAT_PATH, 'utf-8');
    }
  });

  it('should define agent color mapping', () => {
    const combinedContent = (typesContent || '') + (agentChatContent || '');
    expect(combinedContent).toMatch(/AGENT_COLORS|agentColors|getAgentColor/i);
  });

  it('should have Bond with primary purple color', () => {
    const combinedContent = (typesContent || '') + (agentChatContent || '');
    expect(combinedContent).toMatch(/bond.*#5048e5|#5048e5.*bond|primary/i);
  });

  it('should have Wendy with warm orange color', () => {
    const combinedContent = (typesContent || '') + (agentChatContent || '');
    expect(combinedContent).toMatch(/wendy.*orange|orange.*wendy|f97316/i);
  });

  it('should have Morgan with cool blue color', () => {
    const combinedContent = (typesContent || '') + (agentChatContent || '');
    expect(combinedContent).toMatch(/morgan.*blue|blue.*morgan|3b82f6/i);
  });

  it('should have Artie with creative pink color', () => {
    const combinedContent = (typesContent || '') + (agentChatContent || '');
    expect(combinedContent).toMatch(/artie.*pink|pink.*artie|ec4899/i);
  });

  it('should apply agent color to avatar', () => {
    expect(agentChatContent).toMatch(/agentColor|avatarColor|getAgentColor/i);
  });
});

// =============================================================================
// AC9: ACCESSIBILITY REQUIREMENTS
// =============================================================================

describe('AC9: Accessibility Requirements', () => {
  let agentChatContent: string;
  let chatInputContent: string;

  beforeAll(() => {
    if (fs.existsSync(AGENT_CHAT_PATH)) {
      agentChatContent = fs.readFileSync(AGENT_CHAT_PATH, 'utf-8');
    }
    if (fs.existsSync(CHAT_INPUT_PATH)) {
      chatInputContent = fs.readFileSync(CHAT_INPUT_PATH, 'utf-8');
    }
  });

  it('should have aria-live region for new messages', () => {
    expect(agentChatContent).toContain('aria-live');
  });

  it('should have role="log" on message container', () => {
    expect(agentChatContent).toContain('role="log"');
  });

  it('should have aria-label on send button', () => {
    expect(chatInputContent).toContain('aria-label');
  });

  it('should have aria-label on attachment button', () => {
    expect(chatInputContent).toMatch(/aria-label.*attach|attach.*aria-label/i);
  });

  it('should have placeholder or aria-label on textarea', () => {
    expect(chatInputContent).toMatch(/placeholder|aria-label/);
  });

  it('should support keyboard navigation', () => {
    // Should handle Enter key for sending
    expect(chatInputContent).toMatch(/onKeyDown|onKeyPress|Enter/);
  });
});

// =============================================================================
// AC10: EXPORT TESTS
// =============================================================================

describe('AC10: Module Exports', () => {
  let indexContent: string;

  beforeAll(() => {
    if (fs.existsSync(INDEX_PATH)) {
      indexContent = fs.readFileSync(INDEX_PATH, 'utf-8');
    }
  });

  it('should export AgentChat component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*AgentChat[^}]*\}|export\s+\*\s+from/);
  });

  it('should export AgentMessage component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*AgentMessage[^}]*\}|export\s+\*\s+from/);
  });

  it('should export UserMessage component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*UserMessage[^}]*\}|export\s+\*\s+from/);
  });

  it('should export ChatInput component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*ChatInput[^}]*\}|export\s+\*\s+from/);
  });

  it('should export TypingIndicator component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*TypingIndicator[^}]*\}|export\s+\*\s+from/);
  });

  it('should export DateDivider component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*DateDivider[^}]*\}|export\s+\*\s+from/);
  });

  it('should export QuickActionButton component', () => {
    expect(indexContent).toMatch(/export\s*\{[^}]*QuickActionButton[^}]*\}|export\s+\*\s+from/);
  });

  it('should export types', () => {
    expect(indexContent).toMatch(/export\s*\{?[^}]*type|export\s+\*\s+from.*types/);
  });
});

// =============================================================================
// ADDITIONAL COMPONENT STRUCTURE TESTS
// =============================================================================

describe('Component Structure and Styling', () => {
  let agentChatContent: string;

  beforeAll(() => {
    if (fs.existsSync(AGENT_CHAT_PATH)) {
      agentChatContent = fs.readFileSync(AGENT_CHAT_PATH, 'utf-8');
    }
  });

  it('should have correct panel width', () => {
    expect(agentChatContent).toContain(EXPECTED_DIMENSIONS.panelWidth);
  });

  it('should import from design-tokens or use Hyyve colors', () => {
    expect(agentChatContent).toMatch(/design-tokens|HYYVE_COLORS|bg-\[#/);
  });

  it('should use cn utility for class composition', () => {
    expect(agentChatContent).toContain("import { cn }");
  });

  it('should have flex column layout', () => {
    expect(agentChatContent).toContain('flex');
    expect(agentChatContent).toContain('flex-col');
  });

  it('should have overflow-y-auto on message list', () => {
    expect(agentChatContent).toContain('overflow-y-auto');
  });

  it('should have flex-1 for message list to fill space', () => {
    expect(agentChatContent).toContain('flex-1');
  });

  it('should have dark background color', () => {
    expect(agentChatContent).toMatch(/bg-\[#131221\]|bg-background-dark/);
  });

  it('should have border-l for left border', () => {
    expect(agentChatContent).toContain('border-l');
  });
});

// =============================================================================
// INTEGRATION TESTS - Component Composition
// =============================================================================

describe('Component Composition', () => {
  let agentChatContent: string;

  beforeAll(() => {
    if (fs.existsSync(AGENT_CHAT_PATH)) {
      agentChatContent = fs.readFileSync(AGENT_CHAT_PATH, 'utf-8');
    }
  });

  it('should import AgentMessage component', () => {
    expect(agentChatContent).toMatch(/import.*AgentMessage/);
  });

  it('should import UserMessage component', () => {
    expect(agentChatContent).toMatch(/import.*UserMessage/);
  });

  it('should import ChatInput component', () => {
    expect(agentChatContent).toMatch(/import.*ChatInput/);
  });

  it('should import TypingIndicator component', () => {
    expect(agentChatContent).toMatch(/import.*TypingIndicator/);
  });

  it('should import DateDivider component', () => {
    expect(agentChatContent).toMatch(/import.*DateDivider/);
  });

  it('should render messages by mapping over array', () => {
    expect(agentChatContent).toMatch(/messages\.map|\.map\(.*message/);
  });

  it('should conditionally render TypingIndicator based on isTyping', () => {
    expect(agentChatContent).toMatch(/isTyping.*TypingIndicator|TypingIndicator.*isTyping/);
  });
});
