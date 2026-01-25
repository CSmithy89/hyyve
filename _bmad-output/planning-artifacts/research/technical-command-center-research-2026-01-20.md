# Technical Research: Command Center / Operations Dashboard

**Research Date**: 2026-01-20
**Version**: 1.0
**Status**: Complete - VALIDATED (2026-01-21)
**Research Focus**: Real-time operations dashboard for Hyyve platform with HITL approval, alerts, and A2UI rendering

---

## Executive Summary

This research document provides comprehensive analysis of patterns and technologies for building a Command Center / Operations Dashboard for an Hyyve platform. The dashboard will provide real-time visibility into running agents/workflows, human-in-the-loop (HITL) approval queues, issue alerts, and activity timelines, all rendered using the A2UI protocol for cross-platform compatibility.

### Key Findings

1. **Real-Time Updates**: Server-Sent Events (SSE) is preferred over WebSockets for serverless deployments (Vercel, Railway), with Supabase Realtime providing excellent PostgreSQL change subscriptions
2. **A2UI Protocol** (v0.8 public preview) enables safe, declarative UI generation with streaming updates through `updateComponents` and `updateDataModel` messages
3. **HITL Patterns**: Temporal's Signal-based approval system provides the gold standard for durable human approvals with proper state persistence
4. **AG-UI INTERRUPT Events** (draft proposal) provide the transport mechanism for pausing agent execution and awaiting human approval
5. **Tremor** (now Vercel-owned) offers production-ready React components for dashboard charts and metrics
6. **Zustand** is the recommended state management solution for real-time dashboard updates (lightweight, real-time friendly)

---

## Table of Contents

1. [Real-Time Dashboard Patterns](#1-real-time-dashboard-patterns)
2. [A2UI Protocol for Dashboards](#2-a2ui-protocol-for-dashboards)
3. [Human-in-the-Loop (HITL) UX Patterns](#3-human-in-the-loop-hitl-ux-patterns)
4. [AG-UI INTERRUPT Event Handling](#4-ag-ui-interrupt-event-handling)
5. [Issue/Alert Management](#5-issuealert-management)
6. [Activity Timeline Design](#6-activity-timeline-design)
7. [Metrics and Charts](#7-metrics-and-charts)
8. [Multi-Tenant Dashboard](#8-multi-tenant-dashboard)
9. [Technical Implementation](#9-technical-implementation)
10. [Mobile Responsiveness](#10-mobile-responsiveness)
11. [UX Wireframes](#11-ux-wireframes)
12. [Implementation Recommendations](#12-implementation-recommendations)

---

## 1. Real-Time Dashboard Patterns

### 1.1 WebSocket vs SSE Comparison

**Sources**: [Vercel Realtime Guide](https://vercel.com/kb/guide/publish-and-subscribe-to-realtime-data-on-vercel), [Dev.to SSE vs WebSockets](https://dev.to/okrahul/real-time-updates-in-web-apps-why-i-chose-sse-over-websockets-k8k)

| Feature | WebSocket | Server-Sent Events (SSE) |
|---------|-----------|--------------------------|
| **Direction** | Bidirectional | Server-to-client only |
| **Protocol** | WS/WSS | HTTP/HTTPS |
| **Reconnection** | Manual | Automatic |
| **Serverless Support** | Limited | Excellent |
| **Vercel/Railway** | Requires external service (Rivet/Pusher) | Native support (300s timeout on Vercel) |
| **Browser Support** | Excellent | Good (polyfills available) |
| **Use Case** | Chat, gaming | Dashboards, notifications |

### 1.2 SSE Advantages for Dashboards

Server-Sent Events are a standard allowing browser clients to receive a stream of updates from a server over an HTTP connection without resorting to polling. SSE is ideal when the server needs to send continuous updates, like in dashboards, notifications, or live commentary apps.

```typescript
// SSE Client Setup for Dashboard
const eventSource = new EventSource('/api/dashboard/stream');

eventSource.addEventListener('agent_update', (event) => {
  const data = JSON.parse(event.data);
  updateAgentStatus(data);
});

eventSource.addEventListener('alert', (event) => {
  const alert = JSON.parse(event.data);
  showNotification(alert);
});

eventSource.onerror = () => {
  // SSE auto-reconnects, but we can add custom logic
  console.log('Connection lost, reconnecting...');
};
```

### 1.3 Vercel Dashboard Pattern

The Vercel dashboard delivers real-time updates using SWR (stale-while-revalidate) rather than WebSockets directly. This pattern combines:
- Initial data fetch with SWR caching
- Periodic revalidation (configurable interval)
- SSE for critical real-time updates

```typescript
// SWR + SSE Hybrid Pattern
import useSWR from 'swr';

function useAgentStatus(agentId: string) {
  const { data, mutate } = useSWR(
    `/api/agents/${agentId}/status`,
    fetcher,
    { refreshInterval: 5000 } // Polling fallback
  );

  useEffect(() => {
    const eventSource = new EventSource(`/api/agents/${agentId}/stream`);

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      mutate(update, false); // Optimistic update
    };

    return () => eventSource.close();
  }, [agentId, mutate]);

  return data;
}
```

### 1.4 Supabase Realtime Integration

**Sources**: [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime), [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)

Supabase Realtime provides three patterns for real-time updates:

| Pattern | Use Case | Scalability |
|---------|----------|-------------|
| **Postgres Changes** | Listen to database INSERT/UPDATE/DELETE | Single-threaded, limited scale |
| **Broadcast** | Low-latency ephemeral messages | Highly scalable |
| **Presence** | Track online users | Good for collaboration |

```typescript
// Supabase Realtime for Agent Status Updates
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Subscribe to agent_executions table changes
const channel = supabase
  .channel('agent-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'agent_executions',
      filter: `workspace_id=eq.${workspaceId}`
    },
    (payload) => {
      handleAgentUpdate(payload.new);
    }
  )
  .subscribe();

// For high-scale: Use Broadcast instead
const broadcastChannel = supabase
  .channel('dashboard-broadcast')
  .on('broadcast', { event: 'agent_update' }, ({ payload }) => {
    handleAgentUpdate(payload);
  })
  .subscribe();
```

### 1.5 Connection Resilience Strategies

```typescript
// Resilient SSE Connection Manager
class DashboardStreamManager {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseDelay = 1000;

  connect(endpoint: string) {
    this.eventSource = new EventSource(endpoint);

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      this.onConnected();
    };

    this.eventSource.onerror = () => {
      this.handleDisconnect();
    };

    this.setupEventListeners();
  }

  private handleDisconnect() {
    this.eventSource?.close();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts);
      this.reconnectAttempts++;

      setTimeout(() => {
        this.connect(this.currentEndpoint);
      }, Math.min(delay, 30000)); // Max 30s delay
    } else {
      this.onMaxReconnectReached();
    }
  }
}
```

### 1.6 Optimistic Updates Pattern

```typescript
// Optimistic Update for Approval Actions
async function handleApproval(itemId: string, decision: 'approve' | 'reject') {
  // 1. Optimistically update UI
  setApprovalQueue((prev) =>
    prev.map((item) =>
      item.id === itemId
        ? { ...item, status: 'processing', decision }
        : item
    )
  );

  try {
    // 2. Send to server
    await api.submitApproval(itemId, decision);

    // 3. Remove from queue on success
    setApprovalQueue((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  } catch (error) {
    // 4. Rollback on failure
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'pending', decision: null, error: error.message }
          : item
      )
    );
  }
}
```

---

## 2. A2UI Protocol for Dashboards

### 2.1 A2UI Overview for Operations UI

**Sources**: [A2UI.org](https://a2ui.org/), [A2UI Protocol v0.8](https://github.com/google/a2ui)

> **Note**: A2UI is currently in v0.8 Public Preview. The specification and implementations are functional but still evolving.

A2UI enables agents to generate rich, interactive dashboard UIs without executing arbitrary code. Key components for Command Center:

| Component | Dashboard Use |
|-----------|---------------|
| **Card** | Agent status cards, metric displays |
| **Timeline** | Activity log, execution history |
| **Chart** | Performance metrics, cost tracking (requires custom catalog) |
| **Checklist** | Task lists, approval items |
| **Button** | Approve/Reject actions |
| **ComparisonTable** | Side-by-side agent metrics (requires custom catalog) |
| **Form** | Configuration, filter inputs |

### 2.2 Dashboard Surface Creation

```json
{
  "createSurface": {
    "surfaceId": "command_center",
    "catalogId": "https://a2ui.dev/specification/0.8/standard_catalog_definition.json"
  }
}
```

### 2.3 Agent Status Card Component

```json
{
  "updateComponents": {
    "surfaceId": "command_center",
    "components": [
      {
        "id": "agent_card_001",
        "component": "Card",
        "children": ["agent_header", "agent_metrics", "agent_actions"]
      },
      {
        "id": "agent_header",
        "component": "Row",
        "children": ["agent_name", "agent_status_badge"]
      },
      {
        "id": "agent_name",
        "component": "Text",
        "text": { "path": "/agents/001/name" },
        "style": "heading-medium"
      },
      {
        "id": "agent_status_badge",
        "component": "Badge",
        "text": { "path": "/agents/001/status" },
        "variant": { "path": "/agents/001/statusVariant" }
      },
      {
        "id": "agent_metrics",
        "component": "Column",
        "children": ["metric_executions", "metric_success_rate", "metric_avg_time"]
      },
      {
        "id": "metric_executions",
        "component": "Text",
        "text": {
          "template": "Executions: {{value}}",
          "path": "/agents/001/metrics/totalExecutions"
        }
      },
      {
        "id": "agent_actions",
        "component": "Row",
        "children": ["btn_view_details", "btn_pause", "btn_configure"]
      },
      {
        "id": "btn_pause",
        "component": "Button",
        "child": "btn_pause_label",
        "action": {
          "name": "pauseAgent",
          "context": { "agentId": "001" }
        }
      }
    ]
  }
}
```

### 2.4 HITL Approval Queue with A2UI

```json
{
  "updateComponents": {
    "surfaceId": "command_center",
    "components": [
      {
        "id": "approval_queue",
        "component": "Card",
        "children": ["queue_header", "queue_list"]
      },
      {
        "id": "queue_header",
        "component": "Row",
        "children": ["queue_title", "queue_count_badge"]
      },
      {
        "id": "queue_title",
        "component": "Text",
        "text": "Pending Approvals",
        "style": "heading-large"
      },
      {
        "id": "queue_count_badge",
        "component": "Badge",
        "text": { "path": "/approvals/pendingCount" },
        "variant": "warning"
      },
      {
        "id": "queue_list",
        "component": "Column",
        "children": { "path": "/approvals/items", "childTemplate": "approval_item" }
      },
      {
        "id": "approval_item",
        "component": "Card",
        "children": ["approval_context", "approval_actions"]
      },
      {
        "id": "approval_context",
        "component": "Column",
        "children": ["approval_agent", "approval_action", "approval_reason"]
      },
      {
        "id": "approval_agent",
        "component": "Text",
        "text": { "path": "{{item}}/agentName" },
        "style": "label"
      },
      {
        "id": "approval_action",
        "component": "Text",
        "text": { "path": "{{item}}/actionDescription" },
        "style": "body"
      },
      {
        "id": "approval_reason",
        "component": "Text",
        "text": { "path": "{{item}}/reason" },
        "style": "caption"
      },
      {
        "id": "approval_actions",
        "component": "Row",
        "children": ["btn_approve", "btn_reject", "btn_request_info"]
      },
      {
        "id": "btn_approve",
        "component": "Button",
        "child": "approve_label",
        "variant": "primary",
        "action": {
          "name": "approveAction",
          "context": { "itemId": { "path": "{{item}}/id" } }
        }
      },
      {
        "id": "btn_reject",
        "component": "Button",
        "child": "reject_label",
        "variant": "destructive",
        "action": {
          "name": "rejectAction",
          "context": { "itemId": { "path": "{{item}}/id" } }
        }
      },
      {
        "id": "btn_request_info",
        "component": "Button",
        "child": "info_label",
        "variant": "outline",
        "action": {
          "name": "requestMoreInfo",
          "context": { "itemId": { "path": "{{item}}/id" } }
        }
      }
    ]
  }
}
```

### 2.5 Data Binding with updateDataModel

```json
{
  "updateDataModel": {
    "surfaceId": "command_center",
    "path": "/agents/001",
    "op": "replace",
    "value": {
      "name": "Document Analyzer Agent",
      "status": "running",
      "statusVariant": "success",
      "metrics": {
        "totalExecutions": 1247,
        "successRate": 98.5,
        "avgExecutionTime": "2.3s",
        "tokenUsage": 45230,
        "cost": 12.45
      }
    }
  }
}
```

### 2.6 Streaming Updates Pattern

```python
# Backend: Stream A2UI updates for real-time dashboard
import asyncio
from typing import AsyncGenerator

async def stream_dashboard_updates(workspace_id: str) -> AsyncGenerator[str, None]:
    """Stream A2UI updates for Command Center dashboard."""

    # Initial surface creation
    yield json.dumps({
        "createSurface": {
            "surfaceId": "command_center",
            "catalogId": "https://a2ui.dev/specification/0.8/standard_catalog_definition.json"
        }
    }) + "\n"

    # Initial component structure
    yield json.dumps({
        "updateComponents": {
            "surfaceId": "command_center",
            "components": get_dashboard_components()
        }
    }) + "\n"

    # Subscribe to real-time updates
    async for update in subscribe_to_updates(workspace_id):
        if update.type == "agent_status":
            yield json.dumps({
                "updateDataModel": {
                    "surfaceId": "command_center",
                    "path": f"/agents/{update.agent_id}",
                    "op": "replace",
                    "value": update.data
                }
            }) + "\n"
        elif update.type == "new_approval":
            yield json.dumps({
                "updateDataModel": {
                    "surfaceId": "command_center",
                    "path": "/approvals/items/-",
                    "op": "add",
                    "value": update.data
                }
            }) + "\n"
```

---

## 3. Human-in-the-Loop (HITL) UX Patterns

### 3.1 Temporal's Durable Approval Pattern

**Sources**: [Temporal HITL Tutorial](https://learn.temporal.io/tutorials/ai/building-durable-ai-applications/human-in-the-loop/), [Temporal Use Cases](https://docs.temporal.io/evaluate/use-cases-design-patterns)

Temporal provides the gold standard for HITL workflows using Signals:

```python
# Temporal Workflow with HITL Approval
from temporalio import workflow
from temporalio.workflow import signal

@workflow.defn
class AgentExecutionWorkflow:
    def __init__(self):
        self.approval_result = None
        self.approval_received = False

    @workflow.run
    async def run(self, execution_request):
        # Execute pre-approval steps
        context = await workflow.execute_activity(
            gather_context,
            execution_request,
            start_to_close_timeout=timedelta(minutes=5)
        )

        # Check if approval required
        if self.requires_approval(context):
            # Emit approval request
            await workflow.execute_activity(
                notify_approval_required,
                ApprovalRequest(
                    execution_id=workflow.info().workflow_id,
                    context=context,
                    reason="High-risk operation detected"
                ),
                start_to_close_timeout=timedelta(minutes=1)
            )

            # Wait for approval signal (with timeout)
            try:
                await workflow.wait_condition(
                    lambda: self.approval_received,
                    timeout=timedelta(hours=24)
                )
            except asyncio.TimeoutError:
                return ExecutionResult(status="timeout", message="Approval not received")

            if not self.approval_result.approved:
                return ExecutionResult(
                    status="rejected",
                    message=self.approval_result.reason
                )

        # Execute main task
        return await workflow.execute_activity(
            execute_agent_task,
            context,
            start_to_close_timeout=timedelta(hours=1)
        )

    @signal
    def approve(self, approval: ApprovalDecision):
        """Signal handler for approval decisions."""
        self.approval_result = approval
        self.approval_received = True
```

### 3.2 Approval Queue Design

```
+------------------------------------------------------------------+
|                    APPROVAL QUEUE                                  |
|  [ Filters: All | High Priority | My Queue ]    [ 12 Pending ]    |
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------------------------------------------------+  |
|  | [!] HIGH PRIORITY           Requested 5 min ago              |  |
|  |                                                              |  |
|  | Agent: Document Analyzer                                     |  |
|  | Action: Delete 47 documents from customer-data collection    |  |
|  | Reason: Batch cleanup requested by user                      |  |
|  |                                                              |  |
|  | Context:                                                     |  |
|  | - Workflow: doc_cleanup_workflow_abc123                      |  |
|  | - Triggered by: john@company.com                             |  |
|  | - Documents affected: 47 (see details)                       |  |
|  |                                                              |  |
|  | [ View Details ] [ Approve ] [ Reject ] [ Request Info ]     |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  +--------------------------------------------------------------+  |
|  | NORMAL                       Requested 23 min ago            |  |
|  |                                                              |  |
|  | Agent: API Integration Agent                                 |  |
|  | Action: Create new webhook endpoint                          |  |
|  | Reason: External system access request                       |  |
|  |                                                              |  |
|  | [ View Details ] [ Approve ] [ Reject ] [ Request Info ]     |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.3 Context Presentation Best Practices

| Element | Purpose | Implementation |
|---------|---------|----------------|
| **Agent Identity** | Who is requesting | Name, ID, avatar |
| **Action Description** | What will happen | Clear, non-technical summary |
| **Reason/Trigger** | Why approval needed | Business rule that triggered |
| **Impact Assessment** | Scope of action | Records affected, reversibility |
| **Requestor** | Human who initiated | User, timestamp |
| **Related Context** | Supporting info | Links to workflow, logs |
| **Time Sensitivity** | Urgency indicator | SLA countdown, priority badge |

### 3.4 Approval Decision Flow

```typescript
// Approval Decision Schema
interface ApprovalDecision {
  itemId: string;
  decision: 'approve' | 'reject' | 'request_info' | 'escalate';
  reason?: string;
  conditions?: ApprovalCondition[];
  reviewerId: string;
  timestamp: Date;
}

interface ApprovalCondition {
  type: 'must_notify' | 'must_log' | 'requires_revert_plan';
  value: string;
}

// Approval Actions
async function handleApprovalDecision(decision: ApprovalDecision) {
  // 1. Validate reviewer has permission
  await validateReviewerPermission(decision.reviewerId, decision.itemId);

  // 2. Record decision in audit log
  await recordAuditEntry({
    action: 'approval_decision',
    ...decision
  });

  // 3. Send signal to workflow
  await temporalClient.workflow.signal(
    decision.itemId,
    'approve',
    {
      approved: decision.decision === 'approve',
      reason: decision.reason,
      conditions: decision.conditions,
      reviewer: decision.reviewerId
    }
  );

  // 4. Update dashboard
  broadcastUpdate({
    type: 'approval_resolved',
    itemId: decision.itemId,
    decision: decision.decision
  });
}
```

### 3.5 Timeout and Escalation Handling

```typescript
// Escalation Policy
interface EscalationPolicy {
  levels: EscalationLevel[];
  defaultTimeoutMinutes: number;
}

interface EscalationLevel {
  afterMinutes: number;
  action: 'notify' | 'reassign' | 'auto_approve' | 'auto_reject';
  target?: string; // User or group ID
  notificationChannels: ('email' | 'slack' | 'sms')[];
}

const defaultEscalationPolicy: EscalationPolicy = {
  defaultTimeoutMinutes: 60,
  levels: [
    {
      afterMinutes: 15,
      action: 'notify',
      target: 'original_reviewer',
      notificationChannels: ['slack']
    },
    {
      afterMinutes: 30,
      action: 'notify',
      target: 'team_lead',
      notificationChannels: ['email', 'slack']
    },
    {
      afterMinutes: 45,
      action: 'reassign',
      target: 'on_call_group',
      notificationChannels: ['email', 'slack', 'sms']
    },
    {
      afterMinutes: 60,
      action: 'auto_reject',
      notificationChannels: ['email']
    }
  ]
};
```

### 3.6 Audit Trail Requirements

```typescript
// Audit Entry Schema
interface ApprovalAuditEntry {
  id: string;
  timestamp: Date;
  eventType:
    | 'approval_requested'
    | 'approval_viewed'
    | 'approval_assigned'
    | 'approval_reassigned'
    | 'approval_escalated'
    | 'approval_approved'
    | 'approval_rejected'
    | 'approval_timeout'
    | 'info_requested'
    | 'info_provided';

  // Context
  approvalItemId: string;
  workflowId: string;
  agentId: string;

  // Actor
  actorId: string;
  actorType: 'user' | 'system' | 'escalation_policy';

  // Details
  details: Record<string, any>;

  // Immutability
  previousEntryHash: string;
  entryHash: string;
}
```

---

## 4. AG-UI INTERRUPT Event Handling

### 4.1 INTERRUPT Event Flow

**Sources**: [AG-UI Docs](https://docs.ag-ui.com/introduction), [Microsoft AG-UI HITL](https://learn.microsoft.com/en-us/agent-framework/integrations/ag-ui/human-in-the-loop)

> **Note**: The AG-UI INTERRUPT feature is currently in **draft proposal** status. Implementation uses `RUN_FINISHED` with `outcome: "interrupt"` rather than a separate event type. API may change before stabilization.

```
Agent Backend                    Command Center UI
     |                                  |
     |-- RunStarted ------------------>|  Show execution started
     |                                  |
     |-- TextMessageContent ---------->|  Stream progress
     |                                  |
     |-- ToolCallStart --------------->|  Show tool execution
     |-- ToolCallArgs ---------------->|  Display arguments
     |                                  |
     | [Detects sensitive action]      |
     |                                  |
     |-- INTERRUPT ------------------->|  Pause execution
     |   {                             |  Show approval modal
     |     "type": "INTERRUPT",        |
     |     "interruptId": "int_123",   |
     |     "reason": "approval_needed",|
     |     "context": {                |
     |       "action": "delete_data",  |
     |       "scope": "47 documents",  |
     |       "risk": "high"            |
     |     }                           |
     |   }                             |
     |                                  |
     | [Waiting for approval...]       |  User reviews context
     |                                  |
     |<-- APPROVAL_RESPONSE -----------|  User clicks Approve
     |   {                             |
     |     "interruptId": "int_123",   |
     |     "approved": true,           |
     |     "reviewer": "user_456"      |
     |   }                             |
     |                                  |
     |-- ToolCallEnd ----------------->|  Resume execution
     |-- ToolCallResult -------------->|  Show result
     |-- RunFinished ----------------->|  Execution complete
```

### 4.2 Frontend INTERRUPT Handler

```typescript
// CopilotKit INTERRUPT Handler
import { useLangGraphInterrupt } from '@copilotkit/react-core';

function CommandCenterDashboard() {
  const { interrupt, resolve } = useLangGraphInterrupt();

  // Handle incoming interrupts
  useEffect(() => {
    if (interrupt) {
      // Add to approval queue
      addToApprovalQueue({
        id: interrupt.interruptId,
        context: interrupt.context,
        timestamp: new Date(),
        status: 'pending'
      });
    }
  }, [interrupt]);

  const handleApproval = async (interruptId: string, approved: boolean, reason?: string) => {
    // Resolve the interrupt
    await resolve({
      interruptId,
      approved,
      reason,
      reviewer: currentUser.id
    });

    // Remove from queue
    removeFromApprovalQueue(interruptId);
  };

  return (
    <ApprovalQueue
      items={approvalQueue}
      onApprove={(id) => handleApproval(id, true)}
      onReject={(id, reason) => handleApproval(id, false, reason)}
    />
  );
}
```

### 4.3 Approval Request Component with A2UI

```typescript
// A2UI Approval Component Renderer
function A2UIApprovalRenderer({ interrupt }: { interrupt: InterruptEvent }) {
  return (
    <Card className="border-warning">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="text-warning" />
          <CardTitle>Approval Required</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Action</Label>
            <p className="font-medium">{interrupt.context.action}</p>
          </div>
          <div>
            <Label>Reason</Label>
            <p className="text-muted-foreground">{interrupt.context.reason}</p>
          </div>
          <div>
            <Label>Risk Level</Label>
            <Badge variant={getRiskVariant(interrupt.context.risk)}>
              {interrupt.context.risk}
            </Badge>
          </div>
          {interrupt.context.details && (
            <Collapsible>
              <CollapsibleTrigger>View Details</CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="p-4 bg-muted rounded">
                  {JSON.stringify(interrupt.context.details, null, 2)}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="default" onClick={() => onApprove(interrupt.interruptId)}>
          Approve
        </Button>
        <Button variant="destructive" onClick={() => onReject(interrupt.interruptId)}>
          Reject
        </Button>
        <Button variant="outline" onClick={() => onRequestInfo(interrupt.interruptId)}>
          Request More Info
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 4.4 Resume Flow After Approval

```python
# Backend: Handle approval response
from ag_ui.core import ApprovalResponseEvent

async def handle_approval_response(response: ApprovalResponseEvent):
    """Process approval response and resume workflow."""

    # Get the paused execution
    execution = await get_execution(response.interrupt_id)

    if response.approved:
        # Log approval
        await audit_log.record(
            event_type="approval_granted",
            interrupt_id=response.interrupt_id,
            reviewer=response.reviewer,
            execution_id=execution.id
        )

        # Resume execution
        await execution.resume(
            approval_context={
                "approved_by": response.reviewer,
                "approved_at": datetime.utcnow(),
                "conditions": response.conditions
            }
        )

        # Emit continuation events
        yield ToolCallEndEvent(tool_call_id=execution.pending_tool_call_id)

        # Execute the approved action
        result = await execute_tool(execution.pending_tool_call)
        yield ToolCallResultEvent(
            tool_call_id=execution.pending_tool_call_id,
            result=result
        )
    else:
        # Log rejection
        await audit_log.record(
            event_type="approval_rejected",
            interrupt_id=response.interrupt_id,
            reviewer=response.reviewer,
            reason=response.reason
        )

        # Cancel the pending action
        yield ToolCallEndEvent(
            tool_call_id=execution.pending_tool_call_id,
            status="cancelled"
        )

        # Emit rejection message
        yield TextMessageEvent(
            content=f"Action rejected by {response.reviewer}: {response.reason}"
        )
```

### 4.5 Rejection Handling UX

```typescript
// Rejection Dialog with Reason
function RejectionDialog({
  interruptId,
  onReject
}: {
  interruptId: string;
  onReject: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<string>();

  const rejectionCategories = [
    { value: 'security_concern', label: 'Security Concern' },
    { value: 'incorrect_scope', label: 'Incorrect Scope' },
    { value: 'not_authorized', label: 'Not Authorized' },
    { value: 'needs_review', label: 'Needs Further Review' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Action</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {rejectionCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reason (Optional)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide additional context..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onReject(`[${category}] ${reason}`)}
            disabled={!category}
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 5. Issue/Alert Management

### 5.1 Error Detection and Classification

**Sources**: [Notification Design Best Practices](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/), [Stackify Alerts](https://docs.stackify.com/docs/alerts-and-notifications-overview)

```typescript
// Alert Classification Schema
interface Alert {
  id: string;
  timestamp: Date;

  // Classification
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category:
    | 'execution_failure'
    | 'performance_degradation'
    | 'resource_exhaustion'
    | 'security_event'
    | 'integration_error'
    | 'rate_limit'
    | 'cost_threshold';

  // Context
  source: {
    type: 'agent' | 'workflow' | 'system' | 'integration';
    id: string;
    name: string;
  };

  // Details
  title: string;
  description: string;
  metadata: Record<string, any>;

  // State
  status: 'active' | 'acknowledged' | 'snoozed' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  snoozedUntil?: Date;
  resolvedAt?: Date;

  // Actions
  suggestedActions: SuggestedAction[];
}

interface SuggestedAction {
  label: string;
  type: 'link' | 'action' | 'runbook';
  target: string;
}
```

### 5.2 Alert Severity Levels

| Severity | Color | Use Case | Response SLA |
|----------|-------|----------|--------------|
| **Critical** | Red | System down, data loss risk | < 15 min |
| **High** | Orange | Degraded service, failures | < 1 hour |
| **Medium** | Yellow | Performance issues, warnings | < 4 hours |
| **Low** | Blue | Minor issues, optimization | < 24 hours |
| **Info** | Gray | FYI, no action needed | N/A |

### 5.3 Alert Dashboard Layout

```
+------------------------------------------------------------------+
|                    ALERTS & ISSUES                                 |
|  [ Active (7) ] [ Acknowledged (3) ] [ Resolved (124) ]           |
+------------------------------------------------------------------+
|                                                                    |
|  CRITICAL ALERTS (2)                                              |
|  +--------------------------------------------------------------+  |
|  | [X] Agent execution rate limit exceeded                       |  |
|  |     RAG Retriever Agent | 3 min ago                          |  |
|  |     Rate: 150/min (limit: 100/min)                           |  |
|  |     [ View ] [ Acknowledge ] [ Snooze ] [ Create Incident ]  |  |
|  +--------------------------------------------------------------+  |
|  | [X] Database connection pool exhausted                        |  |
|  |     System | 12 min ago                                      |  |
|  |     Active: 100/100 connections                              |  |
|  |     [ View ] [ Acknowledge ] [ Snooze ] [ Create Incident ]  |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  HIGH PRIORITY (3)                                                |
|  +--------------------------------------------------------------+  |
|  | [!] Token budget exceeded for workspace                       |  |
|  |     Workspace: acme-corp | 1 hour ago                        |  |
|  |     Usage: $125.47 (budget: $100.00)                         |  |
|  |     [ View ] [ Acknowledge ] [ Snooze ]                      |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.4 Snooze and Acknowledge Patterns

```typescript
// Snooze Configuration
interface SnoozeConfig {
  duration: number; // minutes
  scope: 'self' | 'everyone';
  reason?: string;
}

const snoozeDurations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
  { value: 1440, label: '24 hours' },
  { value: -1, label: 'Until resolved' }
];

async function snoozeAlert(alertId: string, config: SnoozeConfig) {
  // Update alert status
  await updateAlert(alertId, {
    status: 'snoozed',
    snoozedUntil: config.duration > 0
      ? addMinutes(new Date(), config.duration)
      : null,
    snoozedBy: currentUser.id,
    snoozeScope: config.scope
  });

  // If scope is 'self', create per-user snooze
  if (config.scope === 'self') {
    await createUserSnooze(currentUser.id, alertId, config.duration);
  }

  // Schedule unsnooze
  if (config.duration > 0) {
    await scheduleJob('unsnooze_alert', {
      alertId,
      executeAt: addMinutes(new Date(), config.duration)
    });
  }
}

async function acknowledgeAlert(alertId: string) {
  // Acknowledge stops notifications until alert cycles
  await updateAlert(alertId, {
    status: 'acknowledged',
    acknowledgedBy: currentUser.id,
    acknowledgedAt: new Date()
  });

  // Log acknowledgment
  await auditLog.record({
    eventType: 'alert_acknowledged',
    alertId,
    userId: currentUser.id
  });
}
```

### 5.5 Notification Channels

```typescript
// Multi-Channel Notification Configuration
interface NotificationPolicy {
  alertSeverity: Alert['severity'];
  channels: NotificationChannel[];
  escalationPolicy?: EscalationPolicy;
}

interface NotificationChannel {
  type: 'in_app' | 'email' | 'slack' | 'pagerduty' | 'webhook';
  config: Record<string, any>;
  enabled: boolean;
}

const defaultNotificationPolicies: NotificationPolicy[] = [
  {
    alertSeverity: 'critical',
    channels: [
      { type: 'in_app', config: {}, enabled: true },
      { type: 'slack', config: { channel: '#alerts-critical' }, enabled: true },
      { type: 'pagerduty', config: { severity: 'critical' }, enabled: true },
      { type: 'email', config: { immediate: true }, enabled: true }
    ]
  },
  {
    alertSeverity: 'high',
    channels: [
      { type: 'in_app', config: {}, enabled: true },
      { type: 'slack', config: { channel: '#alerts' }, enabled: true },
      { type: 'email', config: { digest: '15min' }, enabled: true }
    ]
  },
  {
    alertSeverity: 'medium',
    channels: [
      { type: 'in_app', config: {}, enabled: true },
      { type: 'email', config: { digest: 'hourly' }, enabled: true }
    ]
  },
  {
    alertSeverity: 'low',
    channels: [
      { type: 'in_app', config: {}, enabled: true },
      { type: 'email', config: { digest: 'daily' }, enabled: true }
    ]
  }
];
```

### 5.6 Resolution Workflow

```typescript
// Alert Resolution Flow
interface AlertResolution {
  alertId: string;
  resolvedBy: 'user' | 'system' | 'auto_heal';
  resolution: {
    type: 'fixed' | 'false_positive' | 'expected_behavior' | 'wont_fix';
    notes?: string;
    rootCause?: string;
    preventionAction?: string;
  };
  relatedItems?: {
    incidents?: string[];
    commits?: string[];
    tickets?: string[];
  };
}

async function resolveAlert(resolution: AlertResolution) {
  // Update alert
  await updateAlert(resolution.alertId, {
    status: 'resolved',
    resolvedAt: new Date(),
    resolution: resolution.resolution
  });

  // Link related items
  if (resolution.relatedItems) {
    await linkAlertToItems(resolution.alertId, resolution.relatedItems);
  }

  // Create knowledge base entry if root cause provided
  if (resolution.resolution.rootCause) {
    await createKnowledgeEntry({
      type: 'alert_resolution',
      alertId: resolution.alertId,
      rootCause: resolution.resolution.rootCause,
      prevention: resolution.resolution.preventionAction
    });
  }

  // Notify watchers
  await notifyAlertResolved(resolution.alertId);
}
```

---

## 6. Activity Timeline Design

### 6.1 Event Schema for Timeline Entries

**Sources**: [Material UI Timeline](https://mui.com/material-ui/react-timeline/), [react-event-timeline](https://github.com/rcdexta/react-event-timeline)

```typescript
// Timeline Event Schema
interface TimelineEvent {
  id: string;
  timestamp: Date;

  // Event Classification
  type: TimelineEventType;
  category: 'agent' | 'workflow' | 'approval' | 'alert' | 'system' | 'user';

  // Display
  title: string;
  description?: string;
  icon?: string;
  color?: string;

  // Context
  source: {
    type: string;
    id: string;
    name: string;
  };

  // Actor (who/what caused the event)
  actor?: {
    type: 'user' | 'agent' | 'system';
    id: string;
    name: string;
    avatar?: string;
  };

  // Related entities
  relatedTo?: {
    type: string;
    id: string;
  }[];

  // Expandable details
  details?: Record<string, any>;

  // Grouping
  groupId?: string; // For related events
  parentId?: string; // For hierarchical events
}

type TimelineEventType =
  // Agent events
  | 'agent_started'
  | 'agent_completed'
  | 'agent_failed'
  | 'agent_paused'
  | 'agent_resumed'
  // Workflow events
  | 'workflow_started'
  | 'workflow_step_completed'
  | 'workflow_completed'
  | 'workflow_failed'
  // Approval events
  | 'approval_requested'
  | 'approval_granted'
  | 'approval_rejected'
  | 'approval_timeout'
  // Alert events
  | 'alert_triggered'
  | 'alert_acknowledged'
  | 'alert_resolved'
  // Tool events
  | 'tool_called'
  | 'tool_completed'
  | 'tool_failed'
  // System events
  | 'deployment'
  | 'config_changed'
  | 'user_action';
```

### 6.2 Timeline Component Design

```
+------------------------------------------------------------------+
|                    ACTIVITY TIMELINE                              |
|  [ Filter: All Types ] [ Search... ]  [ Today | Week | Custom ]  |
+------------------------------------------------------------------+
|                                                                    |
|  TODAY                                                            |
|  ------                                                           |
|                                                                    |
|  14:32  [✓] Agent Completed                                       |
|         |  Document Analyzer Agent completed successfully          |
|         |  Duration: 2.3s | Tokens: 1,247 | Cost: $0.03           |
|         |  [ View Details ] [ View Logs ]                         |
|         |                                                         |
|  14:30  [⏸] Approval Requested                                    |
|         |  Waiting for approval on batch delete operation          |
|         |  Requested by: RAG Retriever Agent                       |
|         |  [ View Queue ]                                         |
|         |                                                         |
|  14:28  [▶] Agent Started                                         |
|         |  Document Analyzer Agent started                         |
|         |  Triggered by: scheduled_task                           |
|         |                                                         |
|  14:15  [⚠] Alert Triggered                                       |
|         |  High token usage detected                               |
|         |  Workspace: acme-corp | Threshold: $100                 |
|         |  [ View Alert ]                                         |
|         |                                                         |
|  13:45  [✗] Agent Failed                                          |
|    |    |  API Integration Agent failed                           |
|    |    |  Error: Connection timeout to external API              |
|    |    |  [ View Error ] [ Retry ]                               |
|    |    |                                                         |
|    |    |  + Retry #1 at 13:46 - Failed                           |
|    |    |  + Retry #2 at 13:48 - Success                          |
|    |                                                              |
+------------------------------------------------------------------+
|  [ Load More ]                                                    |
+------------------------------------------------------------------+
```

### 6.3 A2UI Timeline Component

```json
{
  "updateComponents": {
    "surfaceId": "command_center",
    "components": [
      {
        "id": "activity_timeline",
        "component": "Timeline",
        "orientation": "vertical",
        "children": { "path": "/timeline/events", "childTemplate": "timeline_item" }
      },
      {
        "id": "timeline_item",
        "component": "TimelineItem",
        "children": ["timeline_marker", "timeline_content"]
      },
      {
        "id": "timeline_marker",
        "component": "TimelineMarker",
        "icon": { "path": "{{item}}/icon" },
        "color": { "path": "{{item}}/color" }
      },
      {
        "id": "timeline_content",
        "component": "Column",
        "children": ["timeline_header", "timeline_body", "timeline_actions"]
      },
      {
        "id": "timeline_header",
        "component": "Row",
        "children": ["timeline_title", "timeline_time"]
      },
      {
        "id": "timeline_title",
        "component": "Text",
        "text": { "path": "{{item}}/title" },
        "style": "label-bold"
      },
      {
        "id": "timeline_time",
        "component": "Text",
        "text": { "path": "{{item}}/timestamp", "format": "relative" },
        "style": "caption"
      },
      {
        "id": "timeline_body",
        "component": "Text",
        "text": { "path": "{{item}}/description" },
        "style": "body"
      }
    ]
  }
}
```

### 6.4 Filtering and Search

```typescript
// Timeline Filter Configuration
interface TimelineFilters {
  types?: TimelineEventType[];
  categories?: string[];
  sources?: string[];
  actors?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// Filter Component
function TimelineFilterBar({
  filters,
  onFilterChange
}: {
  filters: TimelineFilters;
  onFilterChange: (filters: TimelineFilters) => void;
}) {
  return (
    <div className="flex gap-4 items-center">
      <MultiSelect
        label="Event Types"
        options={eventTypeOptions}
        value={filters.types}
        onChange={(types) => onFilterChange({ ...filters, types })}
      />

      <MultiSelect
        label="Categories"
        options={categoryOptions}
        value={filters.categories}
        onChange={(categories) => onFilterChange({ ...filters, categories })}
      />

      <Input
        placeholder="Search events..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />

      <DateRangePicker
        value={filters.dateRange}
        onChange={(dateRange) => onFilterChange({ ...filters, dateRange })}
      />
    </div>
  );
}
```

### 6.5 Grouping Related Events

```typescript
// Event Grouping Logic
function groupTimelineEvents(events: TimelineEvent[]): GroupedTimelineEvent[] {
  const groups: Map<string, TimelineEvent[]> = new Map();
  const standalone: TimelineEvent[] = [];

  events.forEach((event) => {
    if (event.groupId) {
      const existing = groups.get(event.groupId) || [];
      groups.set(event.groupId, [...existing, event]);
    } else {
      standalone.push(event);
    }
  });

  const grouped: GroupedTimelineEvent[] = [];

  // Convert groups to grouped events
  groups.forEach((groupEvents, groupId) => {
    const primary = groupEvents[0]; // First event is primary
    grouped.push({
      ...primary,
      isGroup: true,
      childEvents: groupEvents.slice(1),
      expandable: groupEvents.length > 1
    });
  });

  // Add standalone events
  standalone.forEach((event) => {
    grouped.push({
      ...event,
      isGroup: false,
      childEvents: [],
      expandable: false
    });
  });

  // Sort by timestamp
  return grouped.sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  );
}
```

### 6.6 Real-Time Appending

```typescript
// Real-time Timeline Updates
function useTimelineStream(workspaceId: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/workspaces/${workspaceId}/timeline/stream`
    );

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.addEventListener('timeline_event', (e) => {
      const newEvent = JSON.parse(e.data);

      setEvents((prev) => {
        // Prepend new event
        const updated = [newEvent, ...prev];

        // Limit to last 100 events in memory
        return updated.slice(0, 100);
      });
    });

    eventSource.addEventListener('timeline_update', (e) => {
      const update = JSON.parse(e.data);

      setEvents((prev) =>
        prev.map((event) =>
          event.id === update.id ? { ...event, ...update } : event
        )
      );
    });

    return () => eventSource.close();
  }, [workspaceId]);

  return { events, isConnected };
}
```

### 6.7 Pagination for History

```typescript
// Infinite Scroll Timeline with Cursor Pagination
function useTimelinePagination(workspaceId: string, filters: TimelineFilters) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    const response = await fetch('/api/timeline', {
      method: 'POST',
      body: JSON.stringify({
        workspaceId,
        filters,
        cursor,
        limit: 50
      })
    });

    const data = await response.json();

    setEvents((prev) => [...prev, ...data.events]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setIsLoading(false);
  }, [workspaceId, filters, cursor, isLoading, hasMore]);

  // Reset on filter change
  useEffect(() => {
    setEvents([]);
    setCursor(null);
    setHasMore(true);
  }, [filters]);

  return { events, loadMore, hasMore, isLoading };
}
```

---

## 7. Metrics and Charts

### 7.1 Key Metrics for Agent Platforms

**Sources**: [LangSmith Observability](https://www.langchain.com/langsmith/observability), [Langfuse Cost Tracking](https://langfuse.com/docs/observability/features/token-and-cost-tracking)

| Metric | Description | Visualization |
|--------|-------------|---------------|
| **Execution Success Rate** | % of successful executions | Gauge, Line chart |
| **Average Execution Time** | Mean latency per execution | Line chart, Histogram |
| **Token Usage** | Input/output tokens consumed | Stacked bar, Line |
| **Cost** | $ spent on LLM calls | Line chart, Running total |
| **Queue Depth** | Pending approvals/tasks | Gauge, Area chart |
| **Error Rate** | Failures per time period | Line chart, Bar |
| **Active Agents** | Currently running agents | Counter, Status grid |
| **Throughput** | Executions per minute | Line chart |

### 7.2 Tremor Dashboard Components

**Sources**: [Tremor](https://www.tremor.so/), [Tremor Blocks](https://blocks.tremor.so)

```typescript
// Tremor Metrics Dashboard
import {
  Card,
  Title,
  Text,
  Metric,
  Flex,
  ProgressBar,
  AreaChart,
  DonutChart,
  BarList
} from '@tremor/react';

function AgentMetricsDashboard({ metrics }: { metrics: AgentMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Success Rate */}
      <Card>
        <Text>Success Rate</Text>
        <Metric>{metrics.successRate}%</Metric>
        <Flex className="mt-4">
          <Text>Target: 99%</Text>
          <Text>{metrics.successRate >= 99 ? 'On Track' : 'Below Target'}</Text>
        </Flex>
        <ProgressBar value={metrics.successRate} className="mt-2" />
      </Card>

      {/* Average Execution Time */}
      <Card>
        <Text>Avg Execution Time</Text>
        <Metric>{metrics.avgExecutionTime}s</Metric>
        <AreaChart
          className="mt-4 h-24"
          data={metrics.executionTimeHistory}
          index="time"
          categories={['duration']}
          colors={['blue']}
          showXAxis={false}
          showYAxis={false}
          showLegend={false}
        />
      </Card>

      {/* Token Usage */}
      <Card>
        <Text>Token Usage (24h)</Text>
        <Metric>{formatNumber(metrics.tokenUsage24h)}</Metric>
        <DonutChart
          className="mt-4"
          data={[
            { name: 'Input', value: metrics.inputTokens },
            { name: 'Output', value: metrics.outputTokens },
            { name: 'Reasoning', value: metrics.reasoningTokens }
          ]}
          category="value"
          index="name"
          colors={['blue', 'cyan', 'violet']}
        />
      </Card>

      {/* Cost */}
      <Card>
        <Text>Cost (MTD)</Text>
        <Metric>${metrics.costMTD.toFixed(2)}</Metric>
        <Flex className="mt-4">
          <Text>Budget: ${metrics.budget}</Text>
          <Text>{((metrics.costMTD / metrics.budget) * 100).toFixed(0)}%</Text>
        </Flex>
        <ProgressBar
          value={(metrics.costMTD / metrics.budget) * 100}
          color={metrics.costMTD > metrics.budget * 0.8 ? 'red' : 'blue'}
          className="mt-2"
        />
      </Card>
    </div>
  );
}
```

### 7.3 Real-Time Chart Updates

```typescript
// Real-time Chart with Sliding Window
import { AreaChart } from '@tremor/react';
import { useState, useEffect } from 'react';

function RealTimeMetricsChart({
  metricStream,
  windowMinutes = 60
}: {
  metricStream: EventSource;
  windowMinutes: number;
}) {
  const [data, setData] = useState<MetricDataPoint[]>([]);
  const maxPoints = windowMinutes; // 1 point per minute

  useEffect(() => {
    metricStream.addEventListener('metric', (event) => {
      const point = JSON.parse(event.data);

      setData((prev) => {
        const updated = [...prev, point];
        // Keep only last N points (sliding window)
        return updated.slice(-maxPoints);
      });
    });
  }, [metricStream, maxPoints]);

  return (
    <Card>
      <Title>Executions per Minute (Live)</Title>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="timestamp"
        categories={['executions', 'errors']}
        colors={['blue', 'red']}
        showLegend
        showAnimation
        // Auto-scroll X axis
        autoMinValue
      />
    </Card>
  );
}
```

### 7.4 A2UI Chart Component

> **Note**: The `Chart` component is not part of the A2UI standard catalog and requires a custom component catalog implementation. See [A2UI Custom Components Guide](https://github.com/google/a2ui/blob/main/docs/guides/custom-components.md).

```json
{
  "updateComponents": {
    "surfaceId": "command_center",
    "components": [
      {
        "id": "metrics_chart",
        "component": "Chart",
        "chartType": "area",
        "data": { "path": "/metrics/executionHistory" },
        "xAxis": {
          "dataKey": "timestamp",
          "format": "time"
        },
        "series": [
          {
            "dataKey": "successCount",
            "name": "Successful",
            "color": "green"
          },
          {
            "dataKey": "failureCount",
            "name": "Failed",
            "color": "red"
          }
        ],
        "legend": true,
        "tooltip": true
      }
    ]
  }
}
```

### 7.5 Cost Tracking Dashboard

```typescript
// Cost Tracking Component
function CostTrackingDashboard({ workspaceId }: { workspaceId: string }) {
  const { data: costs } = useSWR(`/api/workspaces/${workspaceId}/costs`);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <Text>Today</Text>
          <Metric>${costs?.today?.toFixed(2)}</Metric>
        </Card>
        <Card>
          <Text>This Week</Text>
          <Metric>${costs?.week?.toFixed(2)}</Metric>
        </Card>
        <Card>
          <Text>This Month</Text>
          <Metric>${costs?.month?.toFixed(2)}</Metric>
        </Card>
        <Card>
          <Text>Budget Remaining</Text>
          <Metric className={costs?.remaining < 0 ? 'text-red-500' : ''}>
            ${costs?.remaining?.toFixed(2)}
          </Metric>
        </Card>
      </div>

      {/* Cost Breakdown by Agent */}
      <Card>
        <Title>Cost by Agent</Title>
        <BarList
          data={costs?.byAgent?.map((a) => ({
            name: a.agentName,
            value: a.cost
          }))}
          valueFormatter={(v) => `$${v.toFixed(2)}`}
        />
      </Card>

      {/* Cost Over Time */}
      <Card>
        <Title>Cost Trend</Title>
        <AreaChart
          data={costs?.history}
          index="date"
          categories={['cost']}
          colors={['blue']}
          valueFormatter={(v) => `$${v.toFixed(2)}`}
        />
      </Card>

      {/* Cost by Model */}
      <Card>
        <Title>Cost by Model</Title>
        <DonutChart
          data={costs?.byModel}
          category="cost"
          index="model"
          valueFormatter={(v) => `$${v.toFixed(2)}`}
        />
      </Card>
    </div>
  );
}
```

---

## 8. Multi-Tenant Dashboard

### 8.1 Workspace-Scoped Views

```typescript
// Multi-Tenant Dashboard Context
interface DashboardContext {
  organization: Organization;
  workspace: Workspace;
  user: User;
  permissions: Permission[];
}

function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: context } = useSWR('/api/dashboard/context');

  if (!context) return <DashboardSkeleton />;

  return (
    <DashboardContextProvider value={context}>
      {children}
    </DashboardContextProvider>
  );
}

// Workspace Selector
function WorkspaceSelector() {
  const { workspaces, currentWorkspace, setWorkspace } = useWorkspaces();

  return (
    <Select value={currentWorkspace.id} onValueChange={setWorkspace}>
      <SelectTrigger>
        <SelectValue>
          <div className="flex items-center gap-2">
            <WorkspaceIcon workspace={currentWorkspace} />
            {currentWorkspace.name}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((ws) => (
          <SelectItem key={ws.id} value={ws.id}>
            <div className="flex items-center gap-2">
              <WorkspaceIcon workspace={ws} />
              {ws.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 8.2 Project-Level Drill-Down

```typescript
// Hierarchical Navigation: Org > Workspace > Project > Agent
function DashboardBreadcrumb() {
  const { organization, workspace, project, agent } = useDashboardContext();

  return (
    <Breadcrumb>
      <BreadcrumbItem href={`/orgs/${organization.id}`}>
        {organization.name}
      </BreadcrumbItem>
      <BreadcrumbItem href={`/workspaces/${workspace.id}`}>
        {workspace.name}
      </BreadcrumbItem>
      {project && (
        <BreadcrumbItem href={`/projects/${project.id}`}>
          {project.name}
        </BreadcrumbItem>
      )}
      {agent && (
        <BreadcrumbItem href={`/agents/${agent.id}`}>
          {agent.name}
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}

// Project Dashboard
function ProjectDashboard({ projectId }: { projectId: string }) {
  const { data: project } = useSWR(`/api/projects/${projectId}`);
  const { data: agents } = useSWR(`/api/projects/${projectId}/agents`);
  const { data: metrics } = useSWR(`/api/projects/${projectId}/metrics`);

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />

      {/* Agent Status Grid */}
      <div className="grid grid-cols-3 gap-4">
        {agents?.map((agent) => (
          <AgentStatusCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Project Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* Recent Activity */}
      <ActivityTimeline projectId={projectId} limit={10} />
    </div>
  );
}
```

### 8.3 Role-Based Access Control

```typescript
// Permission-Aware Components
interface DashboardPermissions {
  canViewAgents: boolean;
  canManageAgents: boolean;
  canApprove: boolean;
  canViewMetrics: boolean;
  canViewCosts: boolean;
  canManageAlerts: boolean;
  canAccessAuditLog: boolean;
}

function usePermissions(): DashboardPermissions {
  const { user, workspace } = useDashboardContext();

  const role = workspace.members.find(m => m.userId === user.id)?.role;

  return {
    canViewAgents: ['viewer', 'member', 'admin', 'owner'].includes(role),
    canManageAgents: ['member', 'admin', 'owner'].includes(role),
    canApprove: ['approver', 'admin', 'owner'].includes(role),
    canViewMetrics: ['viewer', 'member', 'admin', 'owner'].includes(role),
    canViewCosts: ['admin', 'owner'].includes(role),
    canManageAlerts: ['admin', 'owner'].includes(role),
    canAccessAuditLog: ['admin', 'owner'].includes(role)
  };
}

// Permission-Gated Component
function ProtectedComponent({
  permission,
  children,
  fallback = null
}: {
  permission: keyof DashboardPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const permissions = usePermissions();

  if (!permissions[permission]) {
    return fallback;
  }

  return <>{children}</>;
}

// Usage
function ApprovalQueue() {
  return (
    <ProtectedComponent
      permission="canApprove"
      fallback={<NoAccessCard message="You don't have approval permissions" />}
    >
      <ApprovalQueueContent />
    </ProtectedComponent>
  );
}
```

### 8.4 Data Isolation in Real-Time Feeds

```typescript
// Workspace-Scoped SSE Connection
function useWorkspaceStream(workspaceId: string) {
  const { accessToken } = useAuth();

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/workspaces/${workspaceId}/stream`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    // Server validates:
    // 1. Token is valid
    // 2. User has access to workspace
    // 3. Only sends events for this workspace

    return () => eventSource.close();
  }, [workspaceId, accessToken]);
}

// Backend: Workspace-Scoped Event Broadcasting
class WorkspaceEventBroadcaster {
  async broadcast(workspaceId: string, event: DashboardEvent) {
    // Get all active connections for this workspace
    const connections = await this.getWorkspaceConnections(workspaceId);

    for (const conn of connections) {
      // Verify permission for event type
      if (this.canReceiveEvent(conn.user, event)) {
        conn.send(event);
      }
    }
  }

  private canReceiveEvent(user: User, event: DashboardEvent): boolean {
    // Cost events only for admins
    if (event.type === 'cost_update' && !user.isAdmin) {
      return false;
    }

    // Approval events only for approvers
    if (event.type === 'approval_request' && !user.canApprove) {
      return false;
    }

    return true;
  }
}
```

---

## 9. Technical Implementation

### 9.1 React Component Architecture

```
src/
  components/
    command-center/
      CommandCenterLayout.tsx       # Main layout wrapper
      CommandCenterHeader.tsx       # Header with workspace selector

      agent-status/
        AgentStatusGrid.tsx         # Grid of agent cards
        AgentStatusCard.tsx         # Individual agent card
        AgentDetailsDrawer.tsx      # Slide-out details

      approval-queue/
        ApprovalQueue.tsx           # Queue container
        ApprovalItem.tsx            # Individual approval card
        ApprovalDialog.tsx          # Approval/rejection dialog
        ApprovalFilters.tsx         # Filter controls

      alerts/
        AlertsPanel.tsx             # Alerts container
        AlertCard.tsx               # Individual alert
        AlertDetailsSheet.tsx       # Alert details
        SnoozeDialog.tsx            # Snooze configuration

      timeline/
        ActivityTimeline.tsx        # Timeline container
        TimelineEvent.tsx           # Individual event
        TimelineFilters.tsx         # Filter controls

      metrics/
        MetricsDashboard.tsx        # Metrics container
        MetricCard.tsx              # Individual metric
        ChartPanel.tsx              # Chart container
        CostBreakdown.tsx           # Cost tracking

    ui/                            # shadcn/ui components
    a2ui/
      A2UIRenderer.tsx             # A2UI JSON renderer
      A2UIComponentMap.tsx         # Component mapping

  hooks/
    useAgentStatus.ts              # Agent status subscription
    useApprovalQueue.ts            # Approval queue state
    useAlerts.ts                   # Alerts subscription
    useTimeline.ts                 # Timeline with pagination
    useMetrics.ts                  # Metrics subscription
    useDashboardStream.ts          # SSE connection manager
    usePermissions.ts              # RBAC hooks

  stores/
    dashboardStore.ts              # Zustand store

  lib/
    api.ts                         # API client
    sse.ts                         # SSE utilities
    a2ui.ts                        # A2UI utilities
```

### 9.2 Zustand State Management

**Sources**: [Zustand GitHub](https://github.com/pmndrs/zustand), [State Management 2025](https://makersden.io/blog/react-state-management-in-2025), [npm trends](https://npmtrends.com/zustand)

> **Note**: Zustand has 15M+ weekly npm downloads and 56K+ GitHub stars as of 2025, making it one of the most popular React state management libraries.

```typescript
// Dashboard Zustand Store
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

interface DashboardState {
  // Connection State
  isConnected: boolean;
  connectionError: string | null;

  // Agent Status
  agents: Record<string, AgentStatus>;
  selectedAgentId: string | null;

  // Approval Queue
  approvalItems: ApprovalItem[];
  approvalFilters: ApprovalFilters;

  // Alerts
  alerts: Alert[];
  alertFilters: AlertFilters;

  // Timeline
  timelineEvents: TimelineEvent[];
  timelineFilters: TimelineFilters;

  // Metrics
  metrics: DashboardMetrics | null;

  // Actions
  setConnected: (connected: boolean) => void;
  updateAgent: (agentId: string, status: Partial<AgentStatus>) => void;
  addApprovalItem: (item: ApprovalItem) => void;
  removeApprovalItem: (itemId: string) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (alertId: string, updates: Partial<Alert>) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector(
    immer((set) => ({
      // Initial State
      isConnected: false,
      connectionError: null,
      agents: {},
      selectedAgentId: null,
      approvalItems: [],
      approvalFilters: { status: 'pending' },
      alerts: [],
      alertFilters: { status: 'active' },
      timelineEvents: [],
      timelineFilters: {},
      metrics: null,

      // Actions
      setConnected: (connected) =>
        set((state) => {
          state.isConnected = connected;
          state.connectionError = connected ? null : state.connectionError;
        }),

      updateAgent: (agentId, status) =>
        set((state) => {
          state.agents[agentId] = {
            ...state.agents[agentId],
            ...status,
            lastUpdated: new Date()
          };
        }),

      addApprovalItem: (item) =>
        set((state) => {
          state.approvalItems.unshift(item);
        }),

      removeApprovalItem: (itemId) =>
        set((state) => {
          state.approvalItems = state.approvalItems.filter(
            (i) => i.id !== itemId
          );
        }),

      addAlert: (alert) =>
        set((state) => {
          state.alerts.unshift(alert);
        }),

      updateAlert: (alertId, updates) =>
        set((state) => {
          const index = state.alerts.findIndex((a) => a.id === alertId);
          if (index !== -1) {
            state.alerts[index] = { ...state.alerts[index], ...updates };
          }
        }),

      addTimelineEvent: (event) =>
        set((state) => {
          state.timelineEvents.unshift(event);
          // Keep last 100 events
          if (state.timelineEvents.length > 100) {
            state.timelineEvents = state.timelineEvents.slice(0, 100);
          }
        }),

      updateMetrics: (metrics) =>
        set((state) => {
          state.metrics = { ...state.metrics, ...metrics };
        })
    }))
  )
);

// Selectors
export const selectPendingApprovals = (state: DashboardState) =>
  state.approvalItems.filter((i) => i.status === 'pending');

export const selectActiveAlerts = (state: DashboardState) =>
  state.alerts.filter((a) => a.status === 'active');

export const selectRunningAgents = (state: DashboardState) =>
  Object.values(state.agents).filter((a) => a.status === 'running');
```

### 9.3 SSE Client Setup

```typescript
// Resilient SSE Client
class DashboardSSEClient {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat: Date | null = null;

  constructor(
    private endpoint: string,
    private handlers: SSEHandlers,
    private store: typeof useDashboardStore
  ) {}

  connect() {
    this.eventSource = new EventSource(this.endpoint, {
      withCredentials: true
    });

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      this.store.getState().setConnected(true);
      this.startHeartbeatMonitor();
    };

    this.eventSource.onerror = () => {
      this.handleDisconnect();
    };

    // Register event handlers
    this.registerEventHandlers();
  }

  private registerEventHandlers() {
    // Heartbeat
    this.eventSource?.addEventListener('heartbeat', () => {
      this.lastHeartbeat = new Date();
    });

    // Agent updates
    this.eventSource?.addEventListener('agent_update', (e) => {
      const data = JSON.parse(e.data);
      this.store.getState().updateAgent(data.agentId, data.status);
    });

    // Approval items
    this.eventSource?.addEventListener('approval_request', (e) => {
      const data = JSON.parse(e.data);
      this.store.getState().addApprovalItem(data);
      this.handlers.onApprovalRequest?.(data);
    });

    // Alerts
    this.eventSource?.addEventListener('alert', (e) => {
      const data = JSON.parse(e.data);
      this.store.getState().addAlert(data);
      this.handlers.onAlert?.(data);
    });

    // Timeline events
    this.eventSource?.addEventListener('timeline_event', (e) => {
      const data = JSON.parse(e.data);
      this.store.getState().addTimelineEvent(data);
    });

    // Metrics
    this.eventSource?.addEventListener('metrics', (e) => {
      const data = JSON.parse(e.data);
      this.store.getState().updateMetrics(data);
    });
  }

  private startHeartbeatMonitor() {
    this.heartbeatInterval = setInterval(() => {
      if (this.lastHeartbeat) {
        const elapsed = Date.now() - this.lastHeartbeat.getTime();
        if (elapsed > 30000) { // 30 seconds without heartbeat
          this.handleDisconnect();
        }
      }
    }, 10000);
  }

  private handleDisconnect() {
    this.eventSource?.close();
    this.store.getState().setConnected(false);

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(
        this.baseDelay * Math.pow(2, this.reconnectAttempts),
        30000
      );
      this.reconnectAttempts++;

      setTimeout(() => this.connect(), delay);
    }
  }

  disconnect() {
    this.eventSource?.close();
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}
```

### 9.4 Supabase Realtime Integration

```typescript
// Supabase Realtime for Dashboard
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

class SupabaseDashboardClient {
  private client: SupabaseClient;
  private channels: Map<string, RealtimeChannel> = new Map();

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  subscribeToWorkspace(workspaceId: string, handlers: DashboardHandlers) {
    // Agent Executions Channel
    const executionsChannel = this.client
      .channel(`workspace:${workspaceId}:executions`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_executions',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            handlers.onExecutionStarted?.(payload.new);
          } else if (payload.eventType === 'UPDATE') {
            handlers.onExecutionUpdated?.(payload.new);
          }
        }
      )
      .subscribe();

    this.channels.set('executions', executionsChannel);

    // Approvals Channel (using Broadcast for scale)
    const approvalsChannel = this.client
      .channel(`workspace:${workspaceId}:approvals`)
      .on('broadcast', { event: 'approval_request' }, ({ payload }) => {
        handlers.onApprovalRequest?.(payload);
      })
      .on('broadcast', { event: 'approval_resolved' }, ({ payload }) => {
        handlers.onApprovalResolved?.(payload);
      })
      .subscribe();

    this.channels.set('approvals', approvalsChannel);

    // Alerts Channel
    const alertsChannel = this.client
      .channel(`workspace:${workspaceId}:alerts`)
      .on('broadcast', { event: 'alert' }, ({ payload }) => {
        handlers.onAlert?.(payload);
      })
      .subscribe();

    this.channels.set('alerts', alertsChannel);

    // Presence for active users
    const presenceChannel = this.client
      .channel(`workspace:${workspaceId}:presence`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        handlers.onPresenceSync?.(state);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: handlers.userId,
            online_at: new Date().toISOString()
          });
        }
      });

    this.channels.set('presence', presenceChannel);
  }

  unsubscribe() {
    this.channels.forEach((channel) => {
      this.client.removeChannel(channel);
    });
    this.channels.clear();
  }
}
```

### 9.5 Performance Optimization

```typescript
// Performance Optimizations for High-Frequency Updates

// 1. Debounce metric updates
const debouncedMetricUpdate = useMemo(
  () => debounce((metrics: DashboardMetrics) => {
    useDashboardStore.getState().updateMetrics(metrics);
  }, 100),
  []
);

// 2. Virtualized Timeline
import { FixedSizeList as List } from 'react-window';

function VirtualizedTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <List
      height={600}
      itemCount={events.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <TimelineEventRow event={events[index]} />
        </div>
      )}
    </List>
  );
}

// 3. Memoized Components
const AgentStatusCard = memo(function AgentStatusCard({
  agent
}: {
  agent: AgentStatus
}) {
  return (
    <Card>
      {/* Card content */}
    </Card>
  );
}, (prev, next) => {
  // Custom comparison - only re-render on meaningful changes
  return (
    prev.agent.status === next.agent.status &&
    prev.agent.lastExecutionTime === next.agent.lastExecutionTime
  );
});

// 4. Batch Updates
function useBatchedUpdates() {
  const pendingUpdates = useRef<Map<string, any>>(new Map());
  const flushTimeout = useRef<NodeJS.Timeout>();

  const queueUpdate = useCallback((key: string, value: any) => {
    pendingUpdates.current.set(key, value);

    if (!flushTimeout.current) {
      flushTimeout.current = setTimeout(() => {
        // Batch apply all updates
        const updates = Object.fromEntries(pendingUpdates.current);
        useDashboardStore.getState().batchUpdate(updates);
        pendingUpdates.current.clear();
        flushTimeout.current = undefined;
      }, 50);
    }
  }, []);

  return queueUpdate;
}

// 5. Selective Subscriptions
function useAgentStatus(agentId: string) {
  return useDashboardStore(
    useCallback(
      (state) => state.agents[agentId],
      [agentId]
    ),
    shallow // Prevent unnecessary re-renders
  );
}
```

---

## 10. Mobile Responsiveness

### 10.1 Responsive Card Layouts

```typescript
// Responsive Dashboard Grid
function CommandCenterGrid() {
  return (
    <div className="grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    ">
      {agents.map((agent) => (
        <AgentStatusCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

// Responsive Approval Queue
function ResponsiveApprovalQueue() {
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full h-14 w-14">
            <Bell className="h-6 w-6" />
            <Badge className="absolute -top-1 -right-1">
              {pendingCount}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <ApprovalQueueContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <ApprovalQueueSidebar />;
}
```

### 10.2 Touch-Friendly Approval Actions

```typescript
// Touch-Optimized Approval Card
function TouchApprovalCard({ item }: { item: ApprovalItem }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      <Card
        className="cursor-pointer"
        onClick={() => setShowActions(true)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <Text className="font-medium">{item.actionDescription}</Text>
            <Text className="text-sm text-muted-foreground">
              {item.agentName}
            </Text>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Sheet Actions */}
      <Sheet open={showActions} onOpenChange={setShowActions}>
        <SheetContent side="bottom">
          <div className="space-y-4">
            <div className="text-center">
              <Text className="text-lg font-medium">{item.actionDescription}</Text>
              <Text className="text-muted-foreground">{item.reason}</Text>
            </div>

            {/* Large touch targets (minimum 44px) */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                className="h-14"
                onClick={() => handleApprove(item.id)}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Approve
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-14"
                onClick={() => handleReject(item.id)}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Reject
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => handleRequestInfo(item.id)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Request More Info
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

### 10.3 PWA Configuration

**Sources**: [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps), [PWA Complete Guide 2025](https://void.ma/en/publications/pwa-progressive-web-app-guide-complet-react-2025/)

```typescript
// next.config.js with PWA support
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // Next.js config
});

// manifest.json
{
  "name": "Hyyve Command Center",
  "short_name": "Command Center",
  "description": "Operations dashboard for AI agent management",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 10.4 Push Notifications

```typescript
// Push Notification Service
class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    this.registration = await navigator.serviceWorker.ready;
  }

  async subscribe(userId: string) {
    if (!this.registration) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const subscription = await this.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subscription
      })
    });

    return subscription;
  }

  async unsubscribe() {
    const subscription = await this.registration?.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
    }
  }
}

// Service Worker for Push
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: data.tag,
    data: data.data,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'approve') {
    // Handle approve action
    fetch(`/api/approvals/${data.approvalId}/approve`, { method: 'POST' });
  } else if (action === 'reject') {
    // Handle reject action
    fetch(`/api/approvals/${data.approvalId}/reject`, { method: 'POST' });
  } else {
    // Open dashboard
    event.waitUntil(
      clients.openWindow(data.url || '/dashboard')
    );
  }
});
```

---

## 11. UX Wireframes

### 11.1 Command Center Overview

```
+------------------------------------------------------------------+
|  [Logo] COMMAND CENTER                    [Search] [?] [Bell] [U] |
|  Workspace: Acme Corp > Production                                |
+------------------------------------------------------------------+
|                                                                    |
|  QUICK STATS                                                      |
|  +-------------+ +-------------+ +-------------+ +-------------+  |
|  | Running     | | Pending     | | Alerts      | | Cost Today  |  |
|  | Agents      | | Approvals   | |             | |             |  |
|  |     12      | |      3      | |      2      | |    $45.67   |  |
|  | [view]      | | [view]      | | [view]      | | [details]   |  |
|  +-------------+ +-------------+ +-------------+ +-------------+  |
|                                                                    |
|  +---------------------------+  +--------------------------------+ |
|  | AGENT STATUS              |  | APPROVAL QUEUE                 | |
|  | [Grid] [List]             |  | 3 pending                      | |
|  |                           |  |                                | |
|  | +-------+ +-------+       |  | [!] Delete 47 documents        | |
|  | | Doc   | | API   |       |  |     RAG Agent - 5 min ago      | |
|  | | Agent | | Agent |       |  |     [Approve] [Reject]         | |
|  | | [RUN] | | [RUN] |       |  |                                | |
|  | +-------+ +-------+       |  | [ ] Create webhook endpoint    | |
|  |                           |  |     API Agent - 23 min ago     | |
|  | +-------+ +-------+       |  |     [Approve] [Reject]         | |
|  | | QA    | | Email |       |  |                                | |
|  | | Agent | | Agent |       |  | [ ] External API access        | |
|  | | [IDLE]| | [ERR] |       |  |     Integration - 1 hr ago     | |
|  | +-------+ +-------+       |  |     [Approve] [Reject]         | |
|  |                           |  |                                | |
|  +---------------------------+  +--------------------------------+ |
|                                                                    |
|  +---------------------------+  +--------------------------------+ |
|  | ALERTS                    |  | ACTIVITY TIMELINE              | |
|  | 2 active                  |  | [All] [Agents] [Approvals]     | |
|  |                           |  |                                | |
|  | [X] Rate limit exceeded   |  | 14:32 Agent Completed          | |
|  |     RAG Agent - 3m ago    |  |       Doc Analyzer - Success   | |
|  |     [Ack] [Snooze]        |  |                                | |
|  |                           |  | 14:30 Approval Requested       | |
|  | [!] Cost threshold        |  |       Batch delete operation   | |
|  |     Workspace - 1h ago    |  |                                | |
|  |     [Ack] [Snooze]        |  | 14:28 Agent Started            | |
|  |                           |  |       Doc Analyzer             | |
|  +---------------------------+  |                                | |
|                                 | 14:15 Alert Triggered          | |
|                                 |       High token usage         | |
|                                 |                                | |
|                                 | [Load More]                    | |
|                                 +--------------------------------+ |
+------------------------------------------------------------------+
```

### 11.2 Agent Status Card (Detail)

```
+------------------------------------------+
|  [Icon] Document Analyzer Agent          |
|         Status: [RUNNING]                |
+------------------------------------------+
|                                          |
|  Current Execution                       |
|  ─────────────────                       |
|  Started: 2 minutes ago                  |
|  Progress: Analyzing document batch      |
|  Tokens: 1,247 / ~2,000 estimated        |
|                                          |
|  Metrics (24h)                          |
|  ─────────────                          |
|  Executions: 47 (94% success)           |
|  Avg Duration: 2.3s                     |
|  Total Tokens: 45,230                   |
|  Cost: $12.45                           |
|                                          |
|  +------------------------------------+  |
|  |    Success Rate Over Time          |  |
|  |  100%|    __    __                 |  |
|  |   80%|   /  \__/  \                |  |
|  |   60%|__/          \__             |  |
|  |      |________________|            |  |
|  |       6h   12h   18h   24h         |  |
|  +------------------------------------+  |
|                                          |
|  [View Logs] [Configure] [Pause]        |
+------------------------------------------+
```

### 11.3 Approval Item (Expanded)

```
+------------------------------------------------------------------+
|  [!] HIGH PRIORITY                        Requested 5 minutes ago |
+------------------------------------------------------------------+
|                                                                    |
|  Agent: Document Analyzer Agent                                   |
|  Workflow: doc_cleanup_workflow_abc123                           |
|                                                                    |
|  ACTION REQUESTED                                                 |
|  ─────────────────                                                |
|  Delete 47 documents from the customer-data collection           |
|                                                                    |
|  REASON                                                           |
|  ──────                                                           |
|  Batch cleanup requested by user during document migration        |
|                                                                    |
|  CONTEXT                                                          |
|  ───────                                                          |
|  +--------------------------------------------------------------+|
|  | Triggered By:    john@acme-corp.com                          ||
|  | Risk Level:      HIGH (data deletion)                        ||
|  | Reversible:      NO - documents will be permanently deleted  ||
|  | Documents:       47 items (see list below)                   ||
|  | Estimated Impact: ~500MB storage freed                       ||
|  +--------------------------------------------------------------+|
|                                                                    |
|  [v] Show Document List (47 items)                               |
|  +--------------------------------------------------------------+|
|  | - customer-report-2024-01.pdf                                ||
|  | - customer-report-2024-02.pdf                                ||
|  | - customer-report-2024-03.pdf                                ||
|  | ... (44 more)                                                ||
|  +--------------------------------------------------------------+|
|                                                                    |
|  AUDIT TRAIL                                                      |
|  ───────────                                                      |
|  14:30:15 - Approval requested by Document Analyzer Agent        |
|  14:30:15 - Assigned to: ops-team                                |
|  14:32:00 - Viewed by: alice@acme-corp.com                       |
|                                                                    |
|  +----------+  +----------+  +------------------+                 |
|  | APPROVE  |  |  REJECT  |  | REQUEST MORE INFO|                 |
|  +----------+  +----------+  +------------------+                 |
|                                                                    |
+------------------------------------------------------------------+
```

### 11.4 Mobile Approval View

```
+----------------------+
|  Command Center   [=]|
+----------------------+
|                      |
| PENDING APPROVALS (3)|
|                      |
| +------------------+ |
| | [!] HIGH         | |
| | Delete 47 docs   | |
| | Doc Analyzer     | |
| | 5 min ago        | |
| |                  | |
| | [Tap for actions]| |
| +------------------+ |
|                      |
| +------------------+ |
| | [ ] Create hook  | |
| | API Agent        | |
| | 23 min ago       | |
| |                  | |
| | [Tap for actions]| |
| +------------------+ |
|                      |
| +------------------+ |
| | [ ] External API | |
| | Integration      | |
| | 1 hr ago         | |
| |                  | |
| | [Tap for actions]| |
| +------------------+ |
|                      |
+----------------------+

    [Bottom Sheet When Tapped]
+----------------------+
|                      |
| Delete 47 documents  |
| from customer-data   |
|                      |
| Requested by:        |
| Document Analyzer    |
|                      |
| Risk: HIGH           |
|                      |
| +------------------+ |
| |    APPROVE       | |
| +------------------+ |
|                      |
| +------------------+ |
| |    REJECT        | |
| +------------------+ |
|                      |
| [Request More Info]  |
|                      |
| [View Full Details]  |
|                      |
+----------------------+
```

---

## 12. Implementation Recommendations

### 12.1 Technology Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **UI Framework** | React 18+ / Next.js 14+ | Server components, streaming |
| **Component Library** | shadcn/ui + Tremor | Accessible, customizable, dashboard-optimized |
| **State Management** | Zustand | Lightweight, real-time friendly |
| **Real-Time** | SSE + Supabase Realtime | Serverless compatible (Vercel), scalable. Note: Railway is container-based PaaS with full WebSocket support |
| **UI Protocol** | A2UI v0.8 (public preview) | Cross-platform, declarative |
| **Transport** | AG-UI | Bidirectional agent communication |
| **Charts** | Tremor (Recharts) | Dashboard-specific, accessible |
| **Timeline** | Custom + react-chrono | Flexible, themeable |

### 12.2 Implementation Phases

**Phase 1: Foundation (Week 1-2)**
1. Set up Next.js project with shadcn/ui
2. Implement Zustand store for dashboard state
3. Create SSE connection manager
4. Build basic dashboard layout

**Phase 2: Agent Status (Week 2-3)**
1. Agent status card components
2. Real-time status updates via SSE
3. Agent details drawer/modal
4. Grid and list view toggle

**Phase 3: Approval Queue (Week 3-4)**
1. Approval queue UI components
2. AG-UI INTERRUPT handler integration
3. Approve/Reject/Request Info flows
4. Escalation policy implementation

**Phase 4: Alerts & Timeline (Week 4-5)**
1. Alert management components
2. Snooze/acknowledge functionality
3. Activity timeline with filtering
4. Infinite scroll pagination

**Phase 5: Metrics & Charts (Week 5-6)**
1. Tremor chart integration
2. Real-time metric updates
3. Cost tracking dashboard
4. Export and reporting

**Phase 6: A2UI Integration (Week 6-7)**
1. A2UI renderer implementation
2. Component catalog mapping
3. Streaming updates
4. Action handlers

**Phase 7: Mobile & PWA (Week 7-8)**
1. Responsive layouts
2. Touch-friendly components
3. PWA manifest and service worker
4. Push notifications

### 12.3 Key Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Meaningful Paint | < 1.5s | Lighthouse |
| Real-time Update Latency | < 500ms | Custom instrumentation |
| Approval Response Time | < 30s median | Workflow metrics |
| Alert Acknowledgment Time | < 5 min (critical) | Alert metrics |
| Mobile Usability Score | > 90 | Lighthouse |
| Accessibility Score | 100% WCAG AA | axe-core |

### 12.4 Security Considerations

1. **Authentication**: All SSE endpoints require valid session token
2. **Authorization**: Workspace and role-based filtering of events
3. **Input Validation**: Sanitize all A2UI action payloads
4. **Rate Limiting**: Protect approval endpoints from abuse
5. **Audit Logging**: Log all approval decisions and actions
6. **CSRF Protection**: Include CSRF tokens in action requests

---

## References

### Primary Sources

1. [Tremor Dashboard Components](https://www.tremor.so/)
2. [Tremor Blocks/Templates](https://blocks.tremor.so)
3. [AG-UI Documentation](https://docs.ag-ui.com/introduction)
4. [A2UI Protocol](https://a2ui.org/)
5. [Temporal HITL Tutorial](https://learn.temporal.io/tutorials/ai/building-durable-ai-applications/human-in-the-loop/)
6. [Temporal Use Cases](https://docs.temporal.io/evaluate/use-cases-design-patterns)
7. [LangSmith Observability](https://www.langchain.com/langsmith/observability)
8. [Langfuse Cost Tracking](https://langfuse.com/docs/observability/features/token-and-cost-tracking)
9. [Supabase Realtime](https://supabase.com/docs/guides/realtime)
10. [Zustand GitHub](https://github.com/pmndrs/zustand)

### Design Resources

1. [Material UI Timeline](https://mui.com/material-ui/react-timeline/)
2. [Notification Design Best Practices](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/)
3. [Notification System Design](https://www.magicbell.com/blog/notification-system-design)
4. [Stackify Alerts Overview](https://docs.stackify.com/docs/alerts-and-notifications-overview)

### Platform References

1. [Vercel Realtime Guide](https://vercel.com/kb/guide/publish-and-subscribe-to-realtime-data-on-vercel)
2. [Railway Observability](https://docs.railway.com/guides/observability)
3. [Render Logging](https://render.com/docs/logging)
4. [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)

### State Management

1. [State Management 2025](https://makersden.io/blog/react-state-management-in-2025)
2. [Real-time State with WebSockets](https://moldstud.com/articles/p-real-time-state-management-in-react-using-websockets-boost-your-apps-performance)

---

## Validation Log

**Validation Date**: 2026-01-21
**Validation Method**: Cross-referenced with deepwiki MCP, context7 MCP, and direct source verification

### Corrections Applied

| Item | Original | Corrected | Verification Source |
|------|----------|-----------|---------------------|
| A2UI Version | v0.9 | v0.8 (public preview) | [github.com/google/a2ui](https://github.com/google/a2ui) |
| CopilotKit Import | `@copilotkit/react` | `@copilotkit/react-core` | [CopilotKit source](https://github.com/CopilotKit/CopilotKit) |
| AG-UI INTERRUPT | Stable feature | Draft proposal | [AG-UI drafts](https://github.com/ag-ui-protocol/ag-ui/tree/main/docs/drafts) |
| Zustand Growth | "30%+ YoY growth" | Removed (unverified) | [npmtrends.com](https://npmtrends.com/zustand) |
| A2UI Chart Component | Standard catalog | Custom catalog required | [A2UI custom components](https://github.com/google/a2ui/blob/main/docs/guides/custom-components.md) |
| Vercel SSE | Native support | 300s timeout limit | [Vercel docs](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections) |
| Railway Classification | Serverless | Container-based PaaS | [Railway docs](https://docs.railway.com) |

### Items Verified as Accurate

- ✅ Tremor Vercel acquisition
- ✅ Temporal Signal-based HITL patterns
- ✅ Supabase Realtime scalability characteristics
- ✅ A2UI Google backing
- ✅ A2UI Timeline in standard catalog
- ✅ Microsoft AG-UI HITL documentation

---

*Document generated as part of Hyyve Platform technical research*
