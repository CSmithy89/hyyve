# Comprehensive Canvas Builder Research Document

## Platform: ReactFlow + Zustand Visual Node-Based Editor with Unified Agno Chat Interface

**Document Version**: 2.0
**Last Updated**: January 22, 2026
**Validation Status**: ✅ VERIFIED via Context7 MCP + DeepWiki MCP (see Section 17)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Market Analysis: Visual AI Workflow Platforms](#2-market-analysis-visual-ai-workflow-platforms)
   - 2.1 TapNow
   - 2.2 ComfyUI
   - 2.3 Krea Nodes
   - 2.4 Flora
   - 2.5 NodeTool
   - 2.6 Fal Workflows
3. [Collaboration SDK Analysis: Weavy](#3-collaboration-sdk-analysis-weavy)
4. [Architecture Decision: Unified Chat + Dedicated Agents](#4-architecture-decision-unified-chat--dedicated-agents)
5. [Complete Node Type Taxonomy](#5-complete-node-type-taxonomy)
6. [Canvas Agent Architecture (Agno-Based)](#6-canvas-agent-architecture-agno-based)
7. [Integration with Existing Platform Components](#7-integration-with-existing-platform-components)
8. [State Management Architecture](#8-state-management-architecture)
   - 8.1 DAG Enforcement (CRITICAL)
9. [Workflow Execution Engine](#9-workflow-execution-engine)
   - 9.1 Provider Licensing Matrix (VALIDATED)
10. [Community & Marketplace Features](#10-community--marketplace-features)
11. [RAG Integration Patterns](#11-rag-integration-patterns)
12. [Security Considerations](#12-security-considerations)
13. [Performance Optimization](#13-performance-optimization)
    - 13.1 Real-Time Collaboration Architecture (NEW)
    - 13.2 Workflow Versioning & Rollback (NEW)
14. [Recommended MVP Node Set](#14-recommended-mvp-node-set)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Conclusion](#16-conclusion)
17. [Validation Report](#17-validation-report) (NEW)
18. [References](#references)

---

## 1. Executive Summary

This research document provides a comprehensive analysis of visual AI workflow platforms to inform the architecture of a **Canvas Builder** - the 4th build type for the Hyyve Platform. The Canvas Builder enables users to create visual content generation workflows (images, videos, marketing assets) using an infinite canvas with drag-and-drop nodes, powered by a conversational interface through the existing Agno-based chat system.

### Key Findings

1. **Infinite Canvas is Industry Standard**: All major visual AI workflow platforms (TapNow, ComfyUI, Krea Nodes) use infinite zoomable canvases with node-based architectures. **Note:** ReactFlow does NOT enforce DAG (Directed Acyclic Graph) constraints natively—it allows arbitrary connections including cycles. DAG enforcement must be implemented via `isValidConnection` prop with explicit cycle detection.

2. **DAG Execution with Partial Re-execution**: ComfyUI pioneered the pattern of only re-executing changed nodes, dramatically improving iteration speed.

3. **Unified Chat Preferred Over New SDK**: Rather than integrating Weavy or another chat SDK, leveraging the existing Agno + RAG chat infrastructure with a dedicated Canvas Agent provides better UX consistency and reduces vendor dependencies.

4. **Community & Remix Culture**: TapNow's "TapTV" demonstrates the value of public workflows that can be viewed, forked, and remixed - directly applicable to the platform's marketplace model.

5. **Multi-Modal Generation**: Modern canvas builders support text-to-image, image-to-video, sketch-to-image, and batch processing workflows for e-commerce and marketing use cases.

6. **ReactFlow Foundation**: The existing ReactFlow + Zustand stack used for Module, Chatbot, and Voice builders provides the perfect foundation for Canvas Builder.

### Platform Build Types (Updated)

```
Workspace (User/Organization)
    └── Project
        ├── Module (BMB methodology - backend intelligence)
        │   └── Agents / Workflows / Tasks / Checklists
        ├── Chatbot (customer-facing text - Chatwoot)
        │   └── Conversation Flows / Nodes
        ├── Voice Agent (customer-facing voice - Twilio)
        │   └── Voice Flows / Nodes
        └── Canvas (visual content creation - NEW)
            └── Visual Workflows / Nodes / Templates
```

### Architecture Principle

> **Unified Chat + Dedicated Agents**: Single chat window across all builders, with context-aware agent routing. When user is in Canvas view, the Canvas Agent ("Artie") handles requests. This maintains UX consistency and leverages existing Agno + RAG infrastructure.

---

## 2. Market Analysis: Visual AI Workflow Platforms

### 2.1 TapNow

**Website**: https://app.tapnow.ai/

**Overview**: Professional AI engine for visual content creation targeting e-commerce, advertising, and creative storytelling.

**Architecture**
| Component | Description |
|-----------|-------------|
| **Infinite Canvas** | Drag-and-drop workspace for visual content creation |
| **Node Types** | Text, Image, Video, Processing nodes |
| **AI Models** | Text-to-image, text-to-video, image-to-video, sketch-to-video |
| **Batch Processing** | Automated workflow from scriptwriting → storyboarding → finished visuals |

**Key Features**
- Flexible canvas with cutting-edge AI models
- Production workflow from script to finished piece
- Fine editing: high-definition zoom, local redrawing, pixel-level modification
- 5-minute drawing generation vs hours for traditional design (90% cost reduction)
- A/B testing capabilities for marketing content

**Community Platform (TapTV)**
- Shared canvases are public by default
- Users can view full process, reuse, or build on top
- Creator hub + commercial visual engine
- Fosters collaboration and remix culture

**E-Commerce Workflow**
1. Upload 3 product images (different angles) + 2 usage scenarios
2. Fill in product name and five-point description
3. Automated generation with batch processing

**Strengths**
- Purpose-built for commercial visual content
- Strong e-commerce integration
- Community remix culture
- Fast iteration (5 minutes vs hours)

**Weaknesses**
- Closed platform, not self-hostable
- Limited to visual content (no backend logic)
- Newer platform with smaller community

**Sources**: [TapNow App](https://app.tapnow.ai/), [TapNow Docs](https://docs.tapnow.ai/en/docs)

---

### 2.2 ComfyUI

**Repository**: https://github.com/Comfy-Org/ComfyUI

**Overview**: The most powerful and modular diffusion model GUI with graph/nodes interface. Open-source, self-hostable, and highly extensible.

**Architecture**
| Component | Description |
|-----------|-------------|
| **Graph Architecture** | Directed Acyclic Graph (DAG) with typed connections |
| **Node Editor** | Visual programming environment with drag-and-connect |
| **Execution Engine** | Smart partial re-execution (only changed nodes) |
| **Memory Management** | Can run on GPUs with as low as 1GB VRAM |

**Core Concepts**

**Node Categories**
| Category | Examples |
|----------|----------|
| **Loaders** | Load Checkpoint, Load LoRA, Load VAE |
| **Conditioning** | CLIP Text Encode, ControlNet Apply |
| **Sampling** | KSampler, KSampler Advanced |
| **Latent** | Empty Latent Image, VAE Decode/Encode |
| **Image** | Save Image, Preview Image, Image Scale |
| **Masking** | Mask Composite, Set Latent Noise Mask |

**Data Flow Types**
| Type | Color | Description |
|------|-------|-------------|
| MODEL | Purple | Diffusion model weights |
| CLIP | Yellow | Text encoder |
| VAE | Red | Variational autoencoder |
| CONDITIONING | Orange | Prompt embeddings |
| LATENT | Pink | Latent space tensors |
| IMAGE | Blue | Pixel data |
| MASK | Green | Binary/grayscale masks |

**Workflow Persistence**
- Saved as JSON files
- Automatically embedded in generated image metadata
- Can be loaded by opening any generated image

**Execution Optimization**
```
Graph Analysis → Dependency Resolution → Partial Execution → Caching
     │                    │                     │              │
     └── Identify         └── Topological       └── Only run   └── Cache
         changed nodes        sort nodes            changed        outputs
```

**2025 Updates - Nodes 2.0**
- Complete visual redesign
- Linear mode for sequential thinking
- Improved connection visualization
- Better node organization

**Strengths**
- Extremely powerful and flexible
- Open-source (GPL-3.0) - **VALIDATED via DeepWiki**
- Massive custom node ecosystem
- Smart execution and memory management
- Self-hostable

**Weaknesses**
- Steep learning curve
- Technical knowledge required
- No built-in collaboration features

> ⚠️ **GPL-3.0 License Warning (VALIDATED)**: ComfyUI is licensed under GPL-3.0. Per DeepWiki validation, this means:
> - All derivative works must also be GPL-3.0 licensed
> - Source code must be provided to users
> - Cannot be used in proprietary SaaS without GPL applying to the entire system
> - **Recommendation:** Reference architectural patterns conceptually only. Do NOT copy code directly.

**Sources**: [ComfyUI GitHub](https://github.com/Comfy-Org/ComfyUI), [ComfyUI Workflow Docs](https://docs.comfy.org/development/core-concepts/workflow)

---

### 2.3 Krea Nodes

**Website**: https://www.krea.ai/

**Overview**: Infinite canvas with 50+ AI models across images, videos, audio, and 3D.

**Architecture**
| Component | Description |
|-----------|-------------|
| **Infinite Canvas** | Zoomable, pannable workspace |
| **Model Library** | 50+ models for multi-modal generation |
| **Advanced Features** | Lighting adjustments, lens effects, color grading |
| **Community** | Shareable workflows and templates |

**Key Features**
- Balance between accessibility and power
- Straightforward node connections
- Community templates
- Collaborative creation

**Strengths**
- Multi-modal (images, videos, audio, 3D)
- Good balance of simplicity and power
- Strong community features

**Weaknesses**
- Cloud-only, no self-hosting
- Closed source

**Sources**: [Krea AI](https://www.krea.ai/), [Top 7 Node-Based AI Workflow Apps](https://www.krea.ai/articles/top-node-based-ai-workflow-apps)

---

### 2.4 Flora

**Overview**: Collaborative platform combining GPT-4, Flux Pro, and Runway on shared canvases.

**Key Features**
| Feature | Description |
|---------|-------------|
| **Multi-Model** | GPT-4, Flux Pro, Runway integration |
| **Collaboration** | Simultaneous team work on shared canvases |
| **Version History** | Non-linear exploration with version tracking |
| **Flexible Iteration** | Branch and explore different directions |

**Strengths**
- Strong collaboration features
- Multi-model integration
- Version history tracking

**Weaknesses**
- Parameter simplification may limit power users
- Closed platform

---

### 2.5 NodeTool

**Website**: https://nodetool.ai/

**Overview**: Local-first, self-hosted node-based AI workflow builder.

**Architecture**
| Component | Description |
|-----------|-------------|
| **Local-First** | Runs on user's machine |
| **Open Source** | Full source code available |
| **Multi-Modal** | Images, video, audio, 3D support |
| **RAG Integration** | Built-in knowledge base support |

**Key Features**
- Privacy-focused (local execution)
- No cloud dependency
- Extensible node system
- Self-contained workflows

**Strengths**
- Local-first, privacy-focused
- Open source (AGPL-3.0) - **VALIDATED**
- RAG integration built-in

**Weaknesses**
- Requires local GPU for best performance
- Smaller community than ComfyUI

> ⚠️ **AGPL-3.0 License Warning (VALIDATED)**: NodeTool uses AGPL-3.0, not permissive open source. This means:
> - Network-use triggers copyleft provisions
> - SaaS products using it must release their source code
> - **Recommendation:** Do NOT use NodeTool components in closed-source SaaS

**Sources**: [NodeTool](https://nodetool.ai/), [GitHub](https://github.com/nodetool-ai/nodetool)

---

### 2.6 Fal Workflows

**Website**: https://fal.ai/

**Overview**: Cloud-based AI model platform with visual workflow builder.

**Key Features**
| Feature | Description |
|---------|-------------|
| **Model Library** | Hundreds of AI models |
| **Visual Interface** | Node-based workflow builder |
| **API Access** | Direct API requests from workflows |
| **Playground** | Interactive model testing |

**Strengths**
- Large model library
- API-first design
- Good for production workloads

**Weaknesses**
- Can be expensive at scale
- Cluttered interface
- Missing image previews in editor

**Sources**: [Fal.ai](https://fal.ai/)

---

## 3. Collaboration SDK Analysis: Weavy

**Website**: https://www.weavy.com/

**Overview**: Embeddable collaboration SDK for adding chat, files, AI copilots, and real-time features to applications.

### Available Components

| Component | Tag | Purpose |
|-----------|-----|---------|
| **Chat** | `<WyChat>` | 1:1 and group messaging |
| **Messenger** | `<WyMessenger>` | Full messenger interface |
| **Copilot** | `<WyCopilot>` | AI assistant with @mentions |
| **Files** | `<WyFiles>` | File sharing and management |
| **Posts** | `<WyPosts>` | Activity feed |
| **Comments** | `<WyComments>` | Threaded discussions |

### Authentication Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │  Your API   │      │   Weavy     │
│   (React)   │      │  Server     │      │   Cloud     │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │ 1. Request token   │                    │
       │───────────────────>│                    │
       │                    │ 2. Get access_token│
       │                    │───────────────────>│
       │                    │<───────────────────│
       │ 3. Return token    │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ 4. Use token for API calls             │
       │────────────────────────────────────────>│
```

### Webhook Events

| Category | Events |
|----------|--------|
| **Apps** | app.created, app.updated, app.deleted |
| **Messages** | message.created, message.updated, message.deleted |
| **Files** | file.created, file.updated, file.deleted |
| **Comments** | comment.created, comment.updated |
| **Reactions** | reaction.created, reaction.deleted |

### Pricing (VALIDATED January 2026)

| Tier | Price | Users | Features |
|------|-------|-------|----------|
| **Free** | $0/mo | Limited | Prototyping, 2 LLMs, API throttling, shared resources |
| **Startup** | $49/mo (12 months) | Unlimited | 80% discount, full Pro features - for early-stage teams |
| **Pro** | $249/mo | Unlimited | All features, unlimited agents, premium support |
| **Self-Hosted** | Custom | Unlimited | On-premise/private cloud deployment |

> **Note:** Pricing validated via [weavy.com/pricing](https://www.weavy.com/pricing). No explicit MAU limits on Pro tier.

### Decision: Why NOT Weavy

While Weavy provides excellent collaboration features, integrating it would:

1. **Add Vendor Dependency**: Another SaaS to manage
2. **Duplicate Functionality**: We already have Agno + chat infrastructure
3. **Inconsistent UX**: Different chat experience from other builders
4. **Additional Cost**: $249/mo at Pro tier

**Recommendation**: Use existing Agno + RAG chat infrastructure with a dedicated Canvas Agent instead.

**Sources**: [Weavy Docs](https://www.weavy.com/docs), [Weavy React Integration](https://www.weavy.com/docs/get-started/react), [Weavy Webhooks](https://www.weavy.com/docs/learn/webhooks)

---

## 4. Architecture Decision: Unified Chat + Dedicated Agents

### Overview

Rather than adding a new chat SDK (Weavy) or building a separate chat interface, the Canvas Builder will use the **same chat window** as all other builders, with a **dedicated Canvas Agent** that activates based on context.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED CHAT + AGENT SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SINGLE CHAT WINDOW (All Views)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      AI CHAT (Agno + RAG)                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│              ┌───────────────┼───────────────┬───────────────┐              │
│              ▼               ▼               ▼               ▼              │
│       ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│       │  BMB     │    │ Chatbot  │    │  Voice   │    │  Canvas  │        │
│       │ Agents   │    │  Agent   │    │  Agent   │    │  Agent   │        │
│       │(Bond,    │    │          │    │          │    │ (Artie)  │        │
│       │Wendy,    │    │          │    │          │    │          │        │
│       │Morgan)   │    │          │    │          │    │          │        │
│       └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘        │
│            │               │               │               │               │
│            ▼               ▼               ▼               ▼               │
│       ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│       │  Module  │    │ Chatbot  │    │  Voice   │    │  Canvas  │        │
│       │  Builder │    │ Builder  │    │ Builder  │    │ Builder  │        │
│       │  (React  │    │ (React   │    │ (React   │    │ (React   │        │
│       │   Flow)  │    │  Flow)   │    │  Flow)   │    │  Flow)   │        │
│       └──────────┘    └──────────┘    └──────────┘    └──────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Agent Routing Logic

```typescript
// Context-aware agent selection
function selectAgent(activeView: string, projectContext: ProjectContext): Agent {
  switch (activeView) {
    case '/projects/:id/canvas':
      return canvasAgent; // Artie
    case '/projects/:id/chatbot':
      return chatbotAgent;
    case '/projects/:id/voice':
      return voiceAgent;
    case '/projects/:id/modules':
    default:
      return bmbAgentRouter(projectContext); // Bond, Wendy, or Morgan
  }
}
```

### Benefits

| Benefit | Description |
|---------|-------------|
| **Single UI** | Users learn one chat interface, works everywhere |
| **Shared RAG** | All agents access same project knowledge base |
| **Consistent UX** | Same patterns across all builders |
| **No New Vendors** | Reuse Agno + existing chat infrastructure |
| **Agent Handoff** | Canvas Agent can delegate to BMB agents for complex integrations |
| **Cost Savings** | No additional SaaS subscriptions |

---

## 5. Complete Node Type Taxonomy

### 5.1 Input Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **TextPrompt** | Text input for AI generation | None | `text: string` |
| **ImageUpload** | Upload reference images | File selector | `image: ImageData` |
| **SketchInput** | Freehand drawing/graffiti canvas | Drawing tools | `sketch: ImageData` |
| **VideoUpload** | Upload video for processing | File selector | `video: VideoData` |
| **ProductPhotos** | Batch product image upload | Multi-file selector | `images: ImageData[]` |
| **ScriptInput** | Text script with scene parsing | Text editor | `scenes: Scene[]` |
| **AudioUpload** | Upload audio for processing | File selector | `audio: AudioData` |
| **URLInput** | Fetch image/video from URL | URL field | `media: MediaData` |
| **CameraCapture** | Live camera input | Camera selector | `image: ImageData` |
| **ScreenCapture** | Screenshot input | Screen selector | `image: ImageData` |

### 5.2 AI Generation Nodes

| Node | Purpose | Inputs | Outputs | Providers |
|------|---------|--------|---------|-----------|
| **TextToImage** | Generate image from text | `prompt`, `negative_prompt`, `size`, `model` | `image: ImageData` | Flux, SDXL, Midjourney, DALL-E |
| **ImageToImage** | Transform existing image | `image`, `prompt`, `strength` | `image: ImageData` | Flux, SDXL |
| **TextToVideo** | Generate video from text | `prompt`, `duration`, `fps` | `video: VideoData` | Runway, Kling, Pika |
| **ImageToVideo** | Animate still image | `image`, `motion_prompt`, `duration` | `video: VideoData` | Runway, Stable Video |
| **SketchToImage** | Convert sketch to realistic | `sketch`, `prompt`, `style` | `image: ImageData` | ControlNet, T2I-Adapter |
| **Upscale** | AI upscaling | `image`, `scale_factor` | `image: ImageData` | Real-ESRGAN, Topaz |
| **Inpaint** | Fill masked regions | `image`, `mask`, `prompt` | `image: ImageData` | SDXL Inpaint, Flux Fill |
| **Outpaint** | Extend image boundaries | `image`, `direction`, `prompt` | `image: ImageData` | SDXL Outpaint |
| **FaceGenerate** | Generate faces | `prompt`, `style` | `image: ImageData` | StyleGAN, FLUX |
| **ObjectGenerate** | Generate 3D objects | `prompt`, `format` | `model: Model3D` | Meshy, Tripo3D |

### 5.3 Processing Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **RemoveBackground** | Background removal | `image` | `image`, `mask` |
| **FaceSwap** | Face replacement | `source_image`, `target_face` | `image` |
| **StyleTransfer** | Apply artistic styles | `image`, `style_reference` | `image` |
| **ColorGrade** | Color correction/grading | `image`, `lut` or `settings` | `image` |
| **Composite** | Layer composition | `layers: ImageData[]`, `blend_modes` | `image` |
| **Crop** | Crop to region | `image`, `region` | `image` |
| **Resize** | Resize image | `image`, `width`, `height` | `image` |
| **Rotate** | Rotate image | `image`, `angle` | `image` |
| **Blur** | Apply blur effect | `image`, `radius`, `type` | `image` |
| **Sharpen** | Sharpen image | `image`, `amount` | `image` |
| **Denoise** | Remove noise | `image`, `strength` | `image` |
| **SuperResolution** | Enhance resolution | `image`, `model` | `image` |

### 5.4 Text & Caption Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **CaptionGenerate** | Auto-generate captions | `image` or `video` | `caption: string` |
| **TextOverlay** | Add text to image/video | `media`, `text`, `position`, `style` | `media` |
| **Translate** | Translate text | `text`, `source_lang`, `target_lang` | `text` |
| **CopyWrite** | AI copywriting | `product_info`, `tone`, `length` | `copy: string` |
| **HashtagGenerate** | Generate hashtags | `content`, `platform` | `hashtags: string[]` |
| **SEOOptimize** | Optimize for search | `content`, `keywords` | `optimized: string` |

### 5.5 Video Processing Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **VideoTrim** | Trim video duration | `video`, `start`, `end` | `video` |
| **VideoConcat** | Concatenate videos | `videos: VideoData[]` | `video` |
| **VideoSpeed** | Adjust playback speed | `video`, `speed` | `video` |
| **VideoLoop** | Create looping video | `video`, `loops` | `video` |
| **AddAudio** | Add audio track | `video`, `audio` | `video` |
| **ExtractFrames** | Extract frames from video | `video`, `fps` | `images: ImageData[]` |
| **FramesToVideo** | Combine frames to video | `images`, `fps` | `video` |
| **VideoStabilize** | Stabilize shaky video | `video` | `video` |
| **VideoTransition** | Add transitions | `video1`, `video2`, `transition` | `video` |

### 5.6 Control Flow Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **Condition** | Branch based on condition | `value`, `operator`, `comparand` | `true_branch`, `false_branch` |
| **Switch** | Multi-way branching | `value`, `cases` | `case_outputs[]` |
| **Loop** | Iterate over collection | `items: any[]` | `item`, `index` |
| **Batch** | Process items in batch | `items`, `batch_size` | `batches` |
| **Merge** | Merge multiple inputs | `inputs[]` | `merged` |
| **Split** | Split input | `input`, `criteria` | `outputs[]` |
| **Delay** | Add delay between operations | `input`, `delay_ms` | `output` |
| **Gate** | Pass-through with enable | `input`, `enabled` | `output` |

### 5.7 Integration Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **MCPToolCall** | Call module workflow via MCP | `tool_name`, `params` | `result` |
| **RAGQuery** | Query project knowledge base | `query`, `filters` | `results`, `sources` |
| **WebhookTrigger** | Trigger external webhook | `url`, `payload`, `method` | `response` |
| **A2ATask** | Delegate to another agent | `agent_id`, `task` | `result` |
| **HTTPRequest** | Generic HTTP request | `url`, `method`, `headers`, `body` | `response` |
| **DatabaseQuery** | Query database | `query`, `params` | `results` |
| **StorageUpload** | Upload to cloud storage | `file`, `path`, `bucket` | `url` |
| **StorageDownload** | Download from storage | `url` | `file` |
| **EmailSend** | Send email | `to`, `subject`, `body`, `attachments` | `status` |
| **SlackPost** | Post to Slack | `channel`, `message`, `attachments` | `status` |

### 5.8 Output Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **ImageOutput** | Export generated images | `image`, `format`, `quality` | File download |
| **VideoOutput** | Export generated videos | `video`, `format`, `quality` | File download |
| **BatchExport** | Batch export for e-commerce | `items`, `naming_pattern`, `format` | Zip download |
| **PublishToGallery** | Share to community | `workflow`, `title`, `description` | `gallery_url` |
| **SaveToProject** | Save to project assets | `media`, `name`, `folder` | `asset_id` |
| **Preview** | In-canvas preview | `media` | Visual display |
| **Watermark** | Add watermark and export | `media`, `watermark`, `position` | `media` |

### 5.9 Utility Nodes

| Node | Purpose | Inputs | Outputs |
|------|---------|--------|---------|
| **Note** | Add notes/comments | None | None (visual only) |
| **Group** | Group nodes visually | Nodes | Grouped nodes |
| **Reroute** | Clean up connections | `input` | `output` |
| **Seed** | Set random seed | `seed` | `seed` |
| **Debug** | Debug output | `value` | Console log |
| **Timer** | Measure execution time | `input` | `output`, `duration` |

---

## 6. Canvas Agent Architecture (Agno-Based)

### Agent Definition

```python
from agno.agent import Agent
from agno.models.anthropic import Claude

# VALIDATED: Correct Agno API structure per Context7/DeepWiki
canvas_agent = Agent(
    name="Artie",
    role="Visual Content Workflow Specialist",
    description="""
    Artie is a specialized agent for building visual content generation workflows.
    He helps users create, modify, and execute node-based workflows on an infinite canvas
    for generating images, videos, and marketing assets.
    """,
    instructions=[
        "You help users build visual content generation workflows on an infinite canvas.",
        "",
        "CAPABILITIES:",
        "- Add, connect, configure, and delete nodes",
        "- Execute workflows and show previews",
        "- Load and save templates",
        "- Query the project's RAG knowledge base for brand consistency",
        "- Suggest optimal workflows based on user goals",
        "",
        "GUIDELINES:",
        "- Always explain what you're doing step by step",
        "- Offer previews before batch execution",
        "- Use the project's brand guidelines from RAG",
        "- Suggest efficiency improvements",
        "- Warn about potentially expensive operations",
        "",
        "HANDOFF:",
        "- For complex module integrations, delegate to Bond/Wendy/Morgan",
        "- For chatbot integration, delegate to the Chatbot Agent",
        "- For voice integration, delegate to the Voice Agent",
    ],
    tools=[
        # Canvas manipulation
        AddNodeTool(),
        ConnectNodesTool(),
        UpdateNodeTool(),
        DeleteNodeTool(),
        GetCanvasStateTool(),
        SelectNodesTool(),
        GroupNodesTool(),

        # Execution
        ExecuteWorkflowTool(),
        ExecuteNodeTool(),
        PreviewNodeTool(),
        StopExecutionTool(),

        # Templates
        LoadTemplateTool(),
        SaveTemplateTool(),
        BrowseTemplatesTool(),
        ForkTemplateTool(),

        # RAG (shared)
        QueryKnowledgeBaseTool(),
        GetBrandGuidelinesTool(),
        SearchProductCatalogTool(),

        # Project
        SaveToProjectTool(),
        LoadFromProjectTool(),
        ExportWorkflowTool(),
    ],
    # CORRECTED: Use Claude class with proper model ID format
    model=Claude(id="claude-sonnet-4-5-20250929"),
)
```

### Tool Definitions

#### Canvas Manipulation Tools

```python
class AddNodeTool(Tool):
    name = "add_node"
    description = "Add a new node to the canvas"

    parameters = {
        "type": "object",
        "properties": {
            "node_type": {
                "type": "string",
                "description": "Type of node to add (e.g., 'TextToImage', 'RemoveBackground')"
            },
            "position": {
                "type": "object",
                "properties": {
                    "x": {"type": "number"},
                    "y": {"type": "number"}
                },
                "description": "Position on canvas. If omitted, auto-position near last node."
            },
            "config": {
                "type": "object",
                "description": "Initial configuration for the node"
            },
            "label": {
                "type": "string",
                "description": "Optional display label for the node"
            }
        },
        "required": ["node_type"]
    }

    async def execute(self, node_type: str, position: dict = None,
                     config: dict = None, label: str = None) -> dict:
        # Implementation calls canvas state manager
        node_id = await canvas_manager.add_node(
            node_type=node_type,
            position=position or auto_position(),
            config=config or {},
            label=label
        )
        return {"node_id": node_id, "status": "created"}


class ConnectNodesTool(Tool):
    name = "connect_nodes"
    description = "Connect two nodes by their ports"

    parameters = {
        "type": "object",
        "properties": {
            "source_node_id": {"type": "string"},
            "source_port": {"type": "string", "description": "Output port name"},
            "target_node_id": {"type": "string"},
            "target_port": {"type": "string", "description": "Input port name"}
        },
        "required": ["source_node_id", "source_port", "target_node_id", "target_port"]
    }

    async def execute(self, source_node_id: str, source_port: str,
                     target_node_id: str, target_port: str) -> dict:
        # Validate connection types match
        validation = await canvas_manager.validate_connection(
            source_node_id, source_port,
            target_node_id, target_port
        )

        if not validation.valid:
            return {"status": "error", "message": validation.error}

        edge_id = await canvas_manager.connect_nodes(
            source_node_id, source_port,
            target_node_id, target_port
        )
        return {"edge_id": edge_id, "status": "connected"}


class ExecuteWorkflowTool(Tool):
    name = "execute_workflow"
    description = "Execute the current workflow or a subset of nodes"

    parameters = {
        "type": "object",
        "properties": {
            "node_ids": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Specific nodes to execute. If omitted, executes entire workflow."
            },
            "preview_only": {
                "type": "boolean",
                "default": False,
                "description": "If true, only generate previews without full processing"
            }
        }
    }

    async def execute(self, node_ids: list = None, preview_only: bool = False) -> dict:
        execution_id = await workflow_executor.execute(
            node_ids=node_ids,
            preview_only=preview_only
        )
        return {
            "execution_id": execution_id,
            "status": "started",
            "message": "Workflow execution started. I'll notify you when it completes."
        }
```

### Conversation Examples

**Example 1: Creating a Product Image Workflow**

```
User: "I need to create product images for my new sneaker line"

Artie: I'll help you set up a product image workflow. Let me check your brand
guidelines first.

[Calls QueryKnowledgeBaseTool with "brand guidelines sneaker"]

Based on your brand guidelines, I see you prefer:
- Clean white backgrounds
- High contrast lighting
- Your signature blue accent color (#0066CC)

I'll create a workflow for professional product images:

[Calls AddNodeTool: ProductPhotos node]
[Calls AddNodeTool: RemoveBackground node]
[Calls AddNodeTool: StyleTransfer node with brand_style config]
[Calls AddNodeTool: Upscale node at 4x]
[Calls AddNodeTool: BatchExport node]
[Calls ConnectNodesTool for each connection]

Done! I've set up this workflow:
📷 ProductPhotos → 🎭 RemoveBackground → 🎨 BrandStyle → 🔍 4x Upscale → 📦 BatchExport

Upload your sneaker photos to the ProductPhotos node (3 angles + 2 usage
scenarios work best). Want me to run a preview with a single image first?
```

**Example 2: Modifying an Existing Workflow**

```
User: "Add an upscaler before the export, and change the output to WebP format"

Artie: [Calls GetCanvasStateTool to see current workflow]

I see your current workflow ends with:
... → StyleTransfer → BatchExport

I'll add an upscaler between them and update the export format:

[Calls AddNodeTool: Upscale node, positioned between StyleTransfer and BatchExport]
[Calls DeleteEdge: StyleTransfer → BatchExport]
[Calls ConnectNodesTool: StyleTransfer → Upscale]
[Calls ConnectNodesTool: Upscale → BatchExport]
[Calls UpdateNodeTool: BatchExport config to format="webp", quality=90]

Updated! Your workflow now includes:
... → StyleTransfer → 🔍 4x Upscale → 📦 BatchExport (WebP, 90% quality)

This will increase output resolution by 4x while keeping file sizes reasonable
with WebP compression. Ready to run?
```

---

## 7. Integration with Existing Platform Components

### 7.1 Module Integration (MCP)

Canvas workflows can call Module workflows via MCP tools:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CANVAS → MODULE INTEGRATION (MCP)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CANVAS WORKFLOW                          MODULE WORKFLOW                    │
│  ═════════════════                        ═══════════════                    │
│                                                                              │
│  ┌──────────────┐                         ┌──────────────────────────────┐  │
│  │ ProductPhotos│                         │ product-description-generator │  │
│  └──────┬───────┘                         │ (BMB Module Workflow)         │  │
│         │                                 └──────────────┬───────────────┘  │
│         ▼                                                │                   │
│  ┌──────────────┐     MCP Tool Call                      │                   │
│  │ MCPToolCall  │─────────────────────────────────────────►                  │
│  │ "generate-   │     Request: {product_id, images}      │                   │
│  │  description"│◄─────────────────────────────────────────                  │
│  └──────┬───────┘     Response: {title, description,     │                   │
│         │                        features, keywords}     │                   │
│         ▼                                                                    │
│  ┌──────────────┐                                                           │
│  │ CopyWrite    │  ← Uses description from module                           │
│  │ (Generate    │                                                           │
│  │  ad copy)    │                                                           │
│  └──────┬───────┘                                                           │
│         ▼                                                                    │
│  ┌──────────────┐                                                           │
│  │ TextOverlay  │  ← Overlays copy on product image                         │
│  └──────────────┘                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Chatbot Integration

Chatbots can trigger Canvas workflows and receive generated assets:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHATBOT → CANVAS INTEGRATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CUSTOMER CONVERSATION                    CANVAS WORKFLOW                    │
│  ════════════════════                     ═══════════════                    │
│                                                                              │
│  Customer: "Can you show me what                                             │
│             the red version looks like?"                                     │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐     Trigger via MCP     ┌──────────────────────────────┐  │
│  │ Chatbot      │─────────────────────────►│ product-color-variant        │  │
│  │ MCPToolCall  │                          │ (Canvas Workflow)            │  │
│  │ "generate-   │                          │                              │  │
│  │  color-      │                          │  LoadProduct → ColorChange   │  │
│  │  variant"    │                          │       → Preview → Return     │  │
│  └──────────────┘◄─────────────────────────│                              │  │
│         │         Returns: image_url       └──────────────────────────────┘  │
│         ▼                                                                    │
│  Chatbot: "Here's the red version!                                          │
│           [Shows generated image]                                            │
│           Would you like to order this?"                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Voice Agent Integration

Voice agents can reference Canvas outputs:

```
Voice Agent: "I've generated those product images you requested.
              They're now available in your project gallery.
              Would you like me to email them to you, or shall I
              schedule them for your social media posts?"
```

### 7.4 RAG Integration

Canvas workflows can query the project's knowledge base:

| Use Case | RAG Query | Result Usage |
|----------|-----------|--------------|
| Brand consistency | "brand colors and fonts" | Configure StyleTransfer node |
| Product info | "product SKU-123 details" | Feed to CopyWrite node |
| Style references | "approved image styles" | Reference for generation |
| Compliance | "image guidelines regulations" | Validation before export |

### 7.5 Marketplace Integration

Canvas workflows can be published to the platform marketplace:

```typescript
interface CanvasMarketplaceItem {
  id: string;
  type: 'canvas_workflow';
  title: string;
  description: string;
  thumbnail: string;
  category: 'e-commerce' | 'social-media' | 'video' | 'marketing' | 'art';

  // Workflow data
  workflow: CanvasWorkflowJSON;

  // Marketplace fields
  price: number | 'free';
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  stats: {
    downloads: number;
    forks: number;
    rating: number;
    reviews: number;
  };

  // Requirements
  requiredNodes: string[];
  requiredProviders: string[];  // e.g., ['openai', 'runway']
  estimatedCost: {
    perRun: number;
    currency: 'USD';
  };
}
```

---

## 8. State Management Architecture

### Zustand Store Structure

```typescript
interface CanvasStore {
  // Canvas State
  canvas: {
    id: string;
    projectId: string;
    name: string;
    nodes: Record<string, CanvasNode>;
    edges: Record<string, CanvasEdge>;
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };

  // Execution State
  execution: {
    status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
    currentNodeId: string | null;
    progress: Record<string, NodeExecutionState>;
    results: Record<string, any>;
    errors: Record<string, Error>;
    startTime: number | null;
    endTime: number | null;
  };

  // Selection State
  selection: {
    nodeIds: string[];
    edgeIds: string[];
  };

  // History (for undo/redo)
  history: {
    past: CanvasSnapshot[];
    future: CanvasSnapshot[];
  };

  // UI State
  ui: {
    sidebarOpen: boolean;
    nodeLibraryOpen: boolean;
    previewPanelOpen: boolean;
    selectedPreview: string | null;
  };

  // Actions
  actions: {
    // Node operations
    addNode: (type: string, position?: Position, config?: any) => string;
    updateNode: (id: string, updates: Partial<CanvasNode>) => void;
    deleteNode: (id: string) => void;
    duplicateNode: (id: string) => string;

    // Edge operations with DAG enforcement (CRITICAL: ReactFlow doesn't enforce DAG natively)
    addEdge: (source: string, sourcePort: string, target: string, targetPort: string) => string;
    deleteEdge: (id: string) => void;

    // DAG validation (REQUIRED - ReactFlow allows cycles by default)
    validateConnection: (connection: Connection) => boolean;
    wouldCreateCycle: (source: string, target: string) => boolean;

    // Selection
    selectNodes: (ids: string[]) => void;
    selectAll: () => void;
    clearSelection: () => void;

    // Viewport
    setViewport: (viewport: Viewport) => void;
    fitToScreen: () => void;
    zoomToNode: (id: string) => void;

    // Execution
    execute: (nodeIds?: string[]) => Promise<void>;
    pause: () => void;
    resume: () => void;
    stop: () => void;

    // History
    undo: () => void;
    redo: () => void;

    // Persistence
    save: () => Promise<void>;
    load: (workflowId: string) => Promise<void>;
    export: (format: 'json' | 'png') => Promise<Blob>;
  };
}

interface CanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
    inputs: Record<string, PortDefinition>;
    outputs: Record<string, PortDefinition>;
  };
  selected: boolean;
  dragging: boolean;
}

interface CanvasEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  animated: boolean;  // True when data is flowing
  data: {
    dataType: string;
  };
}

interface NodeExecutionState {
  status: 'pending' | 'running' | 'completed' | 'error' | 'skipped';
  startTime?: number;
  endTime?: number;
  progress?: number;  // 0-100
  message?: string;
  cached: boolean;
}
```

### DAG Enforcement (CRITICAL - VALIDATED via DeepWiki)

> ⚠️ **ReactFlow does NOT enforce DAG natively.** Per DeepWiki validation of xyflow/xyflow: "React Flow itself does not enforce a strict Directed Acyclic Graph (DAG) architecture. While it is commonly used to build DAGs, the library allows for arbitrary connections between nodes, including cycles."

**Required Implementation:**

```typescript
// Cycle detection using DFS - REQUIRED for execution engine to work
function wouldCreateCycle(
  nodes: Record<string, CanvasNode>,
  edges: Record<string, CanvasEdge>,
  newSourceId: string,
  newTargetId: string
): boolean {
  // Build adjacency list including the proposed new edge
  const adjacency = new Map<string, Set<string>>();

  // Initialize with existing edges
  Object.values(edges).forEach(edge => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, new Set());
    }
    adjacency.get(edge.source)!.add(edge.target);
  });

  // Add the proposed edge
  if (!adjacency.has(newSourceId)) {
    adjacency.set(newSourceId, new Set());
  }
  adjacency.get(newSourceId)!.add(newTargetId);

  // DFS to detect cycle - check if we can reach newSourceId from newTargetId
  const visited = new Set<string>();
  const stack = [newTargetId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === newSourceId) {
      return true; // Cycle detected!
    }
    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = adjacency.get(current);
    if (neighbors) {
      neighbors.forEach(neighbor => stack.push(neighbor));
    }
  }

  return false;
}

// Use with ReactFlow's isValidConnection prop
const isValidConnection = (connection: Connection): boolean => {
  // Type checking
  const sourceNode = nodes[connection.source];
  const targetNode = nodes[connection.target];
  const sourcePort = sourceNode.data.outputs[connection.sourceHandle!];
  const targetPort = targetNode.data.inputs[connection.targetHandle!];

  if (sourcePort.dataType !== targetPort.dataType) {
    return false; // Type mismatch
  }

  // Cycle detection (CRITICAL)
  if (wouldCreateCycle(nodes, edges, connection.source, connection.target)) {
    return false; // Would create cycle
  }

  return true;
};
```

### Execution Engine

```typescript
class WorkflowExecutor {
  private store: CanvasStore;
  private nodeExecutors: Record<string, NodeExecutor>;
  private cache: ExecutionCache;

  async execute(nodeIds?: string[]): Promise<ExecutionResult> {
    const { nodes, edges } = this.store.canvas;

    // 1. Build dependency graph
    const graph = this.buildDependencyGraph(nodes, edges);

    // 2. Topological sort
    const executionOrder = this.topologicalSort(graph, nodeIds);

    // 3. Check cache for unchanged nodes (ComfyUI pattern)
    const nodesToExecute = this.filterCachedNodes(executionOrder);

    // 4. Execute in order
    for (const nodeId of nodesToExecute) {
      const node = nodes[nodeId];
      const executor = this.nodeExecutors[node.type];

      // Update status
      this.store.execution.currentNodeId = nodeId;
      this.store.execution.progress[nodeId] = { status: 'running', startTime: Date.now() };

      try {
        // Gather inputs from connected nodes
        const inputs = this.gatherInputs(nodeId, edges);

        // Execute node
        const result = await executor.execute(node.data.config, inputs);

        // Cache result
        this.cache.set(nodeId, node.data.config, inputs, result);

        // Store result
        this.store.execution.results[nodeId] = result;
        this.store.execution.progress[nodeId] = {
          status: 'completed',
          endTime: Date.now(),
          cached: false
        };

      } catch (error) {
        this.store.execution.progress[nodeId] = { status: 'error' };
        this.store.execution.errors[nodeId] = error;
        throw error;
      }
    }

    return {
      status: 'completed',
      results: this.store.execution.results
    };
  }

  private filterCachedNodes(nodeIds: string[]): string[] {
    return nodeIds.filter(nodeId => {
      const node = this.store.canvas.nodes[nodeId];
      const inputs = this.gatherInputs(nodeId, this.store.canvas.edges);
      return !this.cache.isValid(nodeId, node.data.config, inputs);
    });
  }
}
```

---

## 9. Workflow Execution Engine

### Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW EXECUTION ENGINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. GRAPH ANALYSIS                                                           │
│  ═════════════════                                                           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                              │
│  │ Parse    │───►│ Validate │───►│ Build    │                              │
│  │ Canvas   │    │ Connections  │ │ DAG      │                              │
│  │ State    │    │ & Types  │    │          │                              │
│  └──────────┘    └──────────┘    └──────────┘                              │
│                                                                              │
│  2. DEPENDENCY RESOLUTION                                                    │
│  ═════════════════════════                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                              │
│  │ Topological  │───►│ Check    │───►│ Determine│                              │
│  │ Sort     │    │ Cache    │    │ Execution│                              │
│  │          │    │ Validity │    │ Set      │                              │
│  └──────────┘    └──────────┘    └──────────┘                              │
│                                                                              │
│  3. PARALLEL EXECUTION                                                       │
│  ══════════════════════                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │    ┌───┐     ┌───┐                                                 │   │
│  │    │ A │     │ B │    ← Independent nodes run in parallel          │   │
│  │    └─┬─┘     └─┬─┘                                                 │   │
│  │      │         │                                                   │   │
│  │      └────┬────┘                                                   │   │
│  │           ▼                                                        │   │
│  │         ┌───┐                                                      │   │
│  │         │ C │         ← Dependent node waits for inputs           │   │
│  │         └─┬─┘                                                      │   │
│  │           │                                                        │   │
│  │           ▼                                                        │   │
│  │         ┌───┐                                                      │   │
│  │         │ D │         ← Sequential when required                  │   │
│  │         └───┘                                                      │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  4. RESULT CACHING                                                           │
│  ═════════════════                                                           │
│  • Cache key: hash(node_type + config + input_values)                       │
│  • Skip execution if cache hit                                              │
│  • Invalidate downstream when upstream changes                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Provider Abstraction

```typescript
interface AIProvider {
  name: string;
  capabilities: string[];  // ['text-to-image', 'image-to-video', etc.]

  // Provider-specific configuration
  config: {
    apiKey: string;
    baseUrl?: string;
    rateLimit?: number;
  };

  // Execute a generation task
  execute(task: GenerationTask): Promise<GenerationResult>;

  // Estimate cost before execution
  estimateCost(task: GenerationTask): CostEstimate;

  // Check availability/quota
  checkQuota(): Promise<QuotaStatus>;
}

// Provider implementations
class FluxProvider implements AIProvider { /* ... */ }
class RunwayProvider implements AIProvider { /* ... */ }
class MidjourneyProvider implements AIProvider { /* ... */ }
class DeepgramProvider implements AIProvider { /* ... */ }

// Provider registry
const providers: Record<string, AIProvider> = {
  'flux': new FluxProvider(config.flux),
  'runway': new RunwayProvider(config.runway),
  'midjourney': new MidjourneyProvider(config.midjourney),
  // ...
};
```

### Provider Licensing Matrix (VALIDATED via DeepWiki)

> ⚠️ **Critical: Review licensing before commercial use**

| Provider | Model | License | Commercial Use | Notes |
|----------|-------|---------|----------------|-------|
| **FLUX** | Schnell | Apache 2.0 | ✅ Free | 1-4 inference steps, fast |
| **FLUX** | Dev | Non-Commercial | ❌ Requires paid license | 20-50 inference steps, high quality |
| **FLUX** | Pro | Proprietary | ✅ Via API pricing | API-only, highest quality |
| **FLUX** | Fill/Canny/Depth | Non-Commercial | ❌ Requires paid license | Specialized [dev] variants |
| **Runway** | Gen-4 | Proprietary | ✅ Via API pricing | Image-to-video, text-to-video |
| **Runway** | Gen-4.5 | Proprietary | ✅ Via API pricing | Coming to API soon |
| **ElevenLabs** | All | Proprietary | ✅ Via API pricing | Industry standard TTS |
| **Meshy** | Meshy 6 | Proprietary | ✅ Via API pricing | 3D generation with quad topology |

**FLUX Licensing Enforcement (VALIDATED via DeepWiki):**
- For commercial use of `FLUX.1 [dev]` models, usage tracking is **mandatory**
- Requires `BFL_API_KEY` environment variable
- Must enable tracking via CLI flag (`--track_usage`)
- The `track_usage_via_api` function reports usage to BFL API

> **Midjourney Warning:** No official API exists. Third-party solutions (ImagineAPI, etc.) violate Midjourney's TOS. Use at your own legal risk.

### Cost Estimation

> ⚠️ **Reality Check (from Validation):** Most AI providers do NOT offer pre-execution cost estimation APIs. FLUX, Runway, and others use fixed or credit-based pricing. The `estimateCost` approach below uses **static pricing tables** rather than dynamic API calls.

```typescript
interface CostEstimate {
  provider: string;
  operation: string;
  estimatedCost: number;
  currency: 'USD';
  breakdown: {
    compute?: number;
    storage?: number;
    api?: number;
  };
  confidence: 'exact' | 'estimated' | 'unknown';
}

// Static pricing table (updated periodically, not real-time)
const PROVIDER_PRICING: Record<string, Record<string, number>> = {
  flux: {
    'text-to-image-schnell': 0.003,  // per image
    'text-to-image-dev': 0.025,      // per image
    'text-to-image-pro': 0.055,      // per image (via API)
  },
  runway: {
    'image-to-video-5s': 0.25,       // per 5 seconds
    'image-to-video-10s': 0.50,      // per 10 seconds
    'text-to-video-5s': 0.25,
  },
  elevenlabs: {
    'tts-per-1k-chars': 0.30,        // per 1000 characters
  },
  'real-esrgan': {
    'upscale-4x': 0.00,              // free (local execution)
  },
};

async function estimateWorkflowCost(workflow: CanvasWorkflow): Promise<WorkflowCostEstimate> {
  const estimates: CostEstimate[] = [];

  for (const node of Object.values(workflow.nodes)) {
    const executor = nodeExecutors[node.type];
    if (executor.estimateCost) {
      estimates.push(await executor.estimateCost(node.data.config));
    }
  }

  return {
    total: estimates.reduce((sum, e) => sum + e.estimatedCost, 0),
    currency: 'USD',
    breakdown: estimates,
    warnings: estimates.filter(e => e.confidence === 'unknown')
  };
}
```

---

## 10. Community & Marketplace Features

### Public Gallery (TapTV-style)

```typescript
interface GalleryItem {
  id: string;
  type: 'workflow' | 'template' | 'output';

  // Content
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  category: string;

  // Workflow data (if type is workflow/template)
  workflow?: CanvasWorkflowJSON;

  // Output data (if type is output)
  outputs?: {
    images?: string[];
    videos?: string[];
  };

  // Author
  author: {
    id: string;
    username: string;
    avatar: string;
  };

  // Engagement
  stats: {
    views: number;
    likes: number;
    forks: number;
    comments: number;
  };

  // Visibility
  visibility: 'public' | 'unlisted' | 'private';

  // Licensing
  license: 'cc0' | 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'proprietary';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### Workflow Forking

```typescript
async function forkWorkflow(workflowId: string, userId: string): Promise<string> {
  const original = await getWorkflow(workflowId);

  const forked = {
    ...original,
    id: generateId(),
    name: `${original.name} (Fork)`,
    author: userId,
    forkedFrom: {
      id: original.id,
      author: original.author,
      name: original.name
    },
    stats: {
      views: 0,
      likes: 0,
      forks: 0,
      comments: 0
    },
    visibility: 'private',  // Start as private
    createdAt: new Date().toISOString()
  };

  await saveWorkflow(forked);

  // Increment fork count on original
  await incrementForkCount(workflowId);

  return forked.id;
}
```

### Template Marketplace

| Category | Description | Example Templates |
|----------|-------------|-------------------|
| **E-commerce** | Product photography workflows | Product on White, Lifestyle Shot, 360 Spin |
| **Social Media** | Platform-optimized content | Instagram Reel, TikTok Ad, YouTube Thumbnail |
| **Marketing** | Advertising assets | Banner Ad Suite, Email Header, Landing Page Hero |
| **Video** | Video production | Product Demo, Explainer Intro, Social Clip |
| **Art** | Creative generation | Portrait Style, Landscape Art, Abstract |

---

## 11. RAG Integration Patterns

### Knowledge Base Queries from Canvas

```typescript
// RAG query node configuration
interface RAGQueryNodeConfig {
  query: string;  // Can include variables: "{{product_name}} brand guidelines"
  filters?: {
    documentTypes?: string[];
    dateRange?: { start: string; end: string };
    tags?: string[];
  };
  maxResults?: number;
  minConfidence?: number;
}

// Example usage in workflow
const brandGuidelinesNode = {
  type: 'RAGQuery',
  config: {
    query: "brand colors, fonts, and visual style guidelines",
    filters: {
      documentTypes: ['brand-guidelines', 'style-guide'],
      tags: ['approved', 'current']
    },
    maxResults: 5,
    minConfidence: 0.8
  }
};

// Output feeds into StyleTransfer node
// brandGuidelinesNode.output → styleTransferNode.input.styleReference
```

### Automatic Brand Consistency

```typescript
// Canvas Agent automatically queries RAG for brand context
async function ensureBrandConsistency(workflow: CanvasWorkflow): Promise<void> {
  // Find all style-related nodes
  const styleNodes = Object.values(workflow.nodes).filter(
    n => ['StyleTransfer', 'ColorGrade', 'TextOverlay'].includes(n.type)
  );

  if (styleNodes.length === 0) return;

  // Query RAG for brand guidelines
  const brandInfo = await ragQuery({
    query: "brand visual identity guidelines colors fonts",
    projectId: workflow.projectId
  });

  // Auto-configure nodes with brand settings
  for (const node of styleNodes) {
    if (node.type === 'StyleTransfer' && !node.data.config.styleReference) {
      node.data.config.styleReference = brandInfo.styleGuide;
    }
    if (node.type === 'ColorGrade' && !node.data.config.colorPalette) {
      node.data.config.colorPalette = brandInfo.colors;
    }
    if (node.type === 'TextOverlay' && !node.data.config.font) {
      node.data.config.font = brandInfo.primaryFont;
    }
  }
}
```

---

## 12. Security Considerations

### Input Validation

| Node Type | Validation Rules |
|-----------|------------------|
| **TextPrompt** | Max length, sanitize HTML, block injection patterns |
| **ImageUpload** | File type validation, size limits, malware scan |
| **URLInput** | URL validation, domain allowlist, content verification |
| **HTTPRequest** | SSRF protection, timeout limits, response size limits |
| **MCPToolCall** | Authorization check, parameter validation |

### Execution Sandboxing

```typescript
interface ExecutionSandbox {
  // Resource limits
  maxExecutionTime: number;  // ms
  maxMemory: number;  // bytes
  maxOutputSize: number;  // bytes

  // Network restrictions
  allowedDomains: string[];
  blockedPorts: number[];

  // File system
  tempDirectory: string;
  maxTempSize: number;

  // Provider restrictions
  allowedProviders: string[];
  maxCostPerExecution: number;
}

// Default sandbox configuration
const defaultSandbox: ExecutionSandbox = {
  maxExecutionTime: 300000,  // 5 minutes
  maxMemory: 4 * 1024 * 1024 * 1024,  // 4GB
  maxOutputSize: 500 * 1024 * 1024,  // 500MB
  allowedDomains: ['api.openai.com', 'api.runwayml.com', /* ... */],
  blockedPorts: [22, 23, 25, 3306, 5432],
  tempDirectory: '/tmp/canvas-execution',
  maxTempSize: 10 * 1024 * 1024 * 1024,  // 10GB
  allowedProviders: ['flux', 'runway', 'openai'],
  maxCostPerExecution: 10.00  // USD
};
```

### Content Moderation

```typescript
interface ContentModerationConfig {
  // Pre-generation prompt check
  promptModeration: {
    enabled: boolean;
    provider: 'openai' | 'perspective' | 'custom';
    blockCategories: string[];  // ['violence', 'adult', 'hate', etc.]
  };

  // Post-generation output check
  outputModeration: {
    enabled: boolean;
    provider: 'aws-rekognition' | 'google-vision' | 'custom';
    blockCategories: string[];
  };

  // Watermarking for AI-generated content
  watermarking: {
    enabled: boolean;
    type: 'visible' | 'invisible' | 'both';
  };
}
```

---

## 13. Performance Optimization

### Caching Strategy

| Cache Level | Scope | TTL | Storage |
|-------------|-------|-----|---------|
| **Node Output** | Per-execution | Session | Memory |
| **Model Weights** | Per-provider | 24 hours | Disk |
| **Generated Assets** | Per-project | 7 days | Object Storage |
| **Thumbnails** | Per-asset | 30 days | CDN |

### Parallel Execution

```typescript
async function executeParallelNodes(
  nodes: CanvasNode[],
  inputs: Record<string, any>
): Promise<Record<string, any>> {
  // Group nodes by dependency level
  const levels = groupByDependencyLevel(nodes);

  const results: Record<string, any> = { ...inputs };

  for (const level of levels) {
    // Execute all nodes in this level in parallel
    const levelResults = await Promise.all(
      level.map(node => executeNode(node, results))
    );

    // Merge results
    for (let i = 0; i < level.length; i++) {
      results[level[i].id] = levelResults[i];
    }
  }

  return results;
}
```

### Streaming Previews

```typescript
// Stream preview updates as execution progresses
async function* executeWithPreviews(
  workflow: CanvasWorkflow
): AsyncGenerator<PreviewUpdate> {
  for (const nodeId of executionOrder) {
    yield { type: 'node_start', nodeId };

    const result = await executeNode(nodeId);

    // Generate preview if node outputs media
    if (result.type === 'image' || result.type === 'video') {
      const preview = await generatePreview(result, { maxSize: 512 });
      yield { type: 'preview', nodeId, preview };
    }

    yield { type: 'node_complete', nodeId, result };
  }
}
```

---

## 13.1 Real-Time Collaboration Architecture (Gap Identified)

> **Gap Identified During Validation:** Flora and other competitors offer real-time multiplayer canvas editing (like Figma). This document originally lacked WebSocket/CRDT architecture.

Per the master plan (`technical-collaborative-editing-research-2026-01-21.md`), the recommended approach is **Yjs + Y-Sweet**.

### Recommended Architecture

```typescript
// Yjs CRDT integration for collaborative canvas editing
import * as Y from 'yjs';
import { YSweetProvider } from '@y-sweet/client';

interface CollaborativeCanvasState {
  // Yjs shared types for canvas elements
  nodesMap: Y.Map<CanvasNode>;
  edgesMap: Y.Map<CanvasEdge>;
  viewportDoc: Y.Map<ViewportState>;

  // Awareness (presence) for cursors and selections
  awareness: {
    cursors: Map<string, { x: number; y: number; userId: string }>;
    selections: Map<string, string[]>; // userId -> nodeIds
  };
}

// Y-Sweet provider setup
const ySweetProvider = new YSweetProvider(
  'wss://your-y-sweet-server.com',
  `canvas-${canvasId}`,
  ydoc,
  { awareness }
);

// ReactFlow integration
const CollaborativeCanvas = () => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  // Sync Yjs → ReactFlow
  useEffect(() => {
    const nodesMap = ydoc.getMap<CanvasNode>('nodes');
    const edgesMap = ydoc.getMap<CanvasEdge>('edges');

    nodesMap.observe(() => {
      setNodes(Array.from(nodesMap.values()));
    });

    edgesMap.observe(() => {
      setEdges(Array.from(edgesMap.values()));
    });
  }, []);

  // Sync ReactFlow → Yjs (on user actions)
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    ydoc.transact(() => {
      const nodesMap = ydoc.getMap<CanvasNode>('nodes');
      changes.forEach(change => {
        if (change.type === 'position' && change.dragging === false) {
          const node = nodesMap.get(change.id);
          if (node) {
            nodesMap.set(change.id, { ...node, position: change.position });
          }
        }
      });
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      // ...
    />
  );
};
```

### Presence & Cursors

```typescript
interface PresenceState {
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
  selectedNodes: string[];
}

// Render collaborator cursors
const CollaboratorCursors = () => {
  const [states, setStates] = useState<Map<number, PresenceState>>(new Map());

  useEffect(() => {
    awareness.on('change', () => {
      setStates(new Map(awareness.getStates()));
    });
  }, []);

  return (
    <>
      {Array.from(states.entries()).map(([clientId, state]) => (
        clientId !== ydoc.clientID && state.cursor && (
          <div
            key={clientId}
            className="collaborator-cursor"
            style={{
              transform: `translate(${state.cursor.x}px, ${state.cursor.y}px)`,
              borderColor: state.color,
            }}
          >
            <span>{state.name}</span>
          </div>
        )
      ))}
    </>
  );
};
```

---

## 13.2 Workflow Versioning & Rollback (Gap Identified)

> **Gap Identified During Validation:** No discussion of workflow version history, branching, or rollback capabilities.

### Recommended Schema

```typescript
interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;          // Semantic: major.minor.patch or simple integer
  parentVersionId: string | null;
  snapshot: CanvasWorkflowJSON;
  diff: JsonPatch[];        // jsondiffpatch format for efficient storage
  createdAt: string;
  createdBy: string;
  message: string;          // Commit message
  tags: string[];           // e.g., ['production', 'stable']
}

interface WorkflowVersionHistory {
  workflowId: string;
  currentVersionId: string;
  versions: WorkflowVersion[];
  branches: {
    name: string;
    headVersionId: string;
  }[];
}
```

### Version Operations

```typescript
// Create new version on save
async function saveWorkflowVersion(
  workflowId: string,
  workflow: CanvasWorkflowJSON,
  message: string
): Promise<WorkflowVersion> {
  const currentVersion = await getCurrentVersion(workflowId);
  const diff = jsonDiffPatch.diff(currentVersion?.snapshot || {}, workflow);

  const newVersion: WorkflowVersion = {
    id: generateId(),
    workflowId,
    version: (currentVersion?.version || 0) + 1,
    parentVersionId: currentVersion?.id || null,
    snapshot: workflow,
    diff,
    createdAt: new Date().toISOString(),
    createdBy: getCurrentUserId(),
    message,
    tags: [],
  };

  await db.workflowVersions.insert(newVersion);
  await db.workflows.update(workflowId, { currentVersionId: newVersion.id });

  return newVersion;
}

// Rollback to previous version
async function rollbackToVersion(
  workflowId: string,
  targetVersionId: string
): Promise<WorkflowVersion> {
  const targetVersion = await db.workflowVersions.get(targetVersionId);

  // Create new version with rollback snapshot (don't overwrite history)
  return saveWorkflowVersion(
    workflowId,
    targetVersion.snapshot,
    `Rollback to version ${targetVersion.version}`
  );
}

// Compare two versions
function compareVersions(
  versionA: WorkflowVersion,
  versionB: WorkflowVersion
): {
  nodesAdded: CanvasNode[];
  nodesRemoved: CanvasNode[];
  nodesModified: { before: CanvasNode; after: CanvasNode }[];
  edgesAdded: CanvasEdge[];
  edgesRemoved: CanvasEdge[];
} {
  // Use jsondiffpatch for detailed comparison
  const diff = jsonDiffPatch.diff(versionA.snapshot, versionB.snapshot);
  // ... parse diff into structured changes
}
```

### Database Schema (PostgreSQL)

```sql
CREATE TABLE workflow_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES canvas_workflows(id),
  version INTEGER NOT NULL,
  parent_version_id UUID REFERENCES workflow_versions(id),
  snapshot JSONB NOT NULL,
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  message TEXT,
  tags TEXT[] DEFAULT '{}',

  UNIQUE(workflow_id, version)
);

CREATE INDEX idx_workflow_versions_workflow ON workflow_versions(workflow_id);
CREATE INDEX idx_workflow_versions_created ON workflow_versions(created_at DESC);
```

---

## 14. Recommended MVP Node Set

### Phase 1: Core Nodes (20 nodes, 4-6 weeks)

**Input Nodes (4)**
| Node | Priority | Complexity |
|------|----------|------------|
| TextPrompt | P0 | Low |
| ImageUpload | P0 | Low |
| ProductPhotos | P1 | Medium |
| URLInput | P2 | Low |

**AI Generation Nodes (5)**
| Node | Priority | Complexity |
|------|----------|------------|
| TextToImage | P0 | Medium |
| ImageToImage | P1 | Medium |
| Upscale | P1 | Low |
| RemoveBackground | P0 | Low |
| Inpaint | P2 | Medium |

**Processing Nodes (4)**
| Node | Priority | Complexity |
|------|----------|------------|
| Resize | P0 | Low |
| Crop | P1 | Low |
| ColorGrade | P2 | Medium |
| Composite | P2 | Medium |

**Control Flow Nodes (3)**
| Node | Priority | Complexity |
|------|----------|------------|
| Condition | P1 | Medium |
| Loop | P2 | Medium |
| Batch | P1 | Medium |

**Integration Nodes (2)**
| Node | Priority | Complexity |
|------|----------|------------|
| RAGQuery | P0 | Medium |
| MCPToolCall | P1 | Medium |

**Output Nodes (2)**
| Node | Priority | Complexity |
|------|----------|------------|
| ImageOutput | P0 | Low |
| BatchExport | P1 | Medium |

### Phase 2: Extended Nodes (15 nodes, 4 weeks)

- TextToVideo, ImageToVideo
- SketchInput, SketchToImage
- StyleTransfer, FaceSwap
- CaptionGenerate, TextOverlay, Translate
- VideoTrim, VideoConcat, AddAudio
- HTTPRequest, WebhookTrigger
- PublishToGallery

### Phase 3: Advanced Nodes (10+ nodes, ongoing)

- 3D generation nodes
- Audio generation nodes
- Advanced video editing
- Real-time collaboration nodes
- Custom code execution

---

## 15. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-6)

| Week | Tasks |
|------|-------|
| **1-2** | ReactFlow canvas setup, Zustand store, basic node system |
| **3-4** | Core input/output nodes, execution engine, caching |
| **5-6** | AI generation nodes (TextToImage, Upscale, RemoveBackground) |

### Phase 2: Integration (Weeks 7-10)

| Week | Tasks |
|------|-------|
| **7-8** | Canvas Agent (Artie) implementation, chat integration |
| **9-10** | RAG integration, MCP tool calling, module integration |

### Phase 3: Polish (Weeks 11-14)

| Week | Tasks |
|------|-------|
| **11-12** | Community features (templates, forking, gallery) |
| **13-14** | Marketplace integration, cost estimation, monitoring |

### Phase 4: Production (Weeks 15-18)

| Week | Tasks |
|------|-------|
| **15-16** | Performance optimization, caching improvements |
| **17-18** | Security hardening, content moderation, testing |

---

## 16. Conclusion

The Canvas Builder represents a natural extension of the Hyyve Platform, adding visual content creation capabilities alongside existing Module, Chatbot, and Voice Agent builders. Key architectural decisions:

1. **Unified Chat Interface**: Leverage existing Agno + RAG infrastructure with a dedicated Canvas Agent instead of adding Weavy or another chat SDK.

2. **ReactFlow Foundation**: Consistent with other builders, using the same ReactFlow + Zustand stack.

3. **DAG Execution**: Adopt ComfyUI's partial re-execution pattern for efficient iteration.

4. **Community-First**: TapTV-style public gallery with forking and remixing to drive marketplace adoption.

5. **Multi-Modal Integration**: Canvas workflows can call Module workflows (MCP), feed Chatbots, and integrate with Voice Agents.

The Canvas Builder positions the platform as a comprehensive AI content creation suite, not just a workflow automation tool.

---

## 17. Validation Report

**Validation Date:** January 22, 2026
**Validation Method:** Context7 MCP + DeepWiki MCP
**Validator:** Claude Opus 4.5

### Validation Summary

| Category | Status | Details |
|----------|--------|---------|
| **Overall** | ✅ VALIDATED with corrections | Document is accurate with 3 critical fixes applied |
| **Core Technologies** | ✅ VALIDATED | ReactFlow, Zustand, MCP patterns confirmed |
| **Market Analysis** | ✅ VALIDATED | All 6 platforms verified |
| **Architecture Decisions** | ✅ VALIDATED | Unified chat, dedicated agents confirmed |
| **Code Examples** | 🔧 CORRECTED | Agno model IDs fixed |
| **Licensing** | ⚠️ ENHANCED | Added critical license warnings |

### Critical Corrections Applied

| Issue | Original | Corrected | Source |
|-------|----------|-----------|--------|
| **ReactFlow DAG** | "DAG architecture" implied native | Added explicit cycle detection requirement | DeepWiki: xyflow/xyflow |
| **Agno Model ID** | `model="claude-sonnet-4-20250514"` | `model=Claude(id="claude-sonnet-4-5-20250929")` | Context7: Agno docs |
| **FLUX Licensing** | Not mentioned | Added full licensing matrix with commercial restrictions | DeepWiki: black-forest-labs/flux |
| **Weavy Pricing** | Missing Startup tier | Added $49/mo Startup tier | weavy.com/pricing |
| **NodeTool License** | "Open source" | Added AGPL-3.0 warning for SaaS | GitHub: nodetool-ai/nodetool |

### Gaps Addressed

| Gap | Section Added |
|-----|---------------|
| Real-time collaboration | Section 13.1 - Yjs + Y-Sweet architecture |
| Workflow versioning | Section 13.2 - Version schema and operations |
| DAG enforcement | Section before Execution Engine - Cycle detection code |

### Validated Claims

| Claim | Status | Source |
|-------|--------|--------|
| ReactFlow infinite canvas | ✅ VALIDATED | Context7: `/websites/reactflow_dev` |
| ReactFlow custom nodes/edges/handles | ✅ VALIDATED | Context7: ReactFlow documentation |
| Zustand state management + persistence | ✅ VALIDATED | Context7: `/websites/zustand_pmnd_rs` |
| ComfyUI partial re-execution | ✅ VALIDATED | DeepWiki: `Comfy-Org/ComfyUI` |
| ComfyUI caching strategies | ✅ VALIDATED | DeepWiki: HierarchicalCache, LRUCache, DependencyAwareCache |
| ComfyUI GPL-3.0 license | ✅ VALIDATED | DeepWiki: `Comfy-Org/ComfyUI` |
| Agno Agent/Tool API structure | ✅ VALIDATED | Context7: `/websites/agno` |
| Agno Team delegation patterns | ✅ VALIDATED | Context7: Agno teams documentation |
| MCP tool calling protocol | ✅ VALIDATED | DeepWiki: `modelcontextprotocol/typescript-sdk` |
| Weavy components (WyChat, WyCopilot, etc.) | ✅ VALIDATED | weavy.com/docs |
| TapNow infinite canvas + TapTV | ✅ VALIDATED | docs.tapnow.ai |
| Krea AI 50+ models | ✅ VALIDATED | krea.ai |
| Flora GPT-4/Flux Pro/Runway integration | ✅ VALIDATED | florafauna.ai |
| NodeTool local-first + RAG | ✅ VALIDATED | nodetool.ai, GitHub |
| Fal.ai workflow API | ✅ VALIDATED | fal.ai, docs.fal.ai |
| FLUX text-to-image models | ✅ VALIDATED | DeepWiki: `black-forest-labs/flux` |
| Runway Gen-4 API | ✅ VALIDATED | runwayml.com/api |

### Remaining Recommendations

1. **Cost Estimation Reality Check:** Most AI providers don't have pre-execution cost estimation APIs. Use static pricing tables instead of dynamic estimation.

2. **Content Moderation Latency:** Real-world moderation (AWS Rekognition, Google Vision) adds 200-2000ms latency per image. Consider async moderation queue.

3. **Horizontal Scaling:** Document assumes single-process execution. Consider adding distributed job queue architecture (BullMQ, Celery) for production scale.

---

## References

### Primary Sources

**Visual AI Workflow Platforms**
- [TapNow App](https://app.tapnow.ai/)
- [TapNow Documentation](https://docs.tapnow.ai/en/docs)
- [ComfyUI GitHub](https://github.com/Comfy-Org/ComfyUI)
- [ComfyUI Workflow Docs](https://docs.comfy.org/development/core-concepts/workflow)
- [Krea AI](https://www.krea.ai/)
- [Top 7 Node-Based AI Workflow Apps](https://www.krea.ai/articles/top-node-based-ai-workflow-apps)
- [NodeTool](https://nodetool.ai/)
- [Fal.ai](https://fal.ai/)

**Collaboration SDK**
- [Weavy Homepage](https://www.weavy.com/)
- [Weavy Documentation](https://www.weavy.com/docs)
- [Weavy React Integration](https://www.weavy.com/docs/get-started/react)
- [Weavy Webhooks](https://www.weavy.com/docs/learn/webhooks)
- [Weavy API Reference](https://www.weavy.com/docs/reference/api)

**Framework References**
- [ReactFlow Documentation](https://reactflow.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Agno Documentation](https://docs.agno.com/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

### Validation Sources (Context7 MCP + DeepWiki MCP)
- Context7: `/websites/reactflow_dev` - ReactFlow infinite canvas, custom nodes
- Context7: `/websites/zustand_pmnd_rs` - Zustand state management
- Context7: `/websites/agno` - Agno Agent/Tool API patterns
- DeepWiki: `Comfy-Org/ComfyUI` - Execution engine, caching, GPL-3.0 license
- DeepWiki: `xyflow/xyflow` - ReactFlow core concepts, DAG non-enforcement
- DeepWiki: `black-forest-labs/flux` - FLUX models and licensing
- DeepWiki: `modelcontextprotocol/typescript-sdk` - MCP tool definitions
- DeepWiki: `agno-agi/agno` - Agno Agent class API

### Related Platform Research Documents

- `technical-visual-workflow-builders-research-2026-01-20.md` - ReactFlow patterns
- `technical-chatbot-builder-research-2026-01-22.md` - Node taxonomy patterns
- `technical-integration-layer-research-2026-01-22.md` - MCP/A2A integration
- `technical-conversational-builder-research-2026-01-20.md` - Chat-to-graph patterns
- `technical-mcp-skills-marketplace-research-2026-01-21.md` - Marketplace patterns

---

*Document created: January 22, 2026*
*Document validated: January 22, 2026 (v2.0)*
*Platform: Hyyve Platform*
*Build Type: Canvas Builder (4th type)*

---

## Document Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-22 | Initial research document |
| 2.0 | 2026-01-22 | Comprehensive validation via Context7 MCP + DeepWiki MCP. Added: DAG cycle detection (Section 8), real-time collaboration (Section 13.1), workflow versioning (Section 13.2), validation report (Section 17). Corrected: ReactFlow DAG claims, Agno model IDs, FLUX licensing, Weavy pricing, NodeTool license warnings. |
