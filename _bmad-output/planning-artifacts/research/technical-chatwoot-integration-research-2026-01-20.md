# Chatwoot Integration Research for Hyyve Platform

**Research Date:** 2026-01-20
**Purpose:** Technical deep-dive for integrating Chatwoot as a contact center solution with RAG-powered chatbots, human escalation, and multi-tenant support.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Chatwoot Architecture Overview](#2-chatwoot-architecture-overview)
3. [API Deep Dive](#3-api-deep-dive)
4. [Webhook Integration](#4-webhook-integration)
5. [Captain AI and Automation](#5-captain-ai-and-automation)
6. [Custom Bot Integration Patterns](#6-custom-bot-integration-patterns)
7. [Knowledge Base / Help Center](#7-knowledge-base--help-center)
8. [Multi-Tenant Implementation](#8-multi-tenant-implementation)
9. [Widget Embedding](#9-widget-embedding)
10. [Deployment Options](#10-deployment-options)
11. [Integration Architecture for Hyyve](#11-integration-architecture-for-hyyve)
12. [Implementation Recommendations](#12-implementation-recommendations)
13. [Appendix: API Reference](#13-appendix-api-reference)

---

## 1. Executive Summary

Chatwoot is an open-source customer engagement platform that provides an excellent foundation for building a RAG-powered contact center. Key findings:

### Strengths for RAG Integration
- **Webhook-based bot architecture**: Perfect for connecting external RAG systems
- **Agent Bot API**: First-class support for custom AI bots with handoff capabilities
- **Multi-tenant by design**: Account-per-tenant model with complete data isolation
- **Help Center with API**: Article management and search APIs for RAG enhancement
- **Real-time WebSocket support**: ActionCable for live updates
- **Self-hosted option**: Full control over data and customization

### Integration Approach
The recommended integration pattern uses **Agent Bots with webhook callbacks**:
1. Customer sends message via Chatwoot widget
2. Chatwoot forwards to your RAG platform via webhook
3. RAG platform processes query against knowledge base
4. Response sent back via Chatwoot API
5. Handoff to human agent when needed

### Key Considerations
- Chatwoot's Captain AI (enterprise) provides built-in AI, but **Agent Bots are better for custom RAG**
- Multi-tenancy maps naturally: one Chatwoot Account per tenant, one Inbox per project
- Help Center articles can feed into RAG knowledge base via API sync

---

## 2. Chatwoot Architecture Overview

### 2.1 Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Ruby on Rails 7.x |
| Frontend | Vue.js 3 |
| Database | PostgreSQL 16+ with pgvector |
| Cache/Queue | Redis 7+ |
| Real-time | ActionCable (WebSocket) |
| Background Jobs | Sidekiq |
| File Storage | ActiveStorage (S3/Azure/GCS/Local) |

### 2.2 Core Components

```
                                    +------------------+
                                    |   Load Balancer  |
                                    +--------+---------+
                                             |
                    +------------------------+------------------------+
                    |                        |                        |
           +--------v--------+     +---------v--------+     +---------v--------+
           |   Rails Web     |     |   Rails Web      |     |   Rails Web      |
           |   (Puma)        |     |   (Puma)         |     |   (Puma)         |
           +--------+--------+     +---------+--------+     +---------+--------+
                    |                        |                        |
                    +------------------------+------------------------+
                                             |
           +----------------+----------------+----------------+
           |                |                |                |
   +-------v-------+ +------v------+ +-------v-------+ +------v------+
   |  PostgreSQL   | |    Redis    | |   Sidekiq     | |  Storage    |
   |  (pgvector)   | |   Cache/Q   | |   Workers     | |  (S3/etc)   |
   +---------------+ +-------------+ +---------------+ +-------------+
```

### 2.3 Data Model Overview

```
Account (Tenant)
    |
    +-- Users (Agents/Admins)
    |
    +-- Inboxes (Channels)
    |       |
    |       +-- Channel (WebWidget/Email/WhatsApp/API/etc.)
    |       |
    |       +-- Agent Assignments (InboxMembers)
    |       |
    |       +-- Agent Bot Assignment
    |
    +-- Contacts (Customers)
    |       |
    |       +-- Contact Inboxes (per-channel identity)
    |
    +-- Conversations
    |       |
    |       +-- Messages
    |       |
    |       +-- Labels
    |       |
    |       +-- Assignee (Agent or Bot)
    |
    +-- Help Center Portals
            |
            +-- Categories
            |
            +-- Articles
```

### 2.4 Database Schema (Key Tables)

#### Accounts Table
```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    domain VARCHAR(100),
    support_email VARCHAR(100),
    feature_flags BIGINT,              -- Bitmask for features
    settings JSONB,                    -- auto_resolve, etc.
    custom_attributes JSONB,
    locale INTEGER DEFAULT 0,
    status INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Conversations Table
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    inbox_id INTEGER NOT NULL REFERENCES inboxes(id),
    contact_id BIGINT NOT NULL REFERENCES contacts(id),
    assignee_id INTEGER REFERENCES users(id),
    assignee_agent_bot_id BIGINT REFERENCES agent_bots(id),
    team_id BIGINT REFERENCES teams(id),
    status INTEGER DEFAULT 0,          -- open(0), resolved(1), pending(2), snoozed(3)
    priority INTEGER,                  -- low(0), medium(1), high(2), urgent(3)
    display_id INTEGER NOT NULL,       -- Human-readable ID per account
    uuid UUID NOT NULL UNIQUE,
    waiting_since TIMESTAMP,
    first_reply_created_at TIMESTAMP,
    last_activity_at TIMESTAMP NOT NULL,
    custom_attributes JSONB,
    additional_attributes JSONB,
    cached_label_list TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(account_id, display_id)
);
```

#### Messages Table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    inbox_id INTEGER NOT NULL REFERENCES inboxes(id),
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    sender_type VARCHAR,               -- 'Contact', 'User', 'AgentBot'
    sender_id BIGINT,
    message_type INTEGER NOT NULL,     -- incoming(0), outgoing(1), activity(2), template(3)
    content_type INTEGER DEFAULT 0,    -- text(0), cards(5), form(6), article(7), etc.
    content TEXT,                      -- Max 150,000 chars
    content_attributes JSON,
    additional_attributes JSONB,
    status INTEGER DEFAULT 0,          -- sent(0), delivered(1), read(2), failed(3)
    source_id TEXT,                    -- Channel-specific message ID
    private BOOLEAN DEFAULT FALSE,     -- Internal note
    sentiment JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Contacts Table
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    name VARCHAR DEFAULT '',
    email VARCHAR,
    phone_number VARCHAR,              -- E.164 format
    identifier VARCHAR,                -- Custom identifier
    contact_type INTEGER DEFAULT 0,    -- visitor(0), lead(1), customer(2)
    blocked BOOLEAN DEFAULT FALSE,
    custom_attributes JSONB,
    additional_attributes JSONB,
    last_activity_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(email, account_id),
    UNIQUE(identifier, account_id)
);
```

### 2.5 Real-Time Communication (ActionCable)

Chatwoot uses Rails ActionCable for WebSocket-based real-time updates:

```javascript
// Frontend subscription
const cable = createConsumer();
cable.subscriptions.create({
    channel: 'RoomChannel',
    pubsub_token: userPubsubToken,
    account_id: accountId,
    user_id: userId
}, {
    received(data) {
        // Handle events: message.created, conversation.status_changed, etc.
    }
});
```

**Event Flow:**
1. Domain event occurs (e.g., message created)
2. `ActionCableListener` determines recipient tokens
3. `ActionCableBroadcastJob` broadcasts to subscribers
4. Frontend handlers update Vuex store
5. UI reactively updates

**Supported Events (ActionCable WebSocket):**
> **Note:** ActionCable events use dot notation internally (`message.created`).
> Webhook subscriptions use snake_case (`message_created`).

- `message.created`, `message.updated`
- `conversation.status_changed`, `conversation.typing_on/off`
- `presence.update`
- `contact.created`, `contact.updated`
- And 17+ more event types

---

## 3. API Deep Dive

### 3.1 API Types Overview

| API Type | Base Path | Authentication | Purpose |
|----------|-----------|----------------|---------|
| **Application API** | `/api/v1/accounts/{id}/*` | User API Key | Account management, conversations, messages |
| **Platform API** | `/platform/api/v1/*` | Platform App Token | Super admin: create accounts, users, bots |
| **Client API** | `/public/api/v1/*` | Website Token | Widget SDK operations (public-facing) |
| **Agent Bot API** | Webhooks + API | Bot Access Token | Custom bot responses |

> **VALIDATED:** Client API uses `/public/api/v1/*` NOT `/api/v1/widget/*`

### 3.2 Authentication Methods

#### User API Key
```bash
# Obtained from User Profile > Access Token
curl -X GET "https://chatwoot.example.com/api/v1/accounts/1/conversations" \
  -H "api_access_token: YOUR_USER_API_KEY"
```

#### Platform App Token
```bash
# Created by system admin for platform apps
curl -X POST "https://chatwoot.example.com/platform/api/v1/accounts" \
  -H "api_access_token: YOUR_PLATFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Tenant Account"}'
```

#### Agent Bot Token
```bash
# Returned when creating agent bot
curl -X POST "https://chatwoot.example.com/api/v1/accounts/1/conversations/123/messages" \
  -H "api_access_token: BOT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from bot!", "message_type": "outgoing"}'
```

### 3.3 Key API Endpoints

#### Create Account (Platform API)
```http
POST /platform/api/v1/accounts
Authorization: api_access_token YOUR_PLATFORM_TOKEN
Content-Type: application/json

{
    "name": "Acme Corp Workspace"
}
```

**Response:**
```json
{
    "id": 42,
    "name": "Acme Corp Workspace",
    "locale": "en",
    "domain": null,
    "support_email": null,
    "feature_flags": [],
    "custom_attributes": {},
    "status": "active"
}
```

#### Create Inbox
```http
POST /api/v1/accounts/{account_id}/inboxes
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "name": "Project Alpha Support",
    "channel": {
        "type": "web_widget",
        "website_url": "https://alpha.example.com",
        "welcome_title": "Welcome to Alpha Support",
        "welcome_tagline": "Ask us anything!",
        "widget_color": "#1f93ff"
    },
    "greeting_enabled": true,
    "greeting_message": "Hi there! How can we help you today?",
    "enable_auto_assignment": true
}
```

**Response:**
```json
{
    "id": 15,
    "name": "Project Alpha Support",
    "channel_type": "Channel::WebWidget",
    "avatar_url": null,
    "widget_color": "#1f93ff",
    "website_token": "abc123xyz",
    "greeting_enabled": true,
    "greeting_message": "Hi there! How can we help you today?",
    "enable_auto_assignment": true,
    "working_hours_enabled": false,
    "timezone": "UTC"
}
```

#### List Conversations
```http
GET /api/v1/accounts/{account_id}/conversations?status=open&inbox_id=15&page=1
Authorization: api_access_token YOUR_API_KEY
```

**Response:**
```json
{
    "data": {
        "meta": {
            "mine_count": 5,
            "unassigned_count": 12,
            "all_count": 45
        },
        "payload": [
            {
                "id": 1234,
                "uuid": "550e8400-e29b-41d4-a716-446655440000",
                "account_id": 1,
                "inbox_id": 15,
                "status": "open",
                "priority": "medium",
                "contact": {
                    "id": 789,
                    "name": "John Doe",
                    "email": "john@example.com"
                },
                "messages": [...],
                "last_activity_at": "2026-01-20T10:30:00Z"
            }
        ]
    }
}
```

#### Create Message
```http
POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "content": "Thanks for reaching out! Based on our knowledge base, here's what I found...",
    "message_type": "outgoing",
    "private": false,
    "content_attributes": {
        "rag_sources": ["doc-123", "doc-456"]
    }
}
```

**Response:**
```json
{
    "id": 5678,
    "content": "Thanks for reaching out! Based on our knowledge base...",
    "message_type": "outgoing",
    "content_type": "text",
    "status": "sent",
    "sender": {
        "id": 42,
        "type": "AgentBot",
        "name": "RAG Assistant"
    },
    "conversation_id": 1234,
    "created_at": "2026-01-20T10:31:00Z"
}
```

#### Toggle Conversation Status
```http
POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/toggle_status
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "status": "resolved"
}
```

### 3.4 Rate Limits

Chatwoot implements rate limiting via Rack::Attack:

| Endpoint Type | Limit | Window | Notes |
|---------------|-------|--------|-------|
| **Global API requests** | **3000** | per minute per IP | Configurable via `RACK_ATTACK_LIMIT` |
| Login attempts | 5 | per 5 minutes per IP | Additional 10/15min per email |
| Sign up | 5 | per 30 minutes | Account creation endpoint |
| Contact search | 100 | per minute | Configurable via `RATE_LIMIT_CONTACT_SEARCH` |
| Conversation transcript | 30 | per hour | Specific endpoint limit |
| Attachment uploads | 60 | per hour | File upload endpoints |

> **VALIDATED:** Default global limit is **3000/min** not 300/min. The 300 value was a commented example in env files.

**Best Practices:**
- Implement exponential backoff on 429 responses
- Cache frequently accessed data
- Batch operations where possible
- Use webhooks instead of polling

---

## 4. Webhook Integration

### 4.1 Webhook Events

| Event | Trigger | Use Case |
|-------|---------|----------|
| `conversation_created` | New conversation starts | Initialize RAG context |
| `conversation_status_changed` | Status changes | Track resolution |
| `conversation_updated` | Conversation modified | Sync changes |
| `message_created` | New message | **Primary RAG trigger** |
| `message_updated` | Message edited | Update context |
| `contact_created` | New contact | CRM sync |
| `contact_updated` | Contact modified | CRM sync |
| `webwidget_triggered` | Widget interaction | Analytics |

### 4.2 Webhook Configuration

**Via API:**
```http
POST /api/v1/accounts/{account_id}/webhooks
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "url": "https://your-rag-platform.com/webhooks/chatwoot",
    "subscriptions": [
        "conversation_created",
        "message_created",
        "conversation_status_changed"
    ]
}
```

**Response:**
```json
{
    "id": 99,
    "url": "https://your-rag-platform.com/webhooks/chatwoot",
    "subscriptions": [
        "conversation_created",
        "message_created",
        "conversation_status_changed"
    ],
    "account_id": 1
}
```

### 4.3 Webhook Payload Structures

#### message_created Event
```json
{
    "event": "message_created",
    "id": 5678,
    "content": "How do I reset my password?",
    "created_at": "2026-01-20T10:30:00Z",
    "message_type": "incoming",
    "content_type": "text",
    "private": false,
    "source_id": null,
    "content_attributes": {},
    "sender": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": null,
        "type": "contact"
    },
    "contact": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": null
    },
    "conversation": {
        "id": 1234,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "display_id": 42,
        "status": "open",
        "priority": null,
        "assignee_id": null,
        "team_id": null,
        "custom_attributes": {},
        "additional_attributes": {}
    },
    "inbox": {
        "id": 15,
        "name": "Project Alpha Support"
    },
    "account": {
        "id": 1,
        "name": "Acme Corp"
    }
}
```

#### conversation_created Event
```json
{
    "event": "conversation_created",
    "id": 1234,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "display_id": 42,
    "account_id": 1,
    "inbox_id": 15,
    "status": "open",
    "priority": null,
    "contact": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "inbox": {
        "id": 15,
        "name": "Project Alpha Support"
    },
    "additional_attributes": {},
    "custom_attributes": {},
    "created_at": "2026-01-20T10:29:00Z"
}
```

#### conversation_status_changed Event
```json
{
    "event": "conversation_status_changed",
    "id": 1234,
    "account_id": 1,
    "status": "resolved",
    "changed_attributes": {
        "status": {
            "previous_value": "open",
            "current_value": "resolved"
        }
    },
    "conversation": {
        "id": 1234,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "display_id": 42,
        "status": "resolved"
    }
}
```

### 4.4 Webhook Security

**Recommendation:** Implement signature verification:

```python
import hmac
import hashlib

def verify_chatwoot_webhook(payload: bytes, signature: str, secret: str) -> bool:
    """Verify webhook signature (if configured)."""
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

**Additional Security:**
- Use HTTPS endpoints only
- Whitelist Chatwoot server IPs
- Validate payload structure
- Implement idempotency checks

---

## 5. Captain AI and Automation

### 5.1 Captain AI Overview (Enterprise)

Captain AI is Chatwoot's built-in AI assistant with:
- OpenAI integration (GPT-4o-mini default)
- Vector search with embeddings
- Tool registry for extensibility
- Copilot mode for agents

**Configuration:**
```bash
CAPTAIN_OPEN_AI_API_KEY=sk-...
CAPTAIN_OPEN_AI_MODEL=gpt-4o-mini
CAPTAIN_OPEN_AI_ENDPOINT=https://api.openai.com/v1
CAPTAIN_EMBEDDING_MODEL=text-embedding-3-small
CAPTAIN_FIRECRAWL_API_KEY=...  # For web scraping
```

### 5.2 Why Agent Bots Are Better for Custom RAG

| Feature | Captain AI | Agent Bots |
|---------|------------|------------|
| Custom RAG integration | Limited | **Full control** |
| Knowledge base | Captain's KB | **Your RAG system** |
| Model choice | OpenAI only | **Any LLM** |
| Hosting | Enterprise only | **Self-hosted** |
| Handoff control | Automatic | **Programmatic** |

**Recommendation:** Use Agent Bots for custom RAG integration.

### 5.3 Automation Rules

Automation rules trigger actions based on conversation events:

```json
{
    "name": "Auto-assign to RAG Bot",
    "description": "Assign new conversations to RAG bot",
    "event_name": "conversation_created",
    "conditions": [
        {
            "attribute_key": "inbox_id",
            "filter_operator": "equal_to",
            "values": [15]
        }
    ],
    "actions": [
        {
            "action_name": "assign_agent",
            "action_params": ["bot_123"]
        }
    ],
    "active": true
}
```

**Available Events:**
- `conversation_created`
- `conversation_updated`
- `conversation_resolved`
- `message_created`

**Available Actions:**
- `send_message`
- `add_label`
- `remove_label`
- `assign_agent`
- `assign_team`
- `send_webhook_event`
- `mute_conversation`
- `change_status`
- `change_priority`

---

## 6. Custom Bot Integration Patterns

### 6.1 Agent Bot Architecture

```
+------------------+     Webhook      +--------------------+
|                  | --------------> |                    |
|    Chatwoot      |                  |   Your RAG         |
|    Server        |                  |   Platform         |
|                  | <-------------- |                    |
+------------------+     API          +--------------------+
                                             |
                                             v
                                      +--------------+
                                      |  Vector DB   |
                                      |  Knowledge   |
                                      +--------------+
```

### 6.2 Creating an Agent Bot

**Via Platform API:**
```http
POST /platform/api/v1/agent_bots
Authorization: api_access_token PLATFORM_TOKEN
Content-Type: application/json

{
    "name": "RAG Assistant",
    "description": "AI-powered support using project knowledge base",
    "outgoing_url": "https://your-rag-platform.com/webhooks/chatwoot/bot",
    "account_id": 1
}
```

**Response:**
```json
{
    "id": 123,
    "name": "RAG Assistant",
    "description": "AI-powered support using project knowledge base",
    "outgoing_url": "https://your-rag-platform.com/webhooks/chatwoot/bot",
    "bot_type": "webhook",
    "bot_config": {},
    "account_id": 1,
    "access_token": "BOT_ACCESS_TOKEN_abc123",
    "system_bot": false,
    "thumbnail": null
}
```

### 6.3 Assigning Bot to Inbox

```http
POST /api/v1/accounts/{account_id}/inboxes/{inbox_id}/set_agent_bot
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "agent_bot": 123
}
```

### 6.4 Bot Webhook Events

> **VALIDATED:** Agent Bot webhooks receive a DIFFERENT set of events than general webhooks:
> - `conversation_resolved` - When conversation is resolved
> - `conversation_opened` - When conversation is opened/reopened
> - `message_created` - New message (primary RAG trigger)
> - `message_updated` - Message edited
> - `webwidget_triggered` - Widget interactions
>
> Note: Agent Bots do NOT receive `conversation_created` or `conversation_status_changed` directly.
> Those are general webhook events, not Agent Bot events.

When enabled, the bot's `outgoing_url` receives events:

```json
{
    "event": "message_created",
    "message": {
        "id": 5678,
        "content": "How do I reset my password?",
        "message_type": "incoming",
        "conversation_id": 1234
    },
    "conversation": {
        "id": 1234,
        "status": "open",
        "contact": {
            "id": 789,
            "name": "John Doe"
        }
    },
    "account": {
        "id": 1
    }
}
```

### 6.5 Bot Response Flow

```python
# Your webhook handler
from fastapi import FastAPI, Request
import httpx

app = FastAPI()
CHATWOOT_URL = "https://chatwoot.example.com"
BOT_TOKEN = "BOT_ACCESS_TOKEN_abc123"

@app.post("/webhooks/chatwoot/bot")
async def handle_bot_webhook(request: Request):
    payload = await request.json()

    if payload.get("event") != "message_created":
        return {"status": "ignored"}

    message = payload["message"]
    conversation = payload["conversation"]
    account_id = payload["account"]["id"]

    # Skip outgoing messages (from bot itself)
    if message["message_type"] != "incoming":
        return {"status": "ignored"}

    # Query your RAG system
    rag_response = await query_rag(
        query=message["content"],
        context={
            "conversation_id": conversation["id"],
            "contact": conversation["contact"]
        }
    )

    # Check if handoff needed
    if rag_response.needs_human:
        await handoff_to_human(account_id, conversation["id"])
        return {"status": "handoff"}

    # Send bot response
    await send_bot_message(
        account_id=account_id,
        conversation_id=conversation["id"],
        content=rag_response.answer
    )

    return {"status": "responded"}

async def send_bot_message(account_id: int, conversation_id: int, content: str):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{CHATWOOT_URL}/api/v1/accounts/{account_id}/conversations/{conversation_id}/messages",
            headers={"api_access_token": BOT_TOKEN},
            json={
                "content": content,
                "message_type": "outgoing"
            }
        )

async def handoff_to_human(account_id: int, conversation_id: int):
    """Trigger bot handoff - opens conversation for human agents."""
    async with httpx.AsyncClient() as client:
        # Send handoff message
        await client.post(
            f"{CHATWOOT_URL}/api/v1/accounts/{account_id}/conversations/{conversation_id}/messages",
            headers={"api_access_token": BOT_TOKEN},
            json={
                "content": "I'll connect you with a human agent who can better assist you.",
                "message_type": "outgoing"
            }
        )
        # Toggle status to open (triggers handoff)
        await client.post(
            f"{CHATWOOT_URL}/api/v1/accounts/{account_id}/conversations/{conversation_id}/toggle_status",
            headers={"api_access_token": BOT_TOKEN},
            json={"status": "open"}
        )
```

### 6.6 Human Handoff Patterns

**Pattern 1: Explicit Handoff Action**
Bot sends response with `action: 'handoff'` in content_attributes:
```python
{
    "content": "Connecting you with a human agent...",
    "content_attributes": {
        "action": "handoff"
    }
}
```

**Pattern 2: Status Toggle**
Change conversation status to `open` and unassign bot:
```python
# Change status
POST /api/v1/accounts/{id}/conversations/{id}/toggle_status
{"status": "open"}

# Unassign bot (optional)
POST /api/v1/accounts/{id}/conversations/{id}/assignments
{"assignee_id": null}
```

**Pattern 3: Confidence-Based Handoff**
```python
if rag_response.confidence < 0.7:
    await handoff_to_human(account_id, conversation_id)
elif "speak to human" in message.lower():
    await handoff_to_human(account_id, conversation_id)
```

---

## 7. Knowledge Base / Help Center

### 7.1 Portal Configuration

Create a Help Center portal:
```http
POST /api/v1/accounts/{account_id}/portals
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "name": "Project Alpha Help Center",
    "slug": "alpha-help",
    "custom_domain": "help.alpha.example.com",
    "color": "#1f93ff",
    "header_text": "How can we help?",
    "homepage_link": "https://alpha.example.com",
    "page_title": "Alpha Support"
}
```

### 7.2 Article Management API

#### Create Category
```http
POST /api/v1/accounts/{account_id}/portals/{portal_slug}/categories
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "name": "Getting Started",
    "slug": "getting-started",
    "description": "Onboarding guides and tutorials",
    "locale": "en",
    "position": 1
}
```

#### Create Article
```http
POST /api/v1/accounts/{account_id}/portals/{portal_slug}/articles
Authorization: api_access_token YOUR_API_KEY
Content-Type: application/json

{
    "title": "How to Reset Your Password",
    "slug": "reset-password",
    "content": "# Reset Your Password\n\n1. Go to the login page...",
    "description": "Step-by-step guide to reset your account password",
    "category_id": 1,
    "locale": "en",
    "status": "published",
    "meta": {
        "title": "Reset Password | Alpha Help",
        "description": "Learn how to reset your password"
    }
}
```

#### Search Articles
```http
GET /api/v1/accounts/{account_id}/portals/{portal_slug}/articles?query=password&status=published
Authorization: api_access_token YOUR_API_KEY
```

### 7.3 RAG Integration with Help Center

**Sync Strategy:**
```python
async def sync_help_center_to_rag():
    """Sync Chatwoot articles to RAG knowledge base."""

    # Fetch all published articles
    articles = await fetch_chatwoot_articles(
        portal_slug="alpha-help",
        status="published"
    )

    for article in articles:
        # Prepare document for RAG
        document = {
            "id": f"chatwoot-article-{article['id']}",
            "title": article["title"],
            "content": article["content"],
            "metadata": {
                "source": "chatwoot_help_center",
                "portal": article["portal_slug"],
                "category": article["category"]["name"],
                "url": f"https://help.example.com/{article['slug']}",
                "updated_at": article["updated_at"]
            }
        }

        # Upsert to vector database
        await vector_db.upsert(document)

# Schedule periodic sync
# Or use webhooks if available for article changes
```

### 7.4 Enterprise Vector Search

Chatwoot Enterprise includes vector search:
```ruby
# Internal method (for reference)
def vector_search(query, portal)
  embedding = Captain::Llm::EmbeddingService.new.get_embedding(query)

  Article
    .where(portal: portal, status: :published)
    .nearest_neighbors(:embedding, embedding, distance: :cosine)
    .limit(5)
end
```

**For Custom RAG:** Use the Articles API to sync content to your own vector database.

---

## 8. Multi-Tenant Implementation

### 8.1 Tenant Model Options

| Model | Structure | Best For |
|-------|-----------|----------|
| **Account per Tenant** | 1 Chatwoot Account = 1 Customer | Isolated tenants |
| **Inbox per Project** | 1 Inbox = 1 Project within Account | Project-based isolation |
| **Combined** | Account per Customer, Inbox per Project | **Recommended** |

### 8.2 Recommended Architecture

```
Your Platform (Multi-tenant)
    |
    +-- Customer A (Tenant)
    |       |
    |       +-- Chatwoot Account A
    |               |
    |               +-- Inbox: Project Alpha
    |               +-- Inbox: Project Beta
    |               +-- Help Center Portal A
    |
    +-- Customer B (Tenant)
            |
            +-- Chatwoot Account B
                    |
                    +-- Inbox: Project Gamma
                    +-- Help Center Portal B
```

### 8.3 Provisioning Workflow

> **VALIDATED:** Tenant provisioning requires BOTH APIs:
> - **Platform API** (`/platform/api/v1/*`): Create accounts, users, agent bots
> - **Application API** (`/api/v1/accounts/{id}/*`): Create inboxes, portals, webhooks
>
> Inbox creation is NOT available in Platform API - use Application API with account admin token.

```python
async def provision_tenant(tenant_name: str, projects: list[str]):
    """Provision Chatwoot resources for new tenant."""

    # 1. Create Chatwoot Account (Platform API)
    account = await chatwoot_platform_api.create_account(
        name=f"{tenant_name} Workspace"
    )

    # 2. Create admin user
    admin = await chatwoot_platform_api.create_user(
        account_id=account["id"],
        email=f"admin@{tenant_name}.com",
        role="administrator"
    )

    # 3. Create RAG bot for account
    bot = await chatwoot_platform_api.create_agent_bot(
        name=f"{tenant_name} RAG Assistant",
        account_id=account["id"],
        outgoing_url=f"https://your-platform.com/webhooks/chatwoot/{account['id']}"
    )

    # 4. Create inbox per project (Application API - NOT Platform API!)
    inboxes = []
    for project in projects:
        inbox = await chatwoot_application_api.create_inbox(  # Use Application API
            account_id=account["id"],
            name=f"{project} Support",
            channel={
                "type": "web_widget",
                "website_url": f"https://{project}.{tenant_name}.com"
            }
        )

        # Assign bot to inbox
        await chatwoot_api.set_inbox_agent_bot(
            account_id=account["id"],
            inbox_id=inbox["id"],
            agent_bot_id=bot["id"]
        )

        inboxes.append(inbox)

    # 5. Create Help Center portal
    portal = await chatwoot_api.create_portal(
        account_id=account["id"],
        name=f"{tenant_name} Help Center",
        slug=tenant_name.lower().replace(" ", "-")
    )

    return {
        "account": account,
        "admin": admin,
        "bot": bot,
        "inboxes": inboxes,
        "portal": portal
    }
```

### 8.4 Data Isolation

Chatwoot enforces isolation at multiple levels:

1. **Database**: All queries scoped by `account_id`
2. **API Routes**: `/api/v1/accounts/{id}/*` pattern
3. **Authorization**: Pundit policies check account membership
4. **WebSocket**: Separate pub/sub tokens per user/account

### 8.5 SSO Integration

**SAML SSO (Enterprise):**
Each account can configure its own IdP:

```ruby
# Account SAML Settings
{
  sso_url: "https://idp.tenant.com/sso",
  certificate: "-----BEGIN CERTIFICATE-----...",
  sp_entity_id: "chatwoot-tenant-a",
  idp_entity_id: "https://idp.tenant.com",
  role_mappings: {
    "admin_group" => "administrator",
    "support_group" => "agent"
  }
}
```

**OAuth (Google):**
```bash
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_CALLBACK_URL=https://chatwoot.example.com/omniauth/google_oauth2/callback
```

---

## 9. Widget Embedding

### 9.1 Basic JavaScript Integration

```html
<script>
  (function(d,t) {
    var BASE_URL = "https://chatwoot.example.com";
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL + "/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function() {
      window.chatwootSDK.run({
        websiteToken: 'YOUR_WEBSITE_TOKEN',
        baseUrl: BASE_URL
      });
    }
  })(document, "script");
</script>
```

### 9.2 Configuration Options

```javascript
window.chatwootSettings = {
    // Display options
    hideMessageBubble: false,
    position: 'right',           // 'left' or 'right'
    type: 'standard',            // 'standard' or 'expanded_bubble'
    launcherTitle: 'Chat with us',
    showPopoutButton: true,
    showUnreadMessagesDialog: true,

    // Features
    enableFileUpload: true,
    enableEmojiPicker: true,
    enableEndConversation: true,

    // Appearance
    darkMode: 'auto',            // 'light', 'dark', or 'auto'

    // Welcome messages
    welcomeTitle: 'Welcome!',
    welcomeDescription: 'How can we help you today?',
    availableMessage: 'We typically reply within minutes',
    unavailableMessage: 'We are currently offline'
};
```

### 9.3 User Identification

```javascript
// Identify logged-in user
window.$chatwoot.setUser('user-unique-id', {
    email: 'john@example.com',
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    phone_number: '+1234567890'
});

// Set custom attributes
window.$chatwoot.setCustomAttributes({
    plan: 'enterprise',
    company: 'Acme Corp',
    signup_date: '2026-01-15'
});

// Set conversation attributes
window.$chatwoot.setConversationCustomAttributes({
    project_id: 'alpha-123',
    priority: 'high'
});
```

### 9.4 Pre-Chat Forms

Configure via inbox settings:
```json
{
    "pre_chat_form_enabled": true,
    "pre_chat_form_options": {
        "pre_chat_message": "Please fill out the form to start chatting",
        "pre_chat_fields": [
            {
                "name": "emailAddress",
                "type": "email",
                "label": "Email",
                "required": true,
                "enabled": true
            },
            {
                "name": "fullName",
                "type": "text",
                "label": "Full Name",
                "required": true,
                "enabled": true
            },
            {
                "name": "phoneNumber",
                "type": "phone",
                "label": "Phone",
                "required": false,
                "enabled": true
            }
        ]
    }
}
```

### 9.5 SDK Methods

```javascript
// Toggle widget
window.$chatwoot.toggle('open');    // 'open' or 'close'
window.$chatwoot.toggle();          // Toggle

// Toggle bubble visibility
window.$chatwoot.toggleBubbleVisibility('show');  // 'show' or 'hide'

// Pop out to new window
window.$chatwoot.popoutChatWindow();

// Labels
window.$chatwoot.setLabel('vip-customer');
window.$chatwoot.removeLabel('vip-customer');

// Locale
window.$chatwoot.setLocale('es');

// Theme
window.$chatwoot.setColorScheme('dark');  // 'light' or 'dark'

// Reset (clear session)
window.$chatwoot.reset();
```

### 9.6 React Integration

Chatwoot doesn't provide official React components, but you can create a wrapper:

```tsx
// ChatwootWidget.tsx
import { useEffect } from 'react';

interface ChatwootSettings {
  hideMessageBubble?: boolean;
  position?: 'left' | 'right';
  type?: 'standard' | 'expanded_bubble';
  launcherTitle?: string;
}

interface ChatwootUser {
  email?: string;
  name?: string;
  avatar_url?: string;
}

interface ChatwootWidgetProps {
  websiteToken: string;
  baseUrl: string;
  settings?: ChatwootSettings;
  user?: ChatwootUser;
  userIdentifier?: string;
}

declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    chatwootSettings: ChatwootSettings;
    $chatwoot: {
      setUser: (identifier: string, user: ChatwootUser) => void;
      toggle: (state?: 'open' | 'close') => void;
      reset: () => void;
    };
  }
}

export function ChatwootWidget({
  websiteToken,
  baseUrl,
  settings,
  user,
  userIdentifier
}: ChatwootWidgetProps) {
  useEffect(() => {
    // Set settings before loading SDK
    if (settings) {
      window.chatwootSettings = settings;
    }

    // Load SDK
    const script = document.createElement('script');
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;

    script.onload = () => {
      window.chatwootSDK.run({ websiteToken, baseUrl });

      // Identify user after SDK loads
      if (user && userIdentifier) {
        // Wait for widget to initialize
        const interval = setInterval(() => {
          if (window.$chatwoot) {
            window.$chatwoot.setUser(userIdentifier, user);
            clearInterval(interval);
          }
        }, 100);
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
      window.$chatwoot?.reset();
    };
  }, [websiteToken, baseUrl]);

  return null; // Widget renders via SDK
}

// Usage
<ChatwootWidget
  websiteToken="abc123"
  baseUrl="https://chatwoot.example.com"
  settings={{
    position: 'right',
    launcherTitle: 'Need help?'
  }}
  user={{
    email: 'user@example.com',
    name: 'Jane Doe'
  }}
  userIdentifier="user-123"
/>
```

---

## 10. Deployment Options

### 10.1 Deployment Comparison

| Option | Complexity | Control | Scalability | Cost |
|--------|------------|---------|-------------|------|
| **Chatwoot Cloud** | Low | Low | Managed | Subscription |
| **Docker Compose** | Medium | High | Manual | Infrastructure |
| **Kubernetes** | High | High | Auto-scale | Infrastructure |
| **Managed Cloud** | Low | Medium | Managed | Higher |

### 10.2 Docker Compose (Recommended for Start)

**docker-compose.production.yaml:**
```yaml
version: '3.8'

services:
  rails:
    image: chatwoot/chatwoot:latest
    depends_on:
      - postgres
      - redis
    ports:
      - '127.0.0.1:3000:3000'
    env_file: .env
    environment:
      - RAILS_ENV=production
      - RAILS_LOG_TO_STDOUT=true
    command: bundle exec rails s -b 0.0.0.0 -p 3000

  sidekiq:
    image: chatwoot/chatwoot:latest
    depends_on:
      - postgres
      - redis
    env_file: .env
    environment:
      - RAILS_ENV=production
    command: bundle exec sidekiq

  postgres:
    image: pgvector/pgvector:pg16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=chatwoot_production
      - POSTGRES_USER=chatwoot
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - '127.0.0.1:5432:5432'

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    ports:
      - '127.0.0.1:6379:6379'

volumes:
  postgres_data:
  redis_data:
```

### 10.3 Essential Environment Variables

```bash
# .env file

# Core Configuration
SECRET_KEY_BASE=your_64_char_secret_key_here
FRONTEND_URL=https://chatwoot.example.com
RAILS_ENV=production

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DATABASE=chatwoot_production
POSTGRES_USERNAME=chatwoot
POSTGRES_PASSWORD=secure_password_here

# Redis
REDIS_URL=redis://redis:6379

# Email
MAILER_SENDER_EMAIL=support@example.com
SMTP_ADDRESS=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_AUTHENTICATION=plain
SMTP_TLS=true

# Storage (S3 example)
ACTIVE_STORAGE_SERVICE=amazon
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=chatwoot-uploads

# Features
ENABLE_ACCOUNT_SIGNUP=false
DEFAULT_LOCALE=en

# MFA (Required for 2FA)
ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY=32_char_key_here
ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY=32_char_key_here
ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT=32_char_key_here
```

### 10.4 Nginx Reverse Proxy

```nginx
upstream chatwoot {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name chatwoot.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chatwoot.example.com;

    ssl_certificate /etc/letsencrypt/live/chatwoot.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chatwoot.example.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://chatwoot;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 86400;
    }
}
```

### 10.5 Resource Requirements

| Deployment Size | Users | RAM | CPU | Storage |
|-----------------|-------|-----|-----|---------|
| Small | < 5 agents | 4 GB | 2 cores | 20 GB |
| Medium | 5-20 agents | 8 GB | 4 cores | 50 GB |
| Large | 20+ agents | 16+ GB | 8+ cores | 100+ GB |

### 10.6 Scaling Considerations

**Horizontal Scaling:**
```yaml
# Scale web servers
rails:
  deploy:
    replicas: 3

# Scale workers
sidekiq:
  deploy:
    replicas: 2
```

**High Availability:**
- PostgreSQL: Primary + Read replicas or managed service (RDS, Cloud SQL)
- Redis: Redis Sentinel or Redis Cluster
- Load Balancer: nginx, HAProxy, or cloud LB
- Storage: S3/GCS with CDN

**Redis Sentinel Configuration:**
```bash
REDIS_SENTINELS=sentinel1:26379,sentinel2:26379,sentinel3:26379
REDIS_SENTINEL_MASTER_NAME=mymaster
REDIS_SENTINEL_PASSWORD=sentinel_password
```

---

## 11. Integration Architecture for Hyyve

### 11.1 Complete Architecture Diagram

```
                                   Your Hyyve Platform
+------------------+              +--------------------------------------------------+
|                  |              |                                                  |
|  Customer        |    Widget    |  +------------+     +------------------------+  |
|  Browser         | -----------> |  | Chatwoot   |     |  RAG Service           |  |
|                  |              |  | Server     |     |                        |  |
+------------------+              |  |            |     |  +------------------+  |  |
                                  |  | - Accounts |     |  | Query Router     |  |  |
                                  |  | - Inboxes  |     |  +--------+---------+  |  |
                                  |  | - Convos   |     |           |            |  |
+------------------+              |  | - Messages |     |  +--------v---------+  |  |
|                  |              |  +-----+------+     |  | Vector Search    |  |  |
|  Agent           |   Dashboard  |        |           |  | (per project KB) |  |  |
|  Browser         | <------------|        | Webhook   |  +--------+---------+  |  |
|                  |              |        |           |           |            |  |
+------------------+              |        v           |  +--------v---------+  |  |
                                  |  +------------+    |  | LLM Service      |  |  |
                                  |  | Webhook    |    |  | (Response Gen)   |  |  |
                                  |  | Handler    |--->|  +--------+---------+  |  |
                                  |  +------------+    |           |            |  |
                                  |        |           |  +--------v---------+  |  |
                                  |        |   API     |  | Confidence       |  |  |
                                  |        | <---------|  | Evaluator        |  |  |
                                  |        |           |  +--------+---------+  |  |
                                  |  +-----v------+    |           |            |  |
                                  |  | Chatwoot   |    |  +--------v---------+  |  |
                                  |  | API Client |    |  | Handoff Logic    |  |  |
                                  |  +------------+    |  +------------------+  |  |
                                  |                    +------------------------+  |
                                  |                                                |
                                  |  +--------------------------------------------+|
                                  |  |            Knowledge Management            ||
                                  |  |                                            ||
                                  |  |  +----------------+  +------------------+  ||
                                  |  |  | Help Center   |  | Document         |  ||
                                  |  |  | Article Sync  |  | Ingestion        |  ||
                                  |  |  +----------------+  +------------------+  ||
                                  |  |           |                  |             ||
                                  |  |           v                  v             ||
                                  |  |  +------------------------------------+    ||
                                  |  |  |        Vector Database             |    ||
                                  |  |  |    (per-project namespaces)        |    ||
                                  |  |  +------------------------------------+    ||
                                  |  +--------------------------------------------+|
                                  +------------------------------------------------+
```

### 11.2 Message Flow Sequence

```
Customer              Chatwoot           Your Platform          Vector DB
   |                     |                    |                     |
   |--1. Send Message--->|                    |                     |
   |                     |--2. Webhook------->|                     |
   |                     |                    |--3. Query---------->|
   |                     |                    |<--4. Results--------|
   |                     |                    |                     |
   |                     |                    |--5. Generate Response
   |                     |                    |                     |
   |                     |<--6. API: Message--|                     |
   |<--7. Display--------|                    |                     |
   |                     |                    |                     |
   |   [If confidence < threshold]            |                     |
   |                     |<--8. Handoff-------|                     |
   |                     |--9. Notify Agent-->|                     |
   |                     |                    |                     |
```

### 11.3 Multi-Tenant Data Flow

```python
# Webhook handler with multi-tenant routing
@app.post("/webhooks/chatwoot/{account_id}")
async def handle_chatwoot_webhook(account_id: int, request: Request):
    payload = await request.json()

    # 1. Identify tenant from Chatwoot account
    tenant = await get_tenant_by_chatwoot_account(account_id)

    # 2. Get project from inbox
    inbox_id = payload["inbox"]["id"]
    project = await get_project_by_inbox(tenant.id, inbox_id)

    # 3. Query RAG with project-specific namespace
    rag_response = await rag_service.query(
        query=payload["message"]["content"],
        namespace=f"tenant-{tenant.id}/project-{project.id}",
        context={
            "conversation_id": payload["conversation"]["id"],
            "contact": payload["contact"]
        }
    )

    # 4. Respond via correct account's API
    await chatwoot_client.send_message(
        account_id=account_id,
        conversation_id=payload["conversation"]["id"],
        content=rag_response.answer
    )
```

### 11.4 Knowledge Base Sync Architecture

```python
class KnowledgeBaseSyncService:
    """Sync knowledge sources to RAG vector database."""

    async def sync_chatwoot_help_center(
        self,
        tenant_id: int,
        project_id: int,
        portal_slug: str
    ):
        """Sync Chatwoot Help Center articles to RAG."""

        # Fetch articles from Chatwoot
        articles = await self.chatwoot_client.get_articles(
            account_id=self.get_chatwoot_account(tenant_id),
            portal_slug=portal_slug,
            status="published"
        )

        # Prepare documents for RAG
        documents = []
        for article in articles:
            documents.append({
                "id": f"chatwoot-article-{article['id']}",
                "content": article["content"],
                "metadata": {
                    "title": article["title"],
                    "source": "help_center",
                    "url": f"https://help.example.com/{article['slug']}",
                    "category": article["category"]["name"],
                    "updated_at": article["updated_at"]
                }
            })

        # Upsert to project namespace
        namespace = f"tenant-{tenant_id}/project-{project_id}"
        await self.vector_db.upsert(
            namespace=namespace,
            documents=documents
        )

    async def sync_external_docs(
        self,
        tenant_id: int,
        project_id: int,
        doc_source: DocumentSource
    ):
        """Sync external documentation (Notion, Confluence, etc.)."""

        # Fetch and process documents
        documents = await doc_source.fetch_documents()

        # Chunk and embed
        chunks = self.chunker.chunk_documents(documents)

        # Upsert to namespace
        namespace = f"tenant-{tenant_id}/project-{project_id}"
        await self.vector_db.upsert(
            namespace=namespace,
            documents=chunks
        )
```

---

## 12. Implementation Recommendations

### 12.1 Phase 1: Foundation (Week 1-2)

**Goals:**
- Deploy Chatwoot
- Set up basic integration
- Create proof of concept

**Tasks:**
1. Deploy Chatwoot via Docker Compose
2. Configure test account and inbox
3. Implement webhook handler
4. Basic RAG query → response flow
5. Test end-to-end message flow

**Deliverables:**
- Working Chatwoot instance
- Webhook endpoint receiving messages
- Bot sending RAG-powered responses

### 12.2 Phase 2: Multi-Tenancy (Week 3-4)

**Goals:**
- Implement tenant provisioning
- Per-project knowledge isolation
- Admin workflows

**Tasks:**
1. Platform API integration for account creation
2. Inbox creation per project
3. Agent Bot provisioning per account
4. Namespace-based vector DB isolation
5. Tenant admin dashboard integration

**Deliverables:**
- Automated tenant provisioning
- Project-specific RAG responses
- Multi-tenant webhook routing

### 12.3 Phase 3: Human Escalation (Week 5-6)

**Goals:**
- Implement handoff logic
- Agent experience
- Context preservation

**Tasks:**
1. Confidence-based handoff triggers
2. Explicit handoff commands
3. Context passing to agents
4. Agent notification system
5. Conversation history API integration

**Deliverables:**
- Smooth bot-to-human handoff
- Agents see RAG context
- No lost conversation context

### 12.4 Phase 4: Knowledge Integration (Week 7-8)

**Goals:**
- Help Center integration
- RAG-enhanced search
- Continuous sync

**Tasks:**
1. Help Center portal setup
2. Article API sync to RAG
3. Article suggestion in responses
4. Webhook-based incremental sync
5. RAG response citations

**Deliverables:**
- Synced Help Center content
- RAG responses cite sources
- Self-service article suggestions

### 12.5 Phase 5: Production Hardening (Week 9-10)

**Goals:**
- Production readiness
- Monitoring and observability
- Performance optimization

**Tasks:**
1. High availability setup
2. Monitoring dashboards
3. Error handling and retries
4. Rate limit handling
5. Security audit

**Deliverables:**
- Production deployment
- Monitoring alerts
- Documentation

### 12.6 Key Technical Decisions

| Decision | Recommendation | Rationale |
|----------|----------------|-----------|
| Bot Type | Agent Bot (webhook) | Full control over RAG integration |
| Multi-tenancy | Account per customer | Complete data isolation |
| Handoff Trigger | Confidence + explicit | Balance automation with control |
| Knowledge Sync | Scheduled + webhook | Real-time where possible |
| Deployment | Docker Compose → K8s | Start simple, scale later |

### 12.7 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Webhook latency | Async processing, quick acknowledgment |
| Rate limits | Implement backoff, request queuing |
| Bot loops | Skip outgoing messages, dedup logic |
| Data isolation | Strict namespace enforcement |
| Downtime | Queue webhooks, retry logic |

---

## 13. Appendix: API Reference

### 13.1 Quick Reference: Common Operations

#### Create Account (Platform API)
```bash
curl -X POST "https://chatwoot.example.com/platform/api/v1/accounts" \
  -H "api_access_token: PLATFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Tenant Name"}'
```

#### Create Inbox
```bash
curl -X POST "https://chatwoot.example.com/api/v1/accounts/1/inboxes" \
  -H "api_access_token: USER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Widget",
    "channel": {
      "type": "web_widget",
      "website_url": "https://example.com"
    }
  }'
```

#### Create Agent Bot
```bash
curl -X POST "https://chatwoot.example.com/platform/api/v1/agent_bots" \
  -H "api_access_token: PLATFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RAG Bot",
    "outgoing_url": "https://your-platform.com/webhooks/bot",
    "account_id": 1
  }'
```

#### Send Bot Message
```bash
curl -X POST "https://chatwoot.example.com/api/v1/accounts/1/conversations/123/messages" \
  -H "api_access_token: BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Here is the answer from our knowledge base...",
    "message_type": "outgoing"
  }'
```

#### Create Webhook
```bash
curl -X POST "https://chatwoot.example.com/api/v1/accounts/1/webhooks" \
  -H "api_access_token: USER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-platform.com/webhooks/chatwoot",
    "subscriptions": ["message_created", "conversation_created"]
  }'
```

#### Handoff to Human
```bash
# Toggle status to open
curl -X POST "https://chatwoot.example.com/api/v1/accounts/1/conversations/123/toggle_status" \
  -H "api_access_token: BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "open"}'
```

### 13.2 Webhook Event Reference

| Event | Payload Keys | Trigger |
|-------|--------------|---------|
| `conversation_created` | id, uuid, account_id, inbox_id, contact, status | New conversation |
| `conversation_status_changed` | id, status, changed_attributes | Status update |
| `conversation_updated` | id, changed_attributes, custom_attributes | Any change |
| `message_created` | id, content, message_type, sender, conversation, inbox | New message |
| `message_updated` | id, content, changed_attributes | Message edit |
| `contact_created` | id, name, email, phone_number, account_id | New contact |
| `contact_updated` | id, changed_attributes | Contact update |

### 13.3 Message Types

| Type | Value | Description |
|------|-------|-------------|
| incoming | 0 | From customer |
| outgoing | 1 | From agent/bot |
| activity | 2 | System message |
| template | 3 | WhatsApp template |

### 13.4 Conversation Statuses

| Status | Value | Description |
|--------|-------|-------------|
| open | 0 | Active, awaiting response |
| resolved | 1 | Completed |
| pending | 2 | Awaiting customer |
| snoozed | 3 | Temporarily paused |

---

## References

- [Chatwoot Documentation](https://www.chatwoot.com/docs)
- [Chatwoot Developer Docs](https://developers.chatwoot.com)
- [Chatwoot GitHub Repository](https://github.com/chatwoot/chatwoot)
- [Chatwoot API Reference](https://developers.chatwoot.com/api-reference)
- [DeepWiki - Chatwoot Analysis](https://deepwiki.com/chatwoot/chatwoot)

---

## 14. Validation Notes (2026-01-21)

**This document was validated against Chatwoot's actual codebase via deepwiki.**

### Corrections Applied

| Section | Issue | Correction |
|---------|-------|------------|
| 3.1 API Types | Client API path was `/api/v1/widget/*` | Changed to `/public/api/v1/*` |
| 3.4 Rate Limits | Listed 300 requests/minute | Corrected to 3000/min (configurable) |
| 6.4 Bot Webhook Events | Implied same events as general webhooks | Added note clarifying Agent Bot specific events |
| 8.3 Provisioning | Implied Platform API creates inboxes | Added clarification that Application API is required |

### Agent Bot Events vs General Webhooks

**General Webhooks** (subscribe via `/api/v1/accounts/{id}/webhooks`):
- `conversation_created`, `conversation_status_changed`, `conversation_updated`
- `message_created`, `message_updated`
- `contact_created`, `contact_updated`
- `webwidget_triggered`
- `conversation_typing_on`, `conversation_typing_off`

**Agent Bot Webhooks** (sent to `outgoing_url`):
- `conversation_resolved`, `conversation_opened`
- `message_created`, `message_updated`
- `webwidget_triggered`

### Key Validated Facts

1. **ActionCable**: Only `RoomChannel` exists - no `ConversationChannel`
2. **Rate Limits**: Default is 3000/min/IP, not 300/min
3. **Client API**: Uses `/public/api/v1/*` base path
4. **Platform API**: Creates accounts, users, bots - but NOT inboxes
5. **Application API**: Creates inboxes, webhooks, portals

### Architecture Validation Status

- ✅ Agent Bot webhook architecture validated
- ✅ Multi-tenant account model validated
- ✅ Help Center/Portal APIs validated
- ✅ WebSocket ActionCable integration validated
- ✅ Database schema (pgvector) validated

---

*Document generated: 2026-01-20*
*Validated: 2026-01-21*
*Research conducted for: Hyyve Platform - Contact Center Integration*
