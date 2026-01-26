/**
 * Agent Execution Workflow
 *
 * Durable workflow for executing agent tasks with:
 * - Retry policies with exponential backoff
 * - HITL (Human-in-the-Loop) signal handling
 * - Checkpoint support for recovery
 */

import {
  proxyActivities,
  defineSignal,
  setHandler,
  condition,
} from '@temporalio/workflow';
import type * as activities from '../activities/agent.js';

// Proxy activities with retry policy
const { executeAgentTask, getAgentResponse, processHITLApproval } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes',
    retry: {
      initialInterval: '1 second',
      backoffCoefficient: 2,
      maximumAttempts: 5,
      maximumInterval: '30 seconds',
    },
  });

/**
 * Input parameters for agent workflow
 */
export interface AgentWorkflowInput {
  agentId: string;
  sessionId: string;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Output result from agent workflow
 */
export interface AgentWorkflowOutput {
  success: boolean;
  response?: string;
  error?: string;
  requiresHITL?: boolean;
  hitlPrompt?: string;
}

/**
 * HITL approval signal payload
 */
export interface HITLApprovalPayload {
  approved: boolean;
  feedback?: string;
}

// Define signals for HITL interaction
export const hitlApprovalSignal = defineSignal<[HITLApprovalPayload]>('hitlApproval');
export const cancelWorkflowSignal = defineSignal<[]>('cancelWorkflow');

/**
 * Agent execution workflow
 *
 * Executes agent tasks with durable state management and HITL support.
 */
export async function agentExecutionWorkflow(
  input: AgentWorkflowInput
): Promise<AgentWorkflowOutput> {
  let hitlApproval: HITLApprovalPayload | null = null;
  let cancelled = false;

  // Set up signal handlers
  setHandler(hitlApprovalSignal, (payload) => {
    hitlApproval = payload;
  });

  setHandler(cancelWorkflowSignal, () => {
    cancelled = true;
  });

  try {
    // Execute the agent task
    const taskResult = await executeAgentTask({
      agentId: input.agentId,
      sessionId: input.sessionId,
      message: input.message,
      context: input.context,
    });

    // Check for cancellation
    if (cancelled) {
      return {
        success: false,
        error: 'Workflow cancelled by user',
      };
    }

    // If HITL is required, wait for approval
    if (taskResult.requiresHITL) {
      // Wait for HITL approval signal (with timeout)
      const hitlReceived = await condition(
        () => hitlApproval !== null || cancelled,
        '24 hours' // Max wait time for HITL
      );

      if (!hitlReceived || cancelled) {
        return {
          success: false,
          error: 'HITL approval timeout or cancelled',
          requiresHITL: true,
          hitlPrompt: taskResult.hitlPrompt,
        };
      }

      // TypeScript can't narrow types set in signal handlers, use assertion
      // We know hitlApproval is not null here due to condition check above
      const approval = hitlApproval as unknown as HITLApprovalPayload;
      if (!approval.approved) {
        return {
          success: false,
          error: 'HITL approval denied',
          requiresHITL: true,
        };
      }

      // Process with HITL approval
      const approvalResult = await processHITLApproval({
        agentId: input.agentId,
        sessionId: input.sessionId,
        taskId: taskResult.taskId,
        feedback: approval.feedback,
      });

      return {
        success: true,
        response: approvalResult.response,
      };
    }

    // Get final response
    const response = await getAgentResponse({
      agentId: input.agentId,
      sessionId: input.sessionId,
      taskId: taskResult.taskId,
    });

    return {
      success: true,
      response: response.content,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
