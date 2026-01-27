# Story 0.2.12: Implement Chatbot Builder UI Shell

## Story

As a **developer**,
I want **the Chatbot Builder page structure**,
So that **users can see the conversation flow editor**.

## Acceptance Criteria

- **AC1:** Chatbot Builder at `/builders/chatbot/[id]`:
  - Left panel: Intent/Entity management (tabs)
  - Center: Conversation flow canvas
  - Right panel: Agent Wendy chat interface

- **AC2:** Left Panel - Intents & Training:
  - Search bar for intents
  - Tabs: Intents, Entities, Variables
  - Intent list with confidence scores
  - Add intent button

- **AC3:** Sample Conversation Nodes:
  - Start node (circular trigger)
  - Decision/Router node (identify intent)
  - Bot Says nodes (message responses)
  - Connected with SVG flow lines

- **AC4:** Canvas Controls:
  - Zoom in/out buttons
  - Fit to screen button
  - Dot grid background
  - Add node FAB button

- **AC5:** Top Navigation Bar:
  - Breadcrumbs (Projects > Bot > Flow)
  - Training status indicator
  - Preview button
  - Deploy button (primary)
  - User avatar

- **AC6:** Right Panel - Wendy AI:
  - Wendy avatar with online status
  - Suggestion cards for improvements
  - Quick action buttons
  - Chat input field

- **AC7:** Design Consistency:
  - Matches `chatbot_builder_main/code.html` wireframe
  - Colors: primary #5048e5, background-dark #131221, surface-dark #1b1a2d
  - Uses Material Symbols Outlined icons
  - Dark theme with dot grid canvas

## Technical Notes

- Uses mock data initially (no API integration)
- Reuses FlowCanvas from story 0-2-6
- Reuses AgentChat from story 0-2-5 (with Wendy config)
- Node connections use SVG paths
- Intent confidence shown as colored badges

## Source Reference

Wireframe: `chatbot_builder_main/code.html`

## Creates

- app/(app)/builders/chatbot/[id]/page.tsx
- app/(app)/builders/chatbot/[id]/layout.tsx
- app/(app)/builders/chatbot/[id]/loading.tsx
- components/builders/chatbot/ChatbotBuilderHeader.tsx
- components/builders/chatbot/IntentsPanel.tsx
- components/builders/chatbot/ConversationNodes.tsx
- components/builders/chatbot/index.ts
- lib/mock-data/chatbot-builder.ts

## Implementation Tasks

- [x] Create mock data for chatbot builder
- [x] Create ChatbotBuilderHeader component
- [x] Create IntentsPanel component (tabs, search, list)
- [x] Create ConversationNodes component (sample nodes)
- [x] Create chatbot builder layout
- [x] Create chatbot builder page
- [x] Add loading state
- [x] Add unit tests (33 tests passing)

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| apps/web/app/(app)/builders/chatbot/[id]/page.tsx | Created | Chatbot builder page with three-panel layout |
| apps/web/app/(app)/builders/chatbot/[id]/layout.tsx | Created | Layout with header wrapper |
| apps/web/app/(app)/builders/chatbot/[id]/loading.tsx | Created | Skeleton loading state |
| apps/web/components/builders/chatbot/ChatbotBuilderHeader.tsx | Created | Top nav with breadcrumbs, training status, Deploy button |
| apps/web/components/builders/chatbot/IntentsPanel.tsx | Created | Left panel with tabs, search, intent list |
| apps/web/components/builders/chatbot/ConversationNodes.tsx | Created | Custom React Flow node types for conversation |
| apps/web/components/builders/chatbot/index.ts | Created | Barrel exports for chatbot components |
| apps/web/lib/mock-data/chatbot-builder.ts | Created | Mock data for intents, entities, nodes |
| apps/web/__tests__/builders/chatbot-builder.test.ts | Created | 33 ATDD tests for all ACs |

### Change Log

- 2026-01-27: Story file created
- 2026-01-27: Implemented all ACs, 33 tests passing

## Status

done
