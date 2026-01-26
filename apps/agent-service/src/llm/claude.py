"""
Claude LLM Client

Provides Claude client with retry handling, streaming support,
tool use, and cost tracking for the Hyyve agent service.
"""

from typing import Any, Literal, TypedDict, AsyncIterator
from dataclasses import dataclass
import os

import anthropic
from anthropic import Anthropic, AsyncAnthropic
from anthropic.types import Message, MessageParam, TextBlock, ToolUseBlock


# Model type alias
ClaudeModelId = Literal[
    "claude-sonnet-4-20250514",
    "claude-opus-4-20250514",
    "claude-haiku-4-20250514",
]


@dataclass
class ModelConfig:
    """Claude model configuration."""

    id: ClaudeModelId
    display_name: str
    max_tokens: int
    input_cost_per_1m: float
    output_cost_per_1m: float


# Model configurations with cost information
CLAUDE_MODELS: dict[ClaudeModelId, ModelConfig] = {
    "claude-sonnet-4-20250514": ModelConfig(
        id="claude-sonnet-4-20250514",
        display_name="Claude Sonnet 4",
        max_tokens=8192,
        input_cost_per_1m=3.0,
        output_cost_per_1m=15.0,
    ),
    "claude-opus-4-20250514": ModelConfig(
        id="claude-opus-4-20250514",
        display_name="Claude Opus 4",
        max_tokens=8192,
        input_cost_per_1m=15.0,
        output_cost_per_1m=75.0,
    ),
    "claude-haiku-4-20250514": ModelConfig(
        id="claude-haiku-4-20250514",
        display_name="Claude Haiku 4",
        max_tokens=8192,
        input_cost_per_1m=0.25,
        output_cost_per_1m=1.25,
    ),
}

# Default model for general use
DEFAULT_MODEL: ClaudeModelId = "claude-sonnet-4-20250514"

# Default configuration
DEFAULT_TIMEOUT = 60.0  # 60 seconds
DEFAULT_MAX_RETRIES = 3
DEFAULT_MAX_TOKENS = 4096


class TokenUsage(TypedDict):
    """Token usage tracking."""

    input_tokens: int
    output_tokens: int


class CostResult(TypedDict):
    """Cost calculation result."""

    input_cost: float
    output_cost: float
    total_cost: float


class ToolUseResult(TypedDict):
    """Tool use result."""

    tool_use_id: str
    name: str
    input: dict[str, Any]


class CompletionResult(TypedDict):
    """Chat completion result."""

    content: str
    stop_reason: str
    usage: TokenUsage
    cost: CostResult
    tool_calls: list[ToolUseResult] | None


class ClaudeClient:
    """
    Claude LLM client wrapper.

    Provides synchronous and asynchronous methods for Claude API calls
    with retry handling, streaming, and cost tracking.
    """

    def __init__(
        self,
        api_key: str | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        max_retries: int = DEFAULT_MAX_RETRIES,
    ):
        """Initialize the Claude client."""
        self._api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")

        if not self._api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY environment variable is not set. "
                "Please set it in your environment or pass it to the constructor."
            )

        self._sync_client = Anthropic(
            api_key=self._api_key,
            timeout=timeout,
            max_retries=max_retries,
        )
        self._async_client = AsyncAnthropic(
            api_key=self._api_key,
            timeout=timeout,
            max_retries=max_retries,
        )

    def calculate_cost(self, model: ClaudeModelId, usage: TokenUsage) -> CostResult:
        """Calculate cost from token usage."""
        model_config = CLAUDE_MODELS[model]

        input_cost = (usage["input_tokens"] / 1_000_000) * model_config.input_cost_per_1m
        output_cost = (usage["output_tokens"] / 1_000_000) * model_config.output_cost_per_1m

        return {
            "input_cost": input_cost,
            "output_cost": output_cost,
            "total_cost": input_cost + output_cost,
        }

    def _extract_text_content(self, message: Message) -> str:
        """Extract text content from message."""
        text_parts = []
        for block in message.content:
            if isinstance(block, TextBlock):
                text_parts.append(block.text)
        return "".join(text_parts)

    def _extract_tool_use(self, message: Message) -> list[ToolUseResult]:
        """Extract tool use results from message."""
        tool_calls = []
        for block in message.content:
            if isinstance(block, ToolUseBlock):
                tool_calls.append({
                    "tool_use_id": block.id,
                    "name": block.name,
                    "input": block.input,  # type: ignore
                })
        return tool_calls

    def complete(
        self,
        messages: list[MessageParam],
        *,
        model: ClaudeModelId = DEFAULT_MODEL,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        system: str | None = None,
        temperature: float | None = None,
        tools: list[dict[str, Any]] | None = None,
        stop_sequences: list[str] | None = None,
    ) -> CompletionResult:
        """Create a synchronous chat completion."""
        message = self._sync_client.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            system=system or anthropic.NOT_GIVEN,
            temperature=temperature or anthropic.NOT_GIVEN,
            tools=tools or anthropic.NOT_GIVEN,
            stop_sequences=stop_sequences or anthropic.NOT_GIVEN,
        )

        usage: TokenUsage = {
            "input_tokens": message.usage.input_tokens,
            "output_tokens": message.usage.output_tokens,
        }
        cost = self.calculate_cost(model, usage)
        tool_calls = self._extract_tool_use(message)

        return {
            "content": self._extract_text_content(message),
            "stop_reason": message.stop_reason or "end_turn",
            "usage": usage,
            "cost": cost,
            "tool_calls": tool_calls if tool_calls else None,
        }

    async def acomplete(
        self,
        messages: list[MessageParam],
        *,
        model: ClaudeModelId = DEFAULT_MODEL,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        system: str | None = None,
        temperature: float | None = None,
        tools: list[dict[str, Any]] | None = None,
        stop_sequences: list[str] | None = None,
    ) -> CompletionResult:
        """Create an asynchronous chat completion."""
        message = await self._async_client.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            system=system or anthropic.NOT_GIVEN,
            temperature=temperature or anthropic.NOT_GIVEN,
            tools=tools or anthropic.NOT_GIVEN,
            stop_sequences=stop_sequences or anthropic.NOT_GIVEN,
        )

        usage: TokenUsage = {
            "input_tokens": message.usage.input_tokens,
            "output_tokens": message.usage.output_tokens,
        }
        cost = self.calculate_cost(model, usage)
        tool_calls = self._extract_tool_use(message)

        return {
            "content": self._extract_text_content(message),
            "stop_reason": message.stop_reason or "end_turn",
            "usage": usage,
            "cost": cost,
            "tool_calls": tool_calls if tool_calls else None,
        }

    async def astream(
        self,
        messages: list[MessageParam],
        *,
        model: ClaudeModelId = DEFAULT_MODEL,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        system: str | None = None,
        temperature: float | None = None,
        tools: list[dict[str, Any]] | None = None,
        stop_sequences: list[str] | None = None,
    ) -> AsyncIterator[str]:
        """Create an async streaming chat completion that yields text chunks."""
        async with self._async_client.messages.stream(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            system=system or anthropic.NOT_GIVEN,
            temperature=temperature or anthropic.NOT_GIVEN,
            tools=tools or anthropic.NOT_GIVEN,
            stop_sequences=stop_sequences or anthropic.NOT_GIVEN,
        ) as stream:
            async for text in stream.text_stream:
                yield text


# Singleton client instance
_client_instance: ClaudeClient | None = None


def get_claude_client() -> ClaudeClient:
    """Get or create the singleton Claude client."""
    global _client_instance
    if _client_instance is None:
        _client_instance = ClaudeClient()
    return _client_instance
