"""
Base Agent Configuration

Provides the base agent class and factory function using Agno framework.
"""

from typing import Any

from agno import Agent
from agno.models.anthropic import Claude
from agno.storage.postgres import PostgresStorage

from src.config import settings


class BaseAgent:
    """
    Base agent class with common Agno configuration.

    All Hyyve agents inherit from this class to get:
    - Memory persistence (PostgreSQL)
    - Session history
    - Agentic memory capabilities
    """

    def __init__(
        self,
        name: str,
        description: str,
        instructions: list[str] | None = None,
        personality: str = "",
    ) -> None:
        """
        Initialize base agent.

        Args:
            name: Agent identifier (e.g., 'bond', 'wendy')
            description: Agent description
            instructions: System instructions for the agent
            personality: Agent personality description
        """
        self.name = name
        self.description = description
        self.instructions = instructions or []
        self.personality = personality

        # Build system prompt
        system_prompt = self._build_system_prompt()

        # Initialize Agno agent with full configuration
        self._agent = Agent(
            name=name,
            model=Claude(id=settings.agno_model),
            description=description,
            instructions=system_prompt,
            # Memory configuration - enable all memory features
            add_history_to_context=True,
            add_memories_to_context=True,
            enable_agentic_memory=True,
            # Storage configuration for persistent memory
            storage=PostgresStorage(
                table_name=f"agent_sessions_{name}",
                db_url=settings.DATABASE_URL,
            ),
            # Additional settings
            markdown=True,
            show_tool_calls=settings.is_development,
        )

    def _build_system_prompt(self) -> list[str]:
        """Build the system prompt from instructions and personality."""
        prompts = []

        if self.personality:
            prompts.append(f"Personality: {self.personality}")

        prompts.extend(self.instructions)

        return prompts

    @property
    def agent(self) -> Agent:
        """Get the underlying Agno agent."""
        return self._agent

    async def run(self, message: str, context: dict[str, Any] | None = None) -> str:
        """
        Run the agent with a message.

        Args:
            message: User message to process
            context: Additional context for the agent

        Returns:
            Agent response string
        """
        # Merge context into the message if provided
        if context:
            # TODO: Implement context injection
            pass

        response = await self._agent.arun(message)
        return response.content if response else ""


def create_agent(
    name: str,
    description: str,
    instructions: list[str] | None = None,
    personality: str = "",
) -> BaseAgent:
    """
    Factory function to create an agent.

    Args:
        name: Agent identifier
        description: Agent description
        instructions: System instructions
        personality: Agent personality

    Returns:
        Configured BaseAgent instance
    """
    return BaseAgent(
        name=name,
        description=description,
        instructions=instructions,
        personality=personality,
    )


# Pre-configured agent personalities
AGENT_PERSONALITIES: dict[str, dict[str, Any]] = {
    "bond": {
        "name": "Bond",
        "description": "Concierge and orchestrator agent for Hyyve",
        "personality": "Polished, confident, and professional. Acts as the main point of contact.",
        "instructions": [
            "You are Bond, the concierge agent for Hyyve.",
            "Help users navigate the platform and route them to specialized agents.",
            "Maintain a professional and helpful demeanor.",
        ],
    },
    "wendy": {
        "name": "Wendy",
        "description": "Workflow assistant agent",
        "personality": "Warm, helpful, and supportive. Guides users through workflow creation.",
        "instructions": [
            "You are Wendy, the workflow assistant for Hyyve.",
            "Help users build and optimize their workflows.",
            "Provide step-by-step guidance with patience and clarity.",
        ],
    },
    "morgan": {
        "name": "Morgan",
        "description": "Data analyst agent",
        "personality": "Precise, methodical, and analytical. Focuses on data insights.",
        "instructions": [
            "You are Morgan, the data analyst for Hyyve.",
            "Analyze data and provide actionable insights.",
            "Be thorough and precise in your analysis.",
        ],
    },
    "artie": {
        "name": "Artie",
        "description": "Creative and design agent",
        "personality": "Enthusiastic, imaginative, and creative. Helps with content creation.",
        "instructions": [
            "You are Artie, the creative agent for Hyyve.",
            "Help users with creative tasks and content generation.",
            "Bring enthusiasm and imagination to every interaction.",
        ],
    },
}
