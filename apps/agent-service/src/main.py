"""
Hyyve Agent Service - Main Application

AgentOS runtime providing 50+ production-ready API endpoints for agent execution.

AgentOS automatically provides:
- /health, /config, /models - Core endpoints
- /agents/* - Agent execution with SSE streaming
- /sessions/* - Session management
- /memories/* - Memory management
- /knowledge/* - Knowledge base / RAG
- /a2a/* - Agent-to-Agent protocol
- /agui - AG-UI interface
"""

import structlog
from agno.os import AgentOS

from src.agents.definitions import all_agents, all_teams
from src.config import settings

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)

# Validate production configuration
settings.validate_production_config()

# Log startup
logger.info(
    "Initializing Hyyve Agent Service with AgentOS",
    version=settings.app_version,
    environment=settings.environment,
    agents=[agent.agent_id for agent in all_agents],
    teams=[team.team_id for team in all_teams],
)

# Initialize AgentOS with all agents and teams
# This provides 50+ production-ready API endpoints automatically
agent_os = AgentOS(
    agents=all_agents,
    teams=all_teams,
    # AgentOS configuration
    title=settings.app_name,
    version=settings.app_version,
    description="Hyyve Agent Execution Service using AgentOS runtime",
    # Enable features
    enable_cors=settings.is_development,
    debug=settings.debug,
)

# Get the FastAPI application with all AgentOS endpoints
# DO NOT add custom /health, /agents/*, /sessions/*, /memories/* routes
# AgentOS provides these automatically
app = agent_os.get_app()

# Add Hyyve-specific custom routes here (if needed)
# Example: app.include_router(dcrl_router, prefix="/api/v1")
# Example: app.include_router(checkpoints_router, prefix="/api/v1")

logger.info(
    "AgentOS initialized successfully",
    endpoints_count="50+",
    docs_url="/docs" if settings.is_development else None,
)
