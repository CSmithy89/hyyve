# Story 0.1.23: Configure Docker Compose for Local Development

## Story

As a **developer**,
I want **Docker Compose configured for local development**,
So that **all services can be run locally with a single command**.

## Acceptance Criteria

- **Given** all service configurations exist
- **When** I configure Docker Compose
- **Then** `docker-compose.yml` includes:
  ```yaml
  services:
    web:              # Next.js frontend
    agent-service:    # Agno Python backend
    temporal-worker:  # Temporal worker
    postgres:         # PostgreSQL (Supabase local)
    redis:            # Redis for caching/pubsub
    temporal:         # Temporal server
    langfuse:         # Langfuse (self-hosted)
  ```
- **And** `docker-compose.override.yml` for dev-specific config
- **And** `.env.docker` with container-specific environment
- **And** Volume mounts for hot reload
- **And** Health checks for all services
- **And** `pnpm docker:up` script starts all services
- **And** Supabase local development is configured

## Technical Notes

- Use Supabase CLI for local PostgreSQL + Auth emulation
- Temporal dev server for local workflow testing
- Mount source code for hot reload in development

## Creates

- docker-compose.yml
- docker-compose.override.yml
- .env.docker
- scripts/docker-up.sh

## Implementation Tasks

1. Create docker-compose.yml with all services
2. Create docker-compose.override.yml for development
3. Create .env.docker with container environment variables
4. Create scripts/docker-up.sh for easy startup
5. Add health checks for all services
6. Configure volume mounts for hot reload
7. Add docker:up and docker:down scripts to package.json
