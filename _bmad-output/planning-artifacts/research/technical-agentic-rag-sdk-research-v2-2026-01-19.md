# Technical Research: Hyyve SDK Stack (V2 - Enhanced)
**Date:** 2026-01-19
**Status:** Verified
**Project:** Hyyve
**Research Type:** Technical SDK Deep Dive (Enhanced Edition)
**Version:** 2.1 - Comprehensive Feature Analysis (Validated)

---

## Executive Summary

This enhanced research document provides a **complete and comprehensive** analysis of the technology stack for building an Hyyve system. This V2 edition expands significantly on the original research with:

- **Deep feature coverage** for all components
- **Detailed code examples** for every feature
- **Missing features** identified through DeepWiki and Context7 research
- **Advanced patterns** not commonly documented

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Agent Framework** | Agno | Orchestration, teams, tools, memory, AgentOS |
| **Web Ingestion** | Crawl4ai | URLs, JS rendering, adaptive crawling |
| **Document Ingestion** | Docling | PDFs, DOCX, images, audio (ASR), VLM |
| **Vector Storage** | PostgreSQL + pgvector | Embeddings, HNSW, hybrid search |
| **Graph Storage** | Neo4j + Graphiti | Entities, relationships, temporal memory |
| **Video Ingestion** | youtube-transcript-api | Transcripts extraction |

---

# Validation Update (V2.1 - Current Docs and Versions)

This section incorporates validated corrections and latest version pins based on Context7 and DeepWiki references. It supersedes conflicting examples below.

## Version Pins (Most Recent at Validation Time)

Use these exact versions when implementing. Re-run the version check before shipping.

| Component | Latest Version |
|-----------|----------------|
| Agno (PyPI) | 2.4.0 |
| Crawl4ai (PyPI) | 0.8.0 |
| Docling (PyPI) | 2.68.0 |
| Graphiti (PyPI) | 0.1.13 |
| pgvector (Python client, PyPI) | 0.4.2 |
| youtube-transcript-api (PyPI) | 1.2.3 |
| Neo4j Server | 2025.08.0 (from Neo4j repo) |
| pgvector extension | >= 0.7.0 required for halfvec/sparsevec/bit types |

Version check script (re-run to stay current):
```python
import json
import urllib.request

packages = [
    "agno",
    "crawl4ai",
    "docling",
    "graphiti",
    "pgvector",
    "youtube-transcript-api",
]
for pkg in packages:
    url = f"https://pypi.org/pypi/{pkg}/json"
    with urllib.request.urlopen(url, timeout=20) as resp:
        data = json.load(resp)
    print(f"{pkg}: {data.get('info', {}).get('version')}")
```

## Verified Corrections (Implementation-Blocking)

### Agno (Agent Framework)

Verified in docs:
- `add_history_to_context` and `num_history_runs` are valid.
- `add_memories_to_context`, `add_session_state_to_context`, `add_session_summary_to_context` are valid.
- `PostgresDb` import is `from agno.db.postgres import PostgresDb`.
- `output_schema` is documented for structured outputs.

Verified in code (DeepWiki; still validate against current Agno docs):
- `GithubTools` and `CodeChunker` exist.
- Structured output flags: `parse_response`, `structured_outputs`, `use_json_mode`, `parser_model`, `output_model`.

Unverified (do not use until confirmed):
- `add_history_to_messages`, `num_history_messages`, `num_history_responses`
- `input_schema`
- `enable_agentic_state`, `enable_agentic_memory`, `enable_agentic_culture`

Corrected context/history example:
```python
from agno.agent import Agent
from agno.db.postgres import PostgresDb
from agno.models.openai import OpenAIChat

db = PostgresDb(db_url="postgresql+psycopg://ai:ai@localhost:5532/ai")

agent = Agent(
    model=OpenAIChat(id="gpt-5-mini"),
    db=db,
    add_history_to_context=True,
    num_history_runs=5,
    add_session_state_to_context=True,
    add_memories_to_context=True,
    add_session_summary_to_context=True,
)
```

### Crawl4ai (Web Ingestion)

Verified: `CrawlerRunConfig` parameters in section 2A.3 match current docs.

Verified in docs/code:
- `AdaptiveCrawler`, `AdaptiveConfig`
- `VirtualScrollConfig`
- `LinkPreviewConfig`
- `AsyncUrlSeeder`, `SeedingConfig`
- Deep crawl strategies: `BFSDeepCrawlStrategy`, `DFSDeepCrawlStrategy`, `BestFirstCrawlingStrategy`
- `FilterChain` and filters/scorers in `crawl4ai.deep_crawling`

Not found in current code/docs:
- `DeepCrawlRule` (use concrete strategy classes instead)

### Docling (Document Ingestion)

Verified: `DocumentConverter`, `PdfPipelineOptions`, `EasyOcrOptions`, `TableFormerMode`, `AcceleratorOptions`,
`AsrPipelineOptions`, `AudioFormatOption`, `asr_model_specs`, `HybridChunker` (via docling_core),
and `vlm_model_specs` constants.

Verified: PII obfuscation is demonstrated via external NER (HF/GLiNER) and post-processing, not pipeline flags.

Corrected VLM example (current docs use a dict-based config):
```python
from docling.datamodel.pipeline_options import VlmPipelineOptions

vlm_options = VlmPipelineOptions(
    enable_remote_services=True,
    vlm_options={
        "url": "http://localhost:8000/v1/chat/completions",
        "params": {"model": "ibm-granite/granite-docling-258M", "max_tokens": 4096},
        "concurrency": 64,
        "prompt": "Convert this page to docling.",
        "timeout": 90,
    },
)
```

### Graphiti (Graph Storage)

Verified `add_episode` signature (required parameters):
```python
await graphiti.add_episode(
    name="doc_1",
    episode_body="content",
    source_description="source description",
    reference_time=datetime.now(timezone.utc),
    source=EpisodeType.text,
    group_id="tenant_acme_123",
)
```

Verified search API:
- `search()` uses default combined hybrid config.
- `search_()` accepts a `SearchConfig` object with method/reranker settings.
- `group_ids` filter is supported for search and retrieval.

Verified in code (DeepWiki) exports from `graphiti_core.search.search_config_recipes`:
- `COMBINED_HYBRID_SEARCH_RRF`, `COMBINED_HYBRID_SEARCH_MMR`, `COMBINED_HYBRID_SEARCH_CROSS_ENCODER`
- `EDGE_HYBRID_SEARCH_RRF`, `EDGE_HYBRID_SEARCH_MMR`, `EDGE_HYBRID_SEARCH_NODE_DISTANCE`,
  `EDGE_HYBRID_SEARCH_EPISODE_MENTIONS`, `EDGE_HYBRID_SEARCH_CROSS_ENCODER`
- `NODE_HYBRID_SEARCH_RRF`, `NODE_HYBRID_SEARCH_MMR`, `NODE_HYBRID_SEARCH_NODE_DISTANCE`,
  `NODE_HYBRID_SEARCH_EPISODE_MENTIONS`, `NODE_HYBRID_SEARCH_CROSS_ENCODER`
- `COMMUNITY_HYBRID_SEARCH_RRF`, `COMMUNITY_HYBRID_SEARCH_MMR`, `COMMUNITY_HYBRID_SEARCH_CROSS_ENCODER`

### pgvector (Vector Storage)

Verified:
- Vector types: `vector`, `halfvec`, `bit`, `sparsevec` (>= 0.7.0).
- Distance operators: `<->`, `<=>`, `<#>`, `<+>`, `<~>`, `<%>`.
- HNSW/IVFFlat operator classes per type.
- `sparsevec` does not support IVFFlat indexes.

Corrections:
- `sparsevec(30000)` is not validated; use a validated dimension and consult pgvector docs for limits.
- Do not state "2000 dims max for indexing"; current docs allow up to 16k for `vector`.

### Neo4j (Graph DB)

Correct vector index syntax:
```cypher
CREATE VECTOR INDEX entity_embeddings IF NOT EXISTS
FOR (n:Entity) ON (n.embedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1536,
    `vector.similarity_function`: 'COSINE'
  }
}
```

### youtube-transcript-api (Video)

Current API in docs uses `list()` and `fetch()`:
```python
from youtube_transcript_api import YouTubeTranscriptApi

transcripts = YouTubeTranscriptApi.list(video_id)
transcript = transcripts.find_transcript(["en"])
segments = transcript.fetch()
```

Thread safety:
- Not thread-safe. Use a new instance per thread.

Additional errors to handle:
- `IpBlocked`, `RequestBlocked`, `AgeRestricted` (in addition to TranscriptsDisabled, NoTranscriptFound, VideoUnavailable, etc.).

## Integration Corrections (Pipeline and Retrieval)

These are implementation blockers in section 6:
- `psycopg2` is sync; do not `await` it. If async, use `asyncpg`.
- `Graphiti.add_episode` requires `source_description` and `reference_time`.
- `EpisodeType` is missing import in the pipeline.
- `HybridRetriever` filters by `metadata->>'group_id'`, but ingestion never sets it. Add group_id to metadata.
- `documents_hybrid` table is referenced but never defined.
- Sparse vector string formatting contains a `}}` typo.

Minimal metadata fix:
```python
metadata = metadata or {}
metadata["group_id"] = group_id
```

## Implementation-Ready Baseline (Validated)

This baseline uses only APIs confirmed in current docs.

### Agno Agent (History + Memory Context)
```python
from agno.agent import Agent
from agno.db.postgres import PostgresDb
from agno.models.openai import OpenAIChat

db = PostgresDb(db_url="postgresql+psycopg://ai:ai@localhost:5532/ai")

agent = Agent(
    model=OpenAIChat(id="gpt-5-mini"),
    db=db,
    add_history_to_context=True,
    num_history_runs=3,
    add_memories_to_context=True,
    add_session_state_to_context=True,
    add_session_summary_to_context=True,
)
```

### Crawl4ai (Verified CrawlerRunConfig)
```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from crawl4ai.content_filter_strategy import PruningContentFilter

browser_config = BrowserConfig(browser_type="chromium", headless=True)

run_config = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,
    word_count_threshold=50,
    excluded_tags=["nav", "footer", "script", "style"],
    exclude_external_links=True,
    markdown_generator=DefaultMarkdownGenerator(
        content_filter=PruningContentFilter(threshold=0.6),
        options={"citations": True, "ignore_links": False},
    ),
    wait_until="networkidle",
    scan_full_page=True,
)

async def crawl(url: str):
    async with AsyncWebCrawler(config=browser_config) as crawler:
        return await crawler.arun(url=url, config=run_config)
```

### Docling (PDF Pipeline)
```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, EasyOcrOptions, TableFormerMode
from docling.datamodel.accelerator_options import AcceleratorDevice, AcceleratorOptions

pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True
pipeline_options.ocr_options = EasyOcrOptions(lang=["en"], confidence_threshold=0.5)
pipeline_options.do_table_structure = True
pipeline_options.table_structure_options.mode = TableFormerMode.ACCURATE
pipeline_options.table_structure_options.do_cell_matching = True
pipeline_options.accelerator_options = AcceleratorOptions(
    num_threads=4,
    device=AcceleratorDevice.AUTO,
)

converter = DocumentConverter(
    format_options={InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)}
)
```

### Graphiti (Episode Ingestion)
```python
from datetime import datetime, timezone
from graphiti_core import Graphiti
from graphiti_core.types import EpisodeType

graphiti = Graphiti(uri="bolt://localhost:7687", user="neo4j", password="password")

await graphiti.add_episode(
    name="doc_1",
    episode_body="content",
    source_description="doc ingest",
    reference_time=datetime.now(timezone.utc),
    source=EpisodeType.text,
    group_id="tenant_acme_123",
)
```

### pgvector (Schema + HNSW Index)
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_chunks (
    id SERIAL PRIMARY KEY,
    doc_id VARCHAR(255) NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(doc_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
```

### Neo4j Vector Index (Correct Syntax)
```cypher
CREATE VECTOR INDEX entity_embeddings IF NOT EXISTS
FOR (n:Entity) ON (n.embedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1536,
    `vector.similarity_function`: 'COSINE'
  }
}
```

### youtube-transcript-api (Current API)
```python
from youtube_transcript_api import YouTubeTranscriptApi

transcripts = YouTubeTranscriptApi.list("dQw4w9WgXcQ")
transcript = transcripts.find_transcript(["en"])
segments = transcript.fetch()
```

---

## CRITICAL FINDING: GitHub Integration Solved

NOTE: GithubTools and CodeChunker are confirmed in the Agno codebase (DeepWiki). Verify usage details against Agno 2.4.0 docs before implementation.

**Agno has native GitHub integration** via `GithubTools` class, eliminating the need for Crawl4ai to handle GitHub repos.

### GitHub Capabilities in Agno
- `search_repositories` - Search repos by criteria
- `list_repositories` - List accessible repos
- `get_repository` - Get repo details
- `get_file_content` - **Read specific file content**
- `get_directory_content` - List directory contents
- `search_code` - Search code snippets across repos

### Code-Specific Features
- **CodeChunker** - AST-based chunking for code files
- Parses code structure (functions, classes, blocks)
- Creates semantically meaningful code chunks

---

## RAG Pipeline Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HYYVE PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────────────────────────────────────────┐│
│  │   AGENT     │    │              INGESTION LAYER                    ││
│  │  FRAMEWORK  │    │  ┌─────────────┐    ┌─────────────────────────┐ ││
│  │             │    │  │  Crawl4ai   │    │        Docling          │ ││
│  │   Agno      │    │  │ - URLs      │    │ - PDFs, DOCX, PPTX     │ ││
│  │             │    │  │ - Web pages │    │ - Images, Audio        │ ││
│  │ - Agents    │    │  │ - Dynamic   │    │ - Tables, Formulas     │ ││
│  │ - Teams     │    │  │   content   │    │ - OCR, VLM             │ ││
│  │ - Tools     │    │  └─────────────┘    └─────────────────────────┘ ││
│  │ - Memory    │    └─────────────────────────────────────────────────┘│
│  │ - Knowledge │                           │                           │
│  └──────┬──────┘                           ▼                           │
│         │           ┌─────────────────────────────────────────────────┐│
│         │           │              STORAGE LAYER                      ││
│         │           │  ┌─────────────────┐  ┌───────────────────────┐ ││
│         │           │  │    pgvector     │  │   Neo4j + Graphiti    │ ││
│         │           │  │                 │  │                       │ ││
│         │           │  │ - Embeddings    │  │ - Entity Nodes        │ ││
│         │           │  │ - HNSW Index    │  │ - Relationship Edges  │ ││
│         │           │  │ - Hybrid Search │  │ - Temporal Tracking   │ ││
│         │           │  │ - Filtering     │  │ - Episode Memory      │ ││
│         │           │  └─────────────────┘  └───────────────────────┘ ││
│         │           └─────────────────────────────────────────────────┘│
│         │                                  │                           │
│         ▼                                  ▼                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                      RETRIEVAL LAYER                             │  │
│  │  - Vector similarity search (pgvector)                           │  │
│  │  - Graph traversal + BFS/DFS (Graphiti)                          │  │
│  │  - Hybrid search (BM25 + semantic)                               │  │
│  │  - Reranking (MMR, Cross-Encoder)                                │  │
│  │  - Hyyve (agent-driven retrieval decisions)                │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# PHASE 1: AGENT FRAMEWORK - AGNO (COMPREHENSIVE)

**Source:** [Agno Documentation](https://docs.agno.com/)

## 1.1 Core Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Agents** | Intelligent reasoning entities | Streaming, debugging, memory, tool usage |
| **Teams** | Multi-agent coordination | Delegation, collaboration, parallel execution |
| **Workflows** | Orchestration patterns | Sequential, parallel, conditional, iterative |
| **Tools** | Function execution | Python functions, MCP servers, toolkits |

## 1.2 Model Support

| Category | Providers |
|----------|-----------|
| **Native Providers** | Anthropic Claude, OpenAI GPT, Google Gemini, Meta Llama, Mistral, Cohere, DeepSeek, xAI |
| **Reasoning Models** | o1, o3, DeepSeek-R1 with configurable reasoning effort |
| **Multimodal** | Vision, audio, video processing and generation |

### Provider Switching Example
```python
# OpenAI
from agno.models.openai import OpenAIChat
agent = Agent(model=OpenAIChat(id="gpt-4o-mini"))

# Anthropic
from agno.models.anthropic import Claude
agent = Agent(model=Claude(id="claude-sonnet-4-5-20250929"))

# Google Gemini
from agno.models.google import Gemini
agent = Agent(model=Gemini(id="gemini-2.0-flash-001"))

# Ollama (local)
from agno.models.ollama.chat import Ollama
agent = Agent(model=Ollama(id="llama3.2:latest"))

# OpenRouter with fallback
from agno.models.openrouter import OpenRouter
agent = Agent(
    model=OpenRouter(
        id="anthropic/claude-3.5-sonnet",
        fallback_models=["openai/gpt-4o", "google/gemini-pro"]
    )
)
```

---

## 1.3 Context Management System (NEW - CRITICAL)

Context management controls what information is included in the agent's prompt during execution. This is **essential for RAG applications**.

### Complete Context Parameters

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.knowledge import Knowledge
from agno.vectordb.pgvector import PgVector

# Initialize knowledge base
knowledge = Knowledge(
    vector_db=PgVector(
        table_name="documents",
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai"
    )
)

agent = Agent(
    name="RAG Agent with Full Context Control",
    model=OpenAIChat(id="gpt-4o"),
    knowledge=knowledge,

    # ═══════════════════════════════════════════════════════════════
    # HISTORY CONTEXT - Control conversation history in prompts
    # ═══════════════════════════════════════════════════════════════
    add_history_to_context=True,      # Include chat history in messages
    num_history_runs=5,               # Number of past runs to include
    num_history_messages=20,          # Number of past messages to include
    # Note: num_history_runs takes precedence if both are set

    # ═══════════════════════════════════════════════════════════════
    # SESSION STATE - Structured data persisted across runs
    # ═══════════════════════════════════════════════════════════════
    session_state={"cart": [], "preferences": {}},  # Initial state
    add_session_state_to_context=True,              # Add state to prompts
    enable_agentic_state=True,        # Agent can dynamically update state
    # When enabled, agent gets `update_session_state` tool automatically

    # ═══════════════════════════════════════════════════════════════
    # KNOWLEDGE/RAG CONTEXT - Enable retrieval augmentation
    # ═══════════════════════════════════════════════════════════════
    add_knowledge_to_context=True,    # Add retrieved docs to user prompt
    search_knowledge=True,            # Enable automatic knowledge search

    # ═══════════════════════════════════════════════════════════════
    # DEPENDENCIES - External data available to tools and prompts
    # ═══════════════════════════════════════════════════════════════
    dependencies={"project_settings": {"max_budget": 1000}},
    add_dependencies_to_context=True, # Add dependencies to user prompt

    # ═══════════════════════════════════════════════════════════════
    # USER MEMORIES - Persistent user preferences/facts
    # ═══════════════════════════════════════════════════════════════
    add_memories_to_context=True,     # Add user memories to context
    enable_agentic_memory=True,       # Agent can create/update memories

    # ═══════════════════════════════════════════════════════════════
    # CULTURAL KNOWLEDGE - Shared knowledge across agents
    # ═══════════════════════════════════════════════════════════════
    add_culture_to_context=True,      # Add cultural knowledge to prompts
    enable_agentic_culture=True,      # Agent can update culture
)
```

### Agentic State Management Example

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat

# Shopping cart agent with dynamic state management
shopping_agent = Agent(
    name="Shopping Assistant",
    model=OpenAIChat(id="gpt-4o"),
    instructions=[
        "You are a shopping assistant that manages a cart.",
        "Use update_session_state to add/remove items from the cart.",
        "Always confirm changes with the user."
    ],
    session_state={
        "cart": [],
        "total": 0.0,
        "user_preferences": {"currency": "USD"}
    },
    add_session_state_to_context=True,
    enable_agentic_state=True,  # Gives agent `update_session_state` tool
)

# Agent can now dynamically modify its state
response = shopping_agent.run("Add 2 apples at $1.50 each to my cart")
# Agent uses update_session_state tool internally:
# {"cart": [{"item": "apple", "qty": 2, "price": 1.50}], "total": 3.00}

print(shopping_agent.session_state)
# {'cart': [{'item': 'apple', 'qty': 2, 'price': 1.5}], 'total': 3.0, ...}
```

### History Context Control Example

```python
from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.storage.postgres import PostgresDb

# Agent with controlled history for long conversations
conversational_agent = Agent(
    name="Long Conversation Agent",
    model=Claude(id="claude-sonnet-4-5-20250929"),

    # Database for persistent history
    db=PostgresDb(
        table_name="agent_sessions",
        db_url="postgresql://user:pass@localhost/db"
    ),

    # History control - crucial for token management
    add_history_to_context=True,
    num_history_runs=3,        # Only last 3 conversation turns
    num_history_messages=15,   # Or last 15 messages (runs takes precedence)

    # Enable session summaries for longer context
    create_session_summary=True,  # Create summaries of past sessions
    add_session_summary_to_context=True,  # Add summary to new sessions
)

# First conversation
response1 = conversational_agent.run(
    "My name is Alice and I work at TechCorp",
    session_id="session_123"
)

# Later conversation - history is automatically included
response2 = conversational_agent.run(
    "What's my name and where do I work?",
    session_id="session_123"
)
# Agent has access to previous messages based on num_history_runs
```

---

## 1.4 Structured I/O System (NEW - CRITICAL)

Agno provides **type-safe input and output** using Pydantic models. This is essential for reliable data extraction and API responses.

Validation note: `output_schema`, `parse_response`, `structured_outputs`, `use_json_mode`, `parser_model`, and `output_model` are confirmed in code. `input_schema` is not confirmed in current docs and should be validated before use.

### Complete Structured I/O Example

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

# ═══════════════════════════════════════════════════════════════════════
# DEFINE INPUT AND OUTPUT SCHEMAS
# ═══════════════════════════════════════════════════════════════════════

class ResearchTopic(BaseModel):
    """Input schema for research requests."""
    topic: str = Field(description="The main topic to research")
    depth: str = Field(default="medium", description="Research depth: shallow, medium, deep")
    sources_required: int = Field(default=3, description="Minimum sources to cite")

class SourceType(str, Enum):
    ACADEMIC = "academic"
    NEWS = "news"
    BLOG = "blog"
    DOCUMENTATION = "documentation"

class Source(BaseModel):
    """A research source."""
    title: str
    url: str
    source_type: SourceType
    relevance_score: float = Field(ge=0.0, le=1.0)

class ResearchFindings(BaseModel):
    """Output schema for research results."""
    summary: str = Field(description="Executive summary of findings")
    key_points: List[str] = Field(description="Main takeaways")
    sources: List[Source] = Field(description="Sources used")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Confidence in findings")
    limitations: Optional[str] = Field(default=None, description="Any limitations or caveats")

# ═══════════════════════════════════════════════════════════════════════
# CREATE AGENT WITH STRUCTURED I/O
# ═══════════════════════════════════════════════════════════════════════

research_agent = Agent(
    name="Research Agent",
    model=OpenAIChat(id="gpt-4o"),
    instructions=[
        "You are a research assistant that provides structured findings.",
        "Always cite your sources and provide confidence scores.",
        "Be thorough but concise in your summaries."
    ],

    # Input validation with Pydantic
    input_schema=ResearchTopic,

    # Output structure with Pydantic
    output_schema=ResearchFindings,

    # Parse response into Pydantic model
    parse_response=True,

    # Use model-enforced structured outputs (if supported)
    structured_outputs=True,

    # Alternative: Use JSON mode for models without native structured outputs
    # use_json_mode=True,  # Adds JSON schema to system message
)

# ═══════════════════════════════════════════════════════════════════════
# USE THE AGENT
# ═══════════════════════════════════════════════════════════════════════

# Input is validated against ResearchTopic schema
result = research_agent.run(
    ResearchTopic(
        topic="Hyyve systems",
        depth="deep",
        sources_required=5
    )
)

# Output is a validated ResearchFindings object
findings: ResearchFindings = result.parsed
print(f"Summary: {findings.summary}")
print(f"Confidence: {findings.confidence_score}")
for source in findings.sources:
    print(f"  - {source.title} ({source.source_type.value})")
```

### Parser Model and Output Model (Cost Optimization)

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.anthropic import Claude

# Use different models for different stages
optimized_agent = Agent(
    name="Cost-Optimized Agent",

    # Main model for reasoning
    model=Claude(id="claude-sonnet-4-5-20250929"),

    # Cheap model for parsing responses into structured format
    parser_model=OpenAIChat(id="gpt-4o-mini"),
    parser_model_prompt="Parse the following response into the required JSON schema. Be precise.",

    # Quality model for generating final user-facing response
    output_model=Claude(id="claude-sonnet-4-5-20250929"),
    output_model_prompt="Generate a polished, user-friendly response based on the analysis.",

    output_schema=ResearchFindings,
    parse_response=True,
)

# Flow:
# 1. Main model (Claude) does the reasoning
# 2. Parser model (GPT-4o-mini) extracts structured data (cheap)
# 3. Output model (Claude) generates final response (quality)
```

### JSON Mode for Non-Native Models

```python
from agno.agent import Agent
from agno.models.ollama import Ollama

# For models without native structured outputs
local_agent = Agent(
    name="Local Structured Agent",
    model=Ollama(id="llama3.2:latest"),

    output_schema=ResearchFindings,

    # Use JSON mode - adds schema to system message
    use_json_mode=True,

    # Still parse response
    parse_response=True,
)

# The schema is included in the system prompt:
# "Please respond with a JSON object matching this schema: {...}"
```

---

## 1.5 Execution Control (NEW - ENHANCED)

### Complete Execution Control Parameters

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat

agent = Agent(
    name="Robust Agent",
    model=OpenAIChat(id="gpt-4o"),

    # ═══════════════════════════════════════════════════════════════
    # STREAMING CONTROL
    # ═══════════════════════════════════════════════════════════════
    stream=True,           # Enable streaming responses

    # ═══════════════════════════════════════════════════════════════
    # DEBUGGING
    # ═══════════════════════════════════════════════════════════════
    debug_mode=True,       # Enable debug output
    debug_level=2,         # Verbosity: 1=basic, 2=detailed, 3=verbose

    # ═══════════════════════════════════════════════════════════════
    # RETRY CONFIGURATION
    # ═══════════════════════════════════════════════════════════════
    retries=3,                    # Number of retry attempts
    delay_between_retries=1.0,    # Seconds between retries
    exponential_backoff=True,     # Exponential backoff on retries
)

# ═══════════════════════════════════════════════════════════════════════
# STREAMING WITH INTERMEDIATE EVENTS
# ═══════════════════════════════════════════════════════════════════════

# Stream including tool calls, reasoning steps, etc.
for event in agent.run("Analyze this data", stream=True, stream_events=True):
    if event.event_type == "content":
        print(event.content, end="", flush=True)
    elif event.event_type == "tool_call":
        print(f"\n[Tool: {event.tool_name}]")
    elif event.event_type == "reasoning":
        print(f"\n[Thinking: {event.reasoning}]")
```

### Async Execution

```python
import asyncio
from agno.agent import Agent
from agno.models.openai import OpenAIChat

agent = Agent(
    name="Async Agent",
    model=OpenAIChat(id="gpt-4o"),
)

async def main():
    # Async run
    response = await agent.arun("What is the capital of France?")
    print(response.content)

    # Async streaming
    async for chunk in agent.arun("Tell me a story", stream=True):
        print(chunk.content, end="", flush=True)

asyncio.run(main())
```

---

## 1.6 Culture - Shared Memory Across Agents (NEW)

Culture provides **collective knowledge** shared across agents and teams, enabling consistent behavior and shared learning.

### Complete Culture Example

```python
from agno.agent import Agent
from agno.culture import CultureManager
from agno.models.openai import OpenAIChat
from agno.storage.postgres import PostgresDb

# ═══════════════════════════════════════════════════════════════════════
# INITIALIZE CULTURE MANAGER
# ═══════════════════════════════════════════════════════════════════════

culture_manager = CultureManager(
    db=PostgresDb(
        table_name="agent_culture",
        db_url="postgresql://user:pass@localhost/db"
    )
)

# ═══════════════════════════════════════════════════════════════════════
# CREATE AGENTS THAT SHARE CULTURE
# ═══════════════════════════════════════════════════════════════════════

support_agent = Agent(
    name="Customer Support",
    model=OpenAIChat(id="gpt-4o"),
    culture_manager=culture_manager,

    # Add cultural knowledge to prompts
    add_culture_to_context=True,

    # Agent can autonomously update culture
    enable_agentic_culture=True,
    # This gives agent the `create_or_update_cultural_knowledge` tool
)

sales_agent = Agent(
    name="Sales Assistant",
    model=OpenAIChat(id="gpt-4o"),
    culture_manager=culture_manager,  # Same culture manager
    add_culture_to_context=True,
    enable_agentic_culture=True,
)

# ═══════════════════════════════════════════════════════════════════════
# MANUALLY ADD CULTURAL KNOWLEDGE
# ═══════════════════════════════════════════════════════════════════════

# Add company policies that all agents should follow
culture_manager.add_knowledge(
    topic="refund_policy",
    content="Our refund policy allows returns within 30 days with receipt. "
            "For items over $100, manager approval is required.",
    category="policies"
)

culture_manager.add_knowledge(
    topic="brand_voice",
    content="Always be friendly, professional, and empathetic. "
            "Use the customer's name. Avoid jargon.",
    category="communication"
)

# ═══════════════════════════════════════════════════════════════════════
# AGENTS LEARN AND SHARE
# ═══════════════════════════════════════════════════════════════════════

# Support agent handles a case and learns something new
support_response = support_agent.run(
    "Customer wants to return a laptop bought 45 days ago. They're upset."
)
# If enable_agentic_culture=True, agent might add:
# "For loyal customers, exceptions to the 30-day policy can be considered
#  with manager approval."

# Sales agent automatically has access to this new knowledge
sales_response = sales_agent.run(
    "Customer is asking about our return policy flexibility."
)
# Sales agent's response is informed by the cultural knowledge,
# including what support learned
```

---

## 1.7 Plan and Learn (PaL) Agent Pattern (NEW)

PaL is a **disciplined execution agent** that plans, executes, adapts, and learns from successful executions.

### Complete PaL Example

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools import tool
from agno.knowledge import Knowledge
from agno.vectordb.pgvector import PgVector

# ═══════════════════════════════════════════════════════════════════════
# PAL AGENT TOOLS
# ═══════════════════════════════════════════════════════════════════════

@tool
def create_plan(goal: str, steps: list[str], success_criteria: list[str]) -> str:
    """Create a structured plan with steps and success criteria."""
    plan = {
        "goal": goal,
        "steps": [{"id": i, "description": s, "status": "pending"}
                  for i, s in enumerate(steps)],
        "success_criteria": success_criteria
    }
    return f"Plan created: {plan}"

@tool
def execute_step(step_id: int, action: str) -> str:
    """Execute a specific step in the plan."""
    # Actual implementation would do the work
    return f"Step {step_id} executed: {action}"

@tool
def verify_step(step_id: int, result: str) -> str:
    """Verify if a step was completed successfully."""
    # Check against success criteria
    return f"Step {step_id} verification: {result}"

@tool
def adapt_plan(reason: str, new_steps: list[str]) -> str:
    """Adapt the plan mid-flight when requirements change."""
    return f"Plan adapted due to: {reason}. New steps: {new_steps}"

# Learning knowledge base
learning_kb = Knowledge(
    vector_db=PgVector(
        table_name="pal_learnings",
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai"
    )
)

@tool
def save_learning(pattern: str, context: str, outcome: str) -> str:
    """Save a reusable pattern from successful execution."""
    learning_kb.add_content(
        content=f"Pattern: {pattern}\nContext: {context}\nOutcome: {outcome}",
        metadata={"type": "learning", "pattern": pattern}
    )
    return f"Learning saved: {pattern}"

@tool
def recall_learnings(task_description: str) -> str:
    """Recall relevant learnings for a similar task."""
    results = learning_kb.search(task_description, limit=3)
    return "\n".join([r.content for r in results])

# ═══════════════════════════════════════════════════════════════════════
# CREATE PAL AGENT
# ═══════════════════════════════════════════════════════════════════════

pal_agent = Agent(
    name="Plan and Learn Agent",
    model=OpenAIChat(id="gpt-4o"),
    instructions=[
        "You are a disciplined execution agent that follows the PaL pattern.",
        "",
        "PLANNING PHASE:",
        "1. Break down goals into clear steps with success criteria",
        "2. Check for relevant learnings from past executions",
        "3. Create a structured plan using create_plan()",
        "",
        "EXECUTION PHASE:",
        "4. Execute each step sequentially using execute_step()",
        "5. Verify completion using verify_step()",
        "6. If a step fails, adapt the plan using adapt_plan()",
        "",
        "LEARNING PHASE:",
        "7. After successful completion, save reusable patterns using save_learning()",
        "8. Document what worked well for future reference",
    ],
    tools=[
        create_plan,
        execute_step,
        verify_step,
        adapt_plan,
        save_learning,
        recall_learnings,
    ],

    # Track progress in session state
    session_state={
        "current_plan": None,
        "current_step": 0,
        "completed_steps": [],
        "learnings_applied": []
    },
    add_session_state_to_context=True,
    enable_agentic_state=True,
)

# ═══════════════════════════════════════════════════════════════════════
# USE PAL AGENT
# ═══════════════════════════════════════════════════════════════════════

response = pal_agent.run(
    "Set up a new Python project with FastAPI, PostgreSQL, and Docker"
)

# Agent will:
# 1. Recall learnings from similar past tasks
# 2. Create a plan with steps like:
#    - Initialize project structure
#    - Create FastAPI app
#    - Set up PostgreSQL connection
#    - Create Dockerfile and docker-compose
#    - Test the setup
# 3. Execute each step, verifying completion
# 4. If something fails, adapt the plan
# 5. Save learnings about what worked
```

---

## 1.8 Workflows 2.0 - Advanced Patterns (NEW)

Agno Workflows 2.0 provides **declarative orchestration** with advanced patterns beyond basic sequential/parallel execution.

### Complete Advanced Workflow Example

```python
from agno.workflow import Workflow, Step, Condition, Loop, Parallel, Router
from agno.workflow.output import StepOutput
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools

# ═══════════════════════════════════════════════════════════════════════
# DEFINE SPECIALIZED AGENTS
# ═══════════════════════════════════════════════════════════════════════

tech_researcher = Agent(
    name="Tech Researcher",
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools()],
    instructions=["Research technology topics thoroughly."]
)

market_researcher = Agent(
    name="Market Researcher",
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools()],
    instructions=["Research market trends and business impact."]
)

content_writer = Agent(
    name="Content Writer",
    model=OpenAIChat(id="gpt-4o"),
    instructions=["Write engaging blog posts from research findings."]
)

social_media_writer = Agent(
    name="Social Media Writer",
    model=OpenAIChat(id="gpt-4o"),
    instructions=["Create concise social media posts from research."]
)

report_writer = Agent(
    name="Report Writer",
    model=OpenAIChat(id="gpt-4o"),
    instructions=["Create formal reports from research findings."]
)

reviewer = Agent(
    name="Content Reviewer",
    model=OpenAIChat(id="gpt-4o"),
    instructions=["Review and improve content quality."]
)

# ═══════════════════════════════════════════════════════════════════════
# DEFINE EVALUATORS AND SELECTORS
# ═══════════════════════════════════════════════════════════════════════

def is_tech_topic(step_input) -> bool:
    """Check if the topic is technology-related."""
    tech_keywords = ["technology", "ai", "software", "tech", "digital", "code"]
    content = str(step_input.previous_step_content or step_input.user_input).lower()
    return any(keyword in content for keyword in tech_keywords)

def is_business_topic(step_input) -> bool:
    """Check if the topic is business-related."""
    biz_keywords = ["market", "business", "revenue", "strategy", "enterprise"]
    content = str(step_input.previous_step_content or step_input.user_input).lower()
    return any(keyword in content for keyword in biz_keywords)

def research_quality_check(step_input, loop_iteration: int) -> bool:
    """Check if research quality is sufficient to exit loop."""
    content = str(step_input.previous_step_content or "")
    word_count = len(content.split())
    # Exit loop if we have enough content or max iterations reached
    return word_count > 500 or loop_iteration >= 3

def content_type_selector(step_input) -> str:
    """Select content type based on user preference in input."""
    user_input = str(step_input.user_input).lower()
    if "blog" in user_input:
        return "blog"
    elif "social" in user_input or "twitter" in user_input:
        return "social"
    else:
        return "report"

# ═══════════════════════════════════════════════════════════════════════
# DEFINE POST-PROCESSOR
# ═══════════════════════════════════════════════════════════════════════

def research_post_processor(step_input) -> StepOutput:
    """Post-process and consolidate research data."""
    research_data = step_input.previous_step_content or ""

    try:
        word_count = len(research_data.split())
        has_tech = any(kw in research_data.lower()
                      for kw in ["technology", "ai", "software"])
        has_business = any(kw in research_data.lower()
                          for kw in ["market", "business", "revenue"])

        enhanced_summary = f"""
## Research Analysis Report

**Data Quality:** {"High-quality" if word_count > 200 else "Limited data"}
**Word Count:** {word_count}

**Content Coverage:**
- Technical Analysis: {"Completed" if has_tech else "Not available"}
- Business Analysis: {"Completed" if has_business else "Not available"}

**Research Findings:**
{research_data}
        """.strip()

        return StepOutput(content=enhanced_summary, success=True)
    except Exception as e:
        return StepOutput(content=f"Post-processing failed: {e}", success=False, error=str(e))

# ═══════════════════════════════════════════════════════════════════════
# BUILD ADVANCED WORKFLOW
# ═══════════════════════════════════════════════════════════════════════

advanced_workflow = Workflow(
    name="Advanced Multi-Pattern Content Workflow",
    steps=[
        # ═══════════════════════════════════════════════════════════
        # PARALLEL CONDITIONAL RESEARCH
        # ═══════════════════════════════════════════════════════════
        Parallel(
            # Tech research branch (conditional)
            Condition(
                name="Tech Research Branch",
                evaluator=is_tech_topic,
                steps=[
                    Step(name="Tech Research", agent=tech_researcher)
                ]
            ),
            # Business research branch with iterative deepening
            Condition(
                name="Business Research Branch",
                evaluator=is_business_topic,
                steps=[
                    Loop(
                        name="Deep Business Research",
                        steps=[
                            Step(name="Market Research", agent=market_researcher)
                        ],
                        end_condition=research_quality_check,
                        max_iterations=3
                    )
                ]
            ),
            name="Conditional Research Phase"
        ),

        # ═══════════════════════════════════════════════════════════
        # POST-PROCESSING STEP (Custom Function)
        # ═══════════════════════════════════════════════════════════
        Step(
            name="Research Post-Processing",
            executor=research_post_processor,
            description="Consolidate and analyze research findings"
        ),

        # ═══════════════════════════════════════════════════════════
        # DYNAMIC ROUTING
        # ═══════════════════════════════════════════════════════════
        Router(
            name="Content Type Router",
            selector=content_type_selector,
            choices={
                "blog": Step(name="Blog Post", agent=content_writer),
                "social": Step(name="Social Media", agent=social_media_writer),
                "report": Step(name="Formal Report", agent=report_writer),
            }
        ),

        # ═══════════════════════════════════════════════════════════
        # FINAL REVIEW
        # ═══════════════════════════════════════════════════════════
        Step(name="Final Review", agent=reviewer),
    ]
)

# ═══════════════════════════════════════════════════════════════════════
# EXECUTE WORKFLOW
# ═══════════════════════════════════════════════════════════════════════

result = advanced_workflow.run(
    "Create a blog post about AI technology trends and their business impact for 2026"
)

print(result.content)
```

### Workflow with Session State

```python
from agno.workflow import Workflow, Step
from agno.agent import Agent

# Workflow with shared state across steps
stateful_workflow = Workflow(
    name="Stateful Customer Service Workflow",
    session_state={
        "customer_id": None,
        "issue_category": None,
        "resolution_attempts": 0,
        "escalated": False,
    },
    steps=[
        Step(name="Identify Customer", agent=identification_agent),
        Step(name="Categorize Issue", agent=categorization_agent),
        Step(name="Resolve Issue", agent=resolution_agent),
        Step(name="Follow Up", agent=followup_agent),
    ]
)

# State is shared and updated across all steps
```

---

## 1.9 Reasoning Tools (NEW)

ReasoningTools provide **explicit thinking capabilities** for complex problem-solving.

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.reasoning import ReasoningTools
from agno.tools.duckduckgo import DuckDuckGoTools

reasoning_agent = Agent(
    name="Reasoning Agent",
    model=OpenAIChat(id="gpt-4o"),
    tools=[
        DuckDuckGoTools(),
        ReasoningTools(
            think=True,           # Enable explicit thinking
            analyze=True,         # Enable analysis capability
            add_instructions=True, # Add reasoning instructions to prompts
            add_few_shot=True,    # Include few-shot examples
        ),
    ],
    instructions=[
        "Use tables where possible.",
        "Think about the problem step by step.",
        "Show your reasoning process."
    ],
    markdown=True,
)

# Agent will use explicit reasoning tools
response = reasoning_agent.print_response(
    "Compare the pros and cons of PostgreSQL vs MongoDB for a RAG system.",
    stream=True,
    show_full_reasoning=True,  # Show thinking process
)
```

---

## 1.10 WorkflowTools and KnowledgeTools (NEW)

### WorkflowTools - Tool-based Workflow Orchestration

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.workflow import WorkflowTools
from agno.workflow import Workflow, Step

# Define a workflow
research_workflow = Workflow(
    name="research-workflow",
    steps=[
        Step(name="search", agent=search_agent),
        Step(name="summarize", agent=summary_agent),
        Step(name="fact-check", agent=fact_check_agent),
    ],
)

# Orchestrator agent that controls the workflow via tools
orchestrator = Agent(
    name="Orchestrator",
    model=OpenAIChat(id="gpt-4o"),
    tools=[
        WorkflowTools(
            workflow=research_workflow,
            add_instructions=True,  # Add workflow usage instructions
        )
    ],
    instructions=[
        "You orchestrate research workflows.",
        "Use the workflow tools to manage multi-step research tasks.",
    ]
)

response = orchestrator.run("Research the impact of AI on healthcare")
```

### KnowledgeTools - Tool-based RAG

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.knowledge import KnowledgeTools
from agno.knowledge import Knowledge
from agno.vectordb.pgvector import PgVector

# Initialize knowledge base
knowledge = Knowledge(
    vector_db=PgVector(
        table_name="documents",
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai"
    )
)

# Load documents
knowledge.load_documents("./docs/")

# Agent with explicit knowledge tools (alternative to built-in search)
knowledge_agent = Agent(
    name="Knowledge Agent",
    model=OpenAIChat(id="gpt-4o"),
    tools=[
        KnowledgeTools(
            knowledge=knowledge,
            search=True,      # Enable search tool
            add=True,         # Enable add content tool
            update=True,      # Enable update tool
        )
    ],
    instructions=[
        "You are a knowledge assistant.",
        "Use the knowledge tools to search, add, and update information.",
        "Always cite your sources."
    ]
)

response = knowledge_agent.run("What are the best practices for API design?")
```

---

## 1.11 AgentOS - Full Production Platform (NEW - CRITICAL)

AgentOS transforms agents, teams, and workflows into a **production-ready service** with REST/WebSocket APIs, authentication, monitoring, and observability.

Validation notes:
- Auth uses Bearer JWT headers on protected endpoints.
- When auth is enabled, the gateway requires these endpoints to remain unprotected: `/config`, `/agents`, `/agents/{agent_id}`, `/teams`, `/teams/{team_id}`, `/workflows`, `/workflows/{workflow_id}`.

### Complete AgentOS Example

```python
from agno.os import AgentOS
from agno.agent import Agent
from agno.teams import Team
from agno.workflow import Workflow
from agno.models.openai import OpenAIChat
from agno.storage.postgres import PostgresDb

# ═══════════════════════════════════════════════════════════════════════
# DEFINE AGENTS, TEAMS, WORKFLOWS
# ═══════════════════════════════════════════════════════════════════════

support_agent = Agent(
    name="Support Agent",
    agent_id="support-v1",
    model=OpenAIChat(id="gpt-4o"),
    instructions=["You handle customer support queries."],
    db=PostgresDb(table_name="support_sessions", db_url=DB_URL),
)

sales_agent = Agent(
    name="Sales Agent",
    agent_id="sales-v1",
    model=OpenAIChat(id="gpt-4o"),
    instructions=["You handle sales inquiries."],
)

customer_team = Team(
    name="Customer Service Team",
    team_id="customer-service-v1",
    members=[support_agent, sales_agent],
    mode="route",  # Route to appropriate agent
)

# ═══════════════════════════════════════════════════════════════════════
# CREATE AGENTOS INSTANCE
# ═══════════════════════════════════════════════════════════════════════

agent_os = AgentOS(
    name="My Production Agent System",

    # Register agents, teams, workflows
    agents=[support_agent, sales_agent],
    teams=[customer_team],
    workflows=[],

    # ═══════════════════════════════════════════════════════════════
    # AUTHENTICATION & AUTHORIZATION
    # ═══════════════════════════════════════════════════════════════
    authorization=True,  # Enable JWT/JWKS authentication
    # Supports:
    # - Bearer token validation
    # - RBAC (Role-Based Access Control)
    # - Scope validation per resource
    # - HS256 (symmetric) and RS256 (asymmetric) JWT signing

    # ═══════════════════════════════════════════════════════════════
    # AGENT-TO-AGENT PROTOCOL
    # ═══════════════════════════════════════════════════════════════
    a2a_interface=True,  # Enable A2A protocol for agent communication

    # ═══════════════════════════════════════════════════════════════
    # OBSERVABILITY
    # ═══════════════════════════════════════════════════════════════
    tracing=True,  # Enable OpenTelemetry tracing
    # Integrations: Langfuse, Opik, Arize Phoenix, LangSmith, AgentOps, Weave
)

# ═══════════════════════════════════════════════════════════════════════
# SERVE THE API
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    agent_os.serve(
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
    )
```

### Auto-Generated API Endpoints (Validated Subset)

```
Validated endpoints in current docs:

CORE:
  GET  /config                    - Get AgentOS config

AGENTS:
  GET  /agents                    - List agents
  GET  /agents/{agent_id}         - Get agent details
  POST /runs/agents/{agent_id}    - Run an agent

TEAMS:
  GET  /teams                     - List teams
  GET  /teams/{team_id}           - Get team details

WORKFLOWS:
  GET  /workflows                 - List workflows
  GET  /workflows/{workflow_id}   - Get workflow details
```

Validated A2A endpoints (when A2A interface is enabled):
```
GET  /a2a/agents/{id}/.well-known/agent-card.json
POST /a2a/agents/{id}/v1/message:stream
POST /a2a/agents/{id}/v1/message:send

GET  /a2a/teams/{id}/.well-known/agent-card.json
POST /a2a/teams/{id}/v1/message:stream
POST /a2a/teams/{id}/v1/message:send

GET  /a2a/workflows/{id}/.well-known/agent-card.json
POST /a2a/workflows/{id}/v1/message:stream
POST /a2a/workflows/{id}/v1/message:send
```

Unverified in docs (present in code; confirm for Agno 2.4.0):
- `/agents/{id}/runs`, `/sessions`, `/memories`, `/health`, `/metrics`, `/knowledge`

### Using the API

```python
import requests

# Create an agent run
response = requests.post(
    "http://localhost:8000/runs/agents/support-v1",
    headers={"Authorization": "Bearer <jwt_token>"},
    json={
        "message": "I need help with my order",
        "session_id": "user_123_session",
        "stream": False
    }
)

result = response.json()
print(result["content"])

# Streaming response
import httpx

async with httpx.AsyncClient() as client:
    async with client.stream(
        "POST",
        "http://localhost:8000/runs/agents/support-v1",
        headers={"Authorization": "Bearer <jwt_token>"},
        json={"message": "Tell me about your products", "stream": True}
    ) as response:
        async for chunk in response.aiter_text():
            print(chunk, end="", flush=True)
```

### Control Plane UI

```
Access the AgentOS control plane at: https://os.agno.com

Features:
- Chat with your agents directly in the browser
- Explore sessions and conversation history
- Monitor traces and execution flow
- Manage knowledge bases and memories
- View metrics and performance data

The UI connects directly to YOUR running AgentOS instance.
No data, API keys, or runtime state touches external servers.
```

### Remote Agents, Teams, Workflows

```python
from agno.os import AgentOS
from agno.os.remote import RemoteAgent, RemoteTeam, RemoteWorkflow

# Connect to agents running on other AgentOS instances
remote_specialist = RemoteAgent(
    name="Remote Specialist",
    agent_id="specialist-v1",
    base_url="https://specialist-service.example.com",
    api_key="remote_api_key"
)

# Include remote agents in your AgentOS
agent_os = AgentOS(
    agents=[local_agent, remote_specialist],
    a2a_interface=True,  # Enables communication between local and remote
)
```

---

## 1.12 Multi-Agent Teams (ENHANCED)

### Complete Team Configuration

```python
from agno.agent import Agent
from agno.teams import Team
from agno.models.openai import OpenAIChat
from agno.models.anthropic import Claude
from agno.knowledge import Knowledge
from agno.vectordb.pgvector import PgVector
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.github import GithubTools

# ═══════════════════════════════════════════════════════════════════════
# SHARED KNOWLEDGE BASE
# ═══════════════════════════════════════════════════════════════════════

shared_knowledge = Knowledge(
    vector_db=PgVector(
        table_name="team_knowledge",
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai",
        search_type="hybrid"  # Vector + BM25
    )
)

# ═══════════════════════════════════════════════════════════════════════
# SPECIALIZED AGENTS
# ═══════════════════════════════════════════════════════════════════════

retriever = Agent(
    name="Retriever",
    role="Find relevant information from knowledge bases",
    model=OpenAIChat(id="gpt-4o-mini"),  # Fast, cheap for retrieval
    instructions=[
        "Search the knowledge base for relevant information.",
        "Return comprehensive results with source citations.",
        "Prioritize recent and authoritative sources."
    ],
)

analyzer = Agent(
    name="Analyzer",
    role="Analyze and synthesize retrieved information",
    model=Claude(id="claude-sonnet-4-5-20250929"),  # Strong reasoning
    tools=[DuckDuckGoTools()],
    instructions=[
        "Analyze the retrieved information for patterns and insights.",
        "Cross-reference with web search when needed.",
        "Identify relationships and contradictions."
    ],
)

code_expert = Agent(
    name="Code Expert",
    role="Answer code-related questions",
    model=OpenAIChat(id="gpt-4o"),
    tools=[GithubTools()],
    instructions=[
        "Search codebases for relevant implementations.",
        "Explain code patterns and best practices.",
        "Provide working code examples."
    ],
)

# ═══════════════════════════════════════════════════════════════════════
# TEAM CONFIGURATIONS
# ═══════════════════════════════════════════════════════════════════════

# ROUTE MODE - Direct to appropriate agent
route_team = Team(
    name="Router Team",
    members=[retriever, analyzer, code_expert],
    mode="route",
    instructions="Route to the most appropriate agent based on the query type.",
)

# COLLABORATE MODE - Agents work together
collab_team = Team(
    name="Collaborative RAG Team",
    members=[retriever, analyzer, code_expert],
    knowledge=shared_knowledge,  # Shared across all members
    search_knowledge=True,
    mode="collaborate",
    instructions="""
    Work together to answer complex questions:
    1. Retriever: Find relevant documents and context
    2. Analyzer: Identify relationships and synthesize findings
    3. Code Expert: Provide implementation details when needed

    Each agent contributes their expertise to form a complete answer.
    """,
)

# COORDINATE MODE - Managed workflow
coord_team = Team(
    name="Coordinated Research Team",
    members=[retriever, analyzer, code_expert],
    knowledge=shared_knowledge,
    mode="coordinate",
    instructions="""
    Execute a coordinated research workflow:
    1. First, Retriever gathers all relevant information
    2. Then, Analyzer processes and synthesizes findings
    3. Finally, Code Expert adds implementation context if needed

    The coordinator manages handoffs between agents.
    """,
)

# ═══════════════════════════════════════════════════════════════════════
# USE TEAMS
# ═══════════════════════════════════════════════════════════════════════

response = collab_team.run(
    "How does Agno implement vector search with pgvector? "
    "I need both the conceptual explanation and code examples."
)

print(response.content)
```

---

## 1.13 Memory Systems (ENHANCED)

### Complete Memory Configuration

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.memory import MemoryManager
from agno.storage.postgres import PostgresDb

# ═══════════════════════════════════════════════════════════════════════
# MEMORY MANAGER CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

memory_manager = MemoryManager(
    db=PostgresDb(
        table_name="agent_memories",
        db_url="postgresql://user:pass@localhost/db"
    ),

    # Memory optimization settings
    enable_deduplication=True,    # Remove duplicate memories
    enable_consolidation=True,    # Merge related memories
    max_memories_per_user=1000,   # Limit per user
)

# ═══════════════════════════════════════════════════════════════════════
# AGENT WITH FULL MEMORY CAPABILITIES
# ═══════════════════════════════════════════════════════════════════════

memory_agent = Agent(
    name="Memory-Enabled Agent",
    model=OpenAIChat(id="gpt-4o"),

    memory_manager=memory_manager,

    # User memories - persistent facts about users
    enable_user_memories=True,    # Auto-create memories from conversations
    add_memories_to_context=True, # Include memories in prompts

    # Agentic memory - agent can manage memories
    enable_agentic_memory=True,   # Agent gets memory management tools
    # Tools added: create_memory, update_memory, delete_memory, search_memories

    # Session storage for history
    db=PostgresDb(
        table_name="agent_sessions",
        db_url="postgresql://user:pass@localhost/db"
    ),
)

# ═══════════════════════════════════════════════════════════════════════
# MEMORY USAGE EXAMPLES
# ═══════════════════════════════════════════════════════════════════════

# First conversation - agent learns about user
response1 = memory_agent.run(
    "Hi! My name is Alice and I'm a software engineer at TechCorp. "
    "I prefer Python and work mostly on backend systems.",
    user_id="alice_123"
)
# Agent automatically creates memories:
# - User's name is Alice
# - User works at TechCorp
# - User is a software engineer
# - User prefers Python
# - User focuses on backend systems

# Later conversation - memories are used
response2 = memory_agent.run(
    "Can you recommend a database for my next project?",
    user_id="alice_123"
)
# Agent's response is personalized:
# "Based on your Python backend work at TechCorp, I'd recommend PostgreSQL..."

# Agent can explicitly manage memories
response3 = memory_agent.run(
    "Actually, I just switched to using TypeScript. Please update your notes.",
    user_id="alice_123"
)
# Agent uses update_memory tool to change the language preference
```

---

## 1.14 Knowledge/RAG Features (ENHANCED)

### Complete Knowledge Configuration

```python
from agno.knowledge import Knowledge
from agno.vectordb.pgvector import PgVector, SearchType
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.knowledge.reranker.cohere import CohereReranker
from agno.knowledge.chunking import (
    SemanticChunker,
    RecursiveChunker,
    AgenticChunker,
    MarkdownChunker,
    DocumentChunker,
)
from agno.knowledge.reader import (
    PDFReader,
    MarkdownReader,
    JSONReader,
    ArXivReader,
    WebReader,
    FirecrawlReader,
)

# ═══════════════════════════════════════════════════════════════════════
# ADVANCED KNOWLEDGE BASE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

knowledge = Knowledge(
    name="Comprehensive RAG Knowledge Base",

    # Vector database with hybrid search
    vector_db=PgVector(
        table_name="documents",
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai",

        # Search configuration
        search_type=SearchType.hybrid,  # Vector + BM25

        # Embedding configuration
        embedder=OpenAIEmbedder(
            id="text-embedding-3-small",
            dimensions=1536
        ),

        # Reranking for better results
        reranker=CohereReranker(
            model="rerank-v3.5",
            top_n=10
        ),
    ),
)

# ═══════════════════════════════════════════════════════════════════════
# LOAD DIFFERENT CONTENT TYPES
# ═══════════════════════════════════════════════════════════════════════

# PDF documents with OCR support
knowledge.load(
    path="./documents/",
    reader=PDFReader(
        chunking_strategy=DocumentChunker(
            chunk_size=1024,
            preserve_structure=True
        )
    )
)

# Markdown documentation
knowledge.load(
    path="./docs/",
    reader=MarkdownReader(
        chunking_strategy=MarkdownChunker(
            split_on_headings=2,  # Split at ## headers
            chunk_size=1024,
            preserve_code_blocks=True
        )
    )
)

# Academic papers from arXiv
knowledge.load(
    source="arxiv",
    reader=ArXivReader(
        search_query="RAG retrieval augmented generation",
        max_papers=50,
        chunking_strategy=SemanticChunker(
            max_tokens=512,
            similarity_threshold=0.8
        )
    )
)

# Web content
knowledge.load(
    urls=[
        "https://docs.agno.com/",
        "https://docs.anthropic.com/",
    ],
    reader=WebReader(
        chunking_strategy=RecursiveChunker(
            chunk_size=1024,
            chunk_overlap=100
        )
    )
)

# JSON/API data
knowledge.load(
    path="./data/api_responses.json",
    reader=JSONReader(
        jq_filter=".results[]",  # Extract specific fields
        chunking_strategy=RecursiveChunker(chunk_size=512)
    )
)

# ═══════════════════════════════════════════════════════════════════════
# AGENTIC CHUNKING (LLM-Driven)
# ═══════════════════════════════════════════════════════════════════════

knowledge.load(
    path="./complex_documents/",
    reader=PDFReader(
        chunking_strategy=AgenticChunker(
            model=OpenAIChat(id="gpt-4o-mini"),
            instructions="Chunk this document to preserve semantic meaning. "
                        "Keep related concepts together. "
                        "Ensure each chunk is self-contained."
        )
    )
)

# ═══════════════════════════════════════════════════════════════════════
# SEARCH EXAMPLES
# ═══════════════════════════════════════════════════════════════════════

# Basic search
results = knowledge.search("How does vector search work?", limit=10)

# Search with filters
results = knowledge.search(
    query="authentication best practices",
    limit=10,
    filters={"source_type": "documentation"},
    min_score=0.7
)

# Hybrid search explicitly
results = knowledge.hybrid_search(
    query="PostgreSQL performance tuning",
    vector_weight=0.7,  # 70% semantic
    keyword_weight=0.3,  # 30% BM25
    limit=10
)
```

---

## 1.15 Built-in Tools (COMPLETE LIST)

```python
# ═══════════════════════════════════════════════════════════════════════
# WEB SEARCH & CRAWLING
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.brave import BraveTools
from agno.tools.exa import ExaTools
from agno.tools.tavily import TavilyTools
from agno.tools.firecrawl import FirecrawlTools
from agno.tools.crawl4ai import Crawl4aiTools
from agno.tools.trafilatura import TrafilaturaTools
from agno.tools.newspaper import NewspaperTools

# ═══════════════════════════════════════════════════════════════════════
# CODE & GITHUB
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.github import GithubTools
from agno.tools.python import PythonTools
from agno.knowledge.chunking.code import CodeChunker

# ═══════════════════════════════════════════════════════════════════════
# FILE SYSTEM
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.file import FileTools

# ═══════════════════════════════════════════════════════════════════════
# APIS & SERVICES
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.gmail import GmailTools
from agno.tools.google_maps import GoogleMapsTools
from agno.tools.google_drive import GoogleDriveTools
from agno.tools.notion import NotionTools
from agno.tools.confluence import ConfluenceTools
from agno.tools.todoist import TodoistTools
from agno.tools.webex import WebexTools

# ═══════════════════════════════════════════════════════════════════════
# DATABASES
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.duckdb import DuckDbTools
from agno.tools.bigquery import BigQueryTools
from agno.tools.postgres import PostgresTools
from agno.tools.redshift import RedshiftTools
from agno.tools.neo4j import Neo4jTools

# ═══════════════════════════════════════════════════════════════════════
# MEDIA
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.youtube import YouTubeTools
from agno.tools.matplotlib import MatplotlibTools
from agno.tools.opencv import OpenCVTools
from agno.tools.reportlab import ReportLabTools

# ═══════════════════════════════════════════════════════════════════════
# FINANCE
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.yfinance import YFinanceTools

# ═══════════════════════════════════════════════════════════════════════
# MEMORY INTEGRATIONS
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.mem0 import Mem0Tools
from agno.tools.memori import MemoriTools
from agno.tools.zep import ZepTools

# ═══════════════════════════════════════════════════════════════════════
# AI/ML SERVICES
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.cartesia import CartesiaTools
from agno.tools.elevenlabs import ElevenlabsTools
from agno.tools.fal import FalTools

# ═══════════════════════════════════════════════════════════════════════
# REASONING & ORCHESTRATION
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.reasoning import ReasoningTools
from agno.tools.workflow import WorkflowTools
from agno.tools.knowledge import KnowledgeTools

# ═══════════════════════════════════════════════════════════════════════
# MCP (Model Context Protocol)
# ═══════════════════════════════════════════════════════════════════════
from agno.tools.mcp import MCPTools
```

---

# PHASE 2A: WEB/URL INGESTION - CRAWL4AI (COMPREHENSIVE)

**Source:** [Crawl4ai GitHub](https://github.com/unclecode/crawl4ai)

## 2A.1 Core Capabilities

| Feature | Description |
|---------|-------------|
| **Async Architecture** | Built on asyncio with `AsyncWebCrawler` |
| **URL Protocols** | http://, https://, file://, raw: |
| **Single/Batch** | `arun()` for single, `arun_many()` for concurrent |

## 2A.2 Browser Configuration

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

# ═══════════════════════════════════════════════════════════════════════
# BROWSER CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

browser_config = BrowserConfig(
    # Browser selection
    browser_type="chromium",  # chromium, firefox, webkit
    headless=True,

    # Viewport
    viewport={"width": 1920, "height": 1080},

    # Stealth mode - bypass bot detection
    stealth_mode=True,

    # User agent
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",

    # Proxy configuration
    proxy="http://user:pass@proxy.example.com:8080",

    # Browser arguments
    extra_args=["--disable-gpu", "--no-sandbox"],
)

async with AsyncWebCrawler(config=browser_config) as crawler:
    result = await crawler.arun(url="https://example.com")
```

## 2A.3 Crawler Run Configuration (COMPLETE)

```python
from crawl4ai import CrawlerRunConfig, CacheMode
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from crawl4ai.content_filter_strategy import PruningContentFilter

# ═══════════════════════════════════════════════════════════════════════
# COMPREHENSIVE CRAWLER CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

run_config = CrawlerRunConfig(
    # ═══════════════════════════════════════════════════════════════
    # CACHING
    # ═══════════════════════════════════════════════════════════════
    cache_mode=CacheMode.ENABLED,  # ENABLED, BYPASS, READ_ONLY, WRITE_ONLY

    # ═══════════════════════════════════════════════════════════════
    # CONTENT FILTERING
    # ═══════════════════════════════════════════════════════════════
    word_count_threshold=50,          # Min words per content block
    excluded_tags=["nav", "footer", "script", "style", "aside"],
    excluded_selector="#ads, .tracker, .popup",
    exclude_external_links=True,
    only_text=False,                  # Keep HTML structure
    keep_data_attributes=False,
    remove_forms=True,

    # ═══════════════════════════════════════════════════════════════
    # MARKDOWN GENERATION
    # ═══════════════════════════════════════════════════════════════
    markdown_generator=DefaultMarkdownGenerator(
        content_filter=PruningContentFilter(threshold=0.6),
        options={
            "citations": True,
            "ignore_links": False
        }
    ),

    # ═══════════════════════════════════════════════════════════════
    # CSS/ELEMENT TARGETING
    # ═══════════════════════════════════════════════════════════════
    css_selector="main.content",      # Target specific element
    target_elements=[".article", ".post"],  # Multiple targets

    # ═══════════════════════════════════════════════════════════════
    # IFRAME & OVERLAY HANDLING
    # ═══════════════════════════════════════════════════════════════
    process_iframes=True,
    remove_overlay_elements=True,

    # ═══════════════════════════════════════════════════════════════
    # JAVASCRIPT EXECUTION
    # ═══════════════════════════════════════════════════════════════
    js_code=[
        "window.scrollTo(0, document.body.scrollHeight);",
        "document.querySelector('.load-more')?.click();"
    ],

    # ═══════════════════════════════════════════════════════════════
    # WAIT CONDITIONS
    # ═══════════════════════════════════════════════════════════════
    wait_for="css:.content-loaded",   # Wait for selector
    wait_for_timeout=10000,           # Max wait in ms
    wait_until="networkidle",         # networkidle, domcontentloaded
    wait_for_images=True,
    delay_before_return_html=0.5,     # Final delay before capture

    # ═══════════════════════════════════════════════════════════════
    # PAGE INTERACTION
    # ═══════════════════════════════════════════════════════════════
    scan_full_page=True,              # Auto-scroll for lazy content
    scroll_delay=0.3,                 # Delay between scrolls
    simulate_user=True,               # Human-like behavior
    magic=True,                       # Auto-handle popups, consent dialogs

    # ═══════════════════════════════════════════════════════════════
    # MEDIA & OUTPUT
    # ═══════════════════════════════════════════════════════════════
    screenshot=True,
    pdf=True,
    capture_mhtml=True,
    image_score_threshold=5,

    # ═══════════════════════════════════════════════════════════════
    # SESSION & PERFORMANCE
    # ═══════════════════════════════════════════════════════════════
    session_id="my_persistent_session",
    page_timeout=60000,
    semaphore_count=10,               # Max concurrent operations
    override_navigator=True,          # Override browser fingerprint
)
```

## 2A.4 Adaptive Crawling (NEW - CRITICAL)

Adaptive crawling **learns and adapts** to website patterns, making intelligent decisions about which links to follow.

```python
from crawl4ai import AsyncWebCrawler, AdaptiveCrawler, AdaptiveConfig

# ═══════════════════════════════════════════════════════════════════════
# ADAPTIVE CRAWLING CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

adaptive_config = AdaptiveConfig(
    # Quality thresholds
    confidence_threshold=0.8,     # Min confidence to accept content
    min_gain_threshold=0.1,       # Min information gain to continue

    # Limits
    max_pages=50,                 # Max pages to crawl
    top_k_links=10,               # Top links to consider per page

    # Strategy
    strategy="embedding",         # "statistical" or "embedding"
    # statistical: Fast, term-based analysis
    # embedding: Uses LLM for semantic understanding
)

async def adaptive_crawl_example():
    browser_config = BrowserConfig(headless=True)

    async with AsyncWebCrawler(config=browser_config) as crawler:
        # Create adaptive crawler
        adaptive = AdaptiveCrawler(crawler)

        # Crawl with adaptive learning
        result = await adaptive.digest(
            start_url="https://docs.example.com",
            query="API documentation for authentication",
            config=adaptive_config
        )

        print(f"Pages crawled: {result.pages_crawled}")
        print(f"Information saturation: {result.saturation_score}")

        for page in result.pages:
            print(f"  - {page.url} (relevance: {page.relevance_score})")

# Adaptive crawler tracks:
# - Pattern success rates
# - Selector stability
# - Content structure variations
# - Extraction confidence scores
```

## 2A.5 Virtual Scroll Support (NEW - CRITICAL)

Handle **infinite scroll pages** where content is replaced, not just appended.

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.async_configs import VirtualScrollConfig

async def crawl_infinite_scroll():
    browser_config = BrowserConfig(headless=True)

    # ═══════════════════════════════════════════════════════════════
    # VIRTUAL SCROLL CONFIGURATION
    # ═══════════════════════════════════════════════════════════════

    virtual_scroll = VirtualScrollConfig(
        # Container to scroll within
        container_selector=".feed-container",

        # Scroll behavior
        scroll_count=10,              # Number of scroll actions
        scroll_by="container_height", # or "page_height" or pixels (e.g., 500)
        wait_after_scroll=1.0,        # Wait for content to load

        # Content capture
        capture_on_scroll=True,       # Capture content at each scroll position
    )

    run_config = CrawlerRunConfig(
        virtual_scroll_config=virtual_scroll,
        word_count_threshold=50,
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url="https://twitter.com/username",
            config=run_config
        )

        print(f"Captured {len(result.markdown)} characters")
        print(f"Scroll positions captured: {result.scroll_captures}")
```

## 2A.6 Link Preview Scoring (NEW)

**Score links** without full page loads for smart crawl prioritization.

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.async_configs import LinkPreviewConfig

async def smart_link_prioritization():
    # ═══════════════════════════════════════════════════════════════
    # LINK PREVIEW CONFIGURATION
    # ═══════════════════════════════════════════════════════════════

    link_preview = LinkPreviewConfig(
        query="RAG documentation examples",  # Contextual scoring
        score_threshold=0.5,                 # Min relevance score
        concurrent_requests=5,               # Parallel preview fetches
    )

    run_config = CrawlerRunConfig(
        link_preview_config=link_preview,
        score_links=True,  # Enable link scoring
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://docs.example.com",
            config=run_config
        )

        # Links are scored by relevance
        for link in result.scored_links:
            print(f"{link.url}: {link.score:.2f}")
```

## 2A.7 Async URL Seeder (NEW)

High-performance **URL discovery** from sitemaps and Common Crawl.

```python
from crawl4ai import AsyncUrlSeeder, SeedingConfig

async def discover_urls():
    # ═══════════════════════════════════════════════════════════════
    # URL SEEDING CONFIGURATION
    # ═══════════════════════════════════════════════════════════════

    seeding_config = SeedingConfig(
        # Discovery sources
        source="sitemap+cc",  # "sitemap", "cc" (Common Crawl), or both

        # Filtering
        query="documentation API",  # BM25 relevance scoring
        max_urls=1000,
        include_patterns=["/docs/*", "/api/*"],
        exclude_patterns=["/login", "/signup", "*.pdf"],

        # Concurrency
        concurrent_requests=20,
    )

    seeder = AsyncUrlSeeder(config=seeding_config)

    # Discover URLs
    discovered = await seeder.discover("https://docs.example.com")

    print(f"Discovered {len(discovered)} URLs")
    for url_info in discovered[:10]:
        print(f"  {url_info.url} (score: {url_info.relevance_score})")
```

## 2A.8 Deep Crawling Strategies (ENHANCED)

Use concrete strategies like `BFSDeepCrawlStrategy`, `DFSDeepCrawlStrategy`, or `BestFirstCrawlingStrategy` with `FilterChain`.

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.content_scraping_strategy import LXMLWebScrapingStrategy
from crawl4ai.deep_crawling import BestFirstCrawlingStrategy
from crawl4ai.deep_crawling.filters import (
    FilterChain,
    DomainFilter,
    URLPatternFilter,
    ContentTypeFilter,
)
from crawl4ai.deep_crawling.scorers import KeywordRelevanceScorer

async def run_advanced_crawler():
    filter_chain = FilterChain([
        DomainFilter(
            allowed_domains=["docs.example.com"],
            blocked_domains=["old.docs.example.com"],
        ),
        URLPatternFilter(patterns=["*guide*", "*tutorial*", "*blog*"]),
        ContentTypeFilter(allowed_types=["text/html"]),
    ])

    keyword_scorer = KeywordRelevanceScorer(
        keywords=["crawl", "example", "async", "configuration"],
        weight=0.7
    )

    config = CrawlerRunConfig(
        deep_crawl_strategy=BestFirstCrawlingStrategy(
            max_depth=2,
            include_external=False,
            filter_chain=filter_chain,
            url_scorer=keyword_scorer,
            max_pages=20,
        ),
        scraping_strategy=LXMLWebScrapingStrategy(),
        stream=True,
        verbose=True,
    )

    results = []
    async with AsyncWebCrawler() as crawler:
        async for result in await crawler.arun("https://docs.example.com", config=config):
            results.append(result)
            score = result.metadata.get("score", 0)
            depth = result.metadata.get("depth", 0)
            print(f"Depth: {depth} | Score: {score:.2f} | {result.url}")

    print(f"Crawled {len(results)} high-value pages")

if __name__ == "__main__":
    asyncio.run(run_advanced_crawler())
```

## 2A.9 Extraction Strategies (COMPLETE)

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.extraction_strategy import (
    NoExtractionStrategy,
    JsonCssExtractionStrategy,
    JsonXPathExtractionStrategy,
    JsonLxmlExtractionStrategy,
    RegexExtractionStrategy,
    CosineStrategy,
    LLMExtractionStrategy,
)
from crawl4ai.llm import LLMConfig

# ═══════════════════════════════════════════════════════════════════════
# CSS SELECTOR EXTRACTION
# ═══════════════════════════════════════════════════════════════════════

css_strategy = JsonCssExtractionStrategy(
    schema={
        "name": "articles",
        "baseSelector": "article.post",
        "fields": [
            {"name": "title", "selector": "h2.title", "type": "text"},
            {"name": "author", "selector": ".author-name", "type": "text"},
            {"name": "date", "selector": ".publish-date", "type": "attribute", "attribute": "datetime"},
            {"name": "content", "selector": ".content", "type": "html"},
            {"name": "url", "selector": "a.read-more", "type": "attribute", "attribute": "href"},
        ]
    }
)

# ═══════════════════════════════════════════════════════════════════════
# XPATH EXTRACTION
# ═══════════════════════════════════════════════════════════════════════

xpath_strategy = JsonXPathExtractionStrategy(
    schema={
        "name": "products",
        "baseXpath": "//div[@class='product']",
        "fields": [
            {"name": "name", "xpath": ".//h3/text()"},
            {"name": "price", "xpath": ".//span[@class='price']/text()"},
            {"name": "rating", "xpath": ".//div[@class='rating']/@data-rating"},
        ]
    }
)

# ═══════════════════════════════════════════════════════════════════════
# LLM EXTRACTION (Structured Data)
# ═══════════════════════════════════════════════════════════════════════

llm_config = LLMConfig(
    provider="openai/gpt-4o-mini",
    api_token="env:OPENAI_API_KEY"  # Read from environment
)

llm_strategy = LLMExtractionStrategy(
    llm_config=llm_config,
    schema={
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "summary": {"type": "string"},
            "key_points": {"type": "array", "items": {"type": "string"}},
            "entities": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "type": {"type": "string"}
                    }
                }
            }
        }
    },
    instruction="Extract the main content, summarize it, identify key points and named entities.",

    # Chunking for long content
    apply_chunking=True,
    chunk_token_threshold=1200,
    overlap_rate=0.1,

    # Input format
    input_format="fit_markdown",  # or "raw_html", "markdown"
)

# ═══════════════════════════════════════════════════════════════════════
# BLOCK-BASED LLM EXTRACTION
# ═══════════════════════════════════════════════════════════════════════

block_strategy = LLMExtractionStrategy(
    llm_config=llm_config,
    extraction_type="block",  # Extract content blocks
    instruction="""
    Extract meaningful content blocks from this page.
    Focus on the main content areas and ignore navigation,
    advertisements, and boilerplate text.
    """,
    apply_chunking=True,
    chunk_token_threshold=1200,
)

# ═══════════════════════════════════════════════════════════════════════
# COSINE SIMILARITY (Semantic Extraction)
# ═══════════════════════════════════════════════════════════════════════

cosine_strategy = CosineStrategy(
    query="How to implement authentication",
    similarity_threshold=0.6,
    top_k=10,
)

# ═══════════════════════════════════════════════════════════════════════
# USE EXTRACTION STRATEGY
# ═══════════════════════════════════════════════════════════════════════

async def extract_structured_data():
    run_config = CrawlerRunConfig(
        extraction_strategy=llm_strategy,
        word_count_threshold=50,
    )

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com/article",
            config=run_config
        )

        if result.success:
            extracted = json.loads(result.extracted_content)
            print(f"Title: {extracted['title']}")
            print(f"Summary: {extracted['summary']}")
            for point in extracted['key_points']:
                print(f"  - {point}")
```

## 2A.10 Content Filters (COMPLETE)

```python
from crawl4ai.content_filter_strategy import (
    PruningContentFilter,
    BM25ContentFilter,
    LLMContentFilter,
    RelevantContentFilter,
)
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

# ═══════════════════════════════════════════════════════════════════════
# PRUNING FILTER - General Purpose
# ═══════════════════════════════════════════════════════════════════════

pruning_filter = PruningContentFilter(
    threshold=0.5,
    threshold_type="fixed"  # or "dynamic"
)

# ═══════════════════════════════════════════════════════════════════════
# BM25 FILTER - Keyword-based
# ═══════════════════════════════════════════════════════════════════════

bm25_filter = BM25ContentFilter(
    query="API authentication documentation",
    threshold=0.3,
)

# ═══════════════════════════════════════════════════════════════════════
# LLM FILTER - Intelligent Content Selection
# ═══════════════════════════════════════════════════════════════════════

llm_filter = LLMContentFilter(
    llm_config=LLMConfig(provider="openai/gpt-4o-mini", api_token="env:OPENAI_API_KEY"),
    instruction="""
    Extract technical documentation content including:
    - Key concepts and explanations
    - ALL code examples with proper formatting
    - API references and parameters
    - Configuration options

    Format as clean markdown with proper code blocks and headers.
    Exclude navigation, footers, advertisements, and boilerplate.
    """
)

# ═══════════════════════════════════════════════════════════════════════
# USE WITH MARKDOWN GENERATOR
# ═══════════════════════════════════════════════════════════════════════

md_generator = DefaultMarkdownGenerator(
    content_filter=llm_filter,  # or pruning_filter, bm25_filter
    options={
        "citations": True,
        "ignore_links": False,
        "preserve_code_blocks": True,
    }
)

run_config = CrawlerRunConfig(
    markdown_generator=md_generator,
)
```

## 2A.11 Robots.txt Compliance (NEW)

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

run_config = CrawlerRunConfig(
    check_robots_txt=True,  # Respect robots.txt rules
)

# Robots.txt handling:
# - Cached in ~/.crawl4ai/robots/robots_cache.db
# - 7-day TTL by default
# - Returns 403 status for disallowed URLs
# - If robots.txt can't be fetched, crawling is still allowed

async with AsyncWebCrawler() as crawler:
    result = await crawler.arun(
        url="https://example.com/page",
        config=run_config
    )

    if not result.success and result.status_code == 403:
        print("URL disallowed by robots.txt")
```

## 2A.12 Browser Profiler (NEW)

```python
from crawl4ai import BrowserProfiler, AsyncWebCrawler

# ═══════════════════════════════════════════════════════════════════════
# CREATE PERSISTENT BROWSER PROFILE
# ═══════════════════════════════════════════════════════════════════════

profiler = BrowserProfiler()

# Create profile with saved state
profile = await profiler.create_profile(
    name="my_authenticated_profile",
    storage_state={
        "cookies": [...],
        "origins": [...]
    }
)

# Use profile for crawling
async with AsyncWebCrawler(profile=profile) as crawler:
    # Crawler has pre-authenticated state
    result = await crawler.arun(url="https://example.com/dashboard")
```

## 2A.13 Hooks System

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

async def on_page_loaded(page):
    """Called after page loads but before extraction."""
    # Handle login
    await page.fill("#username", "user@example.com")
    await page.fill("#password", "password")
    await page.click("#login-button")
    await page.wait_for_selector(".dashboard")

async def on_before_extraction(page, content):
    """Called before content extraction."""
    # Expand all collapsed sections
    await page.evaluate("""
        document.querySelectorAll('.collapsed').forEach(el => el.click());
    """)
    return content

async def on_after_extraction(result):
    """Called after extraction completes."""
    # Post-process results
    result.metadata["processed_at"] = datetime.now().isoformat()
    return result

run_config = CrawlerRunConfig(
    hooks={
        "on_page_loaded": on_page_loaded,
        "on_before_extraction": on_before_extraction,
        "on_after_extraction": on_after_extraction,
    }
)
```

## 2A.14 Session Management

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

async def multi_step_crawl():
    async with AsyncWebCrawler() as crawler:
        # Step 1: Login page
        login_config = CrawlerRunConfig(
            session_id="my_session",
            js_code=[
                "document.querySelector('#username').value = 'user';",
                "document.querySelector('#password').value = 'pass';",
                "document.querySelector('#login').click();"
            ],
            wait_for="css:.dashboard",
        )

        await crawler.arun(url="https://example.com/login", config=login_config)

        # Step 2: Access protected content (same session)
        content_config = CrawlerRunConfig(
            session_id="my_session",  # Reuse session
        )

        result = await crawler.arun(
            url="https://example.com/protected",
            config=content_config
        )

        print(result.markdown)
```

## 2A.15 Proxy Rotation

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig
from crawl4ai.async_configs import ProxyRotationStrategy, RoundRobinProxyStrategy

# ═══════════════════════════════════════════════════════════════════════
# PROXY ROTATION
# ═══════════════════════════════════════════════════════════════════════

proxies = [
    "http://proxy1.example.com:8080",
    "http://proxy2.example.com:8080",
    "http://proxy3.example.com:8080",
]

proxy_strategy = RoundRobinProxyStrategy(proxies=proxies)

browser_config = BrowserConfig(
    proxy_rotation_strategy=proxy_strategy,
)

async with AsyncWebCrawler(config=browser_config) as crawler:
    # Each request uses a different proxy in round-robin fashion
    results = await crawler.arun_many(urls=url_list)
```

---

# PHASE 2B: DOCUMENT INGESTION - DOCLING (COMPREHENSIVE)

**Source:** [Docling Documentation](https://docling-project.github.io/docling/)

## 2B.1 Supported Input Formats

| Category | Formats |
|----------|---------|
| **Documents** | PDF, DOCX, PPTX, XLSX |
| **Web/Markup** | HTML, Markdown |
| **Media** | PNG, TIFF, JPEG, images |
| **Audio** | WAV, MP3, VTT |

## 2B.2 Basic Document Conversion

```python
from docling.document_converter import DocumentConverter

# Simple conversion
converter = DocumentConverter()
result = converter.convert("document.pdf")

# Access content
doc = result.document
markdown = doc.export_to_markdown()
html = doc.export_to_html()
json_dict = doc.export_to_dict()

# Access elements
for element in doc.iterate_items():
    print(f"{element.label}: {element.text[:100]}...")
```

## 2B.3 Advanced PDF Pipeline (ENHANCED)

```python
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    EasyOcrOptions,
    RapidOcrOptions,
    TesseractOcrOptions,
    TableFormerMode,
)
from docling.datamodel.accelerator_options import AcceleratorDevice, AcceleratorOptions

# ═══════════════════════════════════════════════════════════════════════
# COMPREHENSIVE PDF PIPELINE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

pipeline_options = PdfPipelineOptions()

# ═══════════════════════════════════════════════════════════════════════
# OCR CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

pipeline_options.do_ocr = True

# Option 1: EasyOCR (multi-language)
pipeline_options.ocr_options = EasyOcrOptions(
    lang=["en", "de", "fr", "es"],
    confidence_threshold=0.5,
)

# Option 2: RapidOCR with GPU (torch backend)
pipeline_options.ocr_options = RapidOcrOptions(
    backend="torch",  # GPU support
)

# Option 3: Tesseract
pipeline_options.ocr_options = TesseractOcrOptions(
    lang="eng+deu",  # Multiple languages
)

# ═══════════════════════════════════════════════════════════════════════
# TABLE EXTRACTION
# ═══════════════════════════════════════════════════════════════════════

pipeline_options.do_table_structure = True
pipeline_options.table_structure_options.mode = TableFormerMode.ACCURATE  # or FAST
pipeline_options.table_structure_options.do_cell_matching = True

# ═══════════════════════════════════════════════════════════════════════
# CODE AND FORMULA ENRICHMENT
# ═══════════════════════════════════════════════════════════════════════

pipeline_options.do_code_enrichment = True
pipeline_options.do_formula_enrichment = True

# ═══════════════════════════════════════════════════════════════════════
# IMAGE GENERATION
# ═══════════════════════════════════════════════════════════════════════

pipeline_options.generate_page_images = True
pipeline_options.generate_picture_images = True

# ═══════════════════════════════════════════════════════════════════════
# HARDWARE ACCELERATION
# ═══════════════════════════════════════════════════════════════════════

pipeline_options.accelerator_options = AcceleratorOptions(
    num_threads=4,
    device=AcceleratorDevice.AUTO,  # AUTO, CPU, CUDA, MPS
)

# ═══════════════════════════════════════════════════════════════════════
# BATCH PROCESSING TUNING
# ═══════════════════════════════════════════════════════════════════════

pipeline_options.ocr_batch_size = 8
pipeline_options.layout_batch_size = 8
pipeline_options.table_batch_size = 4

# ═══════════════════════════════════════════════════════════════════════
# CREATE CONVERTER WITH OPTIONS
# ═══════════════════════════════════════════════════════════════════════

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

result = converter.convert("complex_document.pdf")
```

## 2B.4 VLM (Vision-Language Model) Pipeline (NEW - CRITICAL)

Docling supports **Vision-Language Models** for advanced document understanding.

Validation note: Current docs confirm `vlm_model_specs` constants and also support dict-based remote config for `VlmPipelineOptions`.

```python
from docling.document_converter import DocumentConverter
from docling.datamodel.pipeline_options import VlmPipelineOptions
from docling.datamodel import vlm_model_specs

# ═══════════════════════════════════════════════════════════════════════
# AVAILABLE VLM MODELS
# ═══════════════════════════════════════════════════════════════════════

# Local models (Transformers framework)
# - vlm_model_specs.GRANITEDOCLING_TRANSFORMERS
# - vlm_model_specs.SMOLDOCLING_TRANSFORMERS
# - vlm_model_specs.PIXTRAL_12B_TRANSFORMERS
# - vlm_model_specs.PHI4_TRANSFORMERS
# - vlm_model_specs.GOT2_TRANSFORMERS
# - vlm_model_specs.DOLPHIN_TRANSFORMERS
# - vlm_model_specs.NU_EXTRACT_2B_TRANSFORMERS
# - vlm_model_specs.GRANITE_VISION_TRANSFORMERS

# Local models (MLX framework - Apple Silicon)
# - vlm_model_specs.GRANITEDOCLING_MLX
# - vlm_model_specs.SMOLDOCLING_MLX
# - vlm_model_specs.QWEN25_VL_3B_MLX
# - vlm_model_specs.PIXTRAL_12B_MLX
# - vlm_model_specs.GEMMA3_12B_MLX
# - vlm_model_specs.GEMMA3_27B_MLX

# API-based models
# - vlm_model_specs.GRANITEDOCLING_VLLM
# - vlm_model_specs.GRANITEDOCLING_OLLAMA
# - vlm_model_specs.GRANITE_VISION_VLLM
# - vlm_model_specs.GRANITE_VISION_OLLAMA
# - vlm_model_specs.DEEPSEEKOCR_OLLAMA

# ═══════════════════════════════════════════════════════════════════════
# VLM PIPELINE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

vlm_options = VlmPipelineOptions()

# Use local GraniteDocling model
vlm_options.vlm_options = vlm_model_specs.GRANITEDOCLING_TRANSFORMERS

# Or use SmolDocling (smaller, faster)
vlm_options.vlm_options = vlm_model_specs.SMOLDOCLING_MLX  # Apple Silicon

# Or use remote service (vLLM, LM Studio, Ollama)
vlm_options.enable_remote_services = True
vlm_options.vlm_options = vlm_model_specs.GRANITEDOCLING_OLLAMA

# ═══════════════════════════════════════════════════════════════════════
# CONVERT WITH VLM
# ═══════════════════════════════════════════════════════════════════════

converter = DocumentConverter(
    pipeline="vlm",  # Use VLM pipeline
    vlm_options=vlm_options,
)

result = converter.convert("complex_document.pdf")

# CLI usage:
# docling --pipeline vlm --vlm-model granite_docling document.pdf
```

## 2B.5 ASR (Automatic Speech Recognition) Pipeline (NEW - CRITICAL)

Docling supports **audio transcription** with Whisper models.

```python
from docling.document_converter import DocumentConverter, AudioFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import AsrPipelineOptions
from docling.datamodel import asr_model_specs
from docling.pipeline.asr_pipeline import AsrPipeline

# Configure ASR pipeline with Whisper model
pipeline_options = AsrPipelineOptions(
    asr_options=asr_model_specs.WHISPER_BASE
)

converter = DocumentConverter(
    format_options={
        InputFormat.AUDIO: AudioFormatOption(
            pipeline_cls=AsrPipeline,
            pipeline_options=pipeline_options,
        )
    }
)

# Supported formats include MP3 and WAV
result = converter.convert("meeting_recording.mp3")

# Access transcript
transcript = result.document.export_to_markdown()
print(transcript)

# Access with timestamps
for segment in result.document.iterate_items():
    if hasattr(segment, 'start_time'):
        print(f"[{segment.start_time:.2f}s] {segment.text}")
```

## 2B.6 Chunking Strategies (ENHANCED)

```python
from docling.document_converter import DocumentConverter
# If using docling-core directly, import HybridChunker from
# docling_core.transforms.chunker.hybrid_chunker
from docling.chunking import HybridChunker, HierarchicalChunker
from docling.chunking.serializer import (
    ChunkingDocSerializer,
    ChunkingSerializerProvider,
)
from transformers import AutoTokenizer

# ═══════════════════════════════════════════════════════════════════════
# HYBRID CHUNKER (Recommended for RAG)
# ═══════════════════════════════════════════════════════════════════════

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

hybrid_chunker = HybridChunker(
    tokenizer=tokenizer,
    max_tokens=512,

    # Merging behavior
    merge_peers=True,  # Merge small chunks under same heading
)

# Convert and chunk
converter = DocumentConverter()
result = converter.convert("document.pdf")

chunks = list(hybrid_chunker.chunk(result.document))

for chunk in chunks:
    print(f"--- Chunk ---")
    print(f"Text: {chunk.text[:200]}...")
    print(f"Headings: {chunk.meta.headings}")
    print(f"Page: {chunk.meta.page}")
    print()

# ═══════════════════════════════════════════════════════════════════════
# CONTEXTUALIZE CHUNKS (for embedding)
# ═══════════════════════════════════════════════════════════════════════

for chunk in chunks:
    # Get metadata-enriched text for embedding
    contextualized = hybrid_chunker.contextualize(chunk)
    print(f"Contextualized: {contextualized[:300]}...")

# ═══════════════════════════════════════════════════════════════════════
# CUSTOM SERIALIZER (e.g., for images)
# ═══════════════════════════════════════════════════════════════════════

class CustomPictureSerializer:
    def serialize(self, picture_item, doc):
        # Custom image handling
        return f"[Image: {picture_item.caption or 'No caption'}]"

class CustomSerializerProvider(ChunkingSerializerProvider):
    def get_serializer(self, doc):
        return ChunkingDocSerializer(
            doc=doc,
            picture_serializer=CustomPictureSerializer(),
        )

custom_chunker = HybridChunker(
    tokenizer=tokenizer,
    serializer_provider=CustomSerializerProvider(),
)

# ═══════════════════════════════════════════════════════════════════════
# HIERARCHICAL CHUNKER (One chunk per element)
# ═══════════════════════════════════════════════════════════════════════

hierarchical_chunker = HierarchicalChunker()
element_chunks = list(hierarchical_chunker.chunk(result.document))
```

## 2B.7 Export Formats

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")
doc = result.document

# ═══════════════════════════════════════════════════════════════════════
# EXPORT OPTIONS
# ═══════════════════════════════════════════════════════════════════════

# Markdown
markdown = doc.export_to_markdown()

# HTML
html = doc.export_to_html()

# JSON/Dict
json_dict = doc.export_to_dict()

# Save as JSON file
doc.save_as_json("output.json")

# Save as YAML
doc.save_as_yaml("output.yaml")

# DocTags format
doctags = doc.export_to_doctags()

# Table to DataFrame
for table in doc.tables:
    df = table.export_to_dataframe()
    print(df)
```

## 2B.8 Framework Integrations

```python
# ═══════════════════════════════════════════════════════════════════════
# LANGCHAIN INTEGRATION
# ═══════════════════════════════════════════════════════════════════════

from docling.integrations.langchain import DoclingReader, DoclingLoader

# Reader for single document
reader = DoclingReader()
documents = reader.load("document.pdf")

# Loader for directories
loader = DoclingLoader(path="./documents/")
all_documents = loader.load()

# ═══════════════════════════════════════════════════════════════════════
# LLAMAINDEX INTEGRATION
# ═══════════════════════════════════════════════════════════════════════

from docling.integrations.llamaindex import DoclingReader, DoclingNodeParser

reader = DoclingReader()
documents = reader.load_data("document.pdf")

parser = DoclingNodeParser()
nodes = parser.get_nodes_from_documents(documents)

# ═══════════════════════════════════════════════════════════════════════
# HAYSTACK INTEGRATION
# ═══════════════════════════════════════════════════════════════════════

from docling.integrations.haystack import DoclingConverter

converter = DoclingConverter()
documents = converter.run(sources=["document.pdf"])
```

## 2B.9 PII Detection and Obfuscation (NEW)

Docling’s example uses **external NER** (HuggingFace pipeline or GLiNER) plus post-processing to obfuscate detected entities. There are no documented `PdfPipelineOptions` flags for PII in current docs.

Minimal pattern from the example:
```python
from transformers import pipeline

nlp = pipeline(
    "token-classification",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple",
)
doc = converter.convert(source=DOC_SOURCE).document
for item in doc.texts:
    results = nlp(item.text)
    # map entities to obfuscated replacements...
```

Alternative model path used in the example:
```python
from gliner import GLiNER
model = GLiNER.from_pretrained("urchade/gliner_multi_pii-v1")
```

Reusable helper (pipeline-friendly):
```python
from transformers import pipeline

DEFAULT_PII_LABELS = {"PER", "PERSON", "ORG", "GPE", "LOC", "DATE", "EMAIL", "PHONE"}

def obfuscate_pii_text(text: str) -> str:
    nlp = pipeline(
        "token-classification",
        model="dslim/bert-base-NER",
        aggregation_strategy="simple",
    )
    entities = nlp(text)
    # Replace from end to start to preserve offsets
    for ent in sorted(entities, key=lambda e: e["start"], reverse=True):
        label = ent.get("entity_group", ent.get("entity"))
        if label in DEFAULT_PII_LABELS:
            text = text[:ent["start"]] + f"[{label}]" + text[ent["end"]:]
    return text
```

End-to-end example:
```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
doc = converter.convert("document_with_pii.pdf").document

sanitized_blocks = []
for item in doc.texts:
    sanitized_blocks.append(obfuscate_pii_text(item.text))

sanitized_text = "\n".join(sanitized_blocks)
print(sanitized_text[:1000])
```

## 2B.10 Batch Processing

```python
from docling.document_converter import DocumentConverter
from pathlib import Path

converter = DocumentConverter()

# ═══════════════════════════════════════════════════════════════════════
# BATCH CONVERSION
# ═══════════════════════════════════════════════════════════════════════

# Convert multiple files
files = list(Path("./documents/").glob("*.pdf"))
results = converter.convert_all(files)

for result in results:
    if result.success:
        print(f"Converted: {result.source}")
        markdown = result.document.export_to_markdown()
    else:
        print(f"Failed: {result.source} - {result.error}")

# ═══════════════════════════════════════════════════════════════════════
# WITH THREADING
# ═══════════════════════════════════════════════════════════════════════

from docling.pipeline.threaded_pdf_pipeline import ThreadedStandardPdfPipeline

# Threaded pipeline with back-pressure control
pipeline = ThreadedStandardPdfPipeline(
    max_workers=4,
    queue_size=10,
)
```

---

# Section 3: Vector Storage - pgvector (Enhanced)

## 3.1 Core Setup and Configuration

```python
import psycopg2
from pgvector.psycopg2 import register_vector

# ═══════════════════════════════════════════════════════════════════════
# CONNECTION SETUP
# ═══════════════════════════════════════════════════════════════════════

conn = psycopg2.connect(
    host="localhost",
    database="hyyve",
    user="postgres",
    password="password"
)

# Register pgvector types
register_vector(conn)

# Create extension
cur = conn.cursor()
cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
conn.commit()
```

## 3.2 Vector Types (NEW - Complete Coverage)

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- DENSE VECTOR (Standard)
-- ═══════════════════════════════════════════════════════════════════════

-- Standard embedding vector (up to 2000 dimensions for indexing)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)  -- OpenAI ada-002 dimensions
);

-- ═══════════════════════════════════════════════════════════════════════
-- SPARSE VECTOR (NEW - for BM25/SPLADE)
-- ═══════════════════════════════════════════════════════════════════════

-- Sparse vectors for keyword/lexical embeddings
-- Ideal for hybrid search combining semantic + lexical
CREATE TABLE documents_sparse (
    id SERIAL PRIMARY KEY,
    content TEXT,
    dense_embedding vector(1536),      -- Semantic embeddings
    sparse_embedding sparsevec(30000)  -- Lexical embeddings (SPLADE/BM25)
);

-- Insert sparse vector (only non-zero values stored)
INSERT INTO documents_sparse (content, sparse_embedding)
VALUES ('example', '{1:0.5, 100:0.3, 500:0.8}/30000');

-- ═══════════════════════════════════════════════════════════════════════
-- HALF VECTOR (Memory Efficient)
-- ═══════════════════════════════════════════════════════════════════════

-- Half-precision (16-bit) vectors - 50% memory reduction
CREATE TABLE documents_half (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding halfvec(1536)  -- Half precision
);

-- ═══════════════════════════════════════════════════════════════════════
-- BINARY VECTOR (Ultra Compact)
-- ═══════════════════════════════════════════════════════════════════════

-- Binary vectors for Hamming distance
CREATE TABLE documents_binary (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding bit(1536)  -- Binary quantized
);
```

## 3.3 Distance Functions (Complete Set)

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- EUCLIDEAN (L2) DISTANCE
-- ═══════════════════════════════════════════════════════════════════════

-- L2 distance - standard for most embeddings
SELECT * FROM documents
ORDER BY embedding <-> '[0.1, 0.2, ...]'::vector
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- COSINE DISTANCE
-- ═══════════════════════════════════════════════════════════════════════

-- Cosine distance - normalized similarity
SELECT * FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- INNER PRODUCT (Negative)
-- ═══════════════════════════════════════════════════════════════════════

-- Inner product - for MaxSim (ColBERT style)
SELECT * FROM documents
ORDER BY embedding <#> '[0.1, 0.2, ...]'::vector
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- L1 / MANHATTAN DISTANCE (NEW)
-- ═══════════════════════════════════════════════════════════════════════

-- L1 distance - sum of absolute differences
SELECT * FROM documents
ORDER BY embedding <+> '[0.1, 0.2, ...]'::vector
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- HAMMING DISTANCE (NEW - Binary Vectors)
-- ═══════════════════════════════════════════════════════════════════════

-- Hamming distance for binary vectors
SELECT * FROM documents_binary
ORDER BY embedding <~> '101010...'::bit(1536)
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- JACCARD DISTANCE (NEW - Binary Vectors)
-- ═══════════════════════════════════════════════════════════════════════

-- Jaccard distance for binary vectors
SELECT * FROM documents_binary
ORDER BY embedding <%> '101010...'::bit(1536)
LIMIT 10;
```

## 3.4 Vector Operations (NEW)

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- ARITHMETIC OPERATIONS
-- ═══════════════════════════════════════════════════════════════════════

-- Addition
SELECT embedding + '[0.1, 0.2, ...]'::vector FROM documents;

-- Subtraction
SELECT embedding - '[0.1, 0.2, ...]'::vector FROM documents;

-- Scalar multiplication
SELECT embedding * 2 FROM documents;

-- ═══════════════════════════════════════════════════════════════════════
-- ELEMENT-WISE OPERATIONS
-- ═══════════════════════════════════════════════════════════════════════

-- Element-wise multiplication (Hadamard product)
SELECT embedding * '[1.0, 0.5, ...]'::vector FROM documents;

-- ═══════════════════════════════════════════════════════════════════════
-- AGGREGATION FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- Average of vectors (centroid)
SELECT avg(embedding) FROM documents WHERE category = 'science';

-- Sum of vectors
SELECT sum(embedding) FROM documents WHERE category = 'science';

-- ═══════════════════════════════════════════════════════════════════════
-- UTILITY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- Vector dimension
SELECT vector_dims(embedding) FROM documents LIMIT 1;

-- Vector norm (magnitude)
SELECT vector_norm(embedding) FROM documents LIMIT 1;

-- Normalize vector (L2)
SELECT l2_normalize(embedding) FROM documents LIMIT 1;

-- Subvector extraction
SELECT subvector(embedding, 1, 256) FROM documents;  -- First 256 dims
```

## 3.5 Index Types and Configuration

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- HNSW INDEX (Recommended for Most Cases)
-- ═══════════════════════════════════════════════════════════════════════

-- HNSW with cosine distance
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
WITH (
    m = 16,               -- Max connections per layer (default: 16)
    ef_construction = 64  -- Size of dynamic candidate list (default: 64)
);

-- HNSW with L2 distance
CREATE INDEX ON documents USING hnsw (embedding vector_l2_ops);

-- HNSW with inner product
CREATE INDEX ON documents USING hnsw (embedding vector_ip_ops);

-- ═══════════════════════════════════════════════════════════════════════
-- HNSW SEARCH PARAMETERS
-- ═══════════════════════════════════════════════════════════════════════

-- Set ef_search for query time (higher = more accurate, slower)
SET hnsw.ef_search = 100;  -- Default: 40

-- ═══════════════════════════════════════════════════════════════════════
-- IVFFLAT INDEX (Faster Build, Larger Datasets)
-- ═══════════════════════════════════════════════════════════════════════

-- IVFFlat requires data before creating index
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);  -- Number of clusters

-- IVFFlat search parameters
SET ivfflat.probes = 10;  -- Number of clusters to search (default: 1)

-- ═══════════════════════════════════════════════════════════════════════
-- SPARSE VECTOR INDEX (NEW)
-- ═══════════════════════════════════════════════════════════════════════

-- Index for sparse vectors
CREATE INDEX ON documents_sparse USING hnsw (sparse_embedding sparsevec_l2_ops);

-- ═══════════════════════════════════════════════════════════════════════
-- HALFVEC INDEX (NEW)
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX ON documents_half USING hnsw (embedding halfvec_cosine_ops);

-- ═══════════════════════════════════════════════════════════════════════
-- BINARY INDEX (NEW)
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX ON documents_binary USING hnsw (embedding bit_hamming_ops);
```

## 3.6 Iterative Index Scans (NEW)

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- ITERATIVE SCAN FOR FILTERED QUERIES
-- ═══════════════════════════════════════════════════════════════════════

-- When combining vector search with filters, pgvector can iteratively
-- scan the index until enough results match the filter

-- Enable iterative scan (default in newer versions)
SET hnsw.iterative_scan = relaxed_order;

-- Example: Find similar documents with a category filter
-- pgvector will keep scanning until 10 matching results found
SELECT * FROM documents
WHERE category = 'technology'
ORDER BY embedding <=> query_embedding
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- ITERATIVE SCAN MODES
-- ═══════════════════════════════════════════════════════════════════════

-- strict_order: Results in exact distance order (slower)
SET hnsw.iterative_scan = strict_order;

-- relaxed_order: Results approximately ordered (faster, default)
SET hnsw.iterative_scan = relaxed_order;

-- off: Disable iterative scan
SET hnsw.iterative_scan = off;
```

## 3.7 Hybrid Search Implementation

```python
import psycopg2
from pgvector.psycopg2 import register_vector
import numpy as np

# ═══════════════════════════════════════════════════════════════════════
# HYBRID SEARCH: DENSE + SPARSE
# ═══════════════════════════════════════════════════════════════════════

class HybridSearcher:
    def __init__(self, conn):
        self.conn = conn
        register_vector(conn)

    def search(
        self,
        query_dense: list[float],
        query_sparse: dict[int, float],
        sparse_dims: int = 30000,
        alpha: float = 0.7,  # Weight for dense (1-alpha for sparse)
        limit: int = 10
    ):
        """
        Hybrid search combining dense and sparse vectors.
        Uses Reciprocal Rank Fusion (RRF) for score combination.
        """
        cur = self.conn.cursor()

        # Convert sparse dict to pgvector format
        sparse_str = "{" + ",".join(f"{k}:{v}" for k, v in query_sparse.items()) + f"}}/{sparse_dims}"

        # RRF-based hybrid search
        query = """
        WITH dense_results AS (
            SELECT id, content,
                   ROW_NUMBER() OVER (ORDER BY dense_embedding <=> %s::vector) as dense_rank
            FROM documents_hybrid
            ORDER BY dense_embedding <=> %s::vector
            LIMIT 100
        ),
        sparse_results AS (
            SELECT id, content,
                   ROW_NUMBER() OVER (ORDER BY sparse_embedding <=> %s::sparsevec) as sparse_rank
            FROM documents_hybrid
            ORDER BY sparse_embedding <=> %s::sparsevec
            LIMIT 100
        )
        SELECT
            COALESCE(d.id, s.id) as id,
            COALESCE(d.content, s.content) as content,
            (
                %s * (1.0 / (60 + COALESCE(d.dense_rank, 1000))) +
                %s * (1.0 / (60 + COALESCE(s.sparse_rank, 1000)))
            ) as rrf_score
        FROM dense_results d
        FULL OUTER JOIN sparse_results s ON d.id = s.id
        ORDER BY rrf_score DESC
        LIMIT %s
        """

        cur.execute(query, (
            query_dense, query_dense,
            sparse_str, sparse_str,
            alpha, 1 - alpha,
            limit
        ))

        return cur.fetchall()

# ═══════════════════════════════════════════════════════════════════════
# USAGE
# ═══════════════════════════════════════════════════════════════════════

searcher = HybridSearcher(conn)

# Dense embedding from OpenAI/Cohere
dense_embedding = [0.1, 0.2, ...]  # 1536 dims

# Sparse embedding from SPLADE/BM25
sparse_embedding = {42: 0.5, 1337: 0.8, 9999: 0.3}

results = searcher.search(
    query_dense=dense_embedding,
    query_sparse=sparse_embedding,
    alpha=0.7  # 70% dense, 30% sparse
)
```

## 3.8 Subvector Indexing (NEW - For High Dimensional Vectors)

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- SUBVECTOR INDEXING
-- For very high-dimensional vectors (e.g., 4096+ dims)
-- ═══════════════════════════════════════════════════════════════════════

-- Create table with high-dimensional vectors
CREATE TABLE documents_high_dim (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(4096)
);

-- Index only first 1024 dimensions (faster, less memory)
CREATE INDEX ON documents_high_dim
USING hnsw ((subvector(embedding, 1, 1024)::vector(1024)) vector_cosine_ops);

-- Query using subvector
SELECT * FROM documents_high_dim
ORDER BY subvector(embedding, 1, 1024) <=> subvector('[...]'::vector(4096), 1, 1024)
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════════
-- MATRYOSHKA EMBEDDINGS (Progressive Precision)
-- ═══════════════════════════════════════════════════════════════════════

-- Modern embedding models support Matryoshka representation
-- where smaller prefixes retain semantic meaning

-- Two-stage search: coarse with 256 dims, fine with full vector
WITH candidates AS (
    SELECT id, embedding
    FROM documents_high_dim
    ORDER BY subvector(embedding, 1, 256) <=> subvector(%s::vector, 1, 256)
    LIMIT 100
)
SELECT id
FROM candidates
ORDER BY embedding <=> %s::vector
LIMIT 10;
```

## 3.9 Binary Quantization (NEW)

```python
import numpy as np

# ═══════════════════════════════════════════════════════════════════════
# BINARY QUANTIZATION FOR FAST FILTERING
# ═══════════════════════════════════════════════════════════════════════

def quantize_to_binary(embedding: list[float]) -> str:
    """Convert float embedding to binary string for pgvector bit type."""
    binary = ''.join('1' if x > 0 else '0' for x in embedding)
    return binary

def hybrid_binary_search(conn, query_embedding: list[float], limit: int = 10):
    """
    Two-stage search:
    1. Fast binary search to get candidates
    2. Re-rank with full precision vectors
    """
    cur = conn.cursor()

    binary_query = quantize_to_binary(query_embedding)

    # Stage 1: Binary search for candidates
    # Stage 2: Re-rank with full vectors
    query = """
    WITH binary_candidates AS (
        SELECT id, embedding
        FROM documents_with_binary
        ORDER BY binary_embedding <~> %s::bit
        LIMIT 200  -- Overselect for re-ranking
    )
    SELECT id, content
    FROM binary_candidates bc
    JOIN documents d ON bc.id = d.id
    ORDER BY bc.embedding <=> %s::vector
    LIMIT %s
    """

    cur.execute(query, (binary_query, query_embedding, limit))
    return cur.fetchall()
```

## 3.10 Performance Tuning

```sql
-- ═══════════════════════════════════════════════════════════════════════
-- MEMORY SETTINGS
-- ═══════════════════════════════════════════════════════════════════════

-- Increase maintenance work mem for faster index builds
SET maintenance_work_mem = '2GB';

-- Increase shared buffers for better caching
-- (Set in postgresql.conf)
-- shared_buffers = '4GB'

-- ═══════════════════════════════════════════════════════════════════════
-- PARALLEL INDEX BUILD
-- ═══════════════════════════════════════════════════════════════════════

-- Enable parallel index creation
SET max_parallel_maintenance_workers = 4;

-- Create index with parallel workers
CREATE INDEX CONCURRENTLY ON documents
USING hnsw (embedding vector_cosine_ops);

-- ═══════════════════════════════════════════════════════════════════════
-- INDEX MONITORING
-- ═══════════════════════════════════════════════════════════════════════

-- Check index size
SELECT pg_size_pretty(pg_relation_size('documents_embedding_idx'));

-- Check index usage
SELECT indexrelname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexrelname LIKE '%embedding%';

-- ═══════════════════════════════════════════════════════════════════════
-- EXPLAIN ANALYZE
-- ═══════════════════════════════════════════════════════════════════════

EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM documents
ORDER BY embedding <=> '[...]'::vector
LIMIT 10;
```

## 3.11 Python Integration (Complete)

```python
from pgvector.psycopg2 import register_vector
from pgvector.sqlalchemy import Vector, SparseVector, HalfVector
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import numpy as np

# ═══════════════════════════════════════════════════════════════════════
# SQLALCHEMY INTEGRATION
# ═══════════════════════════════════════════════════════════════════════

Base = declarative_base()

class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True)
    content = Column(String)
    dense_embedding = Column(Vector(1536))
    sparse_embedding = Column(SparseVector(30000))
    half_embedding = Column(HalfVector(1536))

engine = create_engine('postgresql://user:pass@localhost/db')
Session = sessionmaker(bind=engine)

# ═══════════════════════════════════════════════════════════════════════
# BULK INSERT WITH COPY
# ═══════════════════════════════════════════════════════════════════════

from pgvector.psycopg2 import register_vector
from io import StringIO
import psycopg2

def bulk_insert_vectors(conn, documents: list[dict]):
    """Efficient bulk insert using COPY."""
    register_vector(conn)

    # Prepare data as tab-separated values
    buffer = StringIO()
    for doc in documents:
        embedding_str = '[' + ','.join(map(str, doc['embedding'])) + ']'
        buffer.write(f"{doc['content']}\t{embedding_str}\n")

    buffer.seek(0)

    cur = conn.cursor()
    cur.copy_from(buffer, 'documents', columns=['content', 'embedding'])
    conn.commit()

# ═══════════════════════════════════════════════════════════════════════
# ASYNC WITH ASYNCPG
# ═══════════════════════════════════════════════════════════════════════

import asyncpg
from pgvector.asyncpg import register_vector

async def setup_async():
    conn = await asyncpg.connect(database='hyyve')
    await register_vector(conn)
    return conn

async def search_async(conn, embedding: list[float], limit: int = 10):
    results = await conn.fetch(
        """
        SELECT id, content, embedding <=> $1::vector AS distance
        FROM documents
        ORDER BY embedding <=> $1::vector
        LIMIT $2
        """,
        embedding, limit
    )
    return results
```

---

# Section 4: Graph Storage - Neo4j + Graphiti (Enhanced)

## 4.1 Neo4j Setup and Configuration

```python
from neo4j import GraphDatabase

# ═══════════════════════════════════════════════════════════════════════
# CONNECTION SETUP
# ═══════════════════════════════════════════════════════════════════════

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password"),
    max_connection_lifetime=3600,
    max_connection_pool_size=50
)

# Verify connectivity
driver.verify_connectivity()

# ═══════════════════════════════════════════════════════════════════════
# VECTOR INDEX SETUP
# ═══════════════════════════════════════════════════════════════════════

def setup_vector_index(session):
    # Create vector index for entity embeddings
    session.run("""
    CREATE VECTOR INDEX entity_embeddings IF NOT EXISTS
    FOR (n:Entity)
    ON n.embedding
    OPTIONS {
        indexConfig: {
            `vector.dimensions`: 1536,
            `vector.similarity_function`: 'cosine'
        }
    }
    """)
```

## 4.2 Graphiti Core Setup

```python
from graphiti_core import Graphiti
from graphiti_core.llm_client import OpenAIClient
from graphiti_core.embedder import OpenAIEmbedder

# ═══════════════════════════════════════════════════════════════════════
# GRAPHITI INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

graphiti = Graphiti(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="password",
    llm_client=OpenAIClient(model="gpt-4o-mini"),
    embedder=OpenAIEmbedder(model="text-embedding-3-small"),
)

# Initialize schema (creates constraints and indexes)
await graphiti.build_indices_and_constraints()
```

## 4.3 Episode Types and Ingestion (NEW)

```python
from graphiti_core.types import EpisodeType
from datetime import datetime, timezone

# ═══════════════════════════════════════════════════════════════════════
# EPISODE TYPES
# ═══════════════════════════════════════════════════════════════════════

# MESSAGE: Conversational data (default)
await graphiti.add_episode(
    name="user_conversation",
    episode_body="User: What's the weather? Assistant: It's sunny today.",
    source=EpisodeType.message,  # Extracts speaker, intent, entities
    reference_time=datetime.now(timezone.utc),
    source_description="Chat conversation"
)

# TEXT: Unstructured text (documents, articles)
await graphiti.add_episode(
    name="product_docs",
    episode_body="Acme Widget is a revolutionary product that...",
    source=EpisodeType.text,  # General text extraction
    reference_time=datetime.now(timezone.utc),
    source_description="Product documentation"
)

# JSON: Structured data (API responses, logs)
await graphiti.add_episode(
    name="user_profile",
    episode_body='{"name": "John", "role": "admin", "department": "Engineering"}',
    source=EpisodeType.json,  # Extracts from JSON structure
    reference_time=datetime.now(timezone.utc),
    source_description="User profile data"
)
```

## 4.4 Group IDs for Multi-Tenancy (NEW)

```python
# ═══════════════════════════════════════════════════════════════════════
# GROUP ID PARTITIONING
# ═══════════════════════════════════════════════════════════════════════

# Add episode with group_id for tenant isolation
await graphiti.add_episode(
    name="company_data",
    episode_body="Acme Corp reported Q4 earnings...",
    source=EpisodeType.text,
    reference_time=datetime.now(timezone.utc),
    group_id="tenant_acme_123"  # Tenant-specific namespace
)

# Search within specific group
results = await graphiti.search(
    query="Q4 earnings report",
    group_ids=["tenant_acme_123"],  # Only search this tenant's data
    num_results=10
)

# Search across multiple groups
results = await graphiti.search(
    query="quarterly reports",
    group_ids=["tenant_acme_123", "tenant_beta_456"],
    num_results=20
)
```

## 4.5 Search Configuration Recipes (NEW)

Validation note: recipe constants are confirmed in code for 0.1.x. Confirm against 0.1.13 exports if you pin a newer release.

```python
from graphiti_core.search.search_config import SearchConfig
from graphiti_core.search.search_config_recipes import (
    EDGE_HYBRID_SEARCH_RRF,
    NODE_HYBRID_SEARCH_RRF,
    COMBINED_HYBRID_SEARCH_CROSS_ENCODER,
    FULL_TEXT_SEARCH_NODE_ONLY,
    VECTOR_SEARCH_EDGE_ONLY,
)

# ═══════════════════════════════════════════════════════════════════════
# PRE-BUILT SEARCH RECIPES
# ═══════════════════════════════════════════════════════════════════════

# Edge-focused hybrid search with RRF fusion
results = await graphiti.search(
    query="What products does Acme make?",
    config=EDGE_HYBRID_SEARCH_RRF,
    num_results=10
)

# Node-focused hybrid search
results = await graphiti.search(
    query="Find all people at company",
    config=NODE_HYBRID_SEARCH_RRF
)

# Combined search with cross-encoder reranking
results = await graphiti.search(
    query="Complex multi-hop question",
    config=COMBINED_HYBRID_SEARCH_CROSS_ENCODER
)

# Full-text only (fast, no embeddings)
results = await graphiti.search(
    query="exact phrase match",
    config=FULL_TEXT_SEARCH_NODE_ONLY
)

# Vector only (semantic similarity)
results = await graphiti.search(
    query="conceptually similar items",
    config=VECTOR_SEARCH_EDGE_ONLY
)

# ═══════════════════════════════════════════════════════════════════════
# CUSTOM SEARCH CONFIG
# ═══════════════════════════════════════════════════════════════════════

from graphiti_core.search.search_config import (
    SearchConfig,
    SearchMethod,
    SearchScope,
    RerankerType
)

custom_config = SearchConfig(
    search_methods=[
        SearchMethod.BM25,       # Full-text
        SearchMethod.COSINE,    # Vector similarity
    ],
    search_scope=SearchScope.EDGES,  # NODE, EDGES, or BOTH
    reranker=RerankerType.RRF,       # RRF, CROSS_ENCODER, or NONE
    limit=50,
    bm25_weight=0.3,
    cosine_weight=0.7,
)

results = await graphiti.search(
    query="my query",
    config=custom_config
)
```

## 4.6 Community Detection (NEW)

```python
# ═══════════════════════════════════════════════════════════════════════
# COMMUNITY DETECTION
# Automatically groups related entities into communities
# ═══════════════════════════════════════════════════════════════════════

# Build communities after adding episodes
await graphiti.build_communities(
    group_id="my_group",  # Optional: scope to group
    algorithm="louvain",   # Community detection algorithm
)

# Communities are stored as nodes with type "Community"
# They contain summaries of their member entities

# Search can leverage community structure
results = await graphiti.search(
    query="What are the main topics?",
    include_communities=True,
    num_results=10
)
```

## 4.7 Reflexion Loop for Quality (NEW)

```python
# ═══════════════════════════════════════════════════════════════════════
# REFLEXION LOOP
# Graphiti uses reflexion to improve extraction quality
# ═══════════════════════════════════════════════════════════════════════

# The extraction pipeline internally uses:
# 1. Initial extraction of entities and relationships
# 2. Reflexion step to validate and correct
# 3. Deduplication against existing graph
# 4. Temporal reasoning for fact updates

# Configure reflexion behavior
graphiti = Graphiti(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="password",
    llm_client=OpenAIClient(model="gpt-4o"),
    embedder=OpenAIEmbedder(),
    # Reflexion is enabled by default
    enable_reflexion=True,
)

# For batch processing, can disable for speed
graphiti_fast = Graphiti(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="password",
    llm_client=OpenAIClient(model="gpt-4o-mini"),
    embedder=OpenAIEmbedder(),
    enable_reflexion=False,  # Faster but lower quality
)
```

## 4.8 Entity Resolution and Deduplication

```python
# ═══════════════════════════════════════════════════════════════════════
# AUTOMATIC ENTITY RESOLUTION
# ═══════════════════════════════════════════════════════════════════════

# Graphiti automatically resolves entities during ingestion
# "John Smith", "J. Smith", "John" → same entity node

# Can manually trigger resolution
await graphiti.resolve_entities(
    group_id="my_group",
    threshold=0.85  # Similarity threshold for merging
)

# ═══════════════════════════════════════════════════════════════════════
# TEMPORAL FACT MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════

# Graphiti tracks fact validity over time
# New facts can invalidate old ones

await graphiti.add_episode(
    name="old_job",
    episode_body="John works at Acme Corp",
    reference_time=datetime(2023, 1, 1, tzinfo=timezone.utc)
)

await graphiti.add_episode(
    name="new_job",
    episode_body="John joined Beta Inc last month",
    reference_time=datetime(2024, 6, 1, tzinfo=timezone.utc)
)

# The "works_at" relationship to Acme will be marked as expired
# New "works_at" relationship to Beta will be current
```

## 4.9 Cypher Queries for Complex Traversals

```python
# ═══════════════════════════════════════════════════════════════════════
# DIRECT CYPHER QUERIES
# ═══════════════════════════════════════════════════════════════════════

async def multi_hop_query(driver, start_entity: str, hops: int = 2):
    """Find entities within N hops of start entity."""
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH path = (start:Entity {name: $name})-[*1..$hops]-(connected:Entity)
            WHERE start <> connected
            RETURN DISTINCT connected.name as entity,
                   length(path) as distance,
                   [rel in relationships(path) | type(rel)] as relationship_types
            ORDER BY distance
            LIMIT 50
            """,
            name=start_entity,
            hops=hops
        )
        return [record.data() async for record in result]

# ═══════════════════════════════════════════════════════════════════════
# PATH FINDING
# ═══════════════════════════════════════════════════════════════════════

async def find_connection(driver, entity1: str, entity2: str):
    """Find shortest path between two entities."""
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH path = shortestPath(
                (a:Entity {name: $e1})-[*]-(b:Entity {name: $e2})
            )
            RETURN path,
                   [node in nodes(path) | node.name] as entities,
                   [rel in relationships(path) | type(rel)] as relationships
            """,
            e1=entity1,
            e2=entity2
        )
        return await result.single()
```

## 4.10 Integration with Agno

```python
from agno.agent import Agent
from agno.tools.graphiti import GraphitiTools

# ═══════════════════════════════════════════════════════════════════════
# AGNO NATIVE INTEGRATION
# ═══════════════════════════════════════════════════════════════════════

# Graphiti as agent memory
agent = Agent(
    name="Knowledge Agent",
    model="gpt-4o",
    tools=[GraphitiTools(
        uri="bolt://localhost:7687",
        user="neo4j",
        password="password"
    )],
    instructions=[
        "Use the knowledge graph to store and retrieve facts",
        "Always check existing knowledge before adding new facts"
    ]
)

# The agent can now:
# - Add episodes to the graph
# - Search for relevant facts
# - Traverse relationships
# - Update facts temporally

# ═══════════════════════════════════════════════════════════════════════
# GRAPHITI AS MEMORY STORE
# ═══════════════════════════════════════════════════════════════════════

from agno.memory import GraphitiMemory

memory = GraphitiMemory(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="password",
    group_id="agent_memory"
)

agent = Agent(
    name="Memory Agent",
    model="gpt-4o",
    memory=memory,  # Stores conversation as graph
    add_memory_on_messages=True
)
```

---

# Section 5: Video Ingestion - youtube-transcript-api (Enhanced)

## 5.1 Basic Usage

```python
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import (
    TextFormatter, JSONFormatter, SRTFormatter, WebVTTFormatter
)

# ═══════════════════════════════════════════════════════════════════════
# SINGLE VIDEO TRANSCRIPT
# ═══════════════════════════════════════════════════════════════════════

video_id = "dQw4w9WgXcQ"

# Get transcript list, then fetch the preferred language
transcript_list = YouTubeTranscriptApi.list(video_id)
transcript = transcript_list.find_transcript(["en"])
segments = transcript.fetch()

# Returns list of segments:
# [{'text': 'Hello', 'start': 0.0, 'duration': 1.5}, ...]

# ═══════════════════════════════════════════════════════════════════════
# FORMAT AS TEXT
# ═══════════════════════════════════════════════════════════════════════

formatter = TextFormatter()
text_transcript = formatter.format_transcript(segments)

# ═══════════════════════════════════════════════════════════════════════
# FORMAT AS JSON
# ═══════════════════════════════════════════════════════════════════════

formatter = JSONFormatter()
json_transcript = formatter.format_transcript(segments)

# ═══════════════════════════════════════════════════════════════════════
# FORMAT AS SRT/WebVTT (Subtitles)
# ═══════════════════════════════════════════════════════════════════════

srt_formatter = SRTFormatter()
srt_content = srt_formatter.format_transcript(segments)

webvtt_formatter = WebVTTFormatter()
webvtt_content = webvtt_formatter.format_transcript(segments)
```

## 5.2 Language Selection and Translation

```python
# ═══════════════════════════════════════════════════════════════════════
# LIST AVAILABLE TRANSCRIPTS
# ═══════════════════════════════════════════════════════════════════════

transcript_list = YouTubeTranscriptApi.list(video_id)

for transcript in transcript_list:
    print(f"Language: {transcript.language} ({transcript.language_code})")
    print(f"  Generated: {transcript.is_generated}")
    print(f"  Translatable: {transcript.is_translatable}")

# ═══════════════════════════════════════════════════════════════════════
# GET SPECIFIC LANGUAGE
# ═══════════════════════════════════════════════════════════════════════

# Prefer manual transcripts in order of preference
transcript_list = YouTubeTranscriptApi.list(video_id)
transcript = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
segments = transcript.fetch()

# ═══════════════════════════════════════════════════════════════════════
# TRANSLATION
# ═══════════════════════════════════════════════════════════════════════

transcript_list = YouTubeTranscriptApi.list(video_id)

# Find a transcript and translate it
transcript = transcript_list.find_transcript(['en'])
translated = transcript.translate('es')  # Translate to Spanish
spanish_transcript = translated.fetch()

# ═══════════════════════════════════════════════════════════════════════
# PREFER MANUAL OVER AUTO-GENERATED
# ═══════════════════════════════════════════════════════════════════════

transcript_list = YouTubeTranscriptApi.list(video_id)

# Try manual first, fall back to generated
try:
    transcript = transcript_list.find_manually_created_transcript(['en'])
except:
    transcript = transcript_list.find_generated_transcript(['en'])
```

## 5.3 Batch Processing

Validation note: `get_transcripts` convenience API is not confirmed in current docs. Use `list()` + `fetch()` for batch processing.

```python
# ═══════════════════════════════════════════════════════════════════════
# MULTIPLE VIDEOS
# ═══════════════════════════════════════════════════════════════════════

video_ids = ["id1", "id2", "id3"]

results = {}
for video_id in video_ids:
    try:
        transcript_list = YouTubeTranscriptApi.list(video_id)
        transcript = transcript_list.find_transcript(['en'])
        results[video_id] = transcript.fetch()
        print(f"Got transcript for {video_id}: {len(results[video_id])} segments")
    except Exception:
        results[video_id] = None
        print(f"Failed to get transcript for {video_id}")
```

## 5.4 Custom HTTP Session (NEW)

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ═══════════════════════════════════════════════════════════════════════
# CUSTOM SESSION WITH RETRIES
# ═══════════════════════════════════════════════════════════════════════

session = requests.Session()

# Configure retry strategy
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504]
)

adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("https://", adapter)
session.mount("http://", adapter)

# Use custom session
api = YouTubeTranscriptApi(http_client=session)
segments = api.fetch(video_id, languages=["en"])

# ═══════════════════════════════════════════════════════════════════════
# PROXY CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

proxied_session = requests.Session()
proxied_session.proxies = {
    'http': 'http://proxy.example.com:8080',
    'https': 'http://proxy.example.com:8080'
}

api = YouTubeTranscriptApi(http_client=proxied_session)
segments = api.fetch(video_id, languages=["en"])
```

## 5.5 Thread Safety Considerations (NEW)

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor
from youtube_transcript_api import YouTubeTranscriptApi
import requests

# ═══════════════════════════════════════════════════════════════════════
# THREAD SAFETY WARNING
# ═══════════════════════════════════════════════════════════════════════

# The youtube-transcript-api is NOT thread-safe by default
# Each thread should use its own session

def get_transcript_thread_safe(video_id: str) -> list:
    """Thread-safe transcript fetching."""
    # Create a new session for this thread
    session = requests.Session()
    api = YouTubeTranscriptApi(http_client=session)
    return api.fetch(video_id, languages=["en"])

# ═══════════════════════════════════════════════════════════════════════
# PARALLEL PROCESSING (THREAD POOL)
# ═══════════════════════════════════════════════════════════════════════

video_ids = ["id1", "id2", "id3", "id4", "id5"]

def fetch_with_new_session(video_id):
    """Each call creates its own session."""
    session = requests.Session()
    try:
        api = YouTubeTranscriptApi(http_client=session)
        return video_id, api.fetch(video_id, languages=["en"])
    except Exception as e:
        return video_id, None

# Use ThreadPoolExecutor for parallel fetching
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(fetch_with_new_session, video_ids))

for video_id, transcript in results:
    if transcript:
        print(f"Got {len(transcript)} segments for {video_id}")

# ═══════════════════════════════════════════════════════════════════════
# ASYNC WRAPPER
# ═══════════════════════════════════════════════════════════════════════

async def get_transcript_async(video_id: str) -> list:
    """Async wrapper using thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        get_transcript_thread_safe,
        video_id
    )

async def get_multiple_transcripts(video_ids: list[str]) -> dict:
    """Fetch multiple transcripts concurrently."""
    tasks = [get_transcript_async(vid) for vid in video_ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return dict(zip(video_ids, results))
```

## 5.6 Error Handling

```python
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
    NoTranscriptAvailable,
    IpBlocked,
    RequestBlocked,
    AgeRestricted,
    InvalidVideoId,
    YouTubeRequestFailed,
    NotTranslatable,
    TranslationLanguageNotAvailable,
    CookiePathInvalid,
    CookiesInvalid
)

# ═══════════════════════════════════════════════════════════════════════
# COMPREHENSIVE ERROR HANDLING
# ═══════════════════════════════════════════════════════════════════════

def safe_get_transcript(video_id: str, languages: list = ['en']) -> dict:
    """Safely fetch transcript with detailed error handling."""
    try:
        transcript_list = YouTubeTranscriptApi.list(video_id)
        transcript = transcript_list.find_transcript(languages)
        segments = transcript.fetch()
        return {
            "success": True,
            "video_id": video_id,
            "transcript": segments,
            "error": None
        }
    except TranscriptsDisabled:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "Transcripts are disabled for this video"
        }
    except NoTranscriptFound:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": f"No transcript found for languages: {languages}"
        }
    except VideoUnavailable:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "Video is unavailable (private, deleted, or region-locked)"
        }
    except NoTranscriptAvailable:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "No transcripts available for this video"
        }
    except (IpBlocked, RequestBlocked):
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "Requests blocked by YouTube (rate limit or IP block)"
        }
    except AgeRestricted:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "Video is age restricted"
        }
    except InvalidVideoId:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "Invalid video ID"
        }
    except YouTubeRequestFailed:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": "YouTube request failed"
        }
    except Exception as e:
        return {
            "success": False,
            "video_id": video_id,
            "transcript": None,
            "error": f"Unexpected error: {str(e)}"
        }
```

---

# Section 6: Integration Patterns (Enhanced)

## 6.1 Complete Ingestion Pipeline

```python
import asyncio
from dataclasses import dataclass
from typing import Optional
from datetime import datetime, timezone

from agno.agent import Agent
from agno.embedder import OpenAIEmbedder
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from docling.document_converter import DocumentConverter
from youtube_transcript_api import YouTubeTranscriptApi
from graphiti_core import Graphiti
import psycopg2
from pgvector.psycopg2 import register_vector

# ═══════════════════════════════════════════════════════════════════════
# UNIFIED DOCUMENT MODEL
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class ProcessedDocument:
    """Unified document representation."""
    id: str
    source_type: str  # 'web', 'document', 'video', 'github'
    source_url: str
    title: str
    content: str
    chunks: list[str]
    embeddings: list[list[float]]
    metadata: dict
    processed_at: datetime

# ═══════════════════════════════════════════════════════════════════════
# INGESTION PIPELINE
# ═══════════════════════════════════════════════════════════════════════

class AgenticRAGPipeline:
    def __init__(
        self,
        pg_conn_string: str,
        neo4j_uri: str,
        neo4j_user: str,
        neo4j_password: str,
        openai_api_key: str,
        obfuscate_pii: bool = False
    ):
        # Vector store
        self.pg_conn = psycopg2.connect(pg_conn_string)
        register_vector(self.pg_conn)

        # Graph store
        self.graphiti = Graphiti(
            uri=neo4j_uri,
            user=neo4j_user,
            password=neo4j_password
        )

        # Embedder
        self.embedder = OpenAIEmbedder(
            model="text-embedding-3-small",
            api_key=openai_api_key
        )

        # Document converter
        self.doc_converter = DocumentConverter()

        # Web crawler
        self.crawler = AsyncWebCrawler(
            config=BrowserConfig(headless=True)
        )

        # Optional PII obfuscation (uses external NER helper)
        self.obfuscate_pii = obfuscate_pii

    async def ingest_web(self, url: str, group_id: str) -> ProcessedDocument:
        """Ingest web content."""
        async with self.crawler as crawler:
            result = await crawler.arun(url)

            if not result.success:
                raise Exception(f"Failed to crawl {url}")

            # Process content
            doc = await self._process_content(
                content=result.markdown,
                source_type="web",
                source_url=url,
                title=result.metadata.get("title", url),
                group_id=group_id,
                obfuscate_pii=self.obfuscate_pii
            )

            return doc

    async def ingest_document(
        self,
        file_path: str,
        group_id: str
    ) -> ProcessedDocument:
        """Ingest document (PDF, DOCX, etc.)."""
        result = self.doc_converter.convert(file_path)

        doc = await self._process_content(
            content=result.document.export_to_markdown(),
            source_type="document",
            source_url=f"file://{file_path}",
            title=result.document.metadata.get("title", file_path),
            group_id=group_id,
            obfuscate_pii=self.obfuscate_pii
        )

        return doc

    async def ingest_youtube(
        self,
        video_id: str,
        group_id: str
    ) -> ProcessedDocument:
        """Ingest YouTube transcript."""
        transcript_list = YouTubeTranscriptApi.list(video_id)
        transcript = transcript_list.find_transcript(["en"])
        segments = transcript.fetch()

        # Combine segments into full text
        full_text = " ".join([seg["text"] for seg in segments])

        doc = await self._process_content(
            content=full_text,
            source_type="video",
            source_url=f"https://youtube.com/watch?v={video_id}",
            title=f"YouTube Video {video_id}",
            group_id=group_id,
            metadata={"segments": segments},
            obfuscate_pii=self.obfuscate_pii
        )

        return doc

    async def _process_content(
        self,
        content: str,
        source_type: str,
        source_url: str,
        title: str,
        group_id: str,
        metadata: dict = None,
        obfuscate_pii: bool = False
    ) -> ProcessedDocument:
        """Common processing for all content types."""
        import uuid

        doc_id = str(uuid.uuid4())

        if obfuscate_pii:
            content = obfuscate_pii_text(content)
            metadata = metadata or {}
            metadata["pii_obfuscated"] = True

        # Chunk content
        chunks = self._chunk_content(content)

        # Generate embeddings
        embeddings = await self.embedder.embed_batch(chunks)

        # Store in vector DB
        await self._store_vectors(doc_id, chunks, embeddings, metadata or {})

        # Store in graph (entities and relationships)
        await self.graphiti.add_episode(
            name=doc_id,
            episode_body=content[:10000],  # First 10k chars for graph
            source=EpisodeType.text,
            reference_time=datetime.now(timezone.utc),
            group_id=group_id,
            source_description=f"{source_type}: {source_url}"
        )

        return ProcessedDocument(
            id=doc_id,
            source_type=source_type,
            source_url=source_url,
            title=title,
            content=content,
            chunks=chunks,
            embeddings=embeddings,
            metadata=metadata or {},
            processed_at=datetime.now(timezone.utc)
        )

    def _chunk_content(self, content: str, chunk_size: int = 1000) -> list[str]:
        """Simple chunking (use semantic chunking in production)."""
        chunks = []
        for i in range(0, len(content), chunk_size):
            chunks.append(content[i:i + chunk_size])
        return chunks

    async def _store_vectors(
        self,
        doc_id: str,
        chunks: list[str],
        embeddings: list[list[float]],
        metadata: dict
    ):
        """Store chunks and embeddings in pgvector."""
        cur = self.pg_conn.cursor()

        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            cur.execute(
                """
                INSERT INTO document_chunks
                (doc_id, chunk_index, content, embedding, metadata)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (doc_id, i, chunk, embedding, json.dumps(metadata))
            )

        self.pg_conn.commit()
```

## 6.2 Hybrid Search Implementation

```python
from dataclasses import dataclass
from typing import Optional

# ═══════════════════════════════════════════════════════════════════════
# HYBRID RETRIEVER
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class SearchResult:
    """Unified search result."""
    content: str
    source: str
    score: float
    metadata: dict

class HybridRetriever:
    def __init__(
        self,
        pg_conn,
        graphiti: Graphiti,
        embedder,
        vector_weight: float = 0.5,
        graph_weight: float = 0.3,
        keyword_weight: float = 0.2
    ):
        self.pg_conn = pg_conn
        self.graphiti = graphiti
        self.embedder = embedder
        self.vector_weight = vector_weight
        self.graph_weight = graph_weight
        self.keyword_weight = keyword_weight

    async def search(
        self,
        query: str,
        group_id: Optional[str] = None,
        num_results: int = 10
    ) -> list[SearchResult]:
        """Hybrid search combining vector, graph, and keyword."""

        # Get query embedding
        query_embedding = await self.embedder.embed(query)

        # Parallel searches
        vector_results, graph_results, keyword_results = await asyncio.gather(
            self._vector_search(query_embedding, group_id, num_results * 2),
            self._graph_search(query, group_id, num_results * 2),
            self._keyword_search(query, group_id, num_results * 2)
        )

        # Fuse results using RRF
        fused = self._rrf_fusion(
            [
                (vector_results, self.vector_weight),
                (graph_results, self.graph_weight),
                (keyword_results, self.keyword_weight)
            ],
            k=60
        )

        return fused[:num_results]

    async def _vector_search(
        self,
        embedding: list[float],
        group_id: Optional[str],
        limit: int
    ) -> list[SearchResult]:
        """Vector similarity search in pgvector."""
        cur = self.pg_conn.cursor()

        query = """
        SELECT content, doc_id, 1 - (embedding <=> %s::vector) as score, metadata
        FROM document_chunks
        WHERE (%s IS NULL OR metadata->>'group_id' = %s)
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """

        cur.execute(query, (embedding, group_id, group_id, embedding, limit))

        return [
            SearchResult(
                content=row[0],
                source=f"vector:{row[1]}",
                score=row[2],
                metadata=json.loads(row[3]) if row[3] else {}
            )
            for row in cur.fetchall()
        ]

    async def _graph_search(
        self,
        query: str,
        group_id: Optional[str],
        limit: int
    ) -> list[SearchResult]:
        """Graph search in Graphiti."""
        from graphiti_core.search.search_config_recipes import EDGE_HYBRID_SEARCH_RRF

        results = await self.graphiti.search(
            query=query,
            group_ids=[group_id] if group_id else None,
            config=EDGE_HYBRID_SEARCH_RRF,
            num_results=limit
        )

        return [
            SearchResult(
                content=r.fact if hasattr(r, 'fact') else r.name,
                source=f"graph:{r.uuid}",
                score=r.score if hasattr(r, 'score') else 1.0,
                metadata={"type": r.type if hasattr(r, 'type') else "entity"}
            )
            for r in results
        ]

    async def _keyword_search(
        self,
        query: str,
        group_id: Optional[str],
        limit: int
    ) -> list[SearchResult]:
        """Full-text search in PostgreSQL."""
        cur = self.pg_conn.cursor()

        query_sql = """
        SELECT content, doc_id, ts_rank(to_tsvector('english', content), query) as score, metadata
        FROM document_chunks, plainto_tsquery('english', %s) query
        WHERE to_tsvector('english', content) @@ query
        AND (%s IS NULL OR metadata->>'group_id' = %s)
        ORDER BY score DESC
        LIMIT %s
        """

        cur.execute(query_sql, (query, group_id, group_id, limit))

        return [
            SearchResult(
                content=row[0],
                source=f"keyword:{row[1]}",
                score=row[2],
                metadata=json.loads(row[3]) if row[3] else {}
            )
            for row in cur.fetchall()
        ]

    def _rrf_fusion(
        self,
        result_lists: list[tuple[list[SearchResult], float]],
        k: int = 60
    ) -> list[SearchResult]:
        """Reciprocal Rank Fusion for result combination."""
        scores = {}
        content_map = {}

        for results, weight in result_lists:
            for rank, result in enumerate(results, 1):
                key = result.content[:100]  # Use content prefix as key
                if key not in scores:
                    scores[key] = 0
                    content_map[key] = result

                # RRF formula
                scores[key] += weight * (1.0 / (k + rank))

        # Sort by fused score
        sorted_keys = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

        return [
            SearchResult(
                content=content_map[key].content,
                source=content_map[key].source,
                score=scores[key],
                metadata=content_map[key].metadata
            )
            for key in sorted_keys
        ]
```

## 6.3 Hyyve Agent

```python
from agno.agent import Agent
from agno.tools.function import FunctionTool
from agno.memory import PostgresMemory
from agno.knowledge import KnowledgeBase
from agno.run_response import RunResponse

# ═══════════════════════════════════════════════════════════════════════
# AGENTIC RAG AGENT
# ═══════════════════════════════════════════════════════════════════════

class AgenticRAGAgent:
    def __init__(
        self,
        pipeline: AgenticRAGPipeline,
        retriever: HybridRetriever,
        model: str = "gpt-4o"
    ):
        self.pipeline = pipeline
        self.retriever = retriever

        # Create tools
        search_tool = FunctionTool(
            name="search_knowledge",
            description="Search the knowledge base for relevant information",
            function=self._search_knowledge,
            parameters={
                "query": {"type": "string", "description": "Search query"},
                "num_results": {"type": "integer", "default": 5}
            }
        )

        ingest_tool = FunctionTool(
            name="ingest_content",
            description="Ingest new content into the knowledge base",
            function=self._ingest_content,
            parameters={
                "url": {"type": "string", "description": "URL to ingest"},
                "content_type": {
                    "type": "string",
                    "enum": ["web", "youtube", "document"]
                }
            }
        )

        # Create agent
        self.agent = Agent(
            name="Hyyve Assistant",
            model=model,
            tools=[search_tool, ingest_tool],
            instructions=[
                "You are a helpful assistant with access to a knowledge base.",
                "Always search the knowledge base before answering questions.",
                "Cite your sources when providing information.",
                "If information is not in the knowledge base, say so.",
                "You can ingest new content if the user provides URLs."
            ],
            add_history_to_messages=True,
            num_history_responses=10,
            show_tool_calls=True
        )

    async def _search_knowledge(
        self,
        query: str,
        num_results: int = 5
    ) -> str:
        """Tool function for knowledge search."""
        results = await self.retriever.search(query, num_results=num_results)

        if not results:
            return "No relevant information found in the knowledge base."

        formatted = []
        for i, r in enumerate(results, 1):
            formatted.append(f"[{i}] {r.content}\n   Source: {r.source}")

        return "\n\n".join(formatted)

    async def _ingest_content(
        self,
        url: str,
        content_type: str
    ) -> str:
        """Tool function for content ingestion."""
        try:
            if content_type == "web":
                doc = await self.pipeline.ingest_web(url, "default")
            elif content_type == "youtube":
                # Extract video ID from URL
                video_id = url.split("v=")[-1].split("&")[0]
                doc = await self.pipeline.ingest_youtube(video_id, "default")
            elif content_type == "document":
                doc = await self.pipeline.ingest_document(url, "default")
            else:
                return f"Unknown content type: {content_type}"

            return f"Successfully ingested: {doc.title} ({len(doc.chunks)} chunks)"
        except Exception as e:
            return f"Failed to ingest content: {str(e)}"

    async def chat(self, message: str) -> str:
        """Process a user message."""
        response: RunResponse = await self.agent.arun(message)
        return response.content
```

## 6.4 Production Configuration

```python
# ═══════════════════════════════════════════════════════════════════════
# ENVIRONMENT CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════

import os
from dataclasses import dataclass

@dataclass
class Config:
    """Production configuration."""

    # PostgreSQL
    pg_host: str = os.getenv("PG_HOST", "localhost")
    pg_port: int = int(os.getenv("PG_PORT", 5432))
    pg_database: str = os.getenv("PG_DATABASE", "hyyve")
    pg_user: str = os.getenv("PG_USER", "postgres")
    pg_password: str = os.getenv("PG_PASSWORD", "")

    # Neo4j
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "")

    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    llm_model: str = os.getenv("LLM_MODEL", "gpt-4o")

    # Search weights
    vector_weight: float = float(os.getenv("VECTOR_WEIGHT", 0.5))
    graph_weight: float = float(os.getenv("GRAPH_WEIGHT", 0.3))
    keyword_weight: float = float(os.getenv("KEYWORD_WEIGHT", 0.2))

    @property
    def pg_conn_string(self) -> str:
        return f"postgresql://{self.pg_user}:{self.pg_password}@{self.pg_host}:{self.pg_port}/{self.pg_database}"

# ═══════════════════════════════════════════════════════════════════════
# DATABASE SCHEMA SETUP
# ═══════════════════════════════════════════════════════════════════════

SCHEMA_SQL = """
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Document chunks table
CREATE TABLE IF NOT EXISTS document_chunks (
    id SERIAL PRIMARY KEY,
    doc_id VARCHAR(255) NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    sparse_embedding sparsevec(30000),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(doc_id, chunk_index)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON document_chunks(doc_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks
    USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_chunks_content_fts ON document_chunks
    USING gin (to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_chunks_metadata ON document_chunks
    USING gin (metadata);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(255) PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL,
    source_url TEXT NOT NULL,
    title TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_source_type ON documents(source_type);
"""

async def setup_database(config: Config):
    """Initialize database schema."""
    conn = psycopg2.connect(config.pg_conn_string)
    cur = conn.cursor()
    cur.execute(SCHEMA_SQL)
    conn.commit()
    conn.close()
```

---

# Section 7: Additional Tools Reference

## 7.1 Agno Tools Summary

| Tool Category | Class | Key Functions |
|--------------|-------|---------------|
| **Knowledge** | `KnowledgeTools` | `search_knowledge`, `add_to_knowledge` |
| **Reasoning** | `ReasoningTools` | `add_reasoning_step`, `get_reasoning_chain` |
| **Workflow** | `WorkflowTools` | `condition`, `loop`, `router`, `branch` |
| **GitHub** | `GithubTools` | `search_repositories`, `get_file_content`, `search_code` |
| **Database** | `SqlTools` | `run_query`, `describe_table`, `list_tables` |
| **Web** | `WebTools` | `search_web`, `fetch_url` |
| **File** | `FileTools` | `read_file`, `write_file`, `list_directory` |
| **Shell** | `ShellTools` | `run_command` |

## 7.2 Distance Function Reference

| Operator | Function | Use Case | Index Type |
|----------|----------|----------|------------|
| `<->` | L2/Euclidean | General purpose | `vector_l2_ops` |
| `<=>` | Cosine | Normalized embeddings | `vector_cosine_ops` |
| `<#>` | Inner Product | MaxSim (ColBERT) | `vector_ip_ops` |
| `<+>` | L1/Manhattan | Sparse features | `vector_l1_ops` |
| `<~>` | Hamming | Binary vectors | `bit_hamming_ops` |
| `<%>` | Jaccard | Set similarity | `bit_jaccard_ops` |

## 7.3 Embedding Model Dimensions

| Model | Dimensions | Provider |
|-------|------------|----------|
| text-embedding-3-small | 1536 | OpenAI |
| text-embedding-3-large | 3072 | OpenAI |
| embed-english-v3.0 | 1024 | Cohere |
| embed-multilingual-v3.0 | 1024 | Cohere |
| all-MiniLM-L6-v2 | 384 | Sentence Transformers |
| all-mpnet-base-v2 | 768 | Sentence Transformers |
| bge-large-en-v1.5 | 1024 | BAAI |
| nomic-embed-text-v1 | 768 | Nomic |

---

# Section 8: Quick Reference Cards

## 8.1 Agno Agent Quick Reference

```python
from agno.agent import Agent

agent = Agent(
    # Core
    name="My Agent",
    model="gpt-4o",

    # Instructions
    instructions=["Be helpful"],

    # Tools
    tools=[MyTool()],

    # Context Management
    add_history_to_messages=True,
    num_history_responses=10,
    add_state_in_messages=True,
    add_session_state_to_context=True,

    # Structured I/O
    response_model=MyOutputModel,
    output_schema=MyOutputSchema,
    structured_outputs=True,

    # Execution
    reasoning=True,
    show_tool_calls=True,
    debug_mode=True,
)
```

## 8.2 Crawl4ai Quick Reference

```python
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

async with AsyncWebCrawler() as crawler:
    result = await crawler.arun(
        url="https://example.com",
        config=CrawlerRunConfig(
            # Content extraction
            word_count_threshold=10,
            css_selector="article",

            # JavaScript
            wait_for="css:.content",
            js_code="window.scrollTo(0, document.body.scrollHeight)",

            # Processing
            process_iframes=True,
            remove_overlay_elements=True,
        )
    )
```

## 8.3 pgvector Quick Reference

```sql
-- Create table
CREATE TABLE items (embedding vector(1536));

-- Create index
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);

-- Search
SELECT * FROM items ORDER BY embedding <=> '[...]' LIMIT 10;

-- Set search params
SET hnsw.ef_search = 100;
```

## 8.4 Graphiti Quick Reference

```python
from graphiti_core import Graphiti

graphiti = Graphiti(uri, user, password)

# Add content
await graphiti.add_episode(
    name="doc1",
    episode_body="content",
    source=EpisodeType.text,
    reference_time=datetime.now(timezone.utc),
    group_id="my_group"
)

# Search
results = await graphiti.search(
    query="my query",
    group_ids=["my_group"],
    config=EDGE_HYBRID_SEARCH_RRF
)
```

---

*Document Version: 2.1 Enhanced (Validated)*
*Generated: 2026-01-19*
*Research Sources: DeepWiki, Context7, Official Documentation*
