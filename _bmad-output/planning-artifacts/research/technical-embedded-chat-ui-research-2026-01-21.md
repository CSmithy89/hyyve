# Technical Research: Embedded Chat UI with Chatwoot Backend

**Date:** 2026-01-21
**Researcher:** Claude (Opus 4.5)
**Status:** Complete
**Category:** Technical Architecture

## Executive Summary

This research explores building a **custom React chat UI** that uses **Chatwoot as a headless backend**, enabling per-project chat views embedded directly within the Hyyve Platform. This approach provides full control over the user experience while leveraging Chatwoot's robust messaging infrastructure.

## Architecture Clarification

### System-Wide vs Project-Scoped Features

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM-WIDE VIEWS                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    COMMAND CENTER DASHBOARD                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │ Project  │ │ Project  │ │ Project  │ │ Project  │           │   │
│  │  │ Card A   │ │ Card B   │ │ Card C   │ │ Card D   │           │   │
│  │  │ ──────── │ │ ──────── │ │ ──────── │ │ ──────── │           │   │
│  │  │ Status:OK│ │ Status:! │ │ Status:OK│ │ HITL: 3  │           │   │
│  │  │ Jobs: 42 │ │ Jobs: 17 │ │ Jobs: 89 │ │ Jobs: 5  │           │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │
│  │                                                                  │   │
│  │  Global Metrics: Total Jobs | Active HITL | System Health       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         PROJECT-SCOPED VIEWS                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PROJECT DASHBOARD TAB                         │   │
│  │  Analytics | Job History | HITL Approvals | Settings            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PROJECT CHAT TAB (Chatwoot)                   │   │
│  │  ┌─────────────┐  ┌────────────────────────────────────────┐   │   │
│  │  │ Contacts    │  │  Chat Thread View                       │   │   │
│  │  │ ─────────── │  │  ┌────────────────────────────────────┐│   │   │
│  │  │ John D.  ● │  │  │ Customer: How do I reset password? ││   │   │
│  │  │ Sarah M. ● │  │  │                                      ││   │   │
│  │  │ Mike R.  ○ │  │  │ Bot: I can help with that! Based on ││   │   │
│  │  │ Lisa K.  ○ │  │  │ our docs [source: kb/auth.md]...    ││   │   │
│  │  │           │  │  │                                      ││   │   │
│  │  │ RAG Insights│  │  │ [Confidence: 94%] [Sources: 3]      ││   │   │
│  │  └─────────────┘  └────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PROJECT BUILDER TAB                           │   │
│  │  Conversational Builder | Visual Canvas | Agent Config          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Feature | Scope | Location |
|---------|-------|----------|
| Command Center Dashboard | System-wide | `/dashboard` |
| All Projects Overview | System-wide | `/dashboard` |
| Global HITL Queue | System-wide | `/dashboard/hitl` |
| System Health Metrics | System-wide | `/dashboard` |
| Project Chat (Chatwoot) | Per-project | `/projects/:id/chat` |
| Project Analytics | Per-project | `/projects/:id/analytics` |
| Project Job History | Per-project | `/projects/:id/jobs` |
| Project HITL Approvals | Per-project | `/projects/:id/approvals` |
| Workflow Builder | Per-project | `/projects/:id/builder` |
| Module Management | Per-project | `/projects/:id/modules` |

---

## 1. Headless Chatwoot Architecture

### 1.1 API-First Integration

Instead of embedding Chatwoot's UI, we use it purely as a messaging backend:

```typescript
// Chatwoot as headless backend
interface ChatwootHeadlessConfig {
  // API endpoints we'll use
  endpoints: {
    conversations: '/api/v1/accounts/:account/conversations';
    messages: '/api/v1/accounts/:account/conversations/:id/messages';
    contacts: '/api/v1/accounts/:account/contacts';
    webhooks: '/api/v1/accounts/:account/agent_bots/:id';
  };

  // Real-time via ActionCable
  // NOTE: Only RoomChannel exists - there is NO ConversationChannel in Chatwoot
  websocket: {
    url: 'wss://chatwoot.yourdomain.com/cable';
    channels: ['RoomChannel']; // All events come through RoomChannel
  };
}
```

### 1.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         End Customer                                     │
│                    (Widget/Website/App)                                  │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │ WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Chatwoot Server                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ Conversation│  │   Contact   │  │   Message   │  │ ActionCable │   │
│  │   Manager   │  │   Manager   │  │    Store    │  │  Pub/Sub    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │ Webhook + ActionCable
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Hyyve Platform                                  │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                      Chat Gateway Service                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │ │
│  │  │  Webhook    │  │ ActionCable │  │   Message   │               │ │
│  │  │  Handler    │  │   Client    │  │   Router    │               │ │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │ │
│  │         │                │                │                       │ │
│  │         └────────────────┼────────────────┘                       │ │
│  │                          ▼                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │                    RAG Agent Orchestrator                    │ │ │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐               │ │ │
│  │  │  │ Context   │  │  Claude   │  │  Response │               │ │ │
│  │  │  │ Retrieval │  │  Agent    │  │ Formatter │               │ │ │
│  │  │  └───────────┘  └───────────┘  └───────────┘               │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Platform Chat UI (React)                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │ │
│  │  │  Contact    │  │   Thread    │  │    RAG      │               │ │
│  │  │   List      │  │    View     │  │  Insights   │               │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Custom React Chat UI Components

### 2.1 Component Architecture

```typescript
// src/features/project-chat/components/index.ts

// Main container - project-scoped
export { ProjectChatView } from './ProjectChatView';

// Contact list with online status
export { ContactList } from './ContactList';
export { ContactListItem } from './ContactListItem';
export { ContactSearch } from './ContactSearch';

// Conversation thread
export { ConversationThread } from './ConversationThread';
export { MessageBubble } from './MessageBubble';
export { MessageInput } from './MessageInput';
export { TypingIndicator } from './TypingIndicator';

// RAG-specific enhancements
export { RAGInsightsPanel } from './RAGInsightsPanel';
export { SourceCitation } from './SourceCitation';
export { ConfidenceIndicator } from './ConfidenceIndicator';

// Agent interaction
export { AgentHandoff } from './AgentHandoff';
export { HITLEscalation } from './HITLEscalation';
```

### 2.2 Main Chat View Component

```tsx
// src/features/project-chat/components/ProjectChatView.tsx
import { useState, useEffect } from 'react';
import { useChatwootConnection } from '../hooks/useChatwootConnection';
import { useProjectConversations } from '../hooks/useProjectConversations';
import { ContactList } from './ContactList';
import { ConversationThread } from './ConversationThread';
import { RAGInsightsPanel } from './RAGInsightsPanel';

interface ProjectChatViewProps {
  projectId: string;
  chatwootInboxId: string;
}

export function ProjectChatView({ projectId, chatwootInboxId }: ProjectChatViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showRAGInsights, setShowRAGInsights] = useState(true);

  // Real-time connection to Chatwoot
  const {
    isConnected,
    subscribe,
    unsubscribe
  } = useChatwootConnection(chatwootInboxId);

  // Conversations for this project's inbox
  const {
    conversations,
    isLoading,
    refetch
  } = useProjectConversations(projectId, chatwootInboxId);

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribe('conversation_created', handleNewConversation);
      subscribe('message_created', handleNewMessage);
      subscribe('conversation_status_changed', handleStatusChange);

      return () => {
        unsubscribe('conversation_created');
        unsubscribe('message_created');
        unsubscribe('conversation_status_changed');
      };
    }
  }, [isConnected]);

  return (
    <div className="flex h-full">
      {/* Contact/Conversation List - 280px fixed */}
      <div className="w-[280px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Conversations</h2>
          <p className="text-sm text-muted-foreground">
            {conversations.length} active
          </p>
        </div>
        <ContactList
          conversations={conversations}
          selectedId={selectedConversation}
          onSelect={setSelectedConversation}
          isLoading={isLoading}
        />
      </div>

      {/* Main Chat Area - flex-1 */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ConversationThread
            conversationId={selectedConversation}
            projectId={projectId}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* RAG Insights Panel - 320px, collapsible */}
      {showRAGInsights && selectedConversation && (
        <div className="w-[320px] border-l border-border">
          <RAGInsightsPanel
            conversationId={selectedConversation}
            projectId={projectId}
            onClose={() => setShowRAGInsights(false)}
          />
        </div>
      )}
    </div>
  );
}
```

### 2.3 Conversation Thread with RAG Metadata

```tsx
// src/features/project-chat/components/ConversationThread.tsx
import { useConversationMessages } from '../hooks/useConversationMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';

interface ConversationThreadProps {
  conversationId: string;
  projectId: string;
}

export function ConversationThread({ conversationId, projectId }: ConversationThreadProps) {
  const {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    ragMetadata
  } = useConversationMessages(conversationId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-medium">{messages[0]?.contact?.name || 'Unknown'}</h3>
          <p className="text-sm text-muted-foreground">
            {messages[0]?.contact?.email}
          </p>
        </div>
        <ConversationActions conversationId={conversationId} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            ragMetadata={ragMetadata[message.id]}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <MessageInput
          onSend={sendMessage}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}
```

### 2.4 Message Bubble with RAG Attribution

```tsx
// src/features/project-chat/components/MessageBubble.tsx
import { cn } from '@/lib/utils';
import { SourceCitation } from './SourceCitation';
import { ConfidenceIndicator } from './ConfidenceIndicator';

interface RAGMetadata {
  confidence: number;
  sources: Array<{
    documentId: string;
    documentName: string;
    chunkText: string;
    relevanceScore: number;
  }>;
  retrievalTime: number;
  modelUsed: string;
}

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    messageType: 'incoming' | 'outgoing';
    sender: {
      type: 'contact' | 'agent_bot' | 'user';
      name?: string;
    };
    createdAt: string;
  };
  ragMetadata?: RAGMetadata;
}

export function MessageBubble({ message, ragMetadata }: MessageBubbleProps) {
  const isBot = message.sender.type === 'agent_bot';
  const isIncoming = message.messageType === 'incoming';

  return (
    <div className={cn(
      "flex flex-col max-w-[70%]",
      isIncoming ? "items-start" : "items-end ml-auto"
    )}>
      {/* Sender label for bot messages */}
      {isBot && (
        <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          <BotIcon className="w-3 h-3" />
          RAG Assistant
        </span>
      )}

      {/* Message content */}
      <div className={cn(
        "rounded-lg px-4 py-2",
        isIncoming
          ? "bg-muted text-foreground"
          : "bg-primary text-primary-foreground"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* RAG metadata for bot responses */}
      {isBot && ragMetadata && (
        <div className="mt-2 space-y-2">
          {/* Confidence indicator */}
          <ConfidenceIndicator confidence={ragMetadata.confidence} />

          {/* Source citations */}
          {ragMetadata.sources.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ragMetadata.sources.slice(0, 3).map((source) => (
                <SourceCitation key={source.documentId} source={source} />
              ))}
              {ragMetadata.sources.length > 3 && (
                <button className="text-xs text-muted-foreground">
                  +{ragMetadata.sources.length - 3} more
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Timestamp */}
      <span className="text-xs text-muted-foreground mt-1">
        {formatTime(message.createdAt)}
      </span>
    </div>
  );
}
```

### 2.5 RAG Insights Panel

```tsx
// src/features/project-chat/components/RAGInsightsPanel.tsx
import { useConversationRAGStats } from '../hooks/useConversationRAGStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RAGInsightsPanelProps {
  conversationId: string;
  projectId: string;
  onClose: () => void;
}

export function RAGInsightsPanel({ conversationId, projectId, onClose }: RAGInsightsPanelProps) {
  const { stats, topSources, sentiment } = useConversationRAGStats(conversationId);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">RAG Insights</h3>
        <button onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Response Quality */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Response Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Avg Confidence</span>
                <span>{Math.round(stats.avgConfidence * 100)}%</span>
              </div>
              <Progress value={stats.avgConfidence * 100} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Source Coverage</span>
                <span>{stats.sourceCoverage}%</span>
              </div>
              <Progress value={stats.sourceCoverage} />
            </div>
          </CardContent>
        </Card>

        {/* Top Sources Used */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Top Knowledge Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topSources.map((source) => (
                <li key={source.documentId} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="truncate flex-1">{source.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {source.hitCount}x
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Customer Sentiment */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Customer Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <SentimentIcon sentiment={sentiment.current} />
              <span className="text-sm capitalize">{sentiment.current}</span>
              {sentiment.trend && (
                <TrendArrow direction={sentiment.trend} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-sm text-left p-2 rounded hover:bg-muted">
              Escalate to Human Agent
            </button>
            <button className="w-full text-sm text-left p-2 rounded hover:bg-muted">
              Add to Training Data
            </button>
            <button className="w-full text-sm text-left p-2 rounded hover:bg-muted">
              View Full Trace
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 3. Real-Time Integration with ActionCable

### 3.1 ActionCable Client Hook

```typescript
// src/features/project-chat/hooks/useChatwootConnection.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { createConsumer, Subscription } from '@rails/actioncable';

interface UseChatwootConnectionOptions {
  inboxId: string;
  accountId: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useChatwootConnection({
  inboxId,
  accountId,
  onConnect,
  onDisconnect
}: UseChatwootConnectionOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const consumerRef = useRef<ReturnType<typeof createConsumer> | null>(null);
  const subscriptionsRef = useRef<Map<string, Subscription>>(new Map());

  // Initialize connection
  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_CHATWOOT_WS_URL}/cable`;
    consumerRef.current = createConsumer(wsUrl);

    // Subscribe to inbox channel
    const inboxSubscription = consumerRef.current.subscriptions.create(
      {
        channel: 'RoomChannel',
        pubsub_token: getPubSubToken(accountId, inboxId),
      },
      {
        connected() {
          setIsConnected(true);
          onConnect?.();
        },
        disconnected() {
          setIsConnected(false);
          onDisconnect?.();
        },
        received(data: ChatwootWebSocketEvent) {
          handleWebSocketEvent(data);
        },
      }
    );

    subscriptionsRef.current.set('inbox', inboxSubscription);

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      consumerRef.current?.disconnect();
    };
  }, [inboxId, accountId]);

  // NOTE: Chatwoot does NOT have a ConversationChannel - all events come through RoomChannel
  // Conversation-specific events are filtered client-side by conversation_id
  // The RoomChannel subscription above handles all conversation events

  // Event handlers map
  const eventHandlers = useRef<Map<string, Set<Function>>>(new Map());

  const subscribe = useCallback((event: string, handler: Function) => {
    if (!eventHandlers.current.has(event)) {
      eventHandlers.current.set(event, new Set());
    }
    eventHandlers.current.get(event)!.add(handler);
  }, []);

  const unsubscribe = useCallback((event: string, handler?: Function) => {
    if (handler) {
      eventHandlers.current.get(event)?.delete(handler);
    } else {
      eventHandlers.current.delete(event);
    }
  }, []);

  return {
    isConnected,
    subscribe,
    unsubscribe,
    // Note: No subscribeToConversation - all events come through RoomChannel
  };
}
```

### 3.2 WebSocket Event Types

```typescript
// src/features/project-chat/types/websocket.ts

export type ChatwootWebSocketEvent =
  | ConversationCreatedEvent
  | MessageCreatedEvent
  | ConversationStatusChangedEvent
  | TypingOnEvent
  | TypingOffEvent
  | PresenceUpdateEvent;

export interface ConversationCreatedEvent {
  event: 'conversation.created';
  data: {
    id: number;
    account_id: number;
    inbox_id: number;
    status: 'open' | 'resolved' | 'pending';
    contact: {
      id: number;
      name: string;
      email: string;
      phone_number: string;
    };
    messages: Message[];
    created_at: string;
  };
}

export interface MessageCreatedEvent {
  event: 'message.created';
  data: {
    id: number;
    conversation_id: number;
    content: string;
    message_type: 'incoming' | 'outgoing' | 'activity';
    content_type: 'text' | 'input_select' | 'cards' | 'form';
    sender: {
      id: number;
      type: 'contact' | 'user' | 'agent_bot';
      name?: string;
    };
    created_at: string;
    // Custom metadata we add for RAG - use additional_attributes NOT content_attributes
    // content_attributes has predefined accessors, additional_attributes is for custom data
    additional_attributes?: {
      rag_confidence?: number;
      rag_sources?: string[];
      rag_model?: string;
    };
  };
}

export interface TypingOnEvent {
  event: 'conversation.typing_on';
  data: {
    conversation_id: number;
    user: {
      id: number;
      type: 'contact' | 'user' | 'agent_bot';
    };
  };
}
```

---

## 4. Chatwoot API Integration

### 4.1 API Client

```typescript
// src/features/project-chat/api/chatwoot-client.ts
import { createClient } from '@supabase/supabase-js';

interface ChatwootClientConfig {
  baseUrl: string;
  accountId: string;
  apiAccessToken: string; // Agent bot token or platform token
}

export class ChatwootClient {
  private baseUrl: string;
  private accountId: string;
  private headers: HeadersInit;

  constructor(config: ChatwootClientConfig) {
    this.baseUrl = config.baseUrl;
    this.accountId = config.accountId;
    this.headers = {
      'Content-Type': 'application/json',
      'api_access_token': config.apiAccessToken,
    };
  }

  // Conversations
  async getConversations(inboxId: string, params?: {
    status?: 'open' | 'resolved' | 'pending' | 'snoozed' | 'all';
    assigneeType?: 'me' | 'unassigned' | 'all';
    page?: number;
  }): Promise<ConversationListResponse> {
    const searchParams = new URLSearchParams({
      inbox_id: inboxId,
      ...(params?.status && { status: params.status }),
      ...(params?.assigneeType && { assignee_type: params.assigneeType }),
      ...(params?.page && { page: String(params.page) }),
    });

    const response = await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations?${searchParams}`,
      { headers: this.headers }
    );

    return response.json();
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}`,
      { headers: this.headers }
    );

    return response.json();
  }

  // Messages
  async getMessages(conversationId: string, before?: number): Promise<Message[]> {
    const searchParams = before ? `?before=${before}` : '';

    const response = await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/messages${searchParams}`,
      { headers: this.headers }
    );

    return response.json();
  }

  async sendMessage(conversationId: string, content: string, options?: {
    private?: boolean;
    contentType?: 'text' | 'input_select' | 'cards';
    additionalAttributes?: Record<string, any>; // Use additional_attributes for custom data
  }): Promise<Message> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          content,
          message_type: 'outgoing',
          private: options?.private ?? false,
          content_type: options?.contentType ?? 'text',
          // IMPORTANT: Use additional_attributes for custom RAG metadata
          // content_attributes has predefined accessors and may cause conflicts
          additional_attributes: options?.additionalAttributes,
        }),
      }
    );

    return response.json();
  }

  // Contacts
  async getContact(contactId: string): Promise<Contact> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/contacts/${contactId}`,
      { headers: this.headers }
    );

    return response.json();
  }

  async searchContacts(query: string): Promise<Contact[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/contacts/search?q=${encodeURIComponent(query)}`,
      { headers: this.headers }
    );

    const data = await response.json();
    return data.payload;
  }

  // Conversation actions
  async toggleStatus(conversationId: string, status: 'open' | 'resolved' | 'pending'): Promise<void> {
    await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/toggle_status`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ status }),
      }
    );
  }

  async assignAgent(conversationId: string, agentId: number): Promise<void> {
    await fetch(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/assignments`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ assignee_id: agentId }),
      }
    );
  }
}
```

### 4.2 React Query Hooks

```typescript
// src/features/project-chat/hooks/useProjectConversations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useChatwootClient } from './useChatwootClient';

export function useProjectConversations(projectId: string, inboxId: string) {
  const client = useChatwootClient(projectId);

  return useQuery({
    queryKey: ['project-conversations', projectId, inboxId],
    queryFn: () => client.getConversations(inboxId, { status: 'all' }),
    refetchInterval: 30000, // Refetch every 30s as backup to real-time
    staleTime: 10000,
  });
}

export function useConversationMessages(conversationId: string) {
  const client = useChatwootClient();
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => client.getMessages(conversationId),
    staleTime: 5000,
  });

  // Optimistically add message on send
  const sendMutation = useMutation({
    mutationFn: (content: string) => client.sendMessage(conversationId, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries(['conversation-messages', conversationId]);

      const previousMessages = queryClient.getQueryData(['conversation-messages', conversationId]);

      // Optimistic update
      queryClient.setQueryData(['conversation-messages', conversationId], (old: Message[]) => [
        ...old,
        {
          id: `temp-${Date.now()}`,
          content,
          message_type: 'outgoing',
          sender: { type: 'user' },
          created_at: new Date().toISOString(),
          status: 'sending',
        },
      ]);

      return { previousMessages };
    },
    onError: (err, content, context) => {
      queryClient.setQueryData(
        ['conversation-messages', conversationId],
        context?.previousMessages
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(['conversation-messages', conversationId]);
    },
  });

  return {
    messages: messagesQuery.data ?? [],
    // NOTE: TanStack Query v5 renamed isLoading to isPending
    isLoading: messagesQuery.isPending, // Use isPending in v5
    sendMessage: sendMutation.mutate,
    isSending: sendMutation.isPending, // Use isPending in v5
  };
}
```

---

## 5. RAG Metadata Storage and Retrieval

### 5.1 Database Schema for RAG Metadata

```sql
-- Store RAG metadata separately from Chatwoot
CREATE TABLE chat_rag_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chatwoot_message_id BIGINT NOT NULL,
  chatwoot_conversation_id BIGINT NOT NULL,

  -- RAG response metadata
  confidence_score DECIMAL(3,2) NOT NULL,
  model_used TEXT NOT NULL,
  retrieval_latency_ms INTEGER,
  generation_latency_ms INTEGER,

  -- Token usage
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_cost DECIMAL(10,6),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Index for fast lookups
  CONSTRAINT unique_message UNIQUE (project_id, chatwoot_message_id)
);

-- Source citations for each message
CREATE TABLE chat_rag_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rag_metadata_id UUID NOT NULL REFERENCES chat_rag_metadata(id) ON DELETE CASCADE,

  -- Source document reference
  document_id UUID NOT NULL REFERENCES rag_documents(id),
  chunk_id UUID REFERENCES rag_chunks(id),

  -- Relevance
  relevance_score DECIMAL(3,2) NOT NULL,
  chunk_text TEXT, -- Cached for display

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversation-level analytics
CREATE TABLE chat_conversation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chatwoot_conversation_id BIGINT NOT NULL,

  -- Aggregated stats
  total_messages INTEGER DEFAULT 0,
  bot_messages INTEGER DEFAULT 0,
  human_messages INTEGER DEFAULT 0,
  avg_confidence DECIMAL(3,2),

  -- Sentiment analysis
  customer_sentiment TEXT, -- positive, neutral, negative
  sentiment_score DECIMAL(3,2),

  -- Resolution tracking
  resolved_by_bot BOOLEAN,
  escalated_to_human BOOLEAN DEFAULT false,
  resolution_time_seconds INTEGER,

  -- Timestamps
  first_message_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_conversation UNIQUE (project_id, chatwoot_conversation_id)
);

-- Enable RLS
ALTER TABLE chat_rag_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rag_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversation_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies (project members only)
CREATE POLICY "Project members can view RAG metadata"
  ON chat_rag_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = chat_rag_metadata.project_id
        AND pm.user_id = auth.uid()
    )
  );
```

### 5.2 RAG Metadata Hook

```typescript
// src/features/project-chat/hooks/useConversationRAGStats.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ConversationRAGStats {
  avgConfidence: number;
  sourceCoverage: number;
  totalResponses: number;
  lowConfidenceCount: number;
}

interface TopSource {
  documentId: string;
  name: string;
  hitCount: number;
}

interface SentimentData {
  current: 'positive' | 'neutral' | 'negative';
  trend: 'up' | 'down' | 'stable' | null;
}

export function useConversationRAGStats(conversationId: string) {
  // Fetch aggregated stats
  const statsQuery = useQuery({
    queryKey: ['conversation-rag-stats', conversationId],
    queryFn: async (): Promise<{
      stats: ConversationRAGStats;
      topSources: TopSource[];
      sentiment: SentimentData;
    }> => {
      // Get conversation analytics
      const { data: analytics } = await supabase
        .from('chat_conversation_analytics')
        .select('*')
        .eq('chatwoot_conversation_id', conversationId)
        .single();

      // Get RAG metadata for this conversation
      const { data: ragData } = await supabase
        .from('chat_rag_metadata')
        .select(`
          confidence_score,
          chat_rag_sources (
            document_id,
            relevance_score,
            rag_documents (name)
          )
        `)
        .eq('chatwoot_conversation_id', conversationId);

      // Calculate stats
      const confidences = ragData?.map(r => r.confidence_score) ?? [];
      const avgConfidence = confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;

      const lowConfidenceCount = confidences.filter(c => c < 0.7).length;

      // Aggregate top sources
      const sourceCounts = new Map<string, { name: string; count: number }>();
      ragData?.forEach(r => {
        r.chat_rag_sources?.forEach(s => {
          const existing = sourceCounts.get(s.document_id) ?? {
            name: s.rag_documents?.name ?? 'Unknown',
            count: 0
          };
          sourceCounts.set(s.document_id, {
            ...existing,
            count: existing.count + 1
          });
        });
      });

      const topSources = Array.from(sourceCounts.entries())
        .map(([documentId, { name, count }]) => ({
          documentId,
          name,
          hitCount: count,
        }))
        .sort((a, b) => b.hitCount - a.hitCount)
        .slice(0, 5);

      return {
        stats: {
          avgConfidence,
          sourceCoverage: ragData?.filter(r => r.chat_rag_sources?.length > 0).length ?? 0,
          totalResponses: ragData?.length ?? 0,
          lowConfidenceCount,
        },
        topSources,
        sentiment: {
          current: analytics?.customer_sentiment ?? 'neutral',
          trend: calculateSentimentTrend(analytics),
        },
      };
    },
    staleTime: 30000, // 30 seconds
  });

  return {
    stats: statsQuery.data?.stats ?? { avgConfidence: 0, sourceCoverage: 0, totalResponses: 0, lowConfidenceCount: 0 },
    topSources: statsQuery.data?.topSources ?? [],
    sentiment: statsQuery.data?.sentiment ?? { current: 'neutral', trend: null },
    isLoading: statsQuery.isLoading,
  };
}
```

---

## 6. Backend Integration: Webhook Handler

### 6.1 Webhook Endpoint for RAG Processing

```typescript
// src/app/api/chatwoot/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/chatwoot/verify';
import { processWithRAG } from '@/lib/rag/process';
import { ChatwootClient } from '@/features/project-chat/api/chatwoot-client';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const signature = request.headers.get('x-chatwoot-signature');

  // Verify webhook signature
  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { event, data } = body;

  // Only process incoming messages
  if (event !== 'message_created' || data.message_type !== 'incoming') {
    return NextResponse.json({ status: 'ignored' });
  }

  try {
    // Get project from inbox mapping
    const { data: inboxMapping } = await supabase
      .from('chatwoot_inbox_mappings')
      .select('project_id, projects(*)')
      .eq('chatwoot_inbox_id', data.inbox.id)
      .single();

    if (!inboxMapping) {
      console.error('No project mapped to inbox:', data.inbox.id);
      return NextResponse.json({ error: 'Unmapped inbox' }, { status: 404 });
    }

    const projectId = inboxMapping.project_id;

    // Process message with RAG
    const ragResponse = await processWithRAG({
      projectId,
      query: data.content,
      conversationHistory: await getConversationHistory(data.conversation.id),
      contactContext: data.sender,
    });

    // Send response via Chatwoot API
    const client = new ChatwootClient({
      baseUrl: process.env.CHATWOOT_BASE_URL!,
      accountId: String(data.account.id),
      apiAccessToken: process.env.CHATWOOT_BOT_TOKEN!,
    });

    const sentMessage = await client.sendMessage(
      String(data.conversation.id),
      ragResponse.answer,
      {
        // IMPORTANT: Use additionalAttributes (maps to additional_attributes in API)
        // NOT contentAttributes - content_attributes has predefined schema
        additionalAttributes: {
          rag_confidence: ragResponse.confidence,
          rag_sources: ragResponse.sources.map(s => s.documentId),
          rag_model: ragResponse.model,
        },
      }
    );

    // Store RAG metadata in our database
    await storeRAGMetadata({
      projectId,
      chatwootMessageId: sentMessage.id,
      chatwootConversationId: data.conversation.id,
      confidence: ragResponse.confidence,
      model: ragResponse.model,
      sources: ragResponse.sources,
      latency: ragResponse.latencyMs,
      tokens: ragResponse.tokenUsage,
    });

    // Update conversation analytics
    await updateConversationAnalytics({
      projectId,
      conversationId: data.conversation.id,
      ragResponse,
    });

    return NextResponse.json({ status: 'processed', messageId: sentMessage.id });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function storeRAGMetadata(data: {
  projectId: string;
  chatwootMessageId: number;
  chatwootConversationId: number;
  confidence: number;
  model: string;
  sources: Array<{ documentId: string; chunkId?: string; relevance: number; text: string }>;
  latency: { retrieval: number; generation: number };
  tokens: { prompt: number; completion: number; cost: number };
}) {
  // Insert metadata
  const { data: metadata, error } = await supabase
    .from('chat_rag_metadata')
    .insert({
      project_id: data.projectId,
      chatwoot_message_id: data.chatwootMessageId,
      chatwoot_conversation_id: data.chatwootConversationId,
      confidence_score: data.confidence,
      model_used: data.model,
      retrieval_latency_ms: data.latency.retrieval,
      generation_latency_ms: data.latency.generation,
      prompt_tokens: data.tokens.prompt,
      completion_tokens: data.tokens.completion,
      total_cost: data.tokens.cost,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert sources
  if (data.sources.length > 0) {
    await supabase.from('chat_rag_sources').insert(
      data.sources.map(source => ({
        rag_metadata_id: metadata.id,
        document_id: source.documentId,
        chunk_id: source.chunkId,
        relevance_score: source.relevance,
        chunk_text: source.text,
      }))
    );
  }
}
```

---

## 7. Project Navigation Structure

### 7.1 Route Structure

```
/dashboard                          # System-wide Command Center
/dashboard/hitl                     # Global HITL queue
/dashboard/analytics                # Global analytics

/projects                           # Projects list
/projects/:projectId                # Project overview
/projects/:projectId/chat           # Project Chat (Chatwoot UI)
/projects/:projectId/builder        # Workflow builder
/projects/:projectId/modules        # Module management
/projects/:projectId/knowledge      # RAG knowledge base
/projects/:projectId/analytics      # Project-specific analytics
/projects/:projectId/jobs           # Job history
/projects/:projectId/approvals      # Project HITL approvals
/projects/:projectId/settings       # Project settings
```

### 7.2 Project Layout with Chat Tab

```tsx
// src/app/projects/[projectId]/layout.tsx
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const pathname = usePathname();
  const projectId = params.projectId;

  const tabs = [
    { value: 'overview', label: 'Overview', href: `/projects/${projectId}` },
    { value: 'chat', label: 'Chat', href: `/projects/${projectId}/chat` },
    { value: 'builder', label: 'Builder', href: `/projects/${projectId}/builder` },
    { value: 'modules', label: 'Modules', href: `/projects/${projectId}/modules` },
    { value: 'knowledge', label: 'Knowledge', href: `/projects/${projectId}/knowledge` },
    { value: 'analytics', label: 'Analytics', href: `/projects/${projectId}/analytics` },
    { value: 'settings', label: 'Settings', href: `/projects/${projectId}/settings` },
  ];

  const activeTab = tabs.find(t => pathname === t.href)?.value ?? 'overview';

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div className="border-b border-border px-6 py-4">
        <ProjectHeader projectId={projectId} />

        <Tabs value={activeTab} className="mt-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} asChild>
                <Link href={tab.href}>{tab.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
```

### 7.3 Chat Page

```tsx
// src/app/projects/[projectId]/chat/page.tsx
import { ProjectChatView } from '@/features/project-chat/components/ProjectChatView';
import { getProjectChatwootConfig } from '@/lib/chatwoot/config';

export default async function ProjectChatPage({
  params,
}: {
  params: { projectId: string };
}) {
  const config = await getProjectChatwootConfig(params.projectId);

  if (!config?.inboxId) {
    return (
      <div className="flex items-center justify-center h-full">
        <SetupChatwootPrompt projectId={params.projectId} />
      </div>
    );
  }

  return (
    <ProjectChatView
      projectId={params.projectId}
      chatwootInboxId={config.inboxId}
    />
  );
}
```

---

## 8. Command Center Updates

### 8.1 System-Wide Command Center with Project Cards

```tsx
// src/features/command-center/components/CommandCenterDashboard.tsx
import { useAllProjectsStatus } from '../hooks/useAllProjectsStatus';
import { ProjectStatusCard } from './ProjectStatusCard';
import { GlobalMetrics } from './GlobalMetrics';
import { GlobalHITLQueue } from './GlobalHITLQueue';

export function CommandCenterDashboard() {
  const { projects, globalMetrics, isLoading } = useAllProjectsStatus();

  return (
    <div className="p-6 space-y-6">
      {/* Global Metrics Row */}
      <GlobalMetrics metrics={globalMetrics} />

      {/* Global HITL Queue (collapsible) */}
      <GlobalHITLQueue />

      {/* Project Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectStatusCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 8.2 Project Status Card

```tsx
// src/features/command-center/components/ProjectStatusCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ProjectStatusCardProps {
  project: {
    id: string;
    name: string;
    status: 'healthy' | 'warning' | 'error';
    metrics: {
      jobsCompleted24h: number;
      jobsFailed24h: number;
      pendingHITL: number;
      activeChats: number;
      avgConfidence: number;
    };
  };
}

export function ProjectStatusCard({ project }: ProjectStatusCardProps) {
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{project.name}</CardTitle>
            <div className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Jobs (24h)</p>
              <p className="font-medium">
                {project.metrics.jobsCompleted24h}
                {project.metrics.jobsFailed24h > 0 && (
                  <span className="text-red-500 ml-1">
                    ({project.metrics.jobsFailed24h} failed)
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Active Chats</p>
              <p className="font-medium">{project.metrics.activeChats}</p>
            </div>
            <div>
              <p className="text-muted-foreground">HITL Pending</p>
              <p className="font-medium">
                {project.metrics.pendingHITL > 0 ? (
                  <Badge variant="destructive">{project.metrics.pendingHITL}</Badge>
                ) : (
                  '0'
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">RAG Confidence</p>
              <p className="font-medium">
                {Math.round(project.metrics.avgConfidence * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up Chatwoot API client and types
- [ ] Create ActionCable WebSocket integration
- [ ] Implement basic chat UI components
- [ ] Create database schema for RAG metadata

### Phase 2: Core Chat Features (Weeks 3-4)
- [ ] Build contact list with real-time presence
- [ ] Implement conversation thread view
- [ ] Add message sending with optimistic updates
- [ ] Create typing indicators

### Phase 3: RAG Integration (Weeks 5-6)
- [ ] Build webhook handler for RAG processing
- [ ] Implement RAG metadata storage
- [ ] Create source citation components
- [ ] Add confidence indicators to messages

### Phase 4: Insights Panel (Weeks 7-8)
- [ ] Build RAG insights sidebar
- [ ] Implement conversation analytics
- [ ] Add sentiment analysis display
- [ ] Create escalation actions

### Phase 5: Command Center Integration (Weeks 9-10)
- [ ] Update Command Center with project cards
- [ ] Add chat metrics to project overview
- [ ] Implement cross-project analytics
- [ ] Create global HITL queue

---

## 10. Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Approach | Custom React (not iframe) | Full control over UX, RAG metadata display |
| Real-time | ActionCable + React Query | Chatwoot native + familiar patterns |
| State Management | React Query + Zustand | Server state + local UI state separation |
| RAG Metadata | Separate tables | Don't pollute Chatwoot's data model |
| Chat Scope | Per-project tab | Logical separation, focused context |
| Command Center | System-wide | Global oversight, drill-down to projects |

---

## 11. References

- Chatwoot API Documentation: https://www.chatwoot.com/developers/api/
- Chatwoot WebSocket Events: https://www.chatwoot.com/docs/product/others/websocket-events
- ActionCable Client: https://github.com/rails/actioncable
- React Query: https://tanstack.com/query/latest
- shadcn/ui Components: https://ui.shadcn.com/

---

## 12. Validation Notes (2026-01-21)

**This document was validated against Chatwoot's actual codebase via deepwiki and context7.**

### Corrections Applied

| Issue | Original | Corrected | Impact |
|-------|----------|-----------|--------|
| ConversationChannel | Listed as available channel | **Removed** - Only `RoomChannel` exists | Critical - code would fail |
| RAG metadata field | `content_attributes` | `additional_attributes` | Critical - conflicts with predefined schema |
| React Query v5 | `isLoading` | `isPending` | Moderate - deprecation warnings |
| sendMessage API | `customAttributes` → `content_attributes` | `additionalAttributes` → `additional_attributes` | Critical - wrong field |

### Key Validated Facts

1. **ActionCable**: Only `RoomChannel` exists. All conversation events flow through it, filtered client-side.
2. **@rails/actioncable**: Confirmed as correct npm package for ActionCable client.
3. **pubsub_token**: Correctly used for WebSocket authentication.
4. **additional_attributes**: JSONB field designed for custom metadata (RAG sources, confidence, etc.).
5. **content_attributes**: Reserved for content-type-specific data with predefined accessors.

### Architecture Validation Status

- ✅ Headless Chatwoot approach validated
- ✅ API client patterns validated
- ✅ WebSocket subscription patterns validated (with RoomChannel correction)
- ✅ React Query integration patterns validated (with v5 API updates)
- ✅ RAG metadata storage approach validated (with field correction)
