# Story 0.2.5: Create Agent Chat Component

## Story

As a **developer**,
I want **a reusable agent chat interface component**,
So that **Bond, Wendy, Morgan, and Artie can interact with users consistently**.

## Acceptance Criteria

- **AC1:** AgentChat component renders with agent header containing:
  - Agent name (e.g., "Agent Bond")
  - Status indicator (online/offline) with green pulse animation when online
  - More options button (three dots menu)

- **AC2:** Message list displays messages with:
  - Agent messages with primary-colored avatar on left
  - User messages with gradient avatar on right
  - Sequential agent messages show spacer instead of repeated avatar
  - Max width 85% for message bubbles

- **AC3:** Date dividers show between message groups:
  - Centered text with timestamp (e.g., "Today, 10:23 AM")
  - Uppercase, tracking-widest styling
  - Text-secondary color

- **AC4:** Typing indicator displays:
  - Three bouncing dots animation
  - Staggered animation delays (0s, 0.2s, 0.4s)
  - Agent avatar shown to left

- **AC5:** Quick action buttons in agent messages:
  - Primary action with border-primary styling
  - Secondary action with border-dark styling
  - Rounded-full button styling

- **AC6:** Input area includes:
  - Attachment button (add_circle icon)
  - Auto-growing textarea (max-h-24)
  - Send button with primary background
  - Disclaimer text below input

- **AC7:** Component accepts props:
  - `agentId`: 'bond' | 'wendy' | 'morgan' | 'artie'
  - `messages`: Message[] array for controlled mode
  - `onSendMessage`: (message: string) => void callback
  - `isTyping`: boolean for typing indicator
  - `status`: 'online' | 'offline' | 'busy'

- **AC8:** Agent personality affects appearance:
  - Bond: Primary purple (#5048e5)
  - Wendy: Warm orange
  - Morgan: Cool blue
  - Artie: Creative pink

- **AC9:** Accessibility requirements:
  - ARIA live region for new messages
  - Role="log" on message container
  - Proper labels on all interactive elements
  - Keyboard navigation support

- **AC10:** All components pass unit tests with:
  - AgentChat.test.tsx
  - AgentMessage.test.tsx
  - UserMessage.test.tsx
  - ChatInput.test.tsx

## Technical Notes

- Use Lucide icons instead of Material Symbols
- Match wireframe styles from hyyve_module_builder/code.html lines 346-427
- Agent colors should use design tokens from lib/design-tokens.ts
- Support both controlled (messages prop) and uncontrolled modes

## Source Reference

`hyyve_module_builder/code.html` lines 346-427

## Creates

- components/chat/AgentChat.tsx
- components/chat/AgentMessage.tsx
- components/chat/UserMessage.tsx
- components/chat/ChatInput.tsx
- components/chat/TypingIndicator.tsx
- components/chat/DateDivider.tsx
- components/chat/QuickActionButton.tsx
- components/chat/types.ts

## Implementation Tasks

1. Create types.ts with Message, AgentId, and component interfaces
2. Create AgentMessage.tsx for agent-side message bubbles
3. Create UserMessage.tsx for user-side message bubbles
4. Create DateDivider.tsx for timestamp separators
5. Create TypingIndicator.tsx with bouncing dots
6. Create QuickActionButton.tsx for inline actions
7. Create ChatInput.tsx with attachment and send buttons
8. Create AgentChat.tsx as the main composition component
9. Add unit tests for all components
10. Export from components/chat/index.ts
