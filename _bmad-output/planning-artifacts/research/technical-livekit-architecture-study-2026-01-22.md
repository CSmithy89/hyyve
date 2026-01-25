# LiveKit Agents Architecture Study
## Deep Architectural Analysis for Custom Voice Agent Implementation

**Purpose:** Extract patterns and insights from LiveKit Agents to inform our own custom voice agent implementation. This is NOT an adoption guide - it's a reverse-engineering study.

**Date:** January 2026
**Verified:** 2026-01-22 ✅
**Repository:** [livekit/agents](https://github.com/livekit/agents) (9,105 ⭐ | 2,645 forks | Apache-2.0)

---

## Verification Status

| Claim Category | Verified | Source |
|----------------|----------|--------|
| Turn Detection Model (Qwen2.5-0.5B) | ✅ | DeepWiki, Context7, [LiveKit Blog](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) |
| 39% reduction in false interruptions | ✅ | [LiveKit Blog](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) |
| 13 languages supported | ✅ | Context7, DeepWiki |
| ~400MB RAM requirement | ✅ | Context7, DeepWiki |
| Interruption state machine (4 states) | ✅ | DeepWiki |
| `false_interruption_timeout` default 2.0s | ✅ | DeepWiki |
| Provider abstraction interfaces | ✅ | DeepWiki |
| SIP APIs (`add_sip_participant`, `transfer_sip_participant`) | ✅ | DeepWiki, Context7 |
| MCP integration (`MCPServerHTTP`) | ✅ | Context7 |
| Job/Worker process isolation | ✅ | DeepWiki, [LiveKit Docs](https://docs.livekit.io/agents/server/) |
| Krisp BVC noise cancellation | ✅ | [Krisp Blog](https://krisp.ai/blog/improving-turn-taking-of-ai-voice-agents-with-background-voice-cancellation/), [PyPI](https://pypi.org/project/livekit-plugins-noise-cancellation/) |

**Validation Methods:** DeepWiki MCP, Context7 MCP, GitHub API, Web Search

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Voice Pipeline Architecture](#2-voice-pipeline-architecture)
3. [Turn Detection Deep-Dive](#3-turn-detection-deep-dive)
4. [Interruption Handling State Machine](#4-interruption-handling-state-machine)
5. [Provider Abstraction Interfaces](#5-provider-abstraction-interfaces)
6. [Noise Cancellation Integration](#6-noise-cancellation-integration)
7. [SIP/Twilio Integration Patterns](#7-siptwilio-integration-patterns)
8. [MCP Integration Patterns](#8-mcp-integration-patterns)
9. [Production Infrastructure](#9-production-infrastructure)
10. [What We CAN vs CANNOT Replicate](#10-what-we-can-vs-cannot-replicate)
11. [Recommended Implementation Approach](#11-recommended-implementation-approach)
12. [Effort Estimation](#12-effort-estimation)

---

## 1. Executive Summary

### Key Patterns to Replicate

| Pattern | Priority | Complexity | Replicable? |
|---------|----------|------------|-------------|
| Streaming-first async architecture | Critical | Medium | Yes |
| Semantic turn detection (transformer) | Critical | High | Yes (with training) |
| Preemptive generation | High | Medium | Yes |
| False interruption handling | High | Medium | Yes |
| Provider abstraction layer | High | Low | Yes |
| Audio frame buffering (AudioByteStream) | Critical | Low | Yes |
| Connection pooling for providers | Medium | Low | Yes |
| Job/Worker process isolation | Medium | Medium | Yes |

### Why LiveKit Succeeds

1. **Streaming-First Design:** Every component uses `AsyncIterable` - data flows immediately, not batch-by-batch
2. **Smart Turn Detection:** 39% reduction in false interruptions using a fine-tuned transformer model
3. **Latency Optimization:** Preemptive generation starts LLM/TTS before turn detection completes (note: can cause duplicate LLM requests - see [Issue #4219](https://github.com/livekit/agents/issues/4219))
4. **Graceful Interruption:** State machine handles barge-in with optional resume for false interruptions
5. **Provider Agnosticism:** Clean abstraction allows swapping STT/LLM/TTS without code changes

### Architecture Philosophy

LiveKit chose the **Cascading Pipeline** architecture (STT -> LLM -> TTS) over Speech-to-Speech for:
- Maximum flexibility (swap any component)
- Better TTS quality (ElevenLabs, Cartesia > native S2S voices)
- Debuggable intermediate representations (text is inspectable)
- Predictable costs (~$0.15/minute)

They also support **Realtime Mode** (OpenAI Realtime API, etc.) for lower latency (100-300ms vs 200-500ms) when flexibility isn't critical.

---

## 2. Voice Pipeline Architecture

### ASCII Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              AgentSession                                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-------------+     +---------------+     +-------------+     +---------------+  |
|  |   RoomIO    |     | AudioRecog-   |     |   Agent     |     |  AgentActivity|  |
|  | (WebRTC I/O)|---->|   nition      |---->|  (Logic)    |---->| (Orchestrator)|  |
|  +-------------+     +---------------+     +-------------+     +---------------+  |
|        |                    |                    |                    |           |
|        v                    v                    v                    v           |
|  +-------------+     +---------------+     +-------------+     +---------------+  |
|  | AudioInput  |     |     VAD       |     |    LLM      |     |    TTS        |  |
|  | Stream      |     |   (Silero)    |     |  Provider   |     |   Provider    |  |
|  +-------------+     +---------------+     +-------------+     +---------------+  |
|        |                    |                    |                    |           |
|        v                    v                    v                    v           |
|  +-------------+     +---------------+     +-------------+     +---------------+  |
|  | Noise       |     |     STT       |     |   Tools/    |     | AudioOutput   |  |
|  | Cancellation|     |   Provider    |     |    MCP      |     |   Stream      |  |
|  +-------------+     +---------------+     +-------------+     +---------------+  |
|                             |                                                     |
|                             v                                                     |
|                      +---------------+                                            |
|                      |Turn Detector  |                                            |
|                      | (Transformer) |                                            |
|                      +---------------+                                            |
+-----------------------------------------------------------------------------------+
```

### Pipeline Mode Data Flow

```
User Audio (rtc.AudioFrame)
    |
    v
+-------------------+
| AudioByteStream   |  <- Normalizes to fixed 50-100ms frames
| (Frame Buffering) |
+-------------------+
    |
    +---> VAD (Voice Activity Detection)
    |         |
    |         v
    |     START_OF_SPEECH / END_OF_SPEECH events
    |
    +---> STT Provider (Streaming)
              |
              v
          Interim Transcripts --> Turn Detector
              |                        |
              v                        v
          Final Transcript        End-of-Turn Prediction
              |                        |
              +------------------------+
              |
              v
+-------------------+
| Preemptive Gen?   |  <- Start LLM before turn confirmed
+-------------------+
              |
              v
+-------------------+
| LLM Provider      |  <- Streaming response (ChatChunk)
+-------------------+
              |
              v
+-------------------+
| TTS Provider      |  <- Streaming synthesis (AudioFrame)
+-------------------+
              |
              v
+-------------------+
| Audio Output      |  <- Play to user
+-------------------+
```

### Realtime Mode Data Flow

```
User Audio (rtc.AudioFrame)
    |
    v
+------------------------+
| RealtimeSession        |  <- Single WebSocket to provider
| (OpenAI/Ultravox/etc)  |
+------------------------+
    |
    +--> Audio streamed directly to provider server
    |
    v
Provider Server handles:
  - STT (internal)
  - LLM inference (internal)
  - TTS synthesis (internal)
    |
    v
Events received:
  - input_speech_started
  - input_audio_transcription
  - response.audio.delta
    |
    v
+-------------------+
| Audio Output      |
+-------------------+
```

### Key Design Decisions

1. **AsyncIterable Everywhere:** All I/O uses async iterators for streaming
2. **Frame Normalization:** AudioByteStream converts variable audio chunks to fixed 50-100ms frames
3. **Parallel Processing:** VAD and STT run concurrently on the same audio
4. **Event-Driven:** State changes via events (START_OF_SPEECH, END_OF_SPEECH, transcripts)

---

## 3. Turn Detection Deep-Dive

### The Problem

Traditional VAD-based turn detection causes frequent false positives because:
- VAD only detects silence, not semantic completion
- Natural pauses (thinking, breathing) trigger premature responses
- Results in agents interrupting users mid-sentence

### LiveKit's Solution: Semantic Turn Detection

#### Model Architecture (v0.4.1-intl)

```
Base Model: Qwen2.5-0.5B-Instruct
Parameters: ~500M (distilled from 7B teacher)
Model Size: 281 MB on disk (ONNX quantized)
Inference: ~25ms model inference on CPU
Per-Turn Latency: 50-160ms (includes preprocessing + inference)
RAM: ~400MB (<500MB total with runtime)
Languages: 13 (EN, FR, ES, DE, IT, PT, NL, ZH, JA, KO, ID, RU, TR)
```

> **Clarification (Validated 2026-01-22):** The "~25ms" figure refers to raw model inference time only. Full per-turn latency including preprocessing is 50-160ms according to [LiveKit's benchmarks](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/).

#### Training Approach

1. **Teacher Model:** Qwen2.5-7B-Instruct trained on turn detection task
2. **Knowledge Distillation:** 7B teacher -> 0.5B student
3. **Training Data:**
   - Real call center transcripts
   - Synthetic dialogues with structured data (addresses, emails, phone numbers, credit cards)
   - Varied STT output formats for robustness

#### How It Works

```python
# Pseudocode for turn detection flow

class TurnDetector:
    def __init__(self):
        self.context_window = []  # Last 4 turns
        self.model = load_qwen_0_5b()

    def predict_end_of_turn(self, chat_context: ChatContext) -> float:
        """
        Returns probability (0-1) that user has finished speaking.
        Called on each final transcript from STT.
        """
        # Build context from last 4 turns
        context = self._build_context(chat_context)

        # Run inference (~25ms on CPU)
        probability = self.model.predict(context)

        return probability

    def should_respond(self, probability: float) -> bool:
        """
        Adjusts VAD silence threshold based on probability.
        High confidence = shorter wait time.
        """
        if probability > 0.9:  # Very likely end of turn
            return True  # Respond immediately
        elif probability > 0.7:
            # Reduce silence threshold
            return self._wait_reduced_silence()
        else:
            # Use full VAD silence threshold
            return self._wait_full_silence()
```

#### Performance Results

| Metric | VAD Only | Semantic Turn Detection |
|--------|----------|------------------------|
| False Interruptions | Baseline | -39% (v0.4.1 vs v0.3.0) ✅ |
| Model Inference Time | N/A | ~25ms |
| Per-Turn Latency | N/A | 50-160ms (validated) |
| Accuracy on structured data | Poor | Excellent (emails, phone numbers, credit cards) |

### Replication Approach

1. **Model Selection:** Start with Qwen2.5-0.5B-Instruct or similar small LLM
2. **Training Data Collection:**
   - Record real conversations with turn boundaries labeled
   - Generate synthetic dialogues with GPT-4 for structured data scenarios
   - Include multi-language data if needed
3. **Fine-tuning Task:** Binary classification - "Is this the end of the user's turn?"
4. **Distillation (Optional):** Train larger model first, distill to smaller for inference
5. **Integration:** Run inference on each STT final transcript, adjust endpointing delay

---

## 4. Interruption Handling State Machine

### State Diagram

```
                                    +------------------+
                                    |                  |
                                    v                  |
+----------+    User speaks    +----------+           |
|          |------------------>|          |           |
| IDLE     |                   | LISTENING|           |
|          |<------------------|          |           |
+----------+    Timeout/       +----------+           |
     ^         No speech            |                 |
     |                              | End of turn     |
     |                              | detected        |
     |                              v                 |
     |                        +----------+            |
     |                        |          |            |
     |                        | THINKING |            |
     |                        |          |            |
     |                        +----------+            |
     |                              |                 |
     |                              | LLM response    |
     |                              | + TTS starts    |
     |                              v                 |
     |                        +----------+            |
     |    Speech completes    |          |            |
     +------------------------|  SPEAKING|            |
                              |          |            |
                              +----------+            |
                                   |  ^               |
                                   |  |               |
             User interruption     |  | Resume        |
             detected (VAD/STT)    |  | (false int)   |
                                   v  |               |
                              +----------+            |
                              |  PAUSED  |------------+
                              | (False   |  Confirmed
                              |  Int?)   |  interruption
                              +----------+
```

### Interruption Detection Logic

```python
class InterruptionHandler:
    def __init__(self, config: InterruptionConfig):
        self.min_interruption_duration = config.min_interruption_duration  # e.g., 0.1s
        self.min_interruption_words = config.min_interruption_words  # e.g., 1
        self.false_interruption_timeout = config.false_interruption_timeout  # e.g., 1.0s
        self.resume_false_interruption = config.resume_false_interruption  # True/False

    def on_user_audio_activity(self, event: VADEvent, current_speech: SpeechHandle):
        """Called when VAD detects user speech during agent speaking."""

        if not current_speech.allow_interruptions:
            return  # This speech cannot be interrupted

        # Check minimum duration threshold
        if event.speech_duration < self.min_interruption_duration:
            return  # Too short, ignore

        # Check minimum words threshold (if STT available)
        if self.min_interruption_words > 0:
            if len(event.transcript.split()) < self.min_interruption_words:
                return  # Not enough words

        # Potential interruption detected
        if self.resume_false_interruption:
            # Pause speech, wait to confirm it's real
            self._pause_speech(current_speech)
            self._start_false_interruption_timer()
        else:
            # Immediately interrupt
            self._interrupt_speech(current_speech)

    def _pause_speech(self, speech: SpeechHandle):
        """Pause audio output without canceling generation."""
        speech.pause()
        self.state = "PAUSED"
        self._paused_speech = speech

    def _interrupt_speech(self, speech: SpeechHandle):
        """Cancel generation and update context."""
        speech.interrupt()

        # Record partial response in chat context
        self.chat_context.add_message(
            role="assistant",
            content=speech.text_spoken_so_far,
            interrupted=True
        )

        self.state = "LISTENING"

    def on_false_interruption_timeout(self):
        """Called when pause timer expires without more user speech."""
        if self._paused_speech and self.resume_false_interruption:
            self._paused_speech.resume()
            self.state = "SPEAKING"
            self.emit("false_interruption_resumed")
```

### Context Preservation After Interruption

When interrupted, LiveKit:
1. Records the partial assistant response with `interrupted=True` marker
2. Keeps it in chat context so LLM knows what was said
3. Allows LLM to continue or acknowledge the interruption naturally

```python
# Example chat context after interruption
[
    {"role": "user", "content": "Tell me about the weather"},
    {"role": "assistant", "content": "The weather today is sunny with a high of", "interrupted": True},
    {"role": "user", "content": "Actually, never mind, what time is it?"},
    # LLM sees the interrupted message and can handle gracefully
]
```

---

## 5. Provider Abstraction Interfaces

### STT Interface (Python)

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import AsyncIterable, Optional
import rtc  # LiveKit RTC types

@dataclass
class STTCapabilities:
    streaming: bool = False          # Supports streaming input
    interim_results: bool = False    # Provides partial transcripts
    diarization: bool = False        # Speaker identification
    aligned_transcript: bool = False # Word-level timestamps

@dataclass
class SpeechEvent:
    type: str  # "interim", "final", "start_of_speech", "end_of_speech"
    text: str
    confidence: float
    language: Optional[str] = None
    words: Optional[list] = None  # Word-level details if available

class STT(ABC):
    """Base class for Speech-to-Text providers."""

    def __init__(self):
        self._capabilities: STTCapabilities = STTCapabilities()

    @property
    def capabilities(self) -> STTCapabilities:
        return self._capabilities

    @abstractmethod
    async def recognize(self, audio: rtc.AudioFrame) -> str:
        """Batch recognition for complete audio."""
        pass

    @abstractmethod
    def stream(self) -> "RecognizeStream":
        """Create streaming recognition session."""
        pass

    async def update_options(self, *, language: Optional[str] = None, model: Optional[str] = None):
        """Update runtime options."""
        pass

    async def aclose(self):
        """Cleanup resources."""
        pass

class RecognizeStream(ABC):
    """Streaming STT session."""

    @abstractmethod
    def push_frame(self, frame: rtc.AudioFrame):
        """Push audio frame for recognition."""
        pass

    @abstractmethod
    def end_input(self):
        """Signal end of audio input."""
        pass

    @abstractmethod
    def __aiter__(self) -> AsyncIterable[SpeechEvent]:
        """Iterate over recognition events."""
        pass

    async def aclose(self):
        """Close the stream."""
        pass
```

### TTS Interface (Python)

```python
@dataclass
class TTSCapabilities:
    streaming: bool = False          # Supports streaming synthesis
    word_timestamps: bool = False    # Provides word-level timing

@dataclass
class SynthesizedAudio:
    frame: rtc.AudioFrame
    text: str                        # Text that was synthesized
    word_info: Optional[dict] = None # Word timing if available

class TTS(ABC):
    """Base class for Text-to-Speech providers."""

    def __init__(self, *, sample_rate: int = 24000, num_channels: int = 1):
        self._sample_rate = sample_rate
        self._num_channels = num_channels
        self._capabilities: TTSCapabilities = TTSCapabilities()

    @property
    def sample_rate(self) -> int:
        return self._sample_rate

    @property
    def capabilities(self) -> TTSCapabilities:
        return self._capabilities

    @abstractmethod
    def synthesize(self, text: str) -> "ChunkedStream":
        """Synthesize text as single request."""
        pass

    def stream(self) -> "SynthesizeStream":
        """Create streaming synthesis session."""
        raise NotImplementedError("Streaming not supported")

    async def prewarm(self):
        """Pre-establish connections for lower latency."""
        pass

    async def update_options(self, *, voice: Optional[str] = None, model: Optional[str] = None):
        """Update runtime options."""
        pass

    async def aclose(self):
        """Cleanup resources."""
        pass

class ChunkedStream(ABC):
    """Non-streaming TTS result."""

    @abstractmethod
    def __aiter__(self) -> AsyncIterable[SynthesizedAudio]:
        """Iterate over audio chunks."""
        pass

    async def collect(self) -> rtc.AudioFrame:
        """Collect all audio into single frame."""
        pass

class SynthesizeStream(ABC):
    """Streaming TTS session."""

    @abstractmethod
    def push_text(self, text: str):
        """Push text for synthesis."""
        pass

    def flush(self):
        """Flush buffered text."""
        pass

    def end_input(self):
        """Signal end of text input."""
        pass

    @abstractmethod
    def __aiter__(self) -> AsyncIterable[SynthesizedAudio]:
        """Iterate over audio as it's generated."""
        pass
```

### LLM Interface (Python)

```python
@dataclass
class LLMCapabilities:
    streaming: bool = True
    function_calling: bool = False
    vision: bool = False

@dataclass
class ChatMessage:
    role: str  # "system", "user", "assistant", "tool"
    content: str
    tool_calls: Optional[list] = None
    tool_call_id: Optional[str] = None
    interrupted: bool = False

@dataclass
class ChatChunk:
    """Streaming LLM response chunk."""
    delta: str
    tool_calls: Optional[list] = None
    finish_reason: Optional[str] = None

class LLM(ABC):
    """Base class for LLM providers."""

    @property
    @abstractmethod
    def capabilities(self) -> LLMCapabilities:
        pass

    @abstractmethod
    def chat(
        self,
        chat_ctx: list[ChatMessage],
        tools: Optional[list] = None,
        temperature: float = 0.7,
    ) -> "LLMStream":
        """Start chat completion."""
        pass

    async def aclose(self):
        """Cleanup resources."""
        pass

class LLMStream(ABC):
    """Streaming LLM response."""

    @abstractmethod
    def __aiter__(self) -> AsyncIterable[ChatChunk]:
        """Iterate over response chunks."""
        pass

    async def aclose(self):
        """Cancel and cleanup."""
        pass
```

### TypeScript Interfaces

```typescript
// STT Interface
interface STTCapabilities {
  streaming: boolean;
  interimResults: boolean;
  diarization: boolean;
  alignedTranscript: boolean;
}

interface SpeechEvent {
  type: 'interim' | 'final' | 'start_of_speech' | 'end_of_speech';
  text: string;
  confidence: number;
  language?: string;
  words?: WordInfo[];
}

interface STT {
  capabilities: STTCapabilities;
  recognize(audio: AudioFrame): Promise<string>;
  stream(): RecognizeStream;
  updateOptions(options: { language?: string; model?: string }): Promise<void>;
  close(): Promise<void>;
}

interface RecognizeStream extends AsyncIterable<SpeechEvent> {
  pushFrame(frame: AudioFrame): void;
  endInput(): void;
  close(): Promise<void>;
}

// TTS Interface
interface TTSCapabilities {
  streaming: boolean;
  wordTimestamps: boolean;
}

interface SynthesizedAudio {
  frame: AudioFrame;
  text: string;
  wordInfo?: WordInfo[];
}

interface TTS {
  sampleRate: number;
  numChannels: number;
  capabilities: TTSCapabilities;
  synthesize(text: string): ChunkedStream;
  stream(): SynthesizeStream;
  prewarm(): Promise<void>;
  updateOptions(options: { voice?: string; model?: string }): Promise<void>;
  close(): Promise<void>;
}

interface ChunkedStream extends AsyncIterable<SynthesizedAudio> {
  collect(): Promise<AudioFrame>;
}

interface SynthesizeStream extends AsyncIterable<SynthesizedAudio> {
  pushText(text: string): void;
  flush(): void;
  endInput(): void;
}

// LLM Interface
interface LLMCapabilities {
  streaming: boolean;
  functionCalling: boolean;
  vision: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
  interrupted?: boolean;
}

interface ChatChunk {
  delta: string;
  toolCalls?: ToolCall[];
  finishReason?: string;
}

interface LLM {
  capabilities: LLMCapabilities;
  chat(
    chatCtx: ChatMessage[],
    options?: { tools?: Tool[]; temperature?: number }
  ): LLMStream;
  close(): Promise<void>;
}

interface LLMStream extends AsyncIterable<ChatChunk> {
  close(): Promise<void>;
}
```

### Adapter Patterns

```python
class StreamAdapter(TTS):
    """Converts batch-only TTS to streaming interface."""

    def __init__(self, tts: TTS, sentence_tokenizer: Callable):
        self._tts = tts
        self._tokenizer = sentence_tokenizer

    def stream(self) -> SynthesizeStream:
        return _StreamAdapterStream(self._tts, self._tokenizer)

class _StreamAdapterStream(SynthesizeStream):
    def __init__(self, tts: TTS, tokenizer: Callable):
        self._tts = tts
        self._tokenizer = tokenizer
        self._text_buffer = ""
        self._sentences = asyncio.Queue()

    def push_text(self, text: str):
        self._text_buffer += text
        # Extract complete sentences
        sentences = self._tokenizer(self._text_buffer)
        for sentence in sentences[:-1]:  # Keep last incomplete
            self._sentences.put_nowait(sentence)
        self._text_buffer = sentences[-1] if sentences else ""

    async def __aiter__(self):
        while True:
            sentence = await self._sentences.get()
            if sentence is None:
                break
            async for chunk in self._tts.synthesize(sentence):
                yield chunk

class FallbackAdapter(STT):
    """Automatic failover across multiple STT providers."""

    def __init__(self, providers: list[STT]):
        self._providers = providers
        self._current_index = 0
        self._failed_providers = set()

    def stream(self) -> RecognizeStream:
        # Try providers in order, skip failed ones
        for i, provider in enumerate(self._providers):
            if i not in self._failed_providers:
                try:
                    return provider.stream()
                except Exception:
                    self._failed_providers.add(i)
                    self._schedule_recovery(i)
        raise RuntimeError("All STT providers failed")

    def _schedule_recovery(self, index: int):
        """Exponential backoff recovery for failed provider."""
        asyncio.create_task(self._recover_provider(index))
```

---

## 6. Noise Cancellation Integration

### LiveKit's Approach

LiveKit uses **Krisp** technology for noise cancellation via a **separate plugin package**:

```bash
# Required installation (not included in base livekit-agents)
pip install livekit-plugins-noise-cancellation
```

> **Important (Validated 2026-01-22):** BVC and BVCTelephony are NOT in the core `livekit-agents` package. They require the separate `livekit-plugins-noise-cancellation` plugin available on [PyPI](https://pypi.org/project/livekit-plugins-noise-cancellation/).

| Class | Use Case | Description |
|-------|----------|-------------|
| `BVC()` | Standard WebRTC | Background Voice Cancellation - removes background speakers + noise |
| `BVCTelephony()` | SIP/Telephony | BVC optimized for phone audio characteristics |

**Source:** [Krisp Blog](https://krisp.ai/blog/improving-turn-taking-of-ai-voice-agents-with-background-voice-cancellation/), [LiveKit Enhanced NC Docs](https://docs.livekit.io/transport/media/enhanced-noise-cancellation/)

### Why BVC Matters for Voice AI

1. **Cleaner STT Input:** 2x improvement in Whisper V3 Word Error Rate
2. **Better VAD:** 3.5x reduction in false-positive VAD triggers
3. **Turn Detection:** Fewer false interruptions from background speakers

### Integration Pattern

```python
class AudioInputOptions:
    noise_cancellation: Union[
        NoiseCancellationOptions,  # Direct config
        NoiseCancellationSelector, # Dynamic selection
        FrameProcessor,            # Custom processor
        None
    ] = None

# Dynamic selection based on participant type
def select_noise_cancellation(params: NoiseCancellationParams):
    if params.participant.is_sip:
        return BVCTelephony()  # Telephony-optimized
    else:
        return BVC()  # Standard WebRTC

session = AgentSession(
    audio_input=AudioInputOptions(
        noise_cancellation=select_noise_cancellation
    )
)
```

### Replication Options

| Approach | Pros | Cons |
|----------|------|------|
| **Krisp SDK** | Best quality, LiveKit uses it | Commercial license required |
| **RNNoise** | Open source, good quality | Older, no BVC |
| **Silero VAD** | Good for VAD, open source | Not full NC |
| **WebRTC Built-in** | Free, decent | No BVC, basic NC |
| **NVIDIA Maxine** | Excellent quality | GPU required, commercial |
| **Custom RNN/Transformer** | Full control | Significant training effort |

### Recommended Replication

1. Use **WebRTC built-in NC** as baseline
2. Add **Silero VAD** for voice activity detection
3. Consider **RNNoise** for enhanced NC
4. For telephony: implement adaptive filtering for phone codec artifacts

---

## 7. SIP/Twilio Integration Patterns

### Architecture

```
+-------------------+     +------------------+     +------------------+
|   PSTN/Phone      |     |   SIP Trunk      |     |   LiveKit SFU    |
|   Network         |<--->|   (Twilio/etc)   |<--->|   Server         |
+-------------------+     +------------------+     +------------------+
                                                          |
                                                          v
                                                  +------------------+
                                                  |   Agent Server   |
                                                  |   (Your Code)    |
                                                  +------------------+
```

### Key Integration Points

1. **SIP Trunk Configuration:** Connect Twilio/SIP provider to LiveKit server
2. **Participant Management:** SIP callers appear as participants in LiveKit rooms
3. **Audio Codec Handling:** Server handles transcoding between SIP codecs and WebRTC
4. **DTMF Support:** Capture and process touch-tone inputs
5. **Call Transfer:** Warm/cold transfer to other numbers

### API Pattern

```python
class JobContext:
    """Context provided to agent for each job/call."""

    async def add_sip_participant(
        self,
        sip_trunk_id: str,
        sip_call_to: str,
        room_name: Optional[str] = None,
    ) -> SIPParticipant:
        """Initiate outbound SIP call."""
        pass

    async def transfer_sip_participant(
        self,
        participant_id: str,
        transfer_to: str,
    ):
        """Transfer existing SIP participant to another number."""
        pass

# DTMF Handling
@room.on("sip_dtmf_received")
async def on_dtmf(event: DTMFEvent):
    digit = event.digit  # "0"-"9", "*", "#"
    participant = event.participant
    # Process DTMF input (e.g., menu selection)
```

### Audio Codec Flow

```
Phone (G.711/G.722) --> SIP Trunk --> LiveKit Server (Opus) --> Agent
                                            |
                                            v
                                    [Transcoding happens here]
```

### Replication Approach

1. **Use existing SIP libraries:** `pjsip`, `sofia-sip`, or cloud providers (Twilio, Vonage)
2. **Handle codec conversion:** G.711 <-> PCM <-> Your pipeline format
3. **Implement DTMF:** Parse RTP telephone-event or SIP INFO
4. **Call state machine:** Track call states (ringing, connected, on-hold, transferred)

---

## 8. MCP Integration Patterns

### How LiveKit Integrates MCP

```python
from livekit.agents import AgentSession
from livekit.agents.mcp import MCPServerHTTP, MCPServerStdio

# HTTP-based MCP server
mcp_http = MCPServerHTTP(
    url="https://your-mcp-server.com/sse",
    allowed_tools=["search", "calculator"],  # Optional filter
)

# Stdio-based MCP server (local process)
mcp_stdio = MCPServerStdio(
    command="python",
    args=["mcp_server.py"],
    env={"API_KEY": "..."},
)

session = AgentSession(
    llm=openai.LLM(),
    mcp_servers=[mcp_http, mcp_stdio],
)
```

### Tool Invocation Flow

```
1. Agent Session starts
   |
   v
2. Connect to MCP servers
   |
   v
3. List available tools from each server
   |
   v
4. Register tools with LLM (as function definitions)
   |
   v
5. During conversation:
   |
   +---> LLM decides to call tool
   |          |
   |          v
   +---> Route to correct MCP server
   |          |
   |          v
   +---> Execute tool via MCP protocol
   |          |
   |          v
   +---> Return result to LLM
   |          |
   |          v
   +---> LLM incorporates result in response
```

### MCP Tool Wrapper

```python
class MCPServer:
    async def _make_function_tool(self, mcp_tool: MCPToolDef) -> FunctionTool:
        """Wrap MCP tool as callable for LLM."""

        async def call_tool(**kwargs) -> str:
            result = await self._client.call_tool(
                name=mcp_tool.name,
                arguments=kwargs
            )

            if result.isError:
                raise ToolError(result.content)

            # Format result for LLM
            return json.dumps(result.content)

        return FunctionTool(
            name=mcp_tool.name,
            description=mcp_tool.description,
            parameters=mcp_tool.inputSchema,
            callable=call_tool
        )
```

### Replication Approach

1. **Use MCP SDK:** `pip install mcp` - official Python SDK
2. **Implement two transports:**
   - HTTP/SSE for remote servers
   - Stdio for local processes
3. **Tool registration:** Convert MCP tools to your LLM's function calling format
4. **Mid-conversation invocation:** Pause TTS, execute tool, resume with result

---

## 9. Production Infrastructure

### Job/Worker Architecture

```
+------------------+     +------------------+     +------------------+
|   LiveKit        |     |   Agent Server   |     |   Job Process    |
|   Server         |<--->|   (Main Process) |---->|   (Subprocess)   |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        |  WebSocket             |  Process Pool          |  Isolated
        |  (job dispatch)        |  Management            |  Execution
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|   Job Queue      |     |   Load           |     |   Agent          |
|   (Round-robin)  |     |   Calculator     |     |   Instance       |
+------------------+     +------------------+     +------------------+
```

### Key Concepts

1. **Agent Server:** Main process that accepts job requests
2. **Job:** Single conversation/session, runs in isolated subprocess
3. **Process Pool:** Pre-warmed subprocesses for fast job startup
4. **Load Function:** Custom function to determine server capacity

### Load Balancing

```python
class AgentServer:
    def __init__(
        self,
        load_threshold: float = 0.7,  # Stop accepting jobs above this
        num_idle_processes: int = 3,   # Pre-warmed processes
    ):
        pass

    def compute_load(self) -> float:
        """
        Return value 0-1 indicating current load.
        Default: CPU utilization
        Custom: job count, memory, GPU, etc.
        """
        return min(len(self.active_jobs) / self.max_jobs, 1.0)
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voice-agent
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: agent
        image: your-agent:latest
        resources:
          requests:
            cpu: "1"
            memory: "2Gi"
          limits:
            cpu: "2"
            memory: "4Gi"
        env:
        - name: LIVEKIT_URL
          value: "wss://your-livekit-server"
      # Long grace period for conversation completion
      terminationGracePeriodSeconds: 600  # 10 minutes
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: voice-agent-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: voice-agent
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50  # Scale before load_threshold
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # Slow scale-down
    scaleUp:
      stabilizationWindowSeconds: 60   # Fast scale-up
```

### Graceful Shutdown

```python
# Agent server handles SIGTERM gracefully
# 1. Stop accepting new jobs
# 2. Wait for active jobs to complete (up to grace period)
# 3. Force-kill remaining jobs after grace period

async def shutdown():
    self.accepting_jobs = False

    # Wait for jobs with timeout
    try:
        await asyncio.wait_for(
            self._wait_for_jobs(),
            timeout=self.grace_period
        )
    except asyncio.TimeoutError:
        # Force kill remaining
        for job in self.active_jobs:
            job.cancel()
```

---

## 10. What We CAN vs CANNOT Replicate

### Fully Replicable (Open Source/Standard)

| Component | LiveKit Approach | Replication Path |
|-----------|------------------|------------------|
| Pipeline Architecture | AsyncIterable streaming | Standard Python/TS async patterns |
| Provider Abstraction | Plugin interfaces | Implement interfaces yourself |
| Audio Frame Buffering | AudioByteStream | Simple buffer implementation |
| VAD | Silero VAD | Use Silero directly (MIT license) |
| Turn Detection Model | Custom transformer | Train your own (see approach below) |
| Interruption State Machine | Event-driven FSM | Implement state machine |
| Job/Worker Process Model | multiprocessing | Standard process pool |
| MCP Integration | MCP SDK | Use official MCP SDK |

### Partially Replicable (Requires Effort)

| Component | LiveKit Approach | Challenge |
|-----------|------------------|-----------|
| Turn Detection Training | Call center data + synthetic | Need training data |
| Connection Pooling | Custom per-provider | Provider-specific tuning |
| Preemptive Generation | Speculative execution | Careful context management |

### Proprietary/Licensed (Cannot Directly Replicate)

| Component | LiveKit Uses | Alternatives |
|-----------|--------------|--------------|
| BVC Noise Cancellation | Krisp SDK | RNNoise, WebRTC NC, NVIDIA Maxine |
| LiveKit SFU | Proprietary (but OSS) | Deploy LiveKit, or use Janus/mediasoup |
| LiveKit Cloud Scheduling | Proprietary | Build custom or use K8s |

### Gray Areas

| Component | Notes |
|-----------|-------|
| Semantic Turn Detection Model | Their model is open-source (MIT), but not the training data |
| SIP Gateway | LiveKit server handles this; need separate SIP solution |
| Real-time Model Providers | Depends on provider (OpenAI, Ultravox, etc.) |

---

## 11. Recommended Implementation Approach

### Phase 1: Core Pipeline (2-3 weeks)

```python
# Minimal viable pipeline

class VoicePipeline:
    def __init__(
        self,
        stt: STT,
        llm: LLM,
        tts: TTS,
        vad: VAD,
    ):
        self.stt = stt
        self.llm = llm
        self.tts = tts
        self.vad = vad
        self.chat_context = []

    async def process_audio_stream(
        self,
        audio_input: AsyncIterable[AudioFrame],
        audio_output: AudioOutputSink,
    ):
        # Start STT stream
        stt_stream = self.stt.stream()

        async for frame in audio_input:
            # Push to VAD and STT
            vad_event = self.vad.process(frame)
            stt_stream.push_frame(frame)

            if vad_event.type == "END_OF_SPEECH":
                # Get final transcript
                transcript = await stt_stream.get_final()

                # LLM inference
                self.chat_context.append({"role": "user", "content": transcript})

                async for llm_chunk in self.llm.chat(self.chat_context):
                    # Stream to TTS
                    async for audio in self.tts.stream_text(llm_chunk.delta):
                        await audio_output.write(audio)
```

### Phase 2: Turn Detection (2-4 weeks)

1. **Data Collection:**
   - Record 100+ hours of conversations
   - Label turn boundaries manually or semi-automatically
   - Generate synthetic dialogues for edge cases

2. **Model Training:**
   - Start with Qwen2.5-0.5B-Instruct or similar
   - Fine-tune on turn prediction task
   - Target: <30ms inference, >90% accuracy

3. **Integration:**
   - Run inference on each STT final transcript
   - Adjust endpointing delay based on confidence

### Phase 3: Interruption Handling (1-2 weeks)

1. Implement state machine (LISTENING, THINKING, SPEAKING, PAUSED)
2. Add VAD monitoring during SPEAKING state
3. Implement pause/resume for false interruption handling
4. Update chat context with interrupted messages

### Phase 4: Provider Abstraction (1-2 weeks)

1. Implement base interfaces for STT, TTS, LLM
2. Create adapters for 2-3 providers each
3. Add StreamAdapter for batch-only providers
4. Add FallbackAdapter for resilience

### Phase 5: Production Infrastructure (2-3 weeks)

1. Implement job/worker process model
2. Add health checks and metrics
3. Kubernetes deployment with HPA
4. Graceful shutdown handling

### Phase 6: Advanced Features (Ongoing)

- MCP integration
- SIP/telephony support
- Noise cancellation
- Preemptive generation

---

## 12. Effort Estimation

### Team Composition

| Role | Count | Focus |
|------|-------|-------|
| Senior Backend Engineer | 1-2 | Pipeline, infrastructure |
| ML Engineer | 1 | Turn detection model |
| Audio Engineer | 0.5 | Codec handling, NC |

### Timeline (Single Team)

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Core Pipeline | 2-3 weeks | None |
| Phase 2: Turn Detection | 2-4 weeks | Training data |
| Phase 3: Interruption | 1-2 weeks | Phase 1 |
| Phase 4: Provider Abstraction | 1-2 weeks | Phase 1 |
| Phase 5: Production Infra | 2-3 weeks | Phases 1-4 |
| Phase 6: Advanced | Ongoing | - |

**Total MVP: 8-14 weeks**

### Cost Considerations

| Item | Estimated Cost |
|------|----------------|
| ML Training (GPU) | $500-2000 (one-time) |
| STT API (dev) | $100-500/month |
| TTS API (dev) | $100-500/month |
| LLM API (dev) | $200-1000/month |
| Infrastructure (dev) | $200-500/month |

### Risk Factors

1. **Turn Detection Model Quality:** May require multiple training iterations
2. **Provider API Changes:** Build abstraction early
3. **Latency Targets:** May need optimization cycles
4. **Audio Quality Issues:** Debugging real-time audio is hard

---

## Validation Notes (2026-01-22)

### Corrections Applied

| Original Claim | Correction | Source |
|----------------|------------|--------|
| "~25ms on CPU" for turn detection | **Clarified:** 25ms is model inference only; full per-turn latency is **50-160ms** | [LiveKit Blog](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) |
| BVC/BVCTelephony in core agents | **Clarified:** Requires separate `livekit-plugins-noise-cancellation` package | [PyPI](https://pypi.org/project/livekit-plugins-noise-cancellation/) |
| Model size not specified | **Added:** 281 MB on disk (ONNX quantized) | [LiveKit Blog](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/) |

### Additional Findings (Not in Original)

| Finding | Details | Source |
|---------|---------|--------|
| Preemptive generation can cause duplicate LLM requests | Can double token costs; see Issue #4219 | [GitHub Issue](https://github.com/livekit/agents/issues/4219) |
| BVC reduces VAD false positives | 3.5x reduction on average | [Krisp Blog](https://krisp.ai/blog/improving-turn-taking-of-ai-voice-agents-with-background-voice-cancellation/) |
| BVC improves Whisper V3 WER | 2x improvement on AMI dataset | [Krisp Blog](https://krisp.ai/blog/improving-turn-taking-of-ai-voice-agents-with-background-voice-cancellation/) |
| GitHub Stats | 9,105 stars, 2,645 forks (Apache-2.0) | GitHub API |

### Validation Sources

- **DeepWiki MCP:** livekit/agents codebase analysis
- **Context7 MCP:** /livekit/agents documentation queries
- **GitHub API:** Live repository statistics (2026-01-22)
- **Web Search:** LiveKit blog posts, Krisp blog, PyPI packages
- **Official Docs:** [docs.livekit.io/agents/](https://docs.livekit.io/agents/)

### Verified Correct (No Changes Needed)

- ✅ Qwen2.5-0.5B-Instruct base model
- ✅ 39% reduction in false interruptions (v0.4.1 vs v0.3.0)
- ✅ 13 languages supported
- ✅ ~400MB RAM requirement
- ✅ Interruption handling state machine (LISTENING, THINKING, SPEAKING, PAUSED)
- ✅ `false_interruption_timeout` default 2.0s, `resume_false_interruption` default True
- ✅ Provider abstraction interfaces (STT, TTS, LLM base classes)
- ✅ SIP APIs (`add_sip_participant`, `transfer_sip_participant`, DTMF)
- ✅ MCP integration (`MCPServerHTTP`, `mcp_servers` parameter)
- ✅ Job/Worker process isolation model
- ✅ Kubernetes deployment patterns
- ✅ Knowledge distillation from 7B teacher to 0.5B student

---

## Appendix A: Key Source References

- [LiveKit Agents GitHub](https://github.com/livekit/agents)
- [LiveKit Documentation](https://docs.livekit.io/agents/)
- [Turn Detection Blog Post](https://blog.livekit.io/using-a-transformer-to-improve-end-of-turn-detection/)
- [Improved Turn Detection v0.4.1](https://blog.livekit.io/improved-end-of-turn-model-cuts-voice-ai-interruptions-39/)
- [Enhanced Noise Cancellation](https://docs.livekit.io/transport/media/enhanced-noise-cancellation/)
- [Voice AI Architecture Comparison](https://softcery.com/lab/ai-voice-agents-real-time-vs-turn-based-tts-stt-architecture)
- [LiveKit Agents Deployment](https://docs.livekit.io/agents/ops/deployment/custom/)
- [Krisp BVC for Voice AI](https://krisp.ai/blog/improving-turn-taking-of-ai-voice-agents-with-background-voice-cancellation/)

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| VAD | Voice Activity Detection - detects speech in audio |
| STT | Speech-to-Text - converts audio to text |
| TTS | Text-to-Speech - converts text to audio |
| LLM | Large Language Model - generates responses |
| BVC | Background Voice Cancellation - removes other speakers |
| SFU | Selective Forwarding Unit - WebRTC media server |
| MCP | Model Context Protocol - tool integration standard |
| Barge-in | User interrupting agent mid-speech |
| Endpointing | Detecting end of user's speech turn |
| Preemptive Generation | Starting LLM/TTS before turn confirmed |
