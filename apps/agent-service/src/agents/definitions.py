"""
Hyyve Agent Definitions

Defines the four core agents for the Hyyve platform:
- Bond: Concierge and orchestrator
- Wendy: Workflow assistant
- Morgan: Data analyst
- Artie: Creative and design agent
"""

from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.storage.postgres import PostgresStorage
from agno.team import Team

from src.config import settings


def create_agent(
    name: str,
    agent_id: str,
    description: str,
    personality: str,
    instructions: list[str],
) -> Agent:
    """
    Factory function to create an agent with standard Hyyve configuration.

    All agents get:
    - Claude model
    - PostgreSQL storage for memory
    - History, memories, and agentic memory enabled
    """
    return Agent(
        name=name,
        agent_id=agent_id,
        model=Claude(id=settings.agno_model),
        description=description,
        instructions=[
            f"Personality: {personality}",
            *instructions,
        ],
        # Memory configuration - enable all memory features
        add_history_to_context=True,
        add_memories_to_context=True,
        enable_agentic_memory=True,
        # Storage configuration for persistent memory
        storage=PostgresStorage(
            table_name=f"agent_sessions_{agent_id}",
            db_url=settings.DATABASE_URL,
        ),
        # Performance - cache session in memory for faster access
        cache_session=True,
        # Additional settings
        markdown=True,
        show_tool_calls=settings.is_development,
    )


# Bond - Concierge and Orchestrator Agent
bond = create_agent(
    name="Bond",
    agent_id="bond",
    description="Concierge and orchestrator agent for Hyyve",
    personality="Polished, confident, and professional. Acts as the main point of contact.",
    instructions=[
        "You are Bond, the concierge agent for Hyyve.",
        "Help users navigate the platform and route them to specialized agents.",
        "Maintain a professional and helpful demeanor.",
        "Use the DCRL pattern: Detect intent, Clarify if <60% confidence, Resolve, Learn.",
    ],
)

# Wendy - Workflow Assistant Agent
wendy = create_agent(
    name="Wendy",
    agent_id="wendy",
    description="Workflow assistant agent",
    personality="Warm, helpful, and supportive. Guides users through workflow creation.",
    instructions=[
        "You are Wendy, the workflow assistant for Hyyve.",
        "Help users build and optimize their workflows using the visual editor.",
        "Provide step-by-step guidance with patience and clarity.",
        "Explain node types, connections, and best practices.",
    ],
)

# Morgan - Data Analyst Agent
morgan = create_agent(
    name="Morgan",
    agent_id="morgan",
    description="Data analyst agent",
    personality="Precise, methodical, and analytical. Focuses on data insights.",
    instructions=[
        "You are Morgan, the data analyst for Hyyve.",
        "Analyze data and provide actionable insights.",
        "Be thorough and precise in your analysis.",
        "Help users understand metrics, trends, and patterns.",
    ],
)

# Artie - Creative and Design Agent
artie = create_agent(
    name="Artie",
    agent_id="artie",
    description="Creative and design agent",
    personality="Enthusiastic, imaginative, and creative. Helps with content creation.",
    instructions=[
        "You are Artie, the creative agent for Hyyve.",
        "Help users with creative tasks and content generation.",
        "Bring enthusiasm and imagination to every interaction.",
        "Assist with the Canvas Builder for media generation pipelines.",
    ],
)

# All agents list for registration
all_agents = [bond, wendy, morgan, artie]

# Builder Team - Coordinates all agents
builder_team = Team(
    name="Hyyve Builders",
    team_id="hyyve-builders",
    members=all_agents,
    instructions=[
        "Route workflow/module questions to Wendy",
        "Route data analysis questions to Morgan",
        "Route creative/canvas questions to Artie",
        "Route general questions and orchestration to Bond",
        "For cross-builder questions, coordinate between relevant agents",
    ],
    enable_user_memories=True,
    share_member_interactions=True,
    enable_agentic_culture=True,
    # Performance - cache team session in memory for faster access
    cache_session=True,
)

# All teams list for registration
all_teams = [builder_team]
