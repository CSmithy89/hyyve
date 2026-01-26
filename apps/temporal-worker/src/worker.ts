/**
 * Temporal Worker Entry Point
 *
 * Configures and runs the Temporal worker for durable workflow execution.
 * Handles agent workflows with retry policies and HITL signal support.
 */

import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/index.js';

/**
 * Environment configuration for Temporal worker
 */
interface WorkerConfig {
  temporalAddress: string;
  temporalNamespace: string;
  taskQueue: string;
}

/**
 * Load configuration from environment variables
 */
function loadConfig(): WorkerConfig {
  return {
    temporalAddress: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    temporalNamespace: process.env.TEMPORAL_NAMESPACE || 'default',
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'hyyve-agent-tasks',
  };
}

/**
 * Run the Temporal worker
 */
async function run(): Promise<void> {
  const config = loadConfig();

  console.warn(`Starting Temporal worker...`);
  console.warn(`  Address: ${config.temporalAddress}`);
  console.warn(`  Namespace: ${config.temporalNamespace}`);
  console.warn(`  Task Queue: ${config.taskQueue}`);

  // Create connection to Temporal server
  const connection = await NativeConnection.connect({
    address: config.temporalAddress,
  });

  try {
    // Create and run the worker
    const worker = await Worker.create({
      connection,
      namespace: config.temporalNamespace,
      taskQueue: config.taskQueue,
      workflowsPath: new URL('./workflows/index.js', import.meta.url).pathname,
      activities,
    });

    console.warn('Worker started, listening for tasks...');

    // Run until interrupted
    await worker.run();
  } finally {
    await connection.close();
  }
}

// Start the worker
run().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});
