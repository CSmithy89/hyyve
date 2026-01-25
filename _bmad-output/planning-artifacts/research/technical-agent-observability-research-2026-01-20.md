# Agent Observability & Monitoring - Technical Research Document

**Date:** January 20, 2026
**Version:** 1.1
**Status:** Verified
**Purpose:** Comprehensive technical research for Hyyve platform observability

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Platform Deep Dives](#2-platform-deep-dives)
   - 2.1 LangSmith
   - 2.2 Helicone
   - 2.3 Langfuse
   - 2.4 Arize Phoenix
3. [OpenTelemetry for LLMs](#3-opentelemetry-for-llms)
4. [Cost Tracking Architecture](#4-cost-tracking-architecture)
5. [Agent-Specific Observability](#5-agent-specific-observability)
6. [Log Aggregation Patterns](#6-log-aggregation-patterns)
7. [Alerting and Anomaly Detection](#7-alerting-and-anomaly-detection)
8. [Debugging Failed Executions](#8-debugging-failed-executions)
9. [Multi-Tenant Observability](#9-multi-tenant-observability)
10. [Architecture Recommendations](#10-architecture-recommendations)
11. [Implementation Examples](#11-implementation-examples)

---

## 1. Executive Summary

### Overview

AI agent observability in 2026 has matured significantly, with the industry converging on OpenTelemetry-based standards while specialized platforms provide LLM-specific capabilities. For an Hyyve platform, observability must address:

- **Tracing**: Hierarchical spans tracking agent executions, tool calls, and LLM interactions
- **Cost Management**: Token-level accounting with multi-tenant attribution
- **Quality Monitoring**: Evaluation frameworks for output quality, hallucination detection
- **Debugging**: Replay capabilities for failed executions
- **Alerting**: Anomaly detection for latency, cost, and error rates

### Key Findings

| Requirement | Recommended Solution |
|-------------|---------------------|
| Self-hosted observability | **Langfuse** (MIT license, ClickHouse-backed) |
| Proxy-based cost tracking | **Helicone** (minimal latency, 300+ model support) |
| LangChain/LangGraph integration | **LangSmith** (native support, evaluation suite) |
| Embedding analysis & drift | **Arize Phoenix** (open-source, OTLP-native) |
| Standards compliance | **OpenTelemetry GenAI Semantic Conventions** |

### Platform Comparison Matrix

| Feature | LangSmith | Helicone | Langfuse | Arize Phoenix |
|---------|-----------|----------|----------|---------------|
| **Pricing** | $0.50-5/1k traces | Free tier 10k req/mo | Self-hosted free | Open-source |
| **Self-hosted** | Enterprise only | Yes (OSS) | Yes (MIT) | Yes (ELv2) |
| **OTel Support** | Yes | Limited | Native | Native |
| **Multi-tenant** | Via tags | Via properties | Via projects | Via tags |
| **Evaluation** | Built-in | Limited | Built-in | Built-in |
| **Cost Tracking** | Automatic | Automatic | Automatic | Manual |
| **Latency Impact** | ~0ms (async) | 50-80ms | ~0ms (async) | ~0ms |

---

## 2. Platform Deep Dives

### 2.1 LangSmith (LangChain)

**Overview**: LangSmith is LangChain's agent engineering platform providing observability, evaluation, and deployment capabilities. It offers the deepest integration with LangChain/LangGraph ecosystems.

#### Tracing Architecture

```
+------------------+     +-------------------+     +----------------+
|  Your Application |---->| LangSmith SDK     |---->| Trace Collector|
|  (LangGraph)      |     | (Async Callback)  |     | (Distributed)  |
+------------------+     +-------------------+     +----------------+
                                                           |
                                                           v
                                                   +----------------+
                                                   | LangSmith Cloud|
                                                   | or Self-Hosted |
                                                   +----------------+
```

**Key Concepts**:
- **Runs**: Individual steps (LLM calls, tool calls, chain executions)
- **Traces**: Collection of runs representing a single request
- **Threads**: Collection of traces representing a conversation

#### Instrumentation

```python
# Environment-based setup (simplest)
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls_..."
os.environ["LANGCHAIN_PROJECT"] = "my-agent-project"

# Explicit decorator for custom functions
from langsmith import traceable

@traceable(name="custom_retrieval")
def retrieve_documents(query: str) -> list[Document]:
    # Your retrieval logic
    return documents

# Wrapping OpenAI SDK
from langsmith.wrappers import wrap_openai
from openai import OpenAI

client = wrap_openai(OpenAI())
```

#### Evaluation Framework

LangSmith supports multiple evaluation types:
- **Offline Evals**: Run on datasets for benchmarking/regression testing
- **Online Evals**: Run on production traffic in near real-time
- **Human Evaluation**: Annotation queues and inline review
- **LLM-as-Judge**: Automated scoring against defined criteria
- **Pairwise Comparison**: A/B testing outputs

```python
from langsmith.evaluation import evaluate, LangChainStringEvaluator

# Define evaluators
evaluators = [
    LangChainStringEvaluator("cot_qa"),  # Chain-of-thought QA
    LangChainStringEvaluator("criteria", config={"criteria": "relevance"}),
]

# Run evaluation
results = evaluate(
    lambda inputs: my_agent.invoke(inputs),
    data="my-dataset",
    evaluators=evaluators,
)
```

#### Pricing Structure

| Tier | Cost | Traces Included | Retention |
|------|------|-----------------|-----------|
| Developer | Free | 5k/month | 14 days (base) |
| Plus | $39/seat/month | 10k/month | 14 days (base) |
| Enterprise | Custom | Custom | 400 days (extended) |

**Additional Costs**:
- Base traces: $0.50/1k (14-day retention)
- Extended traces: $5.00/1k (400-day retention)
- Agent Builder runs: $0.05/run beyond quota

#### Self-Hosted Options

Self-hosted LangSmith is **Enterprise-only** and requires:
- Kubernetes cluster (AWS, GCP, or Azure)
- License key from LangChain sales team
- Data remains in your environment

---

### 2.2 Helicone

**Overview**: Helicone is an open-source LLM observability platform using a proxy-based architecture. It excels at cost tracking and requires minimal code changes.

#### Proxy Architecture

```
+------------------+     +-------------------+     +----------------+
|  Your Application|---->| Helicone Proxy    |---->| LLM Provider   |
|                  |     | (Cloudflare Edge) |     | (OpenAI, etc.) |
+------------------+     +-------------------+     +----------------+
                                |
                                v
                         +-------------+
                         | ClickHouse  |
                         | (Analytics) |
                         +-------------+
```

**Latency Impact**: 50-80ms average (Cloudflare Workers at edge)

#### Integration Patterns

**Method 1: URL Replacement**
```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://oai.helicone.ai/v1",
    default_headers={
        "Helicone-Auth": "Bearer sk-helicone-...",
    }
)
```

**Method 2: Header Injection**
```python
headers = {
    "Helicone-Auth": "Bearer sk-helicone-...",
    "Helicone-Property-UserId": "user_123",
    "Helicone-Property-TenantId": "tenant_456",
    "Helicone-Property-Feature": "rag-search",
    "Helicone-Session-Id": "session_789",
    "Helicone-Session-Name": "Customer Support Chat",
}
```

#### Cost Tracking Features

**Automatic Cost Calculation**:
- **Model Registry V2**: Access 300+ models via `https://api.helicone.ai/v1/public/model-registry/models`
- Real-time pricing updates and "providerSlug" normalization
- Support for custom/fine-tuned models

**Cost Attribution via Custom Properties**:
```python
headers = {
    "Helicone-Property-UserTier": "premium",
    "Helicone-Property-Feature": "document-analysis",
    "Helicone-Property-Environment": "production",
    "Helicone-Property-WorkspaceId": "ws_123",
}
```

#### Caching Capabilities

```python
headers = {
    "Helicone-Cache-Enabled": "true",
    "Cache-Control": "max-age=3600",  # 1 hour
}
```

**Cache Benefits**:
- Eliminate redundant API calls
- Typical 90% cost reduction on repeated queries
- Configurable TTL per request

#### Rate Limiting

```python
headers = {
    "Helicone-RateLimit-Policy": "100;w=60",  # 100 requests per 60 seconds
}
```

---

### 2.3 Langfuse (Open Source)

**Overview**: Langfuse is the leading open-source LLM observability platform, recently acquired by ClickHouse. It offers full self-hosting with MIT license.

#### Architecture Components

```
+-------------------+     +------------------+     +---------------+
|   Your App        |---->| Langfuse Web     |---->| PostgreSQL    |
|   (SDK/OTel)      |     | (API + UI)       |     | (Transactional)|
+-------------------+     +------------------+     +---------------+
                                |
                                v
                         +------------------+     +---------------+
                         | Langfuse Worker  |---->| ClickHouse    |
                         | (Async Processing)|    | (Analytics)   |
                         +------------------+     +---------------+
                                |
                                v
                         +------------------+
                         | S3/Blob Storage  |
                         | (Events, Media)  |
                         +------------------+
```

#### Trace and Span Model

```
Session (optional)
    |
    +-- Trace 1 (single request)
    |       |
    |       +-- Span: Agent Execution
    |       |       |
    |       |       +-- Generation: LLM Call
    |       |       +-- Span: Tool Call (retrieval)
    |       |       +-- Generation: LLM Call
    |       |
    |       +-- Span: Post-processing
    |
    +-- Trace 2 (follow-up request)
            |
            +-- ...
```

**Entity Types**:
- **Trace**: Single request/operation with input/output
- **Span**: Logical unit of work (can be nested)
- **Generation**: LLM-specific span with token counts
- **Event**: Point-in-time occurrence
- **Score**: Evaluation result attached to traces

#### SDK Integration

```python
from langfuse import Langfuse
from langfuse.decorators import observe, langfuse_context

langfuse = Langfuse()

@observe()
def rag_pipeline(query: str):
    # Retrieval
    docs = retrieve_documents(query)

    # Update current observation
    langfuse_context.update_current_observation(
        metadata={"doc_count": len(docs)}
    )

    # Generation
    response = generate_response(query, docs)
    return response

@observe(as_type="generation")
def generate_response(query: str, docs: list):
    # LLM call - automatically tracks tokens, cost
    return llm.complete(query, context=docs)
```

#### OpenTelemetry Integration

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

# Configure OTLP exporter to Langfuse
exporter = OTLPSpanExporter(
    endpoint="https://cloud.langfuse.com/api/public/otel/v1/traces",
    headers={
        "Authorization": "Basic <base64(public_key:secret_key)>"
    }
)

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)
```

#### Prompt Management

```python
# Fetch versioned prompt from Langfuse
prompt = langfuse.get_prompt("rag-system-prompt", version=2)

# Use in your application
messages = [
    {"role": "system", "content": prompt.compile(variables={"context": ctx})},
    {"role": "user", "content": user_query}
]
```

#### Self-Hosting Deployment

**Docker Compose (Development)**:
```yaml
version: '3.8'
services:
  langfuse-web:
    image: langfuse/langfuse:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - CLICKHOUSE_URL=http://clickhouse:8123
      - REDIS_HOST=redis

  langfuse-worker:
    image: langfuse/langfuse-worker:latest
    environment:
      - DATABASE_URL=postgresql://...

  clickhouse:
    image: clickhouse/clickhouse-server:latest

  redis:
    image: redis:7

  postgres:
    image: postgres:15
```

**Kubernetes (Production)**:
```bash
helm repo add langfuse https://langfuse.github.io/langfuse-helm
helm install langfuse langfuse/langfuse \
  --set postgresql.enabled=true \
  --set clickhouse.enabled=true \
  --set redis.enabled=true
```

---

### 2.4 Arize Phoenix

**Overview**: Arize Phoenix is an open-source AI observability platform with strong embedding visualization and drift detection capabilities.

#### Key Capabilities

1. **LLM Tracing**: OpenTelemetry-native trace collection
2. **Embedding Analysis**: Visualize and cluster embeddings
3. **Drift Detection**: Monitor feature and embedding drift
4. **Evaluation**: LLM-based and code-based evaluators

#### Architecture

```
+-------------------+     +------------------+     +---------------+
|   Your App        |---->| Phoenix Server   |---->| Local Storage |
|   (OTel SDK)      |     | (OTLP Receiver)  |     | or Phoenix    |
+-------------------+     +------------------+     | Cloud         |
                                |                 +---------------+
                                v
                         +------------------+
                         | Embedding Engine |
                         | (UMAP, Clusters) |
                         +------------------+
```

#### Instrumentation

```python
import phoenix as px
from phoenix.otel import register

# Start Phoenix server
px.launch_app()

# Register OpenTelemetry tracer
tracer_provider = register(project_name="my-rag-agent")

# Auto-instrument frameworks
from openinference.instrumentation.langchain import LangChainInstrumentor
from openinference.instrumentation.openai import OpenAIInstrumentor

LangChainInstrumentor().instrument(tracer_provider=tracer_provider)
OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)
```

#### Embedding Visualization

```python
import phoenix as px

# Load embeddings for analysis
schema = px.Schema(
    embedding_feature_column_names={
        "query_embedding": px.EmbeddingColumnNames(
            vector_column_name="query_vector",
            raw_data_column_name="query_text"
        ),
        "document_embedding": px.EmbeddingColumnNames(
            vector_column_name="doc_vector",
            raw_data_column_name="doc_text"
        )
    }
)

# Launch with embedding analysis
session = px.launch_app(
    primary=production_df,
    reference=baseline_df,
    schema=schema
)
```

#### Drift Detection

Phoenix monitors:
- **Feature Drift**: Changes in input distributions
- **Embedding Drift**: Semantic shifts in vector spaces
- **Performance Drift**: Degradation in quality metrics

```python
from phoenix.evals import run_evals
from phoenix.evals.models import OpenAIModel

# Define drift detection evaluator
model = OpenAIModel(model="gpt-4o")

results = run_evals(
    dataframe=traces_df,
    evaluators=[
        Hallucination(model),
        QACorrectness(model),
        Relevance(model),
    ],
    provide_explanation=True
)
```

---

## 3. OpenTelemetry for LLMs

### GenAI Semantic Conventions

OpenTelemetry has established semantic conventions for GenAI systems (v1.37+), providing standardized attribute names for LLM observability.

#### Core Span Attributes

**Required Attributes**:
```
gen_ai.operation.name    # "chat", "embeddings", "execute_tool"
gen_ai.provider.name     # "openai", "anthropic", "bedrock"
```

**Request Attributes**:
```
gen_ai.request.model           # "gpt-4o", "claude-3-sonnet"
gen_ai.request.temperature     # 0.7
gen_ai.request.max_tokens      # 4096
gen_ai.request.top_p           # 0.9
```

**Response Attributes**:
```
gen_ai.response.model          # Actual model used
gen_ai.response.finish_reasons # ["stop", "length"]
gen_ai.usage.input_tokens      # 1500
gen_ai.usage.output_tokens     # 500
```

**Agent-Specific Attributes**:
```
gen_ai.agent.name              # "rag-assistant"
gen_ai.agent.id                # "agent_123"
gen_ai.conversation.id         # "conv_456"
gen_ai.tool.name               # "web_search"
gen_ai.tool.call.id            # "call_789"
```

#### Span Hierarchy for Agents

```
Trace: invoke_agent (gen_ai.agent.name="rag-assistant")
    |
    +-- Span: chat (gen_ai.operation.name="chat")
    |       Attributes:
    |         gen_ai.request.model="gpt-4o"
    |         gen_ai.usage.input_tokens=1200
    |         gen_ai.usage.output_tokens=150
    |
    +-- Span: execute_tool (gen_ai.operation.name="execute_tool")
    |       Attributes:
    |         gen_ai.tool.name="vector_search"
    |         gen_ai.tool.call.id="call_001"
    |
    +-- Span: chat (gen_ai.operation.name="chat")
            Attributes:
              gen_ai.request.model="gpt-4o"
              gen_ai.usage.input_tokens=3500
              gen_ai.usage.output_tokens=800
```

#### Implementation with OpenTelemetry SDK

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.semconv.ai import GenAiOperationNameValues

# Setup
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint="http://jaeger:4317"))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("rag-agent")

def call_llm(messages, model="gpt-4o"):
    with tracer.start_as_current_span(
        f"chat {model}",
        attributes={
            "gen_ai.operation.name": "chat",
            "gen_ai.provider.name": "openai",
            "gen_ai.request.model": model,
            "gen_ai.request.temperature": 0.7,
        }
    ) as span:
        response = openai_client.chat.completions.create(
            model=model,
            messages=messages
        )

        # Add response attributes
        span.set_attribute("gen_ai.response.model", response.model)
        span.set_attribute("gen_ai.usage.input_tokens", response.usage.prompt_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", response.usage.completion_tokens)
        span.set_attribute("gen_ai.response.finish_reasons", [response.choices[0].finish_reason])

        return response
```

#### Exporters Configuration

**Jaeger**:
```python
from opentelemetry.exporter.jaeger.thrift import JaegerExporter

exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)
```

**Zipkin**:
```python
from opentelemetry.exporter.zipkin.json import ZipkinExporter

exporter = ZipkinExporter(endpoint="http://zipkin:9411/api/v2/spans")
```

**OTLP (Recommended)**:
```python
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# To Jaeger, Tempo, or any OTLP-compatible backend
exporter = OTLPSpanExporter(endpoint="http://collector:4317", insecure=True)
```

---

## 4. Cost Tracking Architecture

### Token Counting

#### Provider-Specific Tokenizers

**OpenAI (tiktoken)**:
```python
import tiktoken

def count_openai_tokens(text: str, model: str = "gpt-4o") -> int:
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# For chat messages
def count_chat_tokens(messages: list, model: str = "gpt-4o") -> int:
    encoding = tiktoken.encoding_for_model(model)
    tokens = 0
    for message in messages:
        tokens += 4  # Message overhead
        tokens += len(encoding.encode(message["content"]))
        tokens += len(encoding.encode(message["role"]))
    tokens += 2  # Priming tokens
    return tokens
```

**Anthropic (Claude)**:
```python
import anthropic

client = anthropic.Anthropic()

def count_anthropic_tokens(text: str, model: str = "claude-3-sonnet-20240229") -> int:
    # Use Anthropic's token counting API
    response = client.messages.count_tokens(
        model=model,
        messages=[{"role": "user", "content": text}]
    )
    return response.input_tokens
```

**Cross-Platform Library (tokencost)**:
```python
from tokencost import calculate_prompt_cost, calculate_completion_cost

# Supports gpt-4o, o1-preview, and o1-mini
prompt = "What is the capital of France?"
completion = "The capital of France is Paris."

prompt_cost = calculate_prompt_cost(prompt, model="gpt-4o")
completion_cost = calculate_completion_cost(completion, model="gpt-4o")
total_cost = prompt_cost + completion_cost
```

### Model Pricing Lookup

```python
# Pricing database (prices per 1M tokens)
MODEL_PRICING = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    "claude-3-opus": {"input": 15.00, "output": 75.00},
    "claude-3-sonnet": {"input": 3.00, "output": 15.00},
    "claude-3-haiku": {"input": 0.25, "output": 1.25},
    "claude-3.5-sonnet": {"input": 3.00, "output": 15.00},
}

def calculate_cost(
    input_tokens: int,
    output_tokens: int,
    model: str,
    cached_tokens: int = 0
) -> float:
    pricing = MODEL_PRICING.get(model, {"input": 0, "output": 0})

    # Cached tokens are typically 90% cheaper
    cache_discount = 0.1

    input_cost = (input_tokens - cached_tokens) * pricing["input"] / 1_000_000
    cached_cost = cached_tokens * pricing["input"] * cache_discount / 1_000_000
    output_cost = output_tokens * pricing["output"] / 1_000_000

    return input_cost + cached_cost + output_cost
```

### Cost Attribution Schema

```sql
-- Cost tracking table schema
CREATE TABLE llm_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Attribution dimensions
    tenant_id VARCHAR(255) NOT NULL,
    workspace_id VARCHAR(255),
    project_id VARCHAR(255),
    agent_id VARCHAR(255),
    user_id VARCHAR(255),
    session_id VARCHAR(255),

    -- Request details
    trace_id VARCHAR(255) NOT NULL,
    span_id VARCHAR(255),
    model VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    operation_type VARCHAR(50), -- 'chat', 'embedding', 'completion'

    -- Token counts
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cached_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,

    -- Costs (in USD cents for precision)
    input_cost_cents DECIMAL(12, 4),
    output_cost_cents DECIMAL(12, 4),
    total_cost_cents DECIMAL(12, 4),

    -- Metadata
    environment VARCHAR(50), -- 'production', 'staging', 'development'
    feature_flag VARCHAR(255),
    custom_metadata JSONB,

    -- Indexes
    INDEX idx_tenant_timestamp (tenant_id, timestamp),
    INDEX idx_workspace_timestamp (workspace_id, timestamp),
    INDEX idx_trace (trace_id)
);

-- Aggregation view for dashboards
CREATE MATERIALIZED VIEW daily_costs AS
SELECT
    date_trunc('day', timestamp) as date,
    tenant_id,
    workspace_id,
    project_id,
    agent_id,
    model,
    COUNT(*) as request_count,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(total_cost_cents) / 100.0 as total_cost_usd
FROM llm_costs
GROUP BY 1, 2, 3, 4, 5, 6;
```

### Budget Alerts and Limits

```python
from dataclasses import dataclass
from decimal import Decimal
from typing import Optional
import asyncio

@dataclass
class BudgetConfig:
    tenant_id: str
    daily_limit_usd: Decimal
    monthly_limit_usd: Decimal
    alert_thresholds: list[float] = (0.5, 0.8, 0.95)  # 50%, 80%, 95%
    hard_limit: bool = False  # Block requests when exceeded

class BudgetManager:
    def __init__(self, db, alerter):
        self.db = db
        self.alerter = alerter

    async def check_budget(self, tenant_id: str) -> tuple[bool, Optional[str]]:
        """Check if tenant is within budget. Returns (allowed, message)."""
        config = await self.get_budget_config(tenant_id)

        daily_spend = await self.get_daily_spend(tenant_id)
        monthly_spend = await self.get_monthly_spend(tenant_id)

        # Check daily limit
        daily_pct = float(daily_spend / config.daily_limit_usd)
        if daily_pct >= 1.0 and config.hard_limit:
            return False, f"Daily budget exceeded: ${daily_spend:.2f}/${config.daily_limit_usd}"

        # Check monthly limit
        monthly_pct = float(monthly_spend / config.monthly_limit_usd)
        if monthly_pct >= 1.0 and config.hard_limit:
            return False, f"Monthly budget exceeded: ${monthly_spend:.2f}/${config.monthly_limit_usd}"

        # Send alerts at thresholds
        for threshold in config.alert_thresholds:
            if daily_pct >= threshold:
                await self.alerter.send_budget_alert(
                    tenant_id=tenant_id,
                    period="daily",
                    current=daily_spend,
                    limit=config.daily_limit_usd,
                    percentage=daily_pct
                )
            if monthly_pct >= threshold:
                await self.alerter.send_budget_alert(
                    tenant_id=tenant_id,
                    period="monthly",
                    current=monthly_spend,
                    limit=config.monthly_limit_usd,
                    percentage=monthly_pct
                )

        return True, None

    async def record_cost(self, cost_record: dict):
        """Record a cost entry and check budgets."""
        await self.db.insert("llm_costs", cost_record)
        await self.check_budget(cost_record["tenant_id"])
```

---

## 5. Agent-Specific Observability

### Tool Call Tracing

```python
from opentelemetry import trace
from functools import wraps

tracer = trace.get_tracer("agent-tools")

def trace_tool_call(tool_name: str):
    """Decorator for tracing tool calls."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            with tracer.start_as_current_span(
                f"execute_tool {tool_name}",
                attributes={
                    "gen_ai.operation.name": "execute_tool",
                    "gen_ai.tool.name": tool_name,
                    "gen_ai.tool.call.arguments": str(kwargs),
                }
            ) as span:
                try:
                    result = await func(*args, **kwargs)
                    span.set_attribute("gen_ai.tool.call.result", str(result)[:1000])
                    span.set_status(trace.Status(trace.StatusCode.OK))
                    return result
                except Exception as e:
                    span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
                    span.record_exception(e)
                    raise
        return wrapper
    return decorator

# Usage
@trace_tool_call("vector_search")
async def vector_search(query: str, top_k: int = 5) -> list[dict]:
    results = await vector_db.search(query, limit=top_k)
    return results

@trace_tool_call("web_search")
async def web_search(query: str) -> list[dict]:
    results = await search_api.search(query)
    return results
```

### Decision Points Logging

```python
import structlog
from enum import Enum

logger = structlog.get_logger()

class DecisionType(Enum):
    TOOL_SELECTION = "tool_selection"
    RESPONSE_GENERATION = "response_generation"
    CLARIFICATION_NEEDED = "clarification_needed"
    DELEGATION = "delegation"
    TERMINATION = "termination"

def log_decision(
    trace_id: str,
    decision_type: DecisionType,
    options: list[str],
    selected: str,
    reasoning: str,
    confidence: float,
    context: dict = None
):
    """Log agent decision points for debugging and analysis."""
    logger.info(
        "agent_decision",
        trace_id=trace_id,
        decision_type=decision_type.value,
        options=options,
        selected=selected,
        reasoning=reasoning,
        confidence=confidence,
        context=context or {},
    )
```

### Memory/Context Tracking

```python
from dataclasses import dataclass, field
from typing import Any
from datetime import datetime

@dataclass
class MemoryEntry:
    content: Any
    timestamp: datetime = field(default_factory=datetime.utcnow)
    source: str = "user"  # "user", "agent", "tool", "system"
    metadata: dict = field(default_factory=dict)

class ObservableMemory:
    """Memory system with built-in observability."""

    def __init__(self, trace_id: str, max_tokens: int = 8000):
        self.trace_id = trace_id
        self.max_tokens = max_tokens
        self.entries: list[MemoryEntry] = []
        self.token_count = 0
        self.logger = structlog.get_logger()

    def add(self, content: Any, source: str = "user", metadata: dict = None):
        entry = MemoryEntry(content=content, source=source, metadata=metadata or {})
        self.entries.append(entry)

        # Log memory addition
        self.logger.info(
            "memory_added",
            trace_id=self.trace_id,
            source=source,
            content_length=len(str(content)),
            total_entries=len(self.entries),
            metadata=metadata,
        )

        # Check for overflow
        self._check_overflow()

    def _check_overflow(self):
        """Handle memory overflow with observability."""
        current_tokens = self._estimate_tokens()
        if current_tokens > self.max_tokens:
            removed_count = 0
            while self._estimate_tokens() > self.max_tokens * 0.8:
                self.entries.pop(0)
                removed_count += 1

            self.logger.warning(
                "memory_overflow",
                trace_id=self.trace_id,
                removed_entries=removed_count,
                remaining_entries=len(self.entries),
                token_limit=self.max_tokens,
            )

    def get_context(self) -> list[dict]:
        """Get memory as context with tracking."""
        context = [{"role": e.source, "content": str(e.content)} for e in self.entries]

        self.logger.debug(
            "memory_retrieved",
            trace_id=self.trace_id,
            entry_count=len(context),
            estimated_tokens=self._estimate_tokens(),
        )

        return context
```

### Multi-Agent Conversation Flows

```python
from opentelemetry import trace
from typing import Optional

tracer = trace.get_tracer("multi-agent")

class AgentOrchestrator:
    """Orchestrator for multi-agent workflows with full observability."""

    def __init__(self, agents: dict):
        self.agents = agents
        self.conversation_id = None

    async def run_workflow(
        self,
        task: str,
        conversation_id: Optional[str] = None
    ) -> dict:
        self.conversation_id = conversation_id or str(uuid.uuid4())

        with tracer.start_as_current_span(
            "multi_agent_workflow",
            attributes={
                "gen_ai.conversation.id": self.conversation_id,
                "workflow.task": task,
                "workflow.agent_count": len(self.agents),
            }
        ) as workflow_span:

            results = {}
            current_context = {"task": task}

            for agent_name, agent in self.agents.items():
                with tracer.start_as_current_span(
                    f"invoke_agent {agent_name}",
                    attributes={
                        "gen_ai.operation.name": "invoke_agent",
                        "gen_ai.agent.name": agent_name,
                        "gen_ai.agent.id": agent.agent_id,
                    }
                ) as agent_span:
                    try:
                        result = await agent.execute(current_context)
                        results[agent_name] = result
                        current_context["previous_result"] = result

                        agent_span.set_attribute(
                            "agent.output_length",
                            len(str(result))
                        )

                    except Exception as e:
                        agent_span.set_status(
                            trace.Status(trace.StatusCode.ERROR, str(e))
                        )
                        raise

            workflow_span.set_attribute("workflow.success", True)
            return results
```

---

## 6. Log Aggregation Patterns

### Structured Logging Schema

```python
import structlog
from datetime import datetime
from typing import Optional

# Configure structlog for JSON output
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
)

# Standard log schema for LLM operations
class LLMLogSchema:
    """Standard fields for LLM operation logs."""

    @staticmethod
    def llm_request(
        trace_id: str,
        span_id: str,
        model: str,
        provider: str,
        input_tokens: int,
        prompt_preview: str,
        tenant_id: str,
        user_id: Optional[str] = None,
        metadata: dict = None
    ) -> dict:
        return {
            "event": "llm_request",
            "trace_id": trace_id,
            "span_id": span_id,
            "model": model,
            "provider": provider,
            "input_tokens": input_tokens,
            "prompt_preview": prompt_preview[:200],  # Truncate for logs
            "tenant_id": tenant_id,
            "user_id": user_id,
            "metadata": metadata or {},
        }

    @staticmethod
    def llm_response(
        trace_id: str,
        span_id: str,
        output_tokens: int,
        latency_ms: float,
        finish_reason: str,
        cost_usd: float,
        success: bool,
        error: Optional[str] = None
    ) -> dict:
        return {
            "event": "llm_response",
            "trace_id": trace_id,
            "span_id": span_id,
            "output_tokens": output_tokens,
            "latency_ms": latency_ms,
            "finish_reason": finish_reason,
            "cost_usd": cost_usd,
            "success": success,
            "error": error,
        }
```

### Log Levels for Agents

| Level | Use Case | Examples |
|-------|----------|----------|
| DEBUG | Detailed execution flow | Memory operations, token counts, intermediate results |
| INFO | Normal operations | Request/response, tool calls, agent decisions |
| WARNING | Recoverable issues | Rate limits, retries, memory overflow, budget warnings |
| ERROR | Failed operations | API errors, tool failures, validation errors |
| CRITICAL | System failures | Database down, provider outage, security violations |

### Correlation ID Implementation

```python
from contextvars import ContextVar
from uuid import uuid4
from functools import wraps

# Context variables for correlation
trace_id_var: ContextVar[str] = ContextVar("trace_id", default="")
tenant_id_var: ContextVar[str] = ContextVar("tenant_id", default="")
user_id_var: ContextVar[str] = ContextVar("user_id", default="")

def with_correlation(func):
    """Ensure correlation IDs are propagated."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Extract or generate trace_id
        trace_id = kwargs.pop("trace_id", None) or trace_id_var.get() or str(uuid4())
        tenant_id = kwargs.pop("tenant_id", None) or tenant_id_var.get()
        user_id = kwargs.pop("user_id", None) or user_id_var.get()

        # Set context
        trace_id_var.set(trace_id)
        tenant_id_var.set(tenant_id)
        user_id_var.set(user_id)

        # Bind to logger
        logger = structlog.get_logger().bind(
            trace_id=trace_id,
            tenant_id=tenant_id,
            user_id=user_id,
        )

        return await func(*args, logger=logger, **kwargs)
    return wrapper

# HTTP middleware for correlation
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class CorrelationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract or generate correlation IDs
        trace_id = request.headers.get("X-Trace-ID", str(uuid4()))
        tenant_id = request.headers.get("X-Tenant-ID", "")
        user_id = request.headers.get("X-User-ID", "")

        # Set context variables
        trace_id_var.set(trace_id)
        tenant_id_var.set(tenant_id)
        user_id_var.set(user_id)

        # Add to response headers
        response = await call_next(request)
        response.headers["X-Trace-ID"] = trace_id

        return response
```

### Retention Policies

```yaml
# Log retention configuration
retention:
  # Tier 1: Hot storage (fast queries)
  hot:
    storage: elasticsearch
    duration: 7d
    log_levels: [DEBUG, INFO, WARNING, ERROR, CRITICAL]

  # Tier 2: Warm storage (slower queries, cheaper)
  warm:
    storage: s3_glacier_instant
    duration: 30d
    log_levels: [INFO, WARNING, ERROR, CRITICAL]

  # Tier 3: Cold storage (archival)
  cold:
    storage: s3_glacier_deep
    duration: 365d
    log_levels: [ERROR, CRITICAL]

  # Tenant-specific overrides
  tenant_overrides:
    enterprise:
      hot_duration: 30d
      warm_duration: 90d
      cold_duration: 7y
    compliance:
      cold_duration: 10y
      include_all_levels: true
```

---

## 7. Alerting and Anomaly Detection

### Alert Configuration

```python
from dataclasses import dataclass
from enum import Enum
from typing import Callable, Optional

class AlertSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class AlertChannel(Enum):
    SLACK = "slack"
    PAGERDUTY = "pagerduty"
    EMAIL = "email"
    WEBHOOK = "webhook"

@dataclass
class AlertRule:
    name: str
    description: str
    metric: str
    condition: str  # e.g., "value > threshold"
    threshold: float
    window_minutes: int
    severity: AlertSeverity
    channels: list[AlertChannel]
    tenant_scope: Optional[str] = None  # None = platform-wide
    cooldown_minutes: int = 15

# Standard alert rules for LLM platform
STANDARD_ALERTS = [
    AlertRule(
        name="high_error_rate",
        description="LLM API error rate exceeds threshold",
        metric="llm.error_rate",
        condition="value > threshold",
        threshold=0.05,  # 5%
        window_minutes=5,
        severity=AlertSeverity.ERROR,
        channels=[AlertChannel.SLACK, AlertChannel.PAGERDUTY],
    ),
    AlertRule(
        name="latency_p95_spike",
        description="P95 latency exceeds normal range",
        metric="llm.latency_p95",
        condition="value > threshold",
        threshold=5000,  # 5 seconds
        window_minutes=10,
        severity=AlertSeverity.WARNING,
        channels=[AlertChannel.SLACK],
    ),
    AlertRule(
        name="cost_spike",
        description="Hourly cost exceeds 2x rolling average",
        metric="llm.hourly_cost",
        condition="value > 2 * rolling_avg_24h",
        threshold=2.0,  # multiplier
        window_minutes=60,
        severity=AlertSeverity.WARNING,
        channels=[AlertChannel.SLACK, AlertChannel.EMAIL],
    ),
    AlertRule(
        name="token_usage_anomaly",
        description="Token usage deviates significantly from baseline",
        metric="llm.tokens_per_request",
        condition="abs(value - baseline) > 3 * stddev",
        threshold=3.0,  # standard deviations
        window_minutes=30,
        severity=AlertSeverity.WARNING,
        channels=[AlertChannel.SLACK],
    ),
    AlertRule(
        name="budget_threshold",
        description="Tenant approaching budget limit",
        metric="tenant.budget_usage_pct",
        condition="value > threshold",
        threshold=0.80,  # 80%
        window_minutes=60,
        severity=AlertSeverity.WARNING,
        channels=[AlertChannel.SLACK, AlertChannel.EMAIL],
    ),
]
```

### Slack Integration

```python
import httpx
from typing import Optional

class SlackAlerter:
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    async def send_alert(
        self,
        title: str,
        message: str,
        severity: AlertSeverity,
        trace_id: Optional[str] = None,
        dashboard_url: Optional[str] = None,
        fields: dict = None
    ):
        color_map = {
            AlertSeverity.INFO: "#36a64f",
            AlertSeverity.WARNING: "#ff9800",
            AlertSeverity.ERROR: "#f44336",
            AlertSeverity.CRITICAL: "#9c27b0",
        }

        blocks = [
            {
                "type": "header",
                "text": {"type": "plain_text", "text": f":warning: {title}"}
            },
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": message}
            }
        ]

        if fields:
            field_text = "\n".join([f"*{k}:* {v}" for k, v in fields.items()])
            blocks.append({
                "type": "section",
                "text": {"type": "mrkdwn", "text": field_text}
            })

        if trace_id or dashboard_url:
            buttons = []
            if trace_id:
                buttons.append({
                    "type": "button",
                    "text": {"type": "plain_text", "text": "View Trace"},
                    "url": f"https://observability.example.com/traces/{trace_id}"
                })
            if dashboard_url:
                buttons.append({
                    "type": "button",
                    "text": {"type": "plain_text", "text": "View Dashboard"},
                    "url": dashboard_url
                })
            blocks.append({"type": "actions", "elements": buttons})

        payload = {
            "attachments": [{
                "color": color_map[severity],
                "blocks": blocks
            }]
        }

        async with httpx.AsyncClient() as client:
            await client.post(self.webhook_url, json=payload)
```

### PagerDuty Integration

```python
class PagerDutyAlerter:
    def __init__(self, routing_key: str):
        self.routing_key = routing_key
        self.events_url = "https://events.pagerduty.com/v2/enqueue"

    async def send_alert(
        self,
        title: str,
        message: str,
        severity: AlertSeverity,
        dedup_key: str,
        source: str = "llm-platform",
        custom_details: dict = None
    ):
        severity_map = {
            AlertSeverity.INFO: "info",
            AlertSeverity.WARNING: "warning",
            AlertSeverity.ERROR: "error",
            AlertSeverity.CRITICAL: "critical",
        }

        payload = {
            "routing_key": self.routing_key,
            "event_action": "trigger",
            "dedup_key": dedup_key,
            "payload": {
                "summary": title,
                "severity": severity_map[severity],
                "source": source,
                "custom_details": {
                    "message": message,
                    **(custom_details or {})
                }
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.events_url, json=payload)
            return response.json()

    async def resolve_alert(self, dedup_key: str):
        payload = {
            "routing_key": self.routing_key,
            "event_action": "resolve",
            "dedup_key": dedup_key,
        }

        async with httpx.AsyncClient() as client:
            await client.post(self.events_url, json=payload)
```

---

## 8. Debugging Failed Executions

### Replay Architecture

```
+------------------+     +-------------------+     +------------------+
| Event Store      |---->| Replay Engine     |---->| Isolated Runtime |
| (Immutable Logs) |     | (Deterministic)   |     | (Sandboxed)      |
+------------------+     +-------------------+     +------------------+
        |                         |                        |
        |                         v                        v
        |                 +---------------+        +---------------+
        |                 | Mock LLM      |        | Comparison    |
        |                 | (Cached Resp) |        | Report        |
        |                 +---------------+        +---------------+
        |
        v
+------------------+
| S3/Blob Storage  |
| (Long-term)      |
+------------------+
```

### Event Sourcing for Agents

```python
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Optional
from enum import Enum
import json

class EventType(Enum):
    AGENT_STARTED = "agent_started"
    LLM_REQUEST = "llm_request"
    LLM_RESPONSE = "llm_response"
    TOOL_CALL = "tool_call"
    TOOL_RESPONSE = "tool_response"
    DECISION_MADE = "decision_made"
    MEMORY_UPDATED = "memory_updated"
    AGENT_COMPLETED = "agent_completed"
    AGENT_FAILED = "agent_failed"

@dataclass
class AgentEvent:
    event_id: str
    trace_id: str
    event_type: EventType
    timestamp: datetime
    sequence_number: int
    payload: dict
    parent_event_id: Optional[str] = None

    def to_json(self) -> str:
        data = asdict(self)
        data["event_type"] = self.event_type.value
        data["timestamp"] = self.timestamp.isoformat()
        return json.dumps(data)

class EventStore:
    """Append-only event store for agent executions."""

    def __init__(self, storage_backend):
        self.storage = storage_backend

    async def append(self, event: AgentEvent):
        """Append event to the store."""
        key = f"traces/{event.trace_id}/events/{event.sequence_number:08d}.json"
        await self.storage.put(key, event.to_json())

    async def get_trace_events(self, trace_id: str) -> list[AgentEvent]:
        """Retrieve all events for a trace."""
        prefix = f"traces/{trace_id}/events/"
        events = []
        async for key, data in self.storage.list(prefix):
            event_data = json.loads(data)
            event_data["event_type"] = EventType(event_data["event_type"])
            event_data["timestamp"] = datetime.fromisoformat(event_data["timestamp"])
            events.append(AgentEvent(**event_data))
        return sorted(events, key=lambda e: e.sequence_number)
```

### Deterministic Replay Engine

```python
class ReplayEngine:
    """Replay agent executions deterministically."""

    def __init__(self, event_store: EventStore):
        self.event_store = event_store
        self.llm_cache = {}
        self.tool_cache = {}

    async def prepare_replay(self, trace_id: str):
        """Load events and build caches for replay."""
        events = await self.event_store.get_trace_events(trace_id)

        for event in events:
            if event.event_type == EventType.LLM_RESPONSE:
                request_hash = self._hash_request(event.payload["request"])
                self.llm_cache[request_hash] = event.payload["response"]
            elif event.event_type == EventType.TOOL_RESPONSE:
                call_hash = self._hash_tool_call(event.payload["call"])
                self.tool_cache[call_hash] = event.payload["response"]

        return events

    async def replay(
        self,
        trace_id: str,
        stop_at_event: Optional[int] = None,
        compare_with_live: bool = False
    ) -> dict:
        """Replay execution with cached responses."""
        events = await self.prepare_replay(trace_id)

        # Create mock clients
        mock_llm = MockLLMClient(self.llm_cache)
        mock_tools = MockToolExecutor(self.tool_cache)

        # Re-instantiate agent with mocks
        agent = self._create_agent_from_events(events, mock_llm, mock_tools)

        # Find initial input
        start_event = next(e for e in events if e.event_type == EventType.AGENT_STARTED)
        initial_input = start_event.payload["input"]

        # Execute replay
        replay_events = []
        async for event in agent.execute_with_events(initial_input):
            replay_events.append(event)
            if stop_at_event and event.sequence_number >= stop_at_event:
                break

        # Compare if requested
        comparison = None
        if compare_with_live:
            comparison = self._compare_executions(events, replay_events)

        return {
            "original_events": events,
            "replay_events": replay_events,
            "comparison": comparison,
        }

    def _compare_executions(
        self,
        original: list[AgentEvent],
        replay: list[AgentEvent]
    ) -> dict:
        """Compare original and replay executions."""
        differences = []

        for i, (orig, rep) in enumerate(zip(original, replay)):
            if orig.event_type != rep.event_type:
                differences.append({
                    "index": i,
                    "type": "event_type_mismatch",
                    "original": orig.event_type.value,
                    "replay": rep.event_type.value,
                })
            elif orig.payload != rep.payload:
                differences.append({
                    "index": i,
                    "type": "payload_mismatch",
                    "event_type": orig.event_type.value,
                    "diff": self._diff_payloads(orig.payload, rep.payload),
                })

        return {
            "match": len(differences) == 0,
            "differences": differences,
            "original_count": len(original),
            "replay_count": len(replay),
        }
```

### Input/Output Inspection UI Components

```typescript
// React component for trace inspection
interface TraceEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

interface TraceInspectorProps {
  traceId: string;
  events: TraceEvent[];
  onReplay: (stopAtEvent?: number) => void;
}

const TraceInspector: React.FC<TraceInspectorProps> = ({
  traceId,
  events,
  onReplay
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TraceEvent | null>(null);
  const [diffView, setDiffView] = useState(false);

  return (
    <div className="trace-inspector">
      <header>
        <h2>Trace: {traceId}</h2>
        <button onClick={() => onReplay()}>Replay Full Trace</button>
      </header>

      <div className="timeline">
        {events.map((event, index) => (
          <div
            key={event.eventId}
            className={`event ${event.eventType} ${
              selectedEvent?.eventId === event.eventId ? 'selected' : ''
            }`}
            onClick={() => setSelectedEvent(event)}
          >
            <span className="sequence">{index + 1}</span>
            <span className="type">{event.eventType}</span>
            <span className="time">{formatTimestamp(event.timestamp)}</span>
            <button onClick={() => onReplay(index)}>
              Replay to here
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="event-details">
          <h3>{selectedEvent.eventType}</h3>
          <pre>{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

---

## 9. Multi-Tenant Observability

### Tenant Isolation Architecture

```
+-------------------+     +-------------------+     +-------------------+
| Tenant A Traffic  |---->|                   |---->| Tenant A Data     |
+-------------------+     |   API Gateway     |     | (Isolated Store)  |
                          |   (Auth + Route)  |     +-------------------+
+-------------------+     |                   |
| Tenant B Traffic  |---->|                   |---->| Tenant B Data     |
+-------------------+     +-------------------+     | (Isolated Store)  |
                                                    +-------------------+

                          +-------------------+
                          | Platform Ops      |
                          | (Cross-tenant     |
                          |  Aggregation)     |
                          +-------------------+
```

### Tenant-Aware Tracing

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource

def create_tenant_tracer(tenant_id: str, workspace_id: str) -> trace.Tracer:
    """Create a tracer with tenant context."""
    resource = Resource.create({
        "service.name": "rag-agent",
        "tenant.id": tenant_id,
        "workspace.id": workspace_id,
    })

    provider = TracerProvider(resource=resource)

    # Add tenant-specific processor if needed
    # (e.g., for tenant-specific sampling rates)

    return provider.get_tracer("rag-agent")

# Middleware to inject tenant context
class TenantContextMiddleware:
    async def __call__(self, request, call_next):
        tenant_id = request.headers.get("X-Tenant-ID")
        workspace_id = request.headers.get("X-Workspace-ID")

        # Set span attributes for all child spans
        current_span = trace.get_current_span()
        current_span.set_attribute("tenant.id", tenant_id)
        current_span.set_attribute("workspace.id", workspace_id)

        response = await call_next(request)
        return response
```

### Per-Tenant Dashboards

```python
# Grafana dashboard configuration generator
def generate_tenant_dashboard(tenant_id: str, tenant_name: str) -> dict:
    return {
        "title": f"{tenant_name} - LLM Observability",
        "tags": ["llm", "tenant", tenant_id],
        "templating": {
            "list": [
                {
                    "name": "tenant_id",
                    "type": "constant",
                    "value": tenant_id,
                    "hide": 2  # Hide from UI
                },
                {
                    "name": "workspace",
                    "type": "query",
                    "query": f"label_values(llm_requests_total{{tenant_id=\"{tenant_id}\"}}, workspace_id)",
                },
                {
                    "name": "agent",
                    "type": "query",
                    "query": f"label_values(llm_requests_total{{tenant_id=\"{tenant_id}\"}}, agent_id)",
                }
            ]
        },
        "panels": [
            {
                "title": "Request Rate",
                "type": "timeseries",
                "targets": [{
                    "expr": f'rate(llm_requests_total{{tenant_id="{tenant_id}"}}[5m])',
                }]
            },
            {
                "title": "Cost (USD)",
                "type": "stat",
                "targets": [{
                    "expr": f'sum(llm_cost_usd{{tenant_id="{tenant_id}"}})',
                }]
            },
            {
                "title": "P95 Latency",
                "type": "timeseries",
                "targets": [{
                    "expr": f'histogram_quantile(0.95, rate(llm_latency_bucket{{tenant_id="{tenant_id}"}}[5m]))',
                }]
            },
            {
                "title": "Error Rate",
                "type": "timeseries",
                "targets": [{
                    "expr": f'rate(llm_errors_total{{tenant_id="{tenant_id}"}}[5m]) / rate(llm_requests_total{{tenant_id="{tenant_id}"}}[5m])',
                }]
            },
            {
                "title": "Token Usage by Model",
                "type": "piechart",
                "targets": [{
                    "expr": f'sum by (model) (llm_tokens_total{{tenant_id="{tenant_id}"}})',
                }]
            },
        ]
    }
```

### Cross-Tenant Aggregation for Platform Ops

```python
# Platform-wide metrics queries
PLATFORM_OPS_QUERIES = {
    "total_requests_by_tenant": """
        sum by (tenant_id) (
            rate(llm_requests_total[5m])
        )
    """,

    "total_cost_by_tenant_daily": """
        sum by (tenant_id) (
            increase(llm_cost_usd[24h])
        )
    """,

    "error_rate_by_tenant": """
        sum by (tenant_id) (rate(llm_errors_total[5m]))
        /
        sum by (tenant_id) (rate(llm_requests_total[5m]))
    """,

    "top_cost_tenants": """
        topk(10,
            sum by (tenant_id) (
                increase(llm_cost_usd[24h])
            )
        )
    """,

    "latency_p99_by_tenant": """
        histogram_quantile(0.99,
            sum by (tenant_id, le) (
                rate(llm_latency_bucket[5m])
            )
        )
    """,
}
```

### Data Retention per Tenant

```python
from dataclasses import dataclass
from enum import Enum

class TenantTier(Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

@dataclass
class RetentionPolicy:
    traces_days: int
    logs_days: int
    metrics_days: int
    raw_events_days: int
    cost_data_days: int

RETENTION_BY_TIER = {
    TenantTier.FREE: RetentionPolicy(
        traces_days=7,
        logs_days=3,
        metrics_days=30,
        raw_events_days=1,
        cost_data_days=90,
    ),
    TenantTier.STARTER: RetentionPolicy(
        traces_days=14,
        logs_days=7,
        metrics_days=90,
        raw_events_days=7,
        cost_data_days=365,
    ),
    TenantTier.PROFESSIONAL: RetentionPolicy(
        traces_days=30,
        logs_days=30,
        metrics_days=180,
        raw_events_days=30,
        cost_data_days=730,
    ),
    TenantTier.ENTERPRISE: RetentionPolicy(
        traces_days=90,
        logs_days=90,
        metrics_days=365,
        raw_events_days=90,
        cost_data_days=2555,  # 7 years for compliance
    ),
}

class RetentionManager:
    """Manage data retention per tenant."""

    async def cleanup_tenant_data(self, tenant_id: str, tier: TenantTier):
        policy = RETENTION_BY_TIER[tier]

        # Cleanup traces
        await self.delete_old_traces(tenant_id, policy.traces_days)

        # Cleanup logs
        await self.delete_old_logs(tenant_id, policy.logs_days)

        # Downsample old metrics
        await self.downsample_metrics(tenant_id, policy.metrics_days)

        # Archive raw events
        await self.archive_events(tenant_id, policy.raw_events_days)
```

---

## 10. Architecture Recommendations

### Recommended Stack for Hyyve Platform

```
                                    +------------------+
                                    |   User Request   |
                                    +--------+---------+
                                             |
                                             v
+------------------+              +----------+----------+
|  Helicone Proxy  |<----------->|    API Gateway      |
|  (Cost Tracking) |              |  (Auth, Rate Limit) |
+------------------+              +----------+----------+
                                             |
                                             v
                                  +----------+----------+
                                  |   Agent Runtime     |
                                  |   (LangGraph)       |
                                  +----------+----------+
                                             |
              +------------------------------+------------------------------+
              |                              |                              |
              v                              v                              v
    +---------+--------+          +----------+----------+         +---------+---------+
    | OpenTelemetry    |          |    LLM Provider     |         |   Vector DB       |
    | Collector        |          |    (OpenAI, etc.)   |         |   (Retrieval)     |
    +---------+--------+          +---------------------+         +-------------------+
              |
    +---------+---------+
    |                   |
    v                   v
+---+----+       +------+------+
|Langfuse|       | Prometheus  |
|(Traces)|       | (Metrics)   |
+---+----+       +------+------+
    |                   |
    v                   v
+---+----+       +------+------+
|ClickHse|       |  Grafana    |
|(OLAP)  |       | (Dashboards)|
+--------+       +-------------+
```

### Component Selection Matrix

| Component | Recommended | Alternative | Rationale |
|-----------|-------------|-------------|-----------|
| **Sampling** | **Tail Sampling** | Head Sampling | Capture 100% of errors (via OTel Collector `tailsamplingprocessor`) while sampling 10% of successes to save storage. |
| **Trace Store** | **Langfuse (ClickHouse)** | Jaeger (Cassandra) | Optimized for high-cardinality analysis and cost/token aggregation queries. |
| **Proxy** | **Helicone V2** | LiteLLM Proxy | Best-in-class cost tracking and zero-latency async logging options. |
| **Metrics** | **Prometheus** | Datadog | Standard for operational metrics (latency, error rate) with alerting. |
| **Tracing** | Langfuse | LangSmith | Self-hosted, MIT license, ClickHouse-backed |
| **Cost Tracking** | Helicone | Custom | Minimal latency, 300+ models, caching |
| **Metrics** | Prometheus | Datadog | Open-source, industry standard |
| **Visualization** | Grafana | Datadog | Flexible, multi-tenant support |
| **Log Aggregation** | Loki | Elasticsearch | Cost-effective, Grafana integration |
| **Alerting** | Grafana Alerting | PagerDuty | Unified with dashboards |
| **Embedding Analysis** | Arize Phoenix | Custom | Drift detection, UMAP visualization |

### Implementation Phases

**Phase 1: Foundation (Week 1-2)**
- Deploy Langfuse (self-hosted)
- Configure OpenTelemetry SDK
- Implement basic tracing decorators
- Set up Prometheus + Grafana

**Phase 2: Cost Management (Week 3-4)**
- Integrate Helicone proxy
- Implement cost attribution schema
- Create budget management service
- Build cost dashboards

**Phase 3: Multi-Tenancy (Week 5-6)**
- Implement tenant isolation in traces
- Generate per-tenant dashboards
- Configure retention policies
- Set up RBAC for observability data

**Phase 4: Advanced Features (Week 7-8)**
- Implement replay/debugging capabilities
- Configure alerting rules
- Add drift detection (Phoenix)
- Build evaluation pipelines

---

## 11. Implementation Examples

### Complete Agent Instrumentation Example

```python
"""
Complete example of an instrumented RAG agent with full observability.
"""

import os
from typing import Optional
from datetime import datetime
from uuid import uuid4

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from langfuse import Langfuse
from langfuse.decorators import observe, langfuse_context
import structlog

# Configuration
LANGFUSE_PUBLIC_KEY = os.environ["LANGFUSE_PUBLIC_KEY"]
LANGFUSE_SECRET_KEY = os.environ["LANGFUSE_SECRET_KEY"]
LANGFUSE_HOST = os.environ.get("LANGFUSE_HOST", "https://cloud.langfuse.com")
HELICONE_API_KEY = os.environ["HELICONE_API_KEY"]

# Initialize OpenTelemetry
provider = TracerProvider()
exporter = OTLPSpanExporter(
    endpoint=f"{LANGFUSE_HOST}/api/public/otel/v1/traces",
    headers={"Authorization": f"Basic {LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}"}
)
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("rag-agent")

# Initialize Langfuse
langfuse = Langfuse(
    public_key=LANGFUSE_PUBLIC_KEY,
    secret_key=LANGFUSE_SECRET_KEY,
    host=LANGFUSE_HOST,
)

# Initialize structured logging
logger = structlog.get_logger()

# Initialize OpenAI with Helicone proxy
from openai import OpenAI

openai_client = OpenAI(
    base_url="https://oai.helicone.ai/v1",
    default_headers={
        "Helicone-Auth": f"Bearer {HELICONE_API_KEY}",
    }
)


class InstrumentedRAGAgent:
    """RAG Agent with comprehensive observability."""

    def __init__(
        self,
        tenant_id: str,
        workspace_id: str,
        agent_id: str = None,
        model: str = "gpt-4o",
    ):
        self.tenant_id = tenant_id
        self.workspace_id = workspace_id
        self.agent_id = agent_id or str(uuid4())
        self.model = model
        self.logger = logger.bind(
            tenant_id=tenant_id,
            workspace_id=workspace_id,
            agent_id=self.agent_id,
        )

    @observe(name="rag_agent_execute")
    async def execute(
        self,
        query: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> dict:
        """Execute the RAG pipeline with full tracing."""
        trace_id = str(uuid4())

        # Update Langfuse context
        langfuse_context.update_current_trace(
            user_id=user_id,
            session_id=session_id,
            tags=[self.tenant_id, self.workspace_id],
            metadata={
                "tenant_id": self.tenant_id,
                "workspace_id": self.workspace_id,
                "agent_id": self.agent_id,
            }
        )

        self.logger.info(
            "agent_execution_started",
            trace_id=trace_id,
            query_length=len(query),
            user_id=user_id,
        )

        start_time = datetime.utcnow()

        try:
            # Step 1: Retrieve relevant documents
            documents = await self._retrieve_documents(query, trace_id)

            # Step 2: Generate response
            response = await self._generate_response(query, documents, trace_id)

            # Calculate metrics
            duration_ms = (datetime.utcnow() - start_time).total_seconds() * 1000

            self.logger.info(
                "agent_execution_completed",
                trace_id=trace_id,
                duration_ms=duration_ms,
                doc_count=len(documents),
                response_length=len(response["content"]),
            )

            return {
                "trace_id": trace_id,
                "response": response["content"],
                "sources": [d["source"] for d in documents],
                "metrics": {
                    "duration_ms": duration_ms,
                    "input_tokens": response["input_tokens"],
                    "output_tokens": response["output_tokens"],
                    "cost_usd": response["cost_usd"],
                }
            }

        except Exception as e:
            self.logger.error(
                "agent_execution_failed",
                trace_id=trace_id,
                error=str(e),
                error_type=type(e).__name__,
            )
            raise

    @observe(name="retrieve_documents", as_type="span")
    async def _retrieve_documents(
        self,
        query: str,
        trace_id: str,
    ) -> list[dict]:
        """Retrieve relevant documents with tracing."""
        with tracer.start_as_current_span(
            "vector_search",
            attributes={
                "gen_ai.operation.name": "execute_tool",
                "gen_ai.tool.name": "vector_search",
                "tenant.id": self.tenant_id,
            }
        ) as span:
            # Simulate retrieval (replace with actual vector DB call)
            documents = [
                {"content": "Document 1 content...", "source": "doc1.pdf", "score": 0.95},
                {"content": "Document 2 content...", "source": "doc2.pdf", "score": 0.87},
            ]

            span.set_attribute("retrieval.doc_count", len(documents))
            span.set_attribute("retrieval.top_score", documents[0]["score"] if documents else 0)

            langfuse_context.update_current_observation(
                metadata={"doc_count": len(documents), "scores": [d["score"] for d in documents]}
            )

            return documents

    @observe(name="generate_response", as_type="generation")
    async def _generate_response(
        self,
        query: str,
        documents: list[dict],
        trace_id: str,
    ) -> dict:
        """Generate response with LLM, fully instrumented."""
        # Prepare context
        context = "\n\n".join([d["content"] for d in documents])

        messages = [
            {"role": "system", "content": f"Answer based on the following context:\n\n{context}"},
            {"role": "user", "content": query}
        ]

        # Add Helicone headers for cost attribution
        extra_headers = {
            "Helicone-Property-TenantId": self.tenant_id,
            "Helicone-Property-WorkspaceId": self.workspace_id,
            "Helicone-Property-AgentId": self.agent_id,
            "Helicone-Property-TraceId": trace_id,
        }

        with tracer.start_as_current_span(
            f"chat {self.model}",
            attributes={
                "gen_ai.operation.name": "chat",
                "gen_ai.provider.name": "openai",
                "gen_ai.request.model": self.model,
                "tenant.id": self.tenant_id,
            }
        ) as span:
            response = openai_client.chat.completions.create(
                model=self.model,
                messages=messages,
                extra_headers=extra_headers,
            )

            # Extract metrics
            input_tokens = response.usage.prompt_tokens
            output_tokens = response.usage.completion_tokens

            # Calculate cost (simplified)
            cost_usd = self._calculate_cost(input_tokens, output_tokens)

            # Set span attributes
            span.set_attribute("gen_ai.usage.input_tokens", input_tokens)
            span.set_attribute("gen_ai.usage.output_tokens", output_tokens)
            span.set_attribute("gen_ai.response.model", response.model)
            span.set_attribute("llm.cost_usd", cost_usd)

            # Update Langfuse
            langfuse_context.update_current_observation(
                model=response.model,
                usage={
                    "input": input_tokens,
                    "output": output_tokens,
                    "total": input_tokens + output_tokens,
                },
                metadata={"cost_usd": cost_usd}
            )

            return {
                "content": response.choices[0].message.content,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "cost_usd": cost_usd,
            }

    def _calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """Calculate cost based on model pricing."""
        pricing = {
            "gpt-4o": {"input": 2.50, "output": 10.00},
            "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        }

        model_pricing = pricing.get(self.model, {"input": 0, "output": 0})
        return (
            input_tokens * model_pricing["input"] / 1_000_000 +
            output_tokens * model_pricing["output"] / 1_000_000
        )


# Usage example
async def main():
    agent = InstrumentedRAGAgent(
        tenant_id="tenant_123",
        workspace_id="workspace_456",
        model="gpt-4o",
    )

    result = await agent.execute(
        query="What are the key features of our product?",
        user_id="user_789",
        session_id="session_abc",
    )

    print(f"Response: {result['response']}")
    print(f"Trace ID: {result['trace_id']}")
    print(f"Cost: ${result['metrics']['cost_usd']:.4f}")

    # Flush traces
    langfuse.flush()


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

---

## References and Sources

### Official Documentation
- [LangSmith Documentation](https://docs.langchain.com/langsmith)
- [LangSmith Pricing](https://www.langchain.com/pricing)
- [Helicone Documentation](https://docs.helicone.ai/)
- [Langfuse Documentation](https://langfuse.com/docs)
- [Langfuse Self-Hosting Guide](https://langfuse.com/self-hosting)
- [Arize Phoenix Documentation](https://phoenix.arize.com/)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OpenTelemetry Agent Spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/)
- [Claude Token Counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)
- [Anthropic API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

### Industry Resources
- [AI Agent Observability - OpenTelemetry Blog](https://opentelemetry.io/blog/2025/ai-agent-observability/)
- [LLM Observability Tools Comparison 2026](https://lakefs.io/blog/llm-observability-tools/)
- [Top AI Agent Observability Platforms 2026](https://o-mega.ai/articles/top-5-ai-agent-observability-platforms-the-ultimate-2026-guide)
- [Multi-Tenant AI SaaS Architecture 2025](https://digitaloneagency.com.au/multi%E2%80%91tenant-ai-saas-architecture-in-2025-isolation-residency-billing-guardrails-the-complete-guide/)
- [TokenCost Library](https://github.com/AgentOps-AI/tokencost)
- [LLM Pricing Calculator](https://pricepertoken.com/)

---

*Document generated: January 20, 2026*
*Last updated: January 20, 2026*
