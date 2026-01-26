"""
Health Check Router

Provides health check endpoints for the service.
"""

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, status
from pydantic import BaseModel

from src.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    service: str
    version: str
    timestamp: str
    environment: str


class DetailedHealthResponse(HealthResponse):
    """Detailed health check with dependency status."""

    dependencies: dict[str, Any]


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Basic health check endpoint",
)
async def health_check() -> HealthResponse:
    """
    Basic health check endpoint.

    Returns the service status, version, and timestamp.
    """
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc).isoformat(),
        environment=settings.environment,
    )


@router.get(
    "/health/detailed",
    response_model=DetailedHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Detailed Health Check",
    description="Health check with dependency status",
)
async def detailed_health_check() -> DetailedHealthResponse:
    """
    Detailed health check including dependency status.

    Checks connectivity to database and cache.
    """
    dependencies: dict[str, Any] = {
        "database": {"status": "ok", "type": "postgresql"},
        "cache": {"status": "ok", "type": "redis"},
        "llm": {"status": "ok", "provider": "anthropic"},
    }

    # TODO: Implement actual dependency checks
    # For now, return placeholder status

    return DetailedHealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc).isoformat(),
        environment=settings.environment,
        dependencies=dependencies,
    )


@router.get(
    "/ready",
    status_code=status.HTTP_200_OK,
    summary="Readiness Check",
    description="Kubernetes readiness probe endpoint",
)
async def readiness_check() -> dict[str, str]:
    """
    Readiness probe for Kubernetes.

    Returns 200 when the service is ready to accept traffic.
    """
    return {"status": "ready"}


@router.get(
    "/live",
    status_code=status.HTTP_200_OK,
    summary="Liveness Check",
    description="Kubernetes liveness probe endpoint",
)
async def liveness_check() -> dict[str, str]:
    """
    Liveness probe for Kubernetes.

    Returns 200 when the service is alive.
    """
    return {"status": "alive"}
