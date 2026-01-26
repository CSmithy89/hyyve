"""
Configuration Management

Centralized configuration using Pydantic Settings.
Environment variables are loaded from .env files and the environment.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "Hyyve Agent Service"
    app_version: str = "0.1.0"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Database (PostgreSQL)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/hyyve"

    # Cache (Redis)
    REDIS_URL: str = "redis://localhost:6379/0"

    # LLM Provider
    ANTHROPIC_API_KEY: str = ""

    # Agno Configuration
    agno_model: str = "claude-sonnet-4-20250514"
    agno_max_tokens: int = 4096
    agno_temperature: float = 0.7

    # Memory Configuration
    enable_memory: bool = True
    memory_namespace: str = "hyyve"

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Export settings instance for convenience
settings = get_settings()
