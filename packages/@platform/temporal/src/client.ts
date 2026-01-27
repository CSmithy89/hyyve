/**
 * Temporal Client Utilities
 *
 * Provides a configured Temporal client for starting and managing workflows
 * from Next.js API routes and other Node.js services.
 */

import { Client, Connection } from '@temporalio/client';
import type { WorkflowHandle } from '@temporalio/client';
import { z } from 'zod';

/**
 * Temporal client configuration schema
 */
export const TemporalConfigSchema = z.object({
  address: z.string().default('localhost:7233'),
  namespace: z.string().default('default'),
  taskQueue: z.string().default('hyyve-agent-tasks'),
});

export type TemporalConfig = z.infer<typeof TemporalConfigSchema>;

/**
 * Agent workflow input schema
 */
export const AgentWorkflowInputSchema = z.object({
  agentId: z.string(),
  sessionId: z.string(),
  message: z.string(),
  context: z.record(z.unknown()).optional(),
});

export type AgentWorkflowInput = z.infer<typeof AgentWorkflowInputSchema>;

/**
 * Agent workflow output schema
 */
export const AgentWorkflowOutputSchema = z.object({
  success: z.boolean(),
  response: z.string().optional(),
  error: z.string().optional(),
  requiresHITL: z.boolean().optional(),
  hitlPrompt: z.string().optional(),
});

export type AgentWorkflowOutput = z.infer<typeof AgentWorkflowOutputSchema>;

/**
 * HITL approval payload schema
 */
export const HITLApprovalPayloadSchema = z.object({
  approved: z.boolean(),
  feedback: z.string().optional(),
});

export type HITLApprovalPayload = z.infer<typeof HITLApprovalPayloadSchema>;

/**
 * Singleton Temporal client instance
 */
let clientInstance: TemporalClient | null = null;

/**
 * Temporal Client wrapper
 *
 * Provides methods for starting agent workflows and managing workflow state.
 */
export class TemporalClient {
  private client: Client;
  private connection: Connection;
  private config: TemporalConfig;

  private constructor(client: Client, connection: Connection, config: TemporalConfig) {
    this.client = client;
    this.connection = connection;
    this.config = config;
  }

  /**
   * Create a connected Temporal client
   */
  static async connect(config?: Partial<TemporalConfig>): Promise<TemporalClient> {
    const resolvedConfig = TemporalConfigSchema.parse({
      address: process.env.TEMPORAL_ADDRESS || config?.address,
      namespace: process.env.TEMPORAL_NAMESPACE || config?.namespace,
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || config?.taskQueue,
    });

    const connection = await Connection.connect({
      address: resolvedConfig.address,
    });

    const client = new Client({
      connection,
      namespace: resolvedConfig.namespace,
    });

    return new TemporalClient(client, connection, resolvedConfig);
  }

  /**
   * Get or create the singleton client instance
   */
  static async getInstance(config?: Partial<TemporalConfig>): Promise<TemporalClient> {
    if (!clientInstance) {
      clientInstance = await TemporalClient.connect(config);
    }
    return clientInstance;
  }

  /**
   * Start an agent execution workflow
   */
  async startAgentWorkflow(
    input: AgentWorkflowInput,
    workflowId?: string
  ): Promise<WorkflowHandle> {
    const validatedInput = AgentWorkflowInputSchema.parse(input);
    const id = workflowId || `agent-${input.agentId}-${Date.now()}`;

    return this.client.workflow.start('agentExecutionWorkflow', {
      taskQueue: this.config.taskQueue,
      workflowId: id,
      args: [validatedInput],
    });
  }

  /**
   * Get an existing workflow handle
   */
  getWorkflowHandle(workflowId: string): WorkflowHandle {
    return this.client.workflow.getHandle(workflowId);
  }

  /**
   * Send HITL approval signal to a workflow
   */
  async sendHITLApproval(
    workflowId: string,
    payload: HITLApprovalPayload
  ): Promise<void> {
    const validatedPayload = HITLApprovalPayloadSchema.parse(payload);
    const handle = this.getWorkflowHandle(workflowId);
    await handle.signal('hitlApproval', validatedPayload);
  }

  /**
   * Cancel a running workflow
   */
  async cancelWorkflow(workflowId: string): Promise<void> {
    const handle = this.getWorkflowHandle(workflowId);
    await handle.signal('cancelWorkflow');
  }

  /**
   * Get workflow result
   */
  async getWorkflowResult(workflowId: string): Promise<AgentWorkflowOutput> {
    const handle = this.getWorkflowHandle(workflowId);
    const result = await handle.result();
    return AgentWorkflowOutputSchema.parse(result);
  }

  /**
   * Close the client connection.
   * This properly closes the underlying gRPC connection to avoid leaks.
   */
  async close(): Promise<void> {
    try {
      await this.connection.close();
    } catch (error) {
      // Log but don't throw - connection may already be closed
      console.warn('Error closing Temporal connection:', error);
    } finally {
      clientInstance = null;
    }
  }
}

/**
 * Helper function to create a Temporal client
 */
export async function createTemporalClient(
  config?: Partial<TemporalConfig>
): Promise<TemporalClient> {
  return TemporalClient.connect(config);
}

/**
 * Helper function to get the singleton client
 */
export async function getTemporalClient(
  config?: Partial<TemporalConfig>
): Promise<TemporalClient> {
  return TemporalClient.getInstance(config);
}
