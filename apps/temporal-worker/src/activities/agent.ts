/**
 * Agent Activities
 *
 * Temporal activities for agent execution, communicating with the
 * Agent Service (Python/Agno) for actual agent operations.
 */

import { ApplicationFailure } from '@temporalio/activity';

/**
 * Agent Service configuration
 */
const AGENT_SERVICE_URL =
  process.env.AGENT_SERVICE_URL || 'http://localhost:8000';

/**
 * Input for executing an agent task
 */
export interface ExecuteAgentTaskInput {
  agentId: string;
  sessionId: string;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Result from agent task execution
 */
export interface ExecuteAgentTaskResult {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'requires_hitl';
  requiresHITL: boolean;
  hitlPrompt?: string;
}

/**
 * Input for getting agent response
 */
export interface GetAgentResponseInput {
  agentId: string;
  sessionId: string;
  taskId: string;
}

/**
 * Agent response result
 */
export interface GetAgentResponseResult {
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Input for processing HITL approval
 */
export interface ProcessHITLApprovalInput {
  agentId: string;
  sessionId: string;
  taskId: string;
  feedback?: string;
}

/**
 * HITL approval result
 */
export interface ProcessHITLApprovalResult {
  response: string;
  metadata?: Record<string, unknown>;
}

/**
 * Execute an agent task
 *
 * Sends the task to the Agent Service and returns the initial result.
 */
export async function executeAgentTask(
  input: ExecuteAgentTaskInput
): Promise<ExecuteAgentTaskResult> {
  const response = await fetch(`${AGENT_SERVICE_URL}/api/v1/agents/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: input.agentId,
      session_id: input.sessionId,
      message: input.message,
      context: input.context,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw ApplicationFailure.nonRetryable(
      `Agent service error: ${response.status} - ${errorText}`,
      'AGENT_SERVICE_ERROR'
    );
  }

  const result = (await response.json()) as {
    task_id: string;
    status: ExecuteAgentTaskResult['status'];
    requires_hitl?: boolean;
    hitl_prompt?: string;
  };

  return {
    taskId: result.task_id,
    status: result.status,
    requiresHITL: result.requires_hitl ?? false,
    hitlPrompt: result.hitl_prompt,
  };
}

/**
 * Get agent response for a completed task
 */
export async function getAgentResponse(
  input: GetAgentResponseInput
): Promise<GetAgentResponseResult> {
  const response = await fetch(
    `${AGENT_SERVICE_URL}/api/v1/agents/${input.agentId}/tasks/${input.taskId}/response`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': input.sessionId,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw ApplicationFailure.retryable(
      `Failed to get agent response: ${response.status} - ${errorText}`,
      'AGENT_RESPONSE_ERROR'
    );
  }

  const result = (await response.json()) as {
    content: string;
    metadata?: Record<string, unknown>;
  };

  return {
    content: result.content,
    metadata: result.metadata,
  };
}

/**
 * Process HITL approval and continue agent execution
 */
export async function processHITLApproval(
  input: ProcessHITLApprovalInput
): Promise<ProcessHITLApprovalResult> {
  const response = await fetch(
    `${AGENT_SERVICE_URL}/api/v1/agents/${input.agentId}/tasks/${input.taskId}/hitl-approval`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': input.sessionId,
      },
      body: JSON.stringify({
        approved: true,
        feedback: input.feedback,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw ApplicationFailure.retryable(
      `Failed to process HITL approval: ${response.status} - ${errorText}`,
      'HITL_APPROVAL_ERROR'
    );
  }

  const result = (await response.json()) as {
    response: string;
    metadata?: Record<string, unknown>;
  };

  return {
    response: result.response,
    metadata: result.metadata,
  };
}
