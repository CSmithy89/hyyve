# Technical Research: Agent Versioning and Lifecycle Management

**Research Date:** 2026-01-21
**Research Focus:** Version control, deployment pipelines, and A/B testing for AI agents and workflows
**Target:** Git-like versioning patterns for Hyyve Platform with visual workflow builders

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Git-like Versioning Patterns](#git-like-versioning-patterns)
3. [Diffing and Comparison](#diffing-and-comparison)
4. [A/B Testing for Agents](#ab-testing-for-agents)
5. [Version Storage](#version-storage)
6. [Deployment Pipelines](#deployment-pipelines)
7. [Implementation Recommendations](#implementation-recommendations)
8. [Database Schema Design](#database-schema-design)
9. [API Design](#api-design)
10. [UI/UX Patterns](#uiux-patterns)
11. [References](#references)

---

## Executive Summary

This research examines versioning and lifecycle management patterns for AI agents and workflows, drawing from industry leaders (Dify, n8n, Flowise) and established software engineering practices. The goal is to inform the architecture of an Hyyve platform that supports production-grade deployment workflows.

### Key Findings

| Aspect | Recommendation |
|--------|----------------|
| **Versioning Model** | Semantic versioning (major.minor.patch) with immutable snapshots |
| **Storage Strategy** | Full snapshots for simplicity; delta compression for optimization |
| **Branching** | Environment-based branches (dev/staging/prod) with GitLab Flow patterns |
| **Diffing Library** | jsondiffpatch for comprehensive JSON comparison with visual output |
| **A/B Testing** | Percentage-based traffic splitting with Bayesian statistical analysis |
| **Deployment** | Promotion-based pipeline with approval gates and automated rollback |
| **Database** | Temporal tables with Supabase audit extension for version history |

### Critical Success Factors

1. **Immutability**: Published versions must be immutable for audit trails and rollback
2. **Atomic Deployments**: All-or-nothing deployments prevent partial state corruption
3. **Observability**: Comprehensive metrics collection enables informed rollback decisions
4. **Gradual Rollout**: Canary and percentage-based deployments minimize blast radius

---

## Git-like Versioning Patterns

### Platform Analysis

#### Dify Version Control

Dify implements a draft-publish model with version history:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DIFY VERSION CONTROL MODEL                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    Publish    ┌──────────┐                        │
│  │  Draft   │──────────────►│ Version  │                        │
│  │ (Active) │               │    A     │                        │
│  └──────────┘               └──────────┘                        │
│       │                          │                               │
│       │ Continue                 │ Becomes "Previous"            │
│       │ Editing                  │                               │
│       ▼                          ▼                               │
│  ┌──────────┐    Publish    ┌──────────┐    ┌──────────┐       │
│  │  Draft   │──────────────►│ Version  │    │ Version  │       │
│  │   (B)    │               │    B     │    │    A     │       │
│  └──────────┘               │ (Latest) │    │(Previous)│       │
│                             └──────────┘    └──────────┘       │
│                                                                  │
│  Restore: Load any previous version into current draft          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Single active draft per workflow
- Immutable published versions
- Chronological version history with metadata (title, notes, date, publisher)
- Restore functionality loads historical versions into draft

**Limitations (per GitHub Issue #23639):**
- No multi-environment support (dev/test/release)
- No tag-based routing for API endpoints
- Team collaboration challenges with single draft model

#### n8n Version Control

n8n provides both built-in history and Git-based source control:

**Built-in Workflow History:**
- Automatic version saves on changes
- 24-hour retention for all users (extended for paid plans)
- Operations: Restore, Clone to new workflow, Open in new tab, Download JSON

**Git Integration (Source Control):**
```
┌─────────────────────────────────────────────────────────────────┐
│                    N8N SOURCE CONTROL FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Development Instance          Git Repository                    │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │                  │  Push   │                  │              │
│  │  Edit Workflows  │────────►│  main branch     │              │
│  │                  │         │  (or dev branch) │              │
│  └──────────────────┘         └────────┬─────────┘              │
│                                        │                         │
│                                        │ Pull                    │
│                                        ▼                         │
│  Production Instance          ┌──────────────────┐              │
│  ┌──────────────────┐         │                  │              │
│  │                  │◄────────│  prod branch     │              │
│  │  Run Workflows   │  Pull   │                  │              │
│  │  (No editing)    │         └──────────────────┘              │
│  └──────────────────┘                                           │
│                                                                  │
│  Best Practice: One-directional flow (dev → git → prod)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**January 2026 Updates:**
- Autosave with versioned publishing
- Concurrency protection to prevent overwrites
- Custom version naming (upcoming)

#### Flowise Status

Flowise currently lacks native versioning (per GitHub Issue #2882):
- Export/import via GUI only
- Community requests for version control integration
- Human-in-the-loop review checkpoints available

### Semantic Versioning for Agents

Adapting SemVer (MAJOR.MINOR.PATCH) for AI agents and workflows:

```typescript
interface AgentVersion {
  major: number;  // Breaking changes to inputs/outputs/behavior
  minor: number;  // New capabilities, backward compatible
  patch: number;  // Bug fixes, prompt improvements
  prerelease?: string;  // alpha, beta, rc.1
  metadata?: string;    // Build info, commit hash
}

// Examples:
// 1.0.0 - Initial production release
// 1.1.0 - Added new tool capability
// 1.1.1 - Fixed prompt injection vulnerability
// 2.0.0 - Changed output schema (breaking)
// 2.0.0-beta.1 - Beta testing new version
```

**Version Increment Guidelines for Agents:**

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| **Major** | X.0.0 | Changed input/output schema, removed tools, altered core behavior |
| **Minor** | x.Y.0 | Added new tools, new output fields, improved capabilities |
| **Patch** | x.y.Z | Prompt refinements, bug fixes, performance improvements |

**Breaking Changes for Agents:**
- Input schema modifications (required fields added/removed)
- Output schema changes (field types, structure)
- Tool removal or signature changes
- Behavior changes affecting downstream consumers

### Branching Strategies

#### Recommended: GitLab Flow (Environment-Based)

```
┌─────────────────────────────────────────────────────────────────┐
│              ENVIRONMENT-BASED BRANCHING STRATEGY                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  feature/add-rag-tool ──┐                                       │
│                         │                                        │
│  feature/improve-prompt─┼──► develop ──► staging ──► main       │
│                         │       │           │          │         │
│  fix/memory-leak ───────┘       │           │          │         │
│                                 ▼           ▼          ▼         │
│                              [DEV]     [STAGING]   [PROD]        │
│                             Instance   Instance   Instance       │
│                                                                  │
│  Promotion Flow:                                                 │
│  1. Feature branches merge to develop (auto-deploy to dev)      │
│  2. develop merges to staging (auto-deploy, integration tests)  │
│  3. staging merges to main (approval gate, production deploy)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Branch Protection Rules

```typescript
const branchPolicies = {
  develop: {
    requirePullRequest: true,
    requiredReviewers: 1,
    requireStatusChecks: ['lint', 'unit-tests'],
    allowForcePush: false,
    autoDeploy: 'development'
  },
  staging: {
    requirePullRequest: true,
    requiredReviewers: 2,
    requireStatusChecks: ['lint', 'unit-tests', 'integration-tests'],
    allowForcePush: false,
    autoDeploy: 'staging'
  },
  main: {
    requirePullRequest: true,
    requiredReviewers: 2,
    requireStatusChecks: ['lint', 'unit-tests', 'integration-tests', 'e2e-tests'],
    requireApprovalGate: true,
    allowForcePush: false,
    autoDeploy: 'production'
  }
};
```

### Rollback Mechanisms

```typescript
interface RollbackStrategy {
  // Instant rollback via traffic switching
  blueGreen: {
    activeEnvironment: 'blue' | 'green';
    switchTraffic: (target: 'blue' | 'green') => Promise<void>;
    healthCheck: () => Promise<boolean>;
  };

  // Version-based rollback
  versionRollback: {
    getCurrentVersion: () => string;
    getAvailableVersions: () => string[];
    rollbackTo: (version: string) => Promise<void>;
  };

  // Automatic rollback triggers
  autoRollback: {
    errorRateThreshold: number;      // e.g., 5%
    latencyThreshold: number;        // e.g., 2000ms p95
    evaluationWindow: number;        // e.g., 300 seconds
    cooldownPeriod: number;          // e.g., 600 seconds
  };
}
```

---

## Diffing and Comparison

### JSON Diff Algorithms

#### Library Comparison

| Library | Best For | Key Features |
|---------|----------|--------------|
| **jsondiffpatch** | Complex workflows | LCS for arrays, visual formatters, reversible patches |
| **deep-diff** | Detailed tracking | Structured output, property-level changes |
| **fast-json-patch** | Performance | RFC 6902 compliant, minimal footprint |
| **json-diff** | Simple comparisons | Shallow comparison, quick overview |

#### Recommended: jsondiffpatch

```typescript
import { create, formatters } from 'jsondiffpatch';

// Configure for workflow comparison
const diffpatcher = create({
  // Match array items by ID for intelligent diffing
  objectHash: (obj: any) => obj.id || obj.nodeId || JSON.stringify(obj),

  // Enable text diffing for prompts
  textDiff: {
    minLength: 60
  },

  // Property filter for ignoring volatile fields
  propertyFilter: (name: string) => {
    return !['updatedAt', 'executionCount', '_internal'].includes(name);
  }
});

// Example: Compare two workflow versions
const workflowV1 = {
  id: 'wf-123',
  name: 'RAG Agent',
  nodes: [
    { id: 'n1', type: 'llm', model: 'gpt-4', prompt: 'You are helpful...' },
    { id: 'n2', type: 'retriever', topK: 5 }
  ],
  edges: [
    { source: 'n1', target: 'n2' }
  ]
};

const workflowV2 = {
  id: 'wf-123',
  name: 'RAG Agent v2',
  nodes: [
    { id: 'n1', type: 'llm', model: 'gpt-4-turbo', prompt: 'You are helpful...' },
    { id: 'n2', type: 'retriever', topK: 10 },
    { id: 'n3', type: 'reranker', model: 'cohere-rerank' }  // New node
  ],
  edges: [
    { source: 'n1', target: 'n2' },
    { source: 'n2', target: 'n3' }  // New edge
  ]
};

const delta = diffpatcher.diff(workflowV1, workflowV2);
console.log(formatters.console.format(delta));

// Output shows:
// - name: "RAG Agent" => "RAG Agent v2"
// - nodes[0].model: "gpt-4" => "gpt-4-turbo"
// - nodes[1].topK: 5 => 10
// - nodes: [added n3]
// - edges: [added edge to n3]
```

### Visual Diff for Node-Based Workflows

#### Diff Visualization Strategy

```typescript
interface WorkflowDiff {
  // Node-level changes
  nodes: {
    added: NodeDefinition[];
    removed: NodeDefinition[];
    modified: Array<{
      nodeId: string;
      changes: PropertyDiff[];
    }>;
    moved: Array<{
      nodeId: string;
      oldPosition: Position;
      newPosition: Position;
    }>;
  };

  // Edge-level changes
  edges: {
    added: EdgeDefinition[];
    removed: EdgeDefinition[];
  };

  // Metadata changes
  metadata: PropertyDiff[];
}

interface PropertyDiff {
  path: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'modified';
}
```

#### React Flow Visual Diff Component

```typescript
// Visual diff overlay for React Flow canvas
interface DiffOverlayProps {
  baseWorkflow: Workflow;
  compareWorkflow: Workflow;
  showMode: 'unified' | 'split' | 'overlay';
}

const DiffOverlay: React.FC<DiffOverlayProps> = ({
  baseWorkflow,
  compareWorkflow,
  showMode
}) => {
  const diff = useMemo(() =>
    computeWorkflowDiff(baseWorkflow, compareWorkflow),
    [baseWorkflow, compareWorkflow]
  );

  // Color coding for changes
  const getNodeStyle = (nodeId: string) => {
    if (diff.nodes.added.some(n => n.id === nodeId)) {
      return { border: '2px solid #22c55e', background: '#dcfce7' }; // Green
    }
    if (diff.nodes.removed.some(n => n.id === nodeId)) {
      return { border: '2px solid #ef4444', background: '#fee2e2' }; // Red
    }
    if (diff.nodes.modified.some(m => m.nodeId === nodeId)) {
      return { border: '2px solid #f59e0b', background: '#fef3c7' }; // Yellow
    }
    return {}; // Unchanged
  };

  return (
    <ReactFlow
      nodes={mergedNodes.map(node => ({
        ...node,
        style: getNodeStyle(node.id)
      }))}
      edges={mergedEdges}
    >
      <DiffLegend diff={diff} />
      <DiffSummaryPanel diff={diff} />
    </ReactFlow>
  );
};
```

### Side-by-Side Comparison UI

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW COMPARISON VIEW                      │
├─────────────────────────────────────────────────────────────────┤
│  Version: 1.2.0                    Version: 1.3.0               │
│  Published: Jan 15, 2026           Published: Jan 20, 2026      │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                     │
│  ┌─────┐    ┌─────┐       │  ┌─────┐    ┌─────┐    ┌─────┐    │
│  │ LLM │───►│ RAG │       │  │ LLM │───►│ RAG │───►│Rerank│    │
│  └─────┘    └─────┘       │  └─────┘    └─────┘    └─────┘    │
│                            │              (mod)      (new)      │
│                            │                                     │
├────────────────────────────┴────────────────────────────────────┤
│  CHANGES SUMMARY                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ + Added: Reranker node                                     │ │
│  │ ~ Modified: RAG node (topK: 5 → 10)                       │ │
│  │ ~ Modified: LLM node (model: gpt-4 → gpt-4-turbo)         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## A/B Testing for Agents

### Traffic Splitting Strategies

#### Percentage-Based Splitting

```typescript
interface TrafficSplitConfig {
  // Experiment identifier
  experimentId: string;

  // Variants with traffic percentages
  variants: Array<{
    id: string;
    agentVersionId: string;
    trafficPercentage: number;  // 0-100, must sum to 100
    isControl: boolean;
  }>;

  // Bucketing strategy
  bucketing: {
    // What to use for consistent bucketing
    bucketBy: 'user_id' | 'session_id' | 'request_id';

    // Hash algorithm for bucketing (LaunchDarkly uses SHA-1, others use murmur3)
    algorithm: 'sha1' | 'murmur3' | 'md5';

    // Salt for hash (prevents cross-experiment correlation)
    salt: string;
  };

  // Targeting rules
  targeting?: {
    // Include only specific user segments
    includeSegments?: string[];
    excludeSegments?: string[];

    // Custom targeting rules
    rules?: TargetingRule[];
  };
}

// Traffic routing implementation
// Note: LaunchDarkly uses SHA-1 for bucketing; other platforms may use murmur3
function routeTraffic(
  config: TrafficSplitConfig,
  context: RequestContext
): string {
  const bucketKey = context[config.bucketing.bucketBy];
  // SHA-1 based bucketing (LaunchDarkly style)
  const hashInput = `${config.experimentId}:${config.bucketing.salt}:${bucketKey}`;
  const hashHex = sha1(hashInput).substring(0, 15);
  const bucket = parseInt(hashHex, 16) % 100000;  // 100,000 buckets for 0.001% precision

  let cumulative = 0;
  for (const variant of config.variants) {
    cumulative += variant.trafficPercentage * 1000;
    if (bucket < cumulative) {
      return variant.agentVersionId;
    }
  }

  // Fallback to control
  return config.variants.find(v => v.isControl)?.agentVersionId;
}
```

#### User-Based Segmentation

```typescript
interface UserSegment {
  id: string;
  name: string;
  rules: Array<{
    field: string;       // e.g., 'plan', 'region', 'signup_date'
    operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';
    value: any;
  }>;
}

// Example segments
const segments: UserSegment[] = [
  {
    id: 'enterprise',
    name: 'Enterprise Users',
    rules: [{ field: 'plan', operator: 'eq', value: 'enterprise' }]
  },
  {
    id: 'power-users',
    name: 'Power Users',
    rules: [{ field: 'monthly_requests', operator: 'gt', value: 1000 }]
  },
  {
    id: 'beta-testers',
    name: 'Beta Testers',
    rules: [{ field: 'beta_enabled', operator: 'eq', value: true }]
  }
];
```

### Metrics Collection

```typescript
interface ExperimentMetrics {
  // Core performance metrics
  latency: {
    p50: number;
    p95: number;
    p99: number;
    mean: number;
  };

  // Quality metrics
  successRate: number;           // Successful completions
  errorRate: number;             // Errors and failures
  halluccinationRate?: number;   // Detected hallucinations

  // Cost metrics
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };

  // User satisfaction
  userSatisfaction?: {
    thumbsUp: number;
    thumbsDown: number;
    npsScore?: number;
  };

  // Business metrics
  taskCompletionRate: number;
  conversionRate?: number;
  retentionImpact?: number;
}

// Metrics collection event
interface MetricEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  timestamp: Date;

  // Request details
  requestId: string;
  latencyMs: number;
  success: boolean;
  errorCode?: string;

  // Token usage
  inputTokens: number;
  outputTokens: number;

  // Optional feedback
  userFeedback?: 'positive' | 'negative' | null;
}
```

### Statistical Significance Testing

#### Bayesian A/B Testing

```typescript
interface BayesianAnalysis {
  // Prior beliefs (can be informed by historical data)
  prior: {
    alpha: number;  // Successes
    beta: number;   // Failures
  };

  // Posterior after observing data
  computePosterior(successes: number, trials: number): BetaDistribution;

  // Probability that variant beats control
  probabilityToBeatControl(
    controlData: { successes: number; trials: number },
    variantData: { successes: number; trials: number }
  ): number;

  // Expected loss if choosing variant
  expectedLoss(
    controlData: { successes: number; trials: number },
    variantData: { successes: number; trials: number }
  ): number;
}

// Implementation
class BayesianCalculator implements BayesianAnalysis {
  prior = { alpha: 1, beta: 1 };  // Uniform prior

  probabilityToBeatControl(
    control: { successes: number; trials: number },
    variant: { successes: number; trials: number }
  ): number {
    // Monte Carlo simulation
    const samples = 100000;
    let variantWins = 0;

    for (let i = 0; i < samples; i++) {
      const controlSample = this.sampleBeta(
        this.prior.alpha + control.successes,
        this.prior.beta + control.trials - control.successes
      );
      const variantSample = this.sampleBeta(
        this.prior.alpha + variant.successes,
        this.prior.beta + variant.trials - variant.successes
      );

      if (variantSample > controlSample) {
        variantWins++;
      }
    }

    return variantWins / samples;
  }

  private sampleBeta(alpha: number, beta: number): number {
    // Beta distribution sampling using gamma functions
    const x = this.sampleGamma(alpha);
    const y = this.sampleGamma(beta);
    return x / (x + y);
  }
}

// Decision framework
interface ExperimentDecision {
  shouldConclude: boolean;
  winner: 'control' | 'variant' | 'no_difference';
  confidence: number;
  recommendation: string;
}

function makeDecision(
  analysis: BayesianAnalysis,
  control: MetricsSummary,
  variant: MetricsSummary,
  config: { minSamples: number; confidenceThreshold: number }
): ExperimentDecision {
  const probVariantWins = analysis.probabilityToBeatControl(
    { successes: control.successes, trials: control.total },
    { successes: variant.successes, trials: variant.total }
  );

  const totalSamples = control.total + variant.total;

  if (totalSamples < config.minSamples) {
    return {
      shouldConclude: false,
      winner: 'no_difference',
      confidence: probVariantWins,
      recommendation: `Need ${config.minSamples - totalSamples} more samples`
    };
  }

  if (probVariantWins > config.confidenceThreshold) {
    return {
      shouldConclude: true,
      winner: 'variant',
      confidence: probVariantWins,
      recommendation: 'Variant is significantly better. Consider full rollout.'
    };
  }

  if (probVariantWins < (1 - config.confidenceThreshold)) {
    return {
      shouldConclude: true,
      winner: 'control',
      confidence: 1 - probVariantWins,
      recommendation: 'Control is significantly better. Do not deploy variant.'
    };
  }

  return {
    shouldConclude: false,
    winner: 'no_difference',
    confidence: Math.max(probVariantWins, 1 - probVariantWins),
    recommendation: 'No significant difference yet. Continue experiment.'
  };
}
```

### Gradual Rollout Patterns

#### Canary Deployment

```typescript
interface CanaryConfig {
  // Initial traffic percentage to canary
  initialPercentage: number;  // e.g., 5%

  // Ramp-up schedule
  rampSchedule: Array<{
    percentage: number;
    durationMinutes: number;
    requiredMetrics: MetricThresholds;
  }>;

  // Rollback triggers
  rollbackTriggers: {
    errorRateThreshold: number;
    latencyP95Threshold: number;
    customMetrics?: Array<{
      metric: string;
      threshold: number;
      operator: 'gt' | 'lt';
    }>;
  };

  // Bake time before full rollout
  finalBakeTimeMinutes: number;
}

// Example canary schedule
const canaryConfig: CanaryConfig = {
  initialPercentage: 1,
  rampSchedule: [
    { percentage: 5, durationMinutes: 30, requiredMetrics: { errorRate: 0.01 } },
    { percentage: 25, durationMinutes: 60, requiredMetrics: { errorRate: 0.01 } },
    { percentage: 50, durationMinutes: 120, requiredMetrics: { errorRate: 0.01 } },
    { percentage: 100, durationMinutes: 0, requiredMetrics: { errorRate: 0.01 } }
  ],
  rollbackTriggers: {
    errorRateThreshold: 0.05,
    latencyP95Threshold: 3000
  },
  finalBakeTimeMinutes: 60
};
```

#### Blue-Green Deployment

```typescript
interface BlueGreenDeployment {
  // Environment states
  blue: {
    version: string;
    status: 'active' | 'standby' | 'draining';
    instances: number;
  };
  green: {
    version: string;
    status: 'active' | 'standby' | 'draining';
    instances: number;
  };

  // Traffic routing
  activeEnvironment: 'blue' | 'green';

  // Deployment operations
  deploy(newVersion: string): Promise<void>;
  switchTraffic(): Promise<void>;
  rollback(): Promise<void>;
}

class BlueGreenController implements BlueGreenDeployment {
  async deploy(newVersion: string): Promise<void> {
    const standby = this.activeEnvironment === 'blue' ? 'green' : 'blue';

    // 1. Deploy to standby environment
    await this.deployToEnvironment(standby, newVersion);

    // 2. Run health checks
    const healthy = await this.runHealthChecks(standby);
    if (!healthy) {
      throw new Error('Health checks failed on standby environment');
    }

    // 3. Run smoke tests
    const smokeTestsPassed = await this.runSmokeTests(standby);
    if (!smokeTestsPassed) {
      throw new Error('Smoke tests failed on standby environment');
    }

    // 4. Ready for traffic switch
    this[standby].status = 'standby';
  }

  async switchTraffic(): Promise<void> {
    const newActive = this.activeEnvironment === 'blue' ? 'green' : 'blue';
    const oldActive = this.activeEnvironment;

    // 1. Start draining old environment
    this[oldActive].status = 'draining';

    // 2. Switch traffic
    await this.updateLoadBalancer(newActive);
    this.activeEnvironment = newActive;
    this[newActive].status = 'active';

    // 3. Wait for drain to complete
    await this.waitForDrain(oldActive);
    this[oldActive].status = 'standby';
  }

  async rollback(): Promise<void> {
    // Instant rollback by switching back
    await this.switchTraffic();
  }
}
```

---

## Version Storage

### Immutable Snapshots vs Delta Storage

#### Comparison

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Full Snapshots** | Simple, fast reads, reliable | Storage growth, redundancy | Small-medium workflows |
| **Delta Storage** | Space efficient, audit trail | Complex reads, reconstruction | Large workflows, high velocity |
| **Hybrid** | Balanced tradeoffs | Implementation complexity | Most production systems |

#### Recommended: Hybrid Approach

```typescript
interface VersionStorage {
  // Store full snapshot for every Nth version or on major changes
  snapshots: {
    versionId: string;
    workflowData: WorkflowDefinition;
    createdAt: Date;
    sizeBytes: number;
  }[];

  // Store deltas between snapshots
  deltas: {
    versionId: string;
    baseSnapshotId: string;
    delta: JSONPatch[];  // RFC 6902 patches
    createdAt: Date;
    sizeBytes: number;
  }[];

  // Reconstruction logic
  getVersion(versionId: string): WorkflowDefinition {
    const snapshot = this.findNearestSnapshot(versionId);
    const deltas = this.getDeltasSince(snapshot.versionId, versionId);
    return this.applyDeltas(snapshot.workflowData, deltas);
  }
}

// Snapshot policy
interface SnapshotPolicy {
  // Create snapshot every N versions
  snapshotInterval: number;  // e.g., 10

  // Always snapshot on major version
  snapshotOnMajor: boolean;

  // Snapshot if delta exceeds size threshold
  maxDeltaSize: number;  // e.g., 50KB

  // Snapshot if cumulative deltas exceed threshold
  maxCumulativeDeltaSize: number;  // e.g., 200KB
}
```

### Database Schema for Version History

#### Core Tables

```sql
-- Agent/Workflow definitions (current state)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_version_id UUID,
  published_version_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  CONSTRAINT unique_agent_name_per_tenant UNIQUE (tenant_id, name)
);

-- Immutable version snapshots
CREATE TABLE agent_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,

  -- Semantic version
  version_major INTEGER NOT NULL DEFAULT 0,
  version_minor INTEGER NOT NULL DEFAULT 0,
  version_patch INTEGER NOT NULL DEFAULT 0,
  version_prerelease VARCHAR(50),
  version_string VARCHAR(50) GENERATED ALWAYS AS (
    version_major || '.' || version_minor || '.' || version_patch ||
    COALESCE('-' || version_prerelease, '')
  ) STORED,

  -- Immutable workflow definition
  definition JSONB NOT NULL,
  definition_hash VARCHAR(64) NOT NULL,  -- SHA-256 for deduplication

  -- Metadata
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'deprecated', 'archived')),
  release_notes TEXT,
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  -- Parent version for diff computation
  parent_version_id UUID REFERENCES agent_versions(id),

  CONSTRAINT unique_version_per_agent UNIQUE (agent_id, version_major, version_minor, version_patch, version_prerelease)
);

-- Delta storage for space optimization (optional)
CREATE TABLE agent_version_deltas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID NOT NULL REFERENCES agent_versions(id) ON DELETE CASCADE,
  base_version_id UUID NOT NULL REFERENCES agent_versions(id),
  delta JSONB NOT NULL,  -- JSON Patch format
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Environment deployments
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  version_id UUID NOT NULL REFERENCES agent_versions(id),
  environment VARCHAR(50) NOT NULL CHECK (environment IN ('development', 'staging', 'production')),

  -- Deployment state
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'deploying', 'active', 'draining', 'rolled_back', 'failed')),
  traffic_percentage INTEGER DEFAULT 0 CHECK (traffic_percentage BETWEEN 0 AND 100),

  -- Timestamps
  deployed_at TIMESTAMPTZ,
  deployed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Only one active deployment per agent per environment
  CONSTRAINT unique_active_deployment UNIQUE (agent_id, environment)
    WHERE status IN ('active', 'deploying')
);

-- A/B test experiments
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Experiment configuration
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'cancelled')),
  bucketing_key VARCHAR(50) DEFAULT 'user_id',
  salt VARCHAR(64) NOT NULL DEFAULT gen_random_uuid()::text,

  -- Targeting
  targeting_rules JSONB,

  -- Timeline
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Experiment variants
CREATE TABLE experiment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  version_id UUID NOT NULL REFERENCES agent_versions(id),
  name VARCHAR(100) NOT NULL,
  traffic_percentage DECIMAL(5,2) NOT NULL CHECK (traffic_percentage BETWEEN 0 AND 100),
  is_control BOOLEAN DEFAULT FALSE,

  CONSTRAINT unique_variant_per_experiment UNIQUE (experiment_id, version_id)
);

-- Experiment metrics
CREATE TABLE experiment_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id),
  variant_id UUID NOT NULL REFERENCES experiment_variants(id),

  -- Time bucket (for aggregation)
  bucket_start TIMESTAMPTZ NOT NULL,
  bucket_end TIMESTAMPTZ NOT NULL,

  -- Counts
  request_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,

  -- Latency percentiles (in ms)
  latency_p50 DECIMAL(10,2),
  latency_p95 DECIMAL(10,2),
  latency_p99 DECIMAL(10,2),

  -- Token usage
  input_tokens BIGINT DEFAULT 0,
  output_tokens BIGINT DEFAULT 0,
  total_cost DECIMAL(10,4) DEFAULT 0,

  -- User feedback
  positive_feedback INTEGER DEFAULT 0,
  negative_feedback INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_metric_bucket UNIQUE (experiment_id, variant_id, bucket_start)
);

-- Indexes for common queries
CREATE INDEX idx_agent_versions_agent ON agent_versions(agent_id);
CREATE INDEX idx_agent_versions_status ON agent_versions(status);
CREATE INDEX idx_deployments_environment ON deployments(agent_id, environment);
CREATE INDEX idx_experiments_status ON experiments(status);
CREATE INDEX idx_experiment_metrics_time ON experiment_metrics(experiment_id, bucket_start);
```

### Supabase Patterns for Versioned Data

#### Using pgaudit Extension

> **Note**: Supabase uses the standard PostgreSQL `pgaudit` extension for audit logging, not a custom "supa_audit" extension.

```sql
-- Enable audit extension
CREATE EXTENSION IF NOT EXISTS pgaudit;

-- Configure pgaudit for specific tables (session-level)
SET pgaudit.log = 'write, ddl';

-- Or configure at the role level for persistent auditing
ALTER ROLE "postgres" SET pgaudit.log TO 'write, ddl';

-- For object-level auditing, create an audit role
CREATE ROLE "audit_role" NOINHERIT;
ALTER ROLE "postgres" SET pgaudit.role TO 'audit_role';

-- Grant permissions to track specific tables
GRANT SELECT, INSERT, UPDATE, DELETE ON agents TO "audit_role";
GRANT SELECT, INSERT, UPDATE, DELETE ON agent_versions TO "audit_role";
GRANT SELECT, INSERT, UPDATE, DELETE ON deployments TO "audit_role";

-- Query audit logs from postgres_logs table (via Supabase dashboard or API)
-- Logs are stored as CSV and can be filtered by AUDIT prefix
SELECT
  cast(t.timestamp as datetime) as timestamp,
  event_message
FROM postgres_logs as t
WHERE event_message LIKE 'AUDIT%'
ORDER BY timestamp DESC;
```

#### Temporal Table Pattern (Manual Implementation)

```sql
-- History table for agent changes
CREATE TABLE agents_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,

  -- All columns from agents table
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_version_id UUID,
  published_version_id UUID,

  -- Temporal columns
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ,

  -- Change metadata
  changed_by UUID,
  change_type VARCHAR(20) CHECK (change_type IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- Trigger function for temporal tracking
CREATE OR REPLACE FUNCTION track_agent_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO agents_history (
      agent_id, tenant_id, name, description,
      current_version_id, published_version_id,
      valid_from, changed_by, change_type
    ) VALUES (
      NEW.id, NEW.tenant_id, NEW.name, NEW.description,
      NEW.current_version_id, NEW.published_version_id,
      NOW(), NEW.updated_by, 'INSERT'
    );
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Close previous history record
    UPDATE agents_history
    SET valid_to = NOW()
    WHERE agent_id = OLD.id AND valid_to IS NULL;

    -- Insert new history record
    INSERT INTO agents_history (
      agent_id, tenant_id, name, description,
      current_version_id, published_version_id,
      valid_from, changed_by, change_type
    ) VALUES (
      NEW.id, NEW.tenant_id, NEW.name, NEW.description,
      NEW.current_version_id, NEW.published_version_id,
      NOW(), NEW.updated_by, 'UPDATE'
    );
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agents_history
    SET valid_to = NOW(), change_type = 'DELETE'
    WHERE agent_id = OLD.id AND valid_to IS NULL;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER agent_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON agents
FOR EACH ROW EXECUTE FUNCTION track_agent_changes();

-- Query agent state at a specific time
CREATE OR REPLACE FUNCTION get_agent_at_time(
  p_agent_id UUID,
  p_timestamp TIMESTAMPTZ
) RETURNS agents_history AS $$
  SELECT * FROM agents_history
  WHERE agent_id = p_agent_id
    AND valid_from <= p_timestamp
    AND (valid_to IS NULL OR valid_to > p_timestamp)
  LIMIT 1;
$$ LANGUAGE SQL;
```

### Storage Optimization

```typescript
interface StorageOptimization {
  // Compression for large workflow definitions
  compression: {
    algorithm: 'gzip' | 'lz4' | 'zstd';
    threshold: number;  // Compress if larger than N bytes
  };

  // Deduplication
  deduplication: {
    // Store identical definitions once
    useContentAddressing: boolean;

    // Share common sub-graphs
    normalizeSubGraphs: boolean;
  };

  // Archival policy
  archival: {
    // Archive versions older than N days
    archiveAfterDays: number;

    // Move to cold storage
    coldStorageEnabled: boolean;

    // Retention before deletion
    retentionDays: number;
  };
}

// Content-addressable storage for definitions
async function storeDefinition(definition: WorkflowDefinition): Promise<string> {
  const normalized = normalizeDefinition(definition);
  const hash = sha256(JSON.stringify(normalized));

  // Check if already exists
  const existing = await db.query(
    'SELECT id FROM definition_store WHERE hash = $1',
    [hash]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  // Store new definition
  const compressed = await compress(JSON.stringify(normalized));
  await db.query(
    'INSERT INTO definition_store (id, hash, data, size_bytes) VALUES ($1, $2, $3, $4)',
    [uuid(), hash, compressed, compressed.length]
  );

  return hash;
}
```

---

## Deployment Pipelines

### Promotion Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │   Draft    │───►│ Development│───►│  Staging   │            │
│  │  Version   │    │   Deploy   │    │   Deploy   │            │
│  └────────────┘    └────────────┘    └────────────┘            │
│        │                 │                 │                     │
│        │                 ▼                 ▼                     │
│        │          ┌────────────┐    ┌────────────┐            │
│        │          │   Auto     │    │Integration │            │
│        │          │   Tests    │    │   Tests    │            │
│        │          └────────────┘    └────────────┘            │
│        │                 │                 │                     │
│        │                 │                 ▼                     │
│        │                 │          ┌────────────┐            │
│        │                 │          │  Approval  │            │
│        │                 │          │    Gate    │            │
│        │                 │          └────────────┘            │
│        │                 │                 │                     │
│        │                 │                 ▼                     │
│        │                 │          ┌────────────┐            │
│        │                 │          │ Production │            │
│        │                 └─────────►│   Deploy   │            │
│        │                            └────────────┘            │
│        │                                   │                     │
│        │                                   ▼                     │
│        │                            ┌────────────┐            │
│        └───────────────────────────►│  Canary/   │            │
│              (Rollback)             │  Gradual   │            │
│                                     └────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Approval Gates

```typescript
interface ApprovalGate {
  id: string;
  deploymentId: string;

  // Gate configuration
  config: {
    // Required approvers
    requiredApprovals: number;
    approverRoles: string[];  // e.g., ['tech-lead', 'qa-lead']

    // Auto-approval conditions
    autoApprove?: {
      enabled: boolean;
      conditions: Array<{
        metric: string;
        operator: 'gt' | 'lt' | 'eq';
        threshold: number;
      }>;
    };

    // Timeout
    timeoutHours: number;
    defaultAction: 'approve' | 'reject' | 'notify';
  };

  // State
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvals: Array<{
    userId: string;
    decision: 'approve' | 'reject';
    comment?: string;
    timestamp: Date;
  }>;
}

// Approval gate implementation
class ApprovalGateService {
  async createGate(deploymentId: string, config: ApprovalGate['config']): Promise<ApprovalGate> {
    const gate: ApprovalGate = {
      id: uuid(),
      deploymentId,
      config,
      status: 'pending',
      approvals: []
    };

    await this.db.insert('approval_gates', gate);
    await this.notifyApprovers(gate);

    return gate;
  }

  async submitApproval(
    gateId: string,
    userId: string,
    decision: 'approve' | 'reject',
    comment?: string
  ): Promise<ApprovalGate> {
    const gate = await this.getGate(gateId);

    // Verify user is authorized approver
    const user = await this.getUser(userId);
    if (!gate.config.approverRoles.some(role => user.roles.includes(role))) {
      throw new Error('User not authorized to approve this gate');
    }

    // Add approval
    gate.approvals.push({
      userId,
      decision,
      comment,
      timestamp: new Date()
    });

    // Check if gate should close
    const approveCount = gate.approvals.filter(a => a.decision === 'approve').length;
    const rejectCount = gate.approvals.filter(a => a.decision === 'reject').length;

    if (approveCount >= gate.config.requiredApprovals) {
      gate.status = 'approved';
      await this.proceedWithDeployment(gate.deploymentId);
    } else if (rejectCount > 0) {
      gate.status = 'rejected';
      await this.cancelDeployment(gate.deploymentId);
    }

    await this.db.update('approval_gates', gate);
    return gate;
  }
}
```

### Automated Testing Before Promotion

```typescript
interface DeploymentTests {
  // Test suites to run at each stage
  stages: {
    development: TestSuite[];
    staging: TestSuite[];
    production: TestSuite[];  // Smoke tests only
  };
}

interface TestSuite {
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'smoke' | 'performance' | 'security';
  timeout: number;
  retries: number;

  // Test execution
  run(context: DeploymentContext): Promise<TestResult>;
}

// Agent-specific test types
const agentTestSuites: TestSuite[] = [
  {
    name: 'Schema Validation',
    type: 'unit',
    timeout: 30000,
    retries: 0,
    async run(ctx) {
      // Validate input/output schemas
      const schema = ctx.agentVersion.definition.schema;
      return validateSchema(schema);
    }
  },
  {
    name: 'Tool Integration',
    type: 'integration',
    timeout: 60000,
    retries: 2,
    async run(ctx) {
      // Test all configured tools work
      const tools = ctx.agentVersion.definition.tools;
      return Promise.all(tools.map(tool => testTool(tool)));
    }
  },
  {
    name: 'Golden Test Cases',
    type: 'e2e',
    timeout: 120000,
    retries: 1,
    async run(ctx) {
      // Run against known input/output pairs
      const goldenTests = await loadGoldenTests(ctx.agentId);
      return runGoldenTests(ctx.agentVersion, goldenTests);
    }
  },
  {
    name: 'Performance Baseline',
    type: 'performance',
    timeout: 300000,
    retries: 0,
    async run(ctx) {
      // Verify latency within acceptable bounds
      const baseline = await getPerformanceBaseline(ctx.agentId);
      const results = await runPerformanceTests(ctx.agentVersion);
      return comparePerformance(baseline, results);
    }
  },
  {
    name: 'Prompt Injection Tests',
    type: 'security',
    timeout: 60000,
    retries: 0,
    async run(ctx) {
      // Test resistance to common attacks
      const attacks = loadPromptInjectionTests();
      return runSecurityTests(ctx.agentVersion, attacks);
    }
  }
];
```

### Environment-Specific Configuration

```typescript
interface EnvironmentConfig {
  name: 'development' | 'staging' | 'production';

  // LLM configuration
  llm: {
    provider: string;
    model: string;
    maxTokens: number;
    temperature: number;
    // Production may use different models for cost
    fallbackModel?: string;
  };

  // Rate limits
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
    concurrentRequests: number;
  };

  // Observability
  observability: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    tracingEnabled: boolean;
    metricsEnabled: boolean;
    samplingRate: number;  // 0-1
  };

  // Feature flags
  features: {
    [key: string]: boolean | string | number;
  };
}

// Environment configs
const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    llm: {
      provider: 'openai',
      model: 'gpt-4o-mini',  // Cheaper for dev
      maxTokens: 1000,
      temperature: 0.7
    },
    rateLimits: {
      requestsPerMinute: 100,
      tokensPerMinute: 50000,
      concurrentRequests: 10
    },
    observability: {
      logLevel: 'debug',
      tracingEnabled: true,
      metricsEnabled: true,
      samplingRate: 1.0  // 100% sampling in dev
    },
    features: {
      experimentalTools: true,
      debugMode: true
    }
  },
  staging: {
    name: 'staging',
    llm: {
      provider: 'openai',
      model: 'gpt-4o',
      maxTokens: 4000,
      temperature: 0.5
    },
    rateLimits: {
      requestsPerMinute: 500,
      tokensPerMinute: 200000,
      concurrentRequests: 50
    },
    observability: {
      logLevel: 'info',
      tracingEnabled: true,
      metricsEnabled: true,
      samplingRate: 0.5
    },
    features: {
      experimentalTools: true,
      debugMode: false
    }
  },
  production: {
    name: 'production',
    llm: {
      provider: 'openai',
      model: 'gpt-4o',
      maxTokens: 4000,
      temperature: 0.3,
      fallbackModel: 'gpt-4o-mini'
    },
    rateLimits: {
      requestsPerMinute: 2000,
      tokensPerMinute: 1000000,
      concurrentRequests: 200
    },
    observability: {
      logLevel: 'warn',
      tracingEnabled: true,
      metricsEnabled: true,
      samplingRate: 0.1
    },
    features: {
      experimentalTools: false,
      debugMode: false
    }
  }
};
```

---

## Implementation Recommendations

### Recommended Libraries and Tools

| Category | Recommendation | Rationale |
|----------|----------------|-----------|
| **JSON Diff** | jsondiffpatch | Best array handling, visual formatters, reversible patches |
| **Graph Editor** | React Flow | Used by Dify/Flowise, extensive ecosystem, good performance |
| **Feature Flags** | LaunchDarkly / Flagsmith | Enterprise-grade, percentage rollouts, targeting |
| **A/B Testing Stats** | Custom Bayesian implementation | Flexible, no p-hacking, continuous monitoring |
| **Version Control UI** | Custom (inspired by GitHub) | Workflow-specific needs |
| **Database** | Supabase (PostgreSQL) | pgaudit extension, RLS, real-time |
| **Deployment** | GitHub Actions + Kubernetes | Industry standard, good integration |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                 VERSIONING & LIFECYCLE ARCHITECTURE              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     FRONTEND LAYER                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │  Workflow   │  │   Version   │  │ Deployment  │     │    │
│  │  │   Editor    │  │  Comparison │  │  Dashboard  │     │    │
│  │  │ (ReactFlow) │  │    (Diff)   │  │  (Status)   │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      API LAYER                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │  Version    │  │ Deployment  │  │ Experiment  │     │    │
│  │  │   API       │  │    API      │  │    API      │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    SERVICE LAYER                         │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │    │
│  │  │  Version  │ │ Promotion │ │  Traffic  │ │ Metrics │ │    │
│  │  │  Manager  │ │  Engine   │ │  Router   │ │Collector│ │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └─────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    DATA LAYER                            │    │
│  │  ┌───────────────────┐  ┌───────────────────────────┐   │    │
│  │  │     Supabase      │  │      Time-Series DB       │   │    │
│  │  │  (PostgreSQL)     │  │   (Metrics/Analytics)     │   │    │
│  │  │  - Versions       │  │   - Request metrics       │   │    │
│  │  │  - Deployments    │  │   - Experiment data       │   │    │
│  │  │  - Experiments    │  │   - Performance stats     │   │    │
│  │  │  - Audit logs     │  │                           │   │    │
│  │  └───────────────────┘  └───────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Design

### Version Management Endpoints

```typescript
// Version Management API
interface VersionAPI {
  // List versions
  'GET /agents/:agentId/versions': {
    query: {
      status?: 'draft' | 'published' | 'deprecated';
      limit?: number;
      offset?: number;
    };
    response: {
      versions: AgentVersion[];
      total: number;
    };
  };

  // Get specific version
  'GET /agents/:agentId/versions/:versionId': {
    response: AgentVersion;
  };

  // Create new version (from draft or clone)
  'POST /agents/:agentId/versions': {
    body: {
      definition: WorkflowDefinition;
      releaseNotes?: string;
      parentVersionId?: string;
    };
    response: AgentVersion;
  };

  // Publish version
  'POST /agents/:agentId/versions/:versionId/publish': {
    body: {
      releaseNotes: string;
    };
    response: AgentVersion;
  };

  // Compare versions
  'GET /agents/:agentId/versions/compare': {
    query: {
      baseVersionId: string;
      compareVersionId: string;
    };
    response: {
      diff: WorkflowDiff;
      summary: DiffSummary;
    };
  };

  // Restore version to draft
  'POST /agents/:agentId/versions/:versionId/restore': {
    response: {
      draftVersion: AgentVersion;
    };
  };
}

// Deployment API
interface DeploymentAPI {
  // List deployments
  'GET /agents/:agentId/deployments': {
    query: {
      environment?: string;
    };
    response: Deployment[];
  };

  // Create deployment (promote to environment)
  'POST /agents/:agentId/deployments': {
    body: {
      versionId: string;
      environment: 'development' | 'staging' | 'production';
      strategy: 'immediate' | 'canary' | 'blue-green';
      canaryConfig?: CanaryConfig;
    };
    response: Deployment;
  };

  // Update deployment (e.g., increase canary %)
  'PATCH /agents/:agentId/deployments/:deploymentId': {
    body: {
      trafficPercentage?: number;
      status?: 'active' | 'draining' | 'rolled_back';
    };
    response: Deployment;
  };

  // Rollback deployment
  'POST /agents/:agentId/deployments/:deploymentId/rollback': {
    body: {
      targetVersionId?: string;  // Optional, defaults to previous
    };
    response: Deployment;
  };
}

// Experiment API
interface ExperimentAPI {
  // Create experiment
  'POST /agents/:agentId/experiments': {
    body: {
      name: string;
      variants: Array<{
        versionId: string;
        trafficPercentage: number;
        isControl: boolean;
      }>;
      targetingRules?: TargetingRule[];
    };
    response: Experiment;
  };

  // Start experiment
  'POST /agents/:agentId/experiments/:experimentId/start': {
    response: Experiment;
  };

  // Get experiment results
  'GET /agents/:agentId/experiments/:experimentId/results': {
    response: {
      experiment: Experiment;
      variants: Array<{
        id: string;
        metrics: ExperimentMetrics;
        sampleSize: number;
      }>;
      analysis: {
        winningVariant: string | null;
        confidence: number;
        recommendation: string;
      };
    };
  };

  // Conclude experiment
  'POST /agents/:agentId/experiments/:experimentId/conclude': {
    body: {
      winner: 'control' | 'variant';
      deployToProduction: boolean;
    };
    response: Experiment;
  };
}
```

### OpenAPI Specification Example

```yaml
openapi: 3.0.3
info:
  title: Agent Versioning API
  version: 1.0.0
  description: API for managing agent versions, deployments, and experiments

paths:
  /agents/{agentId}/versions:
    get:
      summary: List agent versions
      parameters:
        - name: agentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, published, deprecated]
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: List of versions
          content:
            application/json:
              schema:
                type: object
                properties:
                  versions:
                    type: array
                    items:
                      $ref: '#/components/schemas/AgentVersion'
                  total:
                    type: integer

    post:
      summary: Create new version
      parameters:
        - name: agentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - definition
              properties:
                definition:
                  $ref: '#/components/schemas/WorkflowDefinition'
                releaseNotes:
                  type: string
                parentVersionId:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Version created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentVersion'

components:
  schemas:
    AgentVersion:
      type: object
      properties:
        id:
          type: string
          format: uuid
        agentId:
          type: string
          format: uuid
        versionString:
          type: string
          example: "1.2.3"
        status:
          type: string
          enum: [draft, published, deprecated, archived]
        definition:
          $ref: '#/components/schemas/WorkflowDefinition'
        releaseNotes:
          type: string
        publishedAt:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        createdBy:
          type: string
          format: uuid

    WorkflowDefinition:
      type: object
      properties:
        nodes:
          type: array
          items:
            $ref: '#/components/schemas/WorkflowNode'
        edges:
          type: array
          items:
            $ref: '#/components/schemas/WorkflowEdge'
        variables:
          type: object
        settings:
          type: object

    WorkflowNode:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        position:
          type: object
          properties:
            x:
              type: number
            y:
              type: number
        data:
          type: object

    WorkflowEdge:
      type: object
      properties:
        id:
          type: string
        source:
          type: string
        target:
          type: string
        sourceHandle:
          type: string
        targetHandle:
          type: string
```

---

## UI/UX Patterns

### Version History Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  VERSION HISTORY                                    [Compare]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ● v2.1.0 (Latest)                              Jan 20, 2026│ │
│  │   Published by @sarah                                       │ │
│  │   "Added reranker node for improved relevance"              │ │
│  │   [Restore] [View] [Compare]                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ○ v2.0.0                                       Jan 15, 2026│ │
│  │   Published by @john                                        │ │
│  │   "Breaking: Updated output schema for consistency"         │ │
│  │   [Restore] [View] [Compare]                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ○ v1.5.2                                       Jan 10, 2026│ │
│  │   Published by @sarah                                       │ │
│  │   "Fixed prompt injection vulnerability"                    │ │
│  │   [Restore] [View] [Compare]                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Load More...]                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Deployment Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  DEPLOYMENT STATUS - RAG Agent                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ENVIRONMENTS                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DEVELOPMENT                                              │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │  v2.2.0-dev.3        ● Active       100% traffic   │   │   │
│  │  │  Deployed: 2 hours ago by @alex                    │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  STAGING                                                  │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │  v2.1.0              ● Active       100% traffic   │   │   │
│  │  │  Deployed: 1 day ago                               │   │   │
│  │  │  [Promote to Production]                           │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PRODUCTION                                               │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │  v2.0.0              ● Active       95% traffic    │   │   │
│  │  │  v2.1.0              ◐ Canary        5% traffic    │   │   │
│  │  │                                                     │   │   │
│  │  │  Canary Progress: ████░░░░░░ 5% → 25% in 28 min   │   │   │
│  │  │  [Pause] [Rollback] [Accelerate]                   │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### A/B Test Results View

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPERIMENT: Improved RAG Pipeline                               │
│  Status: Running (7 days)                    [Pause] [Conclude]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  VARIANT PERFORMANCE                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     Control      Variant A    Variant B   │   │
│  │  ─────────────────────────────────────────────────────── │   │
│  │  Traffic            50%          30%          20%         │   │
│  │  Samples            12,450       7,521        4,998       │   │
│  │  ─────────────────────────────────────────────────────── │   │
│  │  Success Rate       94.2%        96.8% ↑      95.1%       │   │
│  │  Avg Latency        1.2s         1.4s         1.1s ↓      │   │
│  │  P95 Latency        2.8s         3.1s         2.5s        │   │
│  │  Avg Cost/Req       $0.012       $0.018       $0.010 ↓    │   │
│  │  User Satisfaction  78%          85% ↑        80%         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  STATISTICAL ANALYSIS                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Variant A vs Control:                                    │   │
│  │  • Probability Variant A is better: 94.7%                 │   │
│  │  • Expected improvement: +2.6% success rate               │   │
│  │  • Trade-off: +16.7% latency, +50% cost                   │   │
│  │                                                            │   │
│  │  Variant B vs Control:                                    │   │
│  │  • Probability Variant B is better: 67.2%                 │   │
│  │  • Expected improvement: +0.9% success rate               │   │
│  │  • Trade-off: -8.3% latency, -16.7% cost                  │   │
│  │                                                            │   │
│  │  ⚠️ Recommendation: Continue experiment for 3 more days   │   │
│  │     to reach 95% confidence threshold.                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [View Detailed Metrics] [Export Report] [Configure Alerts]      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## References

### Platform Documentation
- [Dify Version Control](https://docs.dify.ai/en/guides/management/version-control)
- [n8n Workflow History](https://docs.n8n.io/workflows/history/)
- [n8n Source Control](https://docs.n8n.io/source-control-environments/)
- [Flowise Versioning Feature Request](https://github.com/FlowiseAI/Flowise/issues/2882)

### Libraries and Tools
- [jsondiffpatch](https://github.com/benjamine/jsondiffpatch) - JSON diff and patch library
- [React Flow](https://reactflow.dev/) - Node-based graph editor for React
- [LaunchDarkly Percentage Rollouts](https://launchdarkly.com/docs/home/releases/percentage-rollouts)
- [pgaudit Extension](https://supabase.com/docs/guides/database/extensions/pgaudit) - PostgreSQL audit logging extension

### Best Practices
- [Semantic Versioning 2.0.0](https://semver.org/)
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
- [A/B Testing and Canary Deployments for Models](https://apxml.com/courses/advanced-ai-infrastructure-design-optimization/chapter-4-high-performance-model-inference/ab-testing-canary-deployments-models)
- [Blue-Green Deployment](https://www.datacamp.com/tutorial/blue-green-deployment)
- [AWS Machine Learning Lens - Deployment Strategies](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/mlrel-11.html)

### Research and Articles
- [n8n Workflow Version Control and Deployment Pipeline](https://www.wednesday.is/writing-articles/n8n-workflow-version-control-and-deployment-pipeline)
- [LLM Rollout Strategy and Risk Mitigation](https://www.rohan-paul.com/p/llm-rollout-strategy-and-risk-mitigation)
- [State of AI Agents - LangChain](https://www.langchain.com/state-of-agent-engineering)
- [Agile Git Branching Strategies in 2026](https://www.javacodegeeks.com/2025/11/agile-git-branching-strategies-in-2026.html)
- [CI/CD Pipeline Best Practices 2026](https://middleware.io/blog/what-is-a-ci-cd-pipeline/)

### Statistical Testing
- [Bayesian A/B Test Calculator - Dynamic Yield](https://marketing.dynamicyield.com/bayesian-calculator/)
- [VWO A/B Test Significance Calculator](https://vwo.com/tools/ab-test-significance-calculator/)
- [Statsig Bayesian Calculator](https://www.statsig.com/bayesiancalculator)

---

*Document generated: 2026-01-21*
*Research scope: Agent versioning, deployment pipelines, A/B testing for Hyyve Platform*

---

## Validation Notes

**Validated: 2026-01-21** using deepwiki MCP and context7 MCP

### ✅ Verified Claims

| Claim | Source | Status |
|-------|--------|--------|
| jsondiffpatch LCS algorithm, visual formatters | context7 (benjamine/jsondiffpatch) | ✅ Verified |
| Yjs snapshots and UndoManager | context7 (yjs/yjs) | ✅ Verified |
| Dify draft/published versioning model | deepwiki (langgenius/dify) | ✅ Verified |
| n8n WorkflowHistory with full snapshots | deepwiki (n8n-io/n8n) | ✅ Verified |
| Flowise lacks native versioning | deepwiki (FlowiseAI/Flowise) | ✅ Verified |
| Bayesian A/B testing with Beta distribution | Web research | ✅ Verified |
| LaunchDarkly 100,000 bucket partitions | context7 (launchdarkly) | ✅ Verified |

### ⚠️ Corrections Applied

1. **supa_audit → pgaudit** (CRITICAL)
   - Original: Referenced non-existent `supa_audit` Supabase extension
   - Correction: Supabase uses standard PostgreSQL `pgaudit` extension
   - Affected sections: Database audit patterns, References
   - Source: deepwiki (supabase/supabase)

2. **Hashing Algorithm Clarification**
   - Original: Suggested `murmur3` for traffic bucketing
   - Correction: LaunchDarkly uses SHA-1; murmur3 used by other platforms (Amplitude)
   - Affected sections: Traffic splitting implementation
   - Source: LaunchDarkly documentation, GitHub issues

### ⚠️ Implementation Notes

1. **Yjs Snapshots Require gc:false**
   - When using Yjs for versioning with snapshots, you MUST create the document with `gc: false`
   - Example: `const doc = new Y.Doc({ gc: false })`
   - Without this, snapshots cannot be created or restored properly

2. **LaunchDarkly Bucketing Algorithm**
   - Uses SHA-1 hash of: `flagKey.salt.contextKey`
   - Takes first 15 hex characters, converts to decimal
   - Divides by 0xFFFFFFFFFFFFFFF for bucket assignment
   - This ensures consistent user assignment across sessions

### 📚 Validation Sources

- **deepwiki MCP**: Queried actual codebases for Dify, n8n, Flowise, Supabase
- **context7 MCP**: Verified library APIs for jsondiffpatch, Yjs, LaunchDarkly
- **Web Search**: Validated Bayesian A/B testing statistical approach
