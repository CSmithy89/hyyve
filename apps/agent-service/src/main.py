"""
Hyyve Agent Service - Main Application

FastAPI application for agent execution using the Agno framework.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.routers import agents, health

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


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup/shutdown events."""
    # Startup
    logger.info(
        "Starting Hyyve Agent Service",
        version=settings.app_version,
        environment=settings.environment,
    )

    yield

    # Shutdown
    logger.info("Shutting down Hyyve Agent Service")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Agent execution service using Agno framework",
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.is_development else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(agents.router, prefix="/api/v1", tags=["Agents"])


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint returning service info."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
    }
