# Technical Research: Conversation Recording & Template System

**Document Version**: 1.0
**Date**: January 25, 2026
**Status**: Validated
**Project**: Hyyve Platform
**Research Type**: Technical Deep Dive
**Gap Reference**: UX 12.6 #9

---

## Executive Summary

This research document addresses the **Conversation Recording & Templates** gap identified during architecture validation. It covers patterns for capturing builder conversations, creating reusable templates, and enabling conversation replay for training and consistency.

### Key Findings

1. **Chat Recording is Standard**: BotUp, Amazon Lex provide reference implementations
2. **Templates Speed Development**: 5x faster bot creation with pre-built templates
3. **Replay Enables Training**: Recorded conversations improve AI performance
4. **Privacy Considerations**: Recording requires consent and data handling policies

---

## Table of Contents

1. [Industry Analysis](#1-industry-analysis)
2. [Conversation Recording Architecture](#2-conversation-recording-architecture)
3. [Template System Design](#3-template-system-design)
4. [Conversation Replay](#4-conversation-replay)
5. [Privacy & Compliance](#5-privacy--compliance)
6. [Integration with Builders](#6-integration-with-builders)
7. [Implementation Recommendations](#7-implementation-recommendations)
8. [References](#references)

---

## 1. Industry Analysis

### 1.1 Existing Solutions

| Platform | Recording | Templates | Replay | Notes |
|----------|-----------|-----------|--------|-------|
| **BotUp** | Full chat recorder | Limited | Analytics only | User behavior insights |
| **Amazon Lex** | Transcript-based | Automated design | VCB replay | Uses transcripts for bot design |
| **Voiceflow** | Conversation logs | 100+ templates | Testing mode | Pre-built customer service bots |
| **Conferbot** | Session logs | 100+ templates | No | Industry-specific templates |
| **Typebot** | Analytics | 45+ blocks | Preview mode | Building block library |
| **Landbot** | Full tracking | Quick start | Real-time preview | Design once, deploy anywhere |

### 1.2 Key Capabilities

From BotUp Chat Recorder:
> "A Chat Recorder records conversations between a user and the chatbot. This enables developers to analyze user interactions, identify pain points, and generate insights about user behavior, preferences, and demographics."

From Amazon Lex:
> "Automated chatbot designer simplifies bot design by utilizing existing conversation transcripts. The Visual Conversation Builder (VCB) allows everyone to contribute more to bot design."

---

## 2. Conversation Recording Architecture

### 2.1 Recording Model

```typescript
interface ConversationRecording {
  id: string;
  sessionId: string;
  builderId: 'module' | 'chatbot' | 'voice' | 'canvas';

  // Timing
  startedAt: Date;
  endedAt?: Date;
  duration: number; // milliseconds

  // Participants
  userId: string;
  agentId: string; // Bond, Wendy, Morgan, Artie
  workspaceId: string;

  // Content
  turns: ConversationTurn[];
  graphChanges: GraphChange[];

  // Metadata
  tags: string[];
  outcome: 'success' | 'partial' | 'abandoned' | 'error';
  userSatisfaction?: number; // 1-5 rating
  templateCandidate: boolean;
}

interface ConversationTurn {
  id: string;
  sequence: number;
  timestamp: Date;

  role: 'user' | 'agent';
  content: TurnContent;

  // Context
  graphStateBeforeId?: string;
  graphStateAfterId?: string;
  toolCalls?: ToolCall[];
  emotions?: EmotionDetection;
}

interface TurnContent {
  type: 'text' | 'voice' | 'action' | 'approval';
  text?: string;
  audioUrl?: string;
  action?: {
    type: string;
    params: Record<string, unknown>;
  };
}

interface GraphChange {
  turnId: string;
  timestamp: Date;
  changeType: 'node_add' | 'node_remove' | 'node_modify' | 'edge_add' | 'edge_remove';
  nodeId?: string;
  edgeId?: string;
  before?: unknown;
  after?: unknown;
}
```

### 2.2 Recording Service

```typescript
class ConversationRecorder {
  private recording: ConversationRecording | null = null;
  private graphSnapshots: Map<string, GraphSnapshot> = new Map();

  startRecording(
    userId: string,
    agentId: string,
    builderId: string,
    workspaceId: string
  ): string {
    const recordingId = crypto.randomUUID();

    this.recording = {
      id: recordingId,
      sessionId: crypto.randomUUID(),
      builderId: builderId as any,
      startedAt: new Date(),
      duration: 0,
      userId,
      agentId,
      workspaceId,
      turns: [],
      graphChanges: [],
      tags: [],
      outcome: 'partial',
      templateCandidate: false,
    };

    // Take initial graph snapshot
    this.captureGraphSnapshot('initial');

    return recordingId;
  }

  recordTurn(
    role: 'user' | 'agent',
    content: TurnContent,
    toolCalls?: ToolCall[]
  ): void {
    if (!this.recording) return;

    const turn: ConversationTurn = {
      id: crypto.randomUUID(),
      sequence: this.recording.turns.length,
      timestamp: new Date(),
      role,
      content,
      graphStateBeforeId: this.getLatestSnapshotId(),
      toolCalls,
    };

    this.recording.turns.push(turn);

    // Capture post-turn graph state
    const afterSnapshotId = this.captureGraphSnapshot(`after-turn-${turn.sequence}`);
    turn.graphStateAfterId = afterSnapshotId;

    // Compute graph changes
    this.computeGraphChanges(turn);
  }

  endRecording(outcome: ConversationRecording['outcome'], satisfaction?: number): ConversationRecording {
    if (!this.recording) throw new Error('No active recording');

    this.recording.endedAt = new Date();
    this.recording.duration = this.recording.endedAt.getTime() - this.recording.startedAt.getTime();
    this.recording.outcome = outcome;
    this.recording.userSatisfaction = satisfaction;

    // Determine if this is a template candidate
    this.recording.templateCandidate = this.evaluateTemplateCandidate();

    const completed = this.recording;
    this.recording = null;

    return completed;
  }

  private evaluateTemplateCandidate(): boolean {
    if (!this.recording) return false;

    // Criteria for template candidacy:
    // 1. Successful outcome
    // 2. Reasonable length (not too short, not too long)
    // 3. High satisfaction rating
    // 4. Clear pattern (e.g., specific node types used)

    const turnCount = this.recording.turns.length;
    const isSuccessful = this.recording.outcome === 'success';
    const isReasonableLength = turnCount >= 3 && turnCount <= 20;
    const hasHighSatisfaction = (this.recording.userSatisfaction ?? 0) >= 4;

    return isSuccessful && isReasonableLength && hasHighSatisfaction;
  }
}
```

### 2.3 Storage Schema

```sql
-- Conversation recordings table
CREATE TABLE conversation_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  builder_id VARCHAR(50) NOT NULL,

  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_ms INTEGER,

  user_id UUID REFERENCES users(id) NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) NOT NULL,

  outcome VARCHAR(20),
  user_satisfaction SMALLINT CHECK (user_satisfaction BETWEEN 1 AND 5),
  template_candidate BOOLEAN DEFAULT FALSE,

  tags TEXT[],
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation turns table
CREATE TABLE conversation_turns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID REFERENCES conversation_recordings(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,

  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'agent')),
  content JSONB NOT NULL,
  tool_calls JSONB,
  emotions JSONB,

  graph_state_before_id UUID,
  graph_state_after_id UUID,

  UNIQUE (recording_id, sequence)
);

-- Graph snapshots table
CREATE TABLE graph_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID REFERENCES conversation_recordings(id) ON DELETE CASCADE,
  label VARCHAR(255),
  timestamp TIMESTAMPTZ NOT NULL,
  snapshot JSONB NOT NULL, -- Full graph state
  node_count INTEGER,
  edge_count INTEGER
);

-- Graph changes table
CREATE TABLE graph_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID REFERENCES conversation_recordings(id) ON DELETE CASCADE,
  turn_id UUID REFERENCES conversation_turns(id),
  timestamp TIMESTAMPTZ NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  node_id VARCHAR(255),
  edge_id VARCHAR(255),
  before_state JSONB,
  after_state JSONB
);

-- Indexes
CREATE INDEX idx_recordings_workspace ON conversation_recordings(workspace_id);
CREATE INDEX idx_recordings_user ON conversation_recordings(user_id);
CREATE INDEX idx_recordings_template ON conversation_recordings(template_candidate) WHERE template_candidate = TRUE;
CREATE INDEX idx_turns_recording ON conversation_turns(recording_id);
```

---

## 3. Template System Design

### 3.1 Template Model

```typescript
interface ConversationTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  builderId: 'module' | 'chatbot' | 'voice' | 'canvas';

  // Source
  sourceRecordingId?: string; // If derived from a recording
  createdBy: string;
  isOfficial: boolean;

  // Content
  turns: TemplateTurn[];
  variables: TemplateVariable[];
  resultingGraph: GraphTemplate;

  // Metadata
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // "5 minutes"
  usageCount: number;
  rating: number;

  createdAt: Date;
  updatedAt: Date;
}

enum TemplateCategory {
  CUSTOMER_SERVICE = 'customer_service',
  LEAD_GENERATION = 'lead_generation',
  FAQ = 'faq',
  APPOINTMENT_BOOKING = 'appointment_booking',
  E_COMMERCE = 'e_commerce',
  ONBOARDING = 'onboarding',
  FEEDBACK = 'feedback',
  WORKFLOW_AUTOMATION = 'workflow_automation',
}

interface TemplateTurn {
  sequence: number;
  role: 'user' | 'agent';
  content: string;
  isVariable: boolean; // Contains {{variable}} placeholders
  expectedAction?: string; // What the agent should do
}

interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  defaultValue?: unknown;
  options?: string[]; // For select type
  required: boolean;
}

interface GraphTemplate {
  nodes: TemplateNode[];
  edges: TemplateEdge[];
}

interface TemplateNode {
  templateNodeId: string; // Stable across template uses
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  variableBindings: Record<string, string>; // property -> variable name
}
```

### 3.2 Template Library UI

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION TEMPLATES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filter: [All ▼] [Module ▼] [Beginner ▼]  🔍 Search...          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────────┤
│  │ 🌟 OFFICIAL TEMPLATES                                        │
│  ├──────────────────────────────────────────────────────────────┤
│  │                                                              │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  │  📞         │ │  🛒         │ │  📋         │            │
│  │  │ Customer    │ │ E-Commerce  │ │ FAQ Bot     │            │
│  │  │ Service     │ │ Assistant   │ │             │            │
│  │  │             │ │             │ │             │            │
│  │  │ ⭐ 4.8 (234)│ │ ⭐ 4.6 (189)│ │ ⭐ 4.9 (312)│            │
│  │  │ ~10 min     │ │ ~15 min     │ │ ~5 min      │            │
│  │  └─────────────┘ └─────────────┘ └─────────────┘            │
│  │                                                              │
│  ├──────────────────────────────────────────────────────────────┤
│  │ 👤 MY TEMPLATES                                              │
│  ├──────────────────────────────────────────────────────────────┤
│  │                                                              │
│  │  ┌─────────────┐ ┌─────────────┐                            │
│  │  │  🔧         │ │  📝         │                            │
│  │  │ API Schema  │ │ Onboarding  │                            │
│  │  │ Builder     │ │ Flow        │                            │
│  │  │             │ │             │                            │
│  │  │ Last used:  │ │ Last used:  │ [+ Create from Recording]  │
│  │  │ 2 days ago  │ │ 1 week ago  │                            │
│  │  └─────────────┘ └─────────────┘                            │
│  │                                                              │
│  └──────────────────────────────────────────────────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Template Creation from Recording

```typescript
class TemplateGenerator {
  generateFromRecording(recording: ConversationRecording): ConversationTemplate {
    // Extract turns, generalizing specific values to variables
    const turns: TemplateTurn[] = recording.turns.map((turn, i) => ({
      sequence: i,
      role: turn.role,
      content: this.generalizeContent(turn.content),
      isVariable: this.hasVariables(turn.content),
      expectedAction: this.inferAction(turn, recording.graphChanges),
    }));

    // Extract variables from content
    const variables = this.extractVariables(recording);

    // Build graph template from final state
    const resultingGraph = this.buildGraphTemplate(recording);

    return {
      id: crypto.randomUUID(),
      name: `Template from ${recording.id}`,
      description: this.generateDescription(recording),
      category: this.inferCategory(recording),
      builderId: recording.builderId,
      sourceRecordingId: recording.id,
      createdBy: recording.userId,
      isOfficial: false,
      turns,
      variables,
      resultingGraph,
      tags: recording.tags,
      difficulty: this.assessDifficulty(recording),
      estimatedTime: this.estimateTime(recording),
      usageCount: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generalizeContent(content: TurnContent): string {
    if (!content.text) return '';

    // Replace specific values with variable placeholders
    let generalized = content.text;

    // Replace URLs
    generalized = generalized.replace(
      /(https?:\/\/[^\s]+)/g,
      '{{api_url}}'
    );

    // Replace email addresses
    generalized = generalized.replace(
      /[\w.-]+@[\w.-]+\.\w+/g,
      '{{email}}'
    );

    // Replace numbers that look like IDs
    generalized = generalized.replace(
      /\b[A-Za-z0-9]{8,}\b/g,
      (match) => match.length > 20 ? '{{api_key}}' : match
    );

    return generalized;
  }

  private extractVariables(recording: ConversationRecording): TemplateVariable[] {
    const variables: Map<string, TemplateVariable> = new Map();

    for (const turn of recording.turns) {
      const content = turn.content.text || '';
      const varMatches = content.matchAll(/\{\{(\w+)\}\}/g);

      for (const match of varMatches) {
        const name = match[1];
        if (!variables.has(name)) {
          variables.set(name, {
            name,
            description: this.inferVariableDescription(name),
            type: this.inferVariableType(name),
            required: true,
          });
        }
      }
    }

    return Array.from(variables.values());
  }
}
```

---

## 4. Conversation Replay

### 4.1 Replay Engine

```typescript
interface ReplaySession {
  templateId: string;
  variableValues: Record<string, unknown>;
  currentTurnIndex: number;
  status: 'playing' | 'paused' | 'waiting_input' | 'completed';
  modifications: TurnModification[];
}

interface TurnModification {
  turnIndex: number;
  originalContent: string;
  modifiedContent: string;
  reason: 'user_edit' | 'variable_substitution' | 'context_adaptation';
}

class ConversationReplayer {
  private session: ReplaySession | null = null;
  private template: ConversationTemplate | null = null;

  startReplay(
    template: ConversationTemplate,
    variableValues: Record<string, unknown>
  ): ReplaySession {
    this.template = template;
    this.session = {
      templateId: template.id,
      variableValues,
      currentTurnIndex: 0,
      status: 'playing',
      modifications: [],
    };

    return this.session;
  }

  async executeNextTurn(): Promise<{
    turn: TemplateTurn;
    substitutedContent: string;
    action?: string;
  }> {
    if (!this.session || !this.template) {
      throw new Error('No active replay session');
    }

    const turn = this.template.turns[this.session.currentTurnIndex];
    const substitutedContent = this.substituteVariables(
      turn.content,
      this.session.variableValues
    );

    if (turn.role === 'user') {
      // Wait for user to confirm or modify
      this.session.status = 'waiting_input';
    } else {
      // Execute agent turn
      this.session.currentTurnIndex++;

      if (this.session.currentTurnIndex >= this.template.turns.length) {
        this.session.status = 'completed';
      }
    }

    return {
      turn,
      substitutedContent,
      action: turn.expectedAction,
    };
  }

  confirmUserTurn(content: string): void {
    if (!this.session || !this.template) return;

    const turn = this.template.turns[this.session.currentTurnIndex];
    const originalSubstituted = this.substituteVariables(
      turn.content,
      this.session.variableValues
    );

    if (content !== originalSubstituted) {
      this.session.modifications.push({
        turnIndex: this.session.currentTurnIndex,
        originalContent: originalSubstituted,
        modifiedContent: content,
        reason: 'user_edit',
      });
    }

    this.session.currentTurnIndex++;
    this.session.status = 'playing';
  }

  private substituteVariables(
    content: string,
    values: Record<string, unknown>
  ): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return String(values[varName] ?? match);
    });
  }
}
```

### 4.2 Replay UI

```tsx
function ConversationReplayView({ template, onComplete }: ReplayViewProps) {
  const [replayer] = useState(() => new ConversationReplayer());
  const [session, setSession] = useState<ReplaySession | null>(null);
  const [currentTurn, setCurrentTurn] = useState<TemplateTurn | null>(null);
  const [userInput, setUserInput] = useState('');

  const startReplay = (variables: Record<string, unknown>) => {
    const newSession = replayer.startReplay(template, variables);
    setSession(newSession);
    advanceReplay();
  };

  const advanceReplay = async () => {
    const result = await replayer.executeNextTurn();
    setCurrentTurn(result.turn);

    if (result.turn.role === 'user') {
      setUserInput(result.substitutedContent);
    }
  };

  const confirmTurn = () => {
    replayer.confirmUserTurn(userInput);
    advanceReplay();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span>Step {(session?.currentTurnIndex ?? 0) + 1} of {template.turns.length}</span>
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{
                width: `${((session?.currentTurnIndex ?? 0) / template.turns.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Conversation display */}
      <div className="flex-1 overflow-auto p-4">
        {template.turns.slice(0, (session?.currentTurnIndex ?? 0) + 1).map((turn, i) => (
          <div
            key={i}
            className={`mb-4 ${turn.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                turn.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              {turn.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input area for user turns */}
      {session?.status === 'waiting_input' && (
        <div className="p-4 border-t">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={confirmTurn}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Send
            </button>
            <button
              onClick={() => setUserInput(currentTurn?.content ?? '')}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Reset to Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Privacy & Compliance

### 5.1 Consent Management

```typescript
interface RecordingConsent {
  userId: string;
  consentType: 'opt_in' | 'opt_out';
  scope: 'all' | 'workspace' | 'session';
  purposes: RecordingPurpose[];
  grantedAt: Date;
  expiresAt?: Date;
}

enum RecordingPurpose {
  QUALITY_IMPROVEMENT = 'quality_improvement',
  TEMPLATE_CREATION = 'template_creation',
  ANALYTICS = 'analytics',
  TRAINING = 'training',
}

class ConsentManager {
  async checkConsent(userId: string, purpose: RecordingPurpose): Promise<boolean> {
    const consent = await this.getActiveConsent(userId);

    if (!consent || consent.consentType === 'opt_out') {
      return false;
    }

    if (consent.expiresAt && consent.expiresAt < new Date()) {
      return false;
    }

    return consent.purposes.includes(purpose);
  }

  async recordConsent(
    userId: string,
    consentType: 'opt_in' | 'opt_out',
    purposes: RecordingPurpose[]
  ): Promise<void> {
    await db.recordingConsents.upsert({
      where: { userId },
      create: {
        userId,
        consentType,
        purposes,
        grantedAt: new Date(),
      },
      update: {
        consentType,
        purposes,
        grantedAt: new Date(),
      },
    });
  }
}
```

### 5.2 Data Retention

```typescript
const RETENTION_POLICIES = {
  recordings: {
    default: 90, // days
    templateCandidates: 365,
    officialTemplates: null, // indefinite
  },
  snapshots: {
    default: 30,
    attachedToTemplate: 365,
  },
};

async function cleanupExpiredRecordings(): Promise<void> {
  const cutoffDate = subDays(new Date(), RETENTION_POLICIES.recordings.default);

  await db.conversationRecordings.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
      templateCandidate: false,
    },
  });
}
```

### 5.3 PII Handling

```typescript
function sanitizeForTemplate(content: string): string {
  // Remove or mask PII before storing in templates
  let sanitized = content;

  // Email addresses
  sanitized = sanitized.replace(
    /[\w.-]+@[\w.-]+\.\w+/g,
    '[EMAIL]'
  );

  // Phone numbers
  sanitized = sanitized.replace(
    /\+?[\d\s-]{10,}/g,
    '[PHONE]'
  );

  // Credit card numbers
  sanitized = sanitized.replace(
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    '[CARD]'
  );

  // SSN
  sanitized = sanitized.replace(
    /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    '[SSN]'
  );

  return sanitized;
}
```

---

## 6. Integration with Builders

### 6.1 Recording Hook

```typescript
function useConversationRecording(builderId: string) {
  const recorder = useMemo(() => new ConversationRecorder(), []);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(async () => {
    const hasConsent = await consentManager.checkConsent(
      userId,
      RecordingPurpose.QUALITY_IMPROVEMENT
    );

    if (!hasConsent) {
      // Show consent dialog
      return;
    }

    recorder.startRecording(userId, agentId, builderId, workspaceId);
    setIsRecording(true);
  }, [userId, agentId, builderId, workspaceId]);

  const recordTurn = useCallback((
    role: 'user' | 'agent',
    content: TurnContent
  ) => {
    if (isRecording) {
      recorder.recordTurn(role, content);
    }
  }, [isRecording]);

  const stopRecording = useCallback(async (
    outcome: ConversationRecording['outcome'],
    satisfaction?: number
  ) => {
    if (!isRecording) return null;

    const recording = recorder.endRecording(outcome, satisfaction);
    setIsRecording(false);

    // Save to backend
    await api.saveRecording(recording);

    return recording;
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    recordTurn,
    stopRecording,
  };
}
```

### 6.2 Template Selection Integration

```tsx
function BuilderWithTemplates({ builderId }: { builderId: string }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);

  const handleTemplateSelect = (template: ConversationTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);

    // Start guided replay
    // ...
  };

  return (
    <div className="flex h-screen">
      {/* Template sidebar */}
      <aside className="w-64 border-r">
        <button onClick={() => setShowTemplates(true)}>
          Browse Templates
        </button>

        {showTemplates && (
          <TemplateLibrary
            builderId={builderId}
            onSelect={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </aside>

      {/* Main builder canvas */}
      <main className="flex-1">
        {selectedTemplate ? (
          <ConversationReplayView
            template={selectedTemplate}
            onComplete={() => setSelectedTemplate(null)}
          />
        ) : (
          <BuilderCanvas builderId={builderId} />
        )}
      </main>
    </div>
  );
}
```

---

## 7. Implementation Recommendations

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                CONVERSATION RECORDING SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Recording   │───►│   Template   │───►│   Replay     │      │
│  │   Service    │    │  Generator   │    │   Engine     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                    │              │
│         ▼                   ▼                    ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  PostgreSQL  │    │   Template   │    │   Builder    │      │
│  │  (Storage)   │    │   Library    │    │ Integration  │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  PRIVACY LAYER                            │  │
│  │  Consent Manager  │  PII Sanitizer  │  Retention Policy  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Implementation Phases

| Phase | Scope | Effort |
|-------|-------|--------|
| **P1** | Recording service + storage | 1 sprint |
| **P2** | Template generation | 1 sprint |
| **P3** | Template library UI | 1 sprint |
| **P4** | Replay engine | 1 sprint |
| **P5** | Privacy & consent | 1 sprint |

### 7.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Template Usage Rate | >30% of new projects | Projects starting from template |
| Recording Opt-in | >60% | Users consenting to recording |
| Template Completion | >80% | Users completing template replay |
| Time Savings | >50% | Time to first working flow |

---

## References

- [BotUp Chat Recorder](https://botup.com/chat-recorder)
- [Amazon Lex Visual Conversation Builder](https://aws.amazon.com/lex/)
- [Voiceflow Chatbot Templates](https://www.voiceflow.com/blog/chatbot-template)
- [Conferbot Templates](https://www.conferbot.com/templates)
- [Typebot Building Blocks](https://typebot.io/)
- [Landbot Platform](https://landbot.io)
- [Top 10 Chatbot Templates 2025 - Sobot](https://www.sobot.io/article/top-10-chatbot-script-templates-2025/)

---

## Appendix A: Validation Notes

**Validation Method**: Industry analysis, platform feature comparison
**Confidence Level**: High - patterns proven across multiple platforms
**Privacy Considerations**: GDPR Article 6 (consent), CCPA compliance required
