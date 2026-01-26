#!/bin/bash

# Docker Compose Startup Script
# Story 0.1.23: Configure Docker Compose for Local Development
#
# This script starts all Hyyve platform services for local development.
# Usage: ./scripts/docker-up.sh [options]
#
# Options:
#   --build     Force rebuild of containers
#   --detach    Run in detached mode (background)
#   --fresh     Remove volumes and start fresh
#   --services  Start only specific services (comma-separated)
#   --help      Show this help message

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default options
BUILD=false
DETACH=false
FRESH=false
SERVICES=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD=true
            shift
            ;;
        --detach|-d)
            DETACH=true
            shift
            ;;
        --fresh)
            FRESH=true
            shift
            ;;
        --services)
            SERVICES="$2"
            shift 2
            ;;
        --help|-h)
            head -20 "$0" | tail -14
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Hyyve Platform - Docker Startup               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
    exit 1
fi

# Check Docker daemon is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker daemon is not running${NC}"
    exit 1
fi

# Fresh start - remove volumes
if [ "$FRESH" = true ]; then
    echo -e "${YELLOW}⚠ Fresh start requested - removing volumes...${NC}"
    docker compose down -v 2>/dev/null || true
    echo -e "${GREEN}✓ Volumes removed${NC}"
fi

# Check for .env.docker and create from example if needed
if [ ! -f ".env.docker.local" ] && [ -f ".env.docker" ]; then
    echo -e "${YELLOW}ℹ Creating .env.docker.local from .env.docker${NC}"
    cp .env.docker .env.docker.local
fi

# Build compose command
COMPOSE_CMD="docker compose"

# Add build flag if requested
if [ "$BUILD" = true ]; then
    COMPOSE_CMD="$COMPOSE_CMD up --build"
else
    COMPOSE_CMD="$COMPOSE_CMD up"
fi

# Add detach flag if requested
if [ "$DETACH" = true ]; then
    COMPOSE_CMD="$COMPOSE_CMD -d"
fi

# Add specific services if requested
if [ -n "$SERVICES" ]; then
    # Convert comma-separated to space-separated
    SERVICES_ARRAY=$(echo "$SERVICES" | tr ',' ' ')
    COMPOSE_CMD="$COMPOSE_CMD $SERVICES_ARRAY"
fi

echo -e "${BLUE}Starting services...${NC}"
echo -e "${YELLOW}Command: $COMPOSE_CMD${NC}"
echo ""

# Run docker compose
$COMPOSE_CMD

# If running in detached mode, show status
if [ "$DETACH" = true ]; then
    echo ""
    echo -e "${GREEN}✓ Services started in background${NC}"
    echo ""
    echo -e "${BLUE}Service URLs:${NC}"
    echo -e "  • Web (Next.js):      http://localhost:3000"
    echo -e "  • Agent Service:      http://localhost:8000"
    echo -e "  • Temporal UI:        http://localhost:8080"
    echo -e "  • Langfuse:           http://localhost:3001"
    echo -e "  • Supabase Studio:    http://localhost:3002"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  • View logs:          docker compose logs -f [service]"
    echo -e "  • Stop services:      pnpm docker:down"
    echo -e "  • Service status:     docker compose ps"
fi
