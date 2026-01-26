/**
 * ATDD Tests for Story 0.1.17: Configure Agno Agent Framework (Python Backend)
 *
 * Validates the Python agent service structure and configuration.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const agentServicePath = join(projectRoot, 'apps/agent-service');

describe('Story 0.1.17: Configure Agno Agent Framework', () => {
  describe('AC1: Python Service Directory Structure', () => {
    it('should have apps/agent-service directory', () => {
      expect(existsSync(agentServicePath)).toBe(true);
    });

    it('should have src directory', () => {
      expect(existsSync(join(agentServicePath, 'src'))).toBe(true);
    });

    it('should have src/agents directory', () => {
      expect(existsSync(join(agentServicePath, 'src/agents'))).toBe(true);
    });

    it('should have src/tools directory', () => {
      expect(existsSync(join(agentServicePath, 'src/tools'))).toBe(true);
    });

    it('should have src/memory directory', () => {
      expect(existsSync(join(agentServicePath, 'src/memory'))).toBe(true);
    });

    it('should have src/workflows directory', () => {
      expect(existsSync(join(agentServicePath, 'src/workflows'))).toBe(true);
    });

    it('should have src/routers directory', () => {
      expect(existsSync(join(agentServicePath, 'src/routers'))).toBe(true);
    });

    it('should have pyproject.toml', () => {
      expect(existsSync(join(agentServicePath, 'pyproject.toml'))).toBe(true);
    });

    it('should have Dockerfile', () => {
      expect(existsSync(join(agentServicePath, 'Dockerfile'))).toBe(true);
    });
  });

  describe('AC2: Python Dependencies', () => {
    let pyprojectContent: string;

    beforeAll(() => {
      const pyprojectPath = join(agentServicePath, 'pyproject.toml');
      if (existsSync(pyprojectPath)) {
        pyprojectContent = readFileSync(pyprojectPath, 'utf-8');
      }
    });

    it('should specify agno dependency', () => {
      expect(pyprojectContent).toMatch(/agno/i);
    });

    it('should specify fastapi dependency', () => {
      expect(pyprojectContent).toMatch(/fastapi/i);
    });

    it('should specify uvicorn dependency', () => {
      expect(pyprojectContent).toMatch(/uvicorn/i);
    });

    it('should specify psycopg dependency for PostgreSQL', () => {
      expect(pyprojectContent).toMatch(/psycopg/i);
    });

    it('should specify redis dependency', () => {
      expect(pyprojectContent).toMatch(/redis/i);
    });

    it('should specify anthropic dependency for Claude', () => {
      expect(pyprojectContent).toMatch(/anthropic/i);
    });
  });

  describe('AC3: Agno Configuration', () => {
    let configContent: string;
    let baseAgentContent: string;

    beforeAll(() => {
      const configPath = join(agentServicePath, 'src/config.py');
      const baseAgentPath = join(agentServicePath, 'src/agents/base.py');

      if (existsSync(configPath)) {
        configContent = readFileSync(configPath, 'utf-8');
      }
      if (existsSync(baseAgentPath)) {
        baseAgentContent = readFileSync(baseAgentPath, 'utf-8');
      }
    });

    it('should have config.py file', () => {
      expect(existsSync(join(agentServicePath, 'src/config.py'))).toBe(true);
    });

    it('should have DATABASE_URL configuration', () => {
      expect(configContent).toMatch(/DATABASE_URL/);
    });

    it('should have REDIS_URL configuration', () => {
      expect(configContent).toMatch(/REDIS_URL/);
    });

    it('should have ANTHROPIC_API_KEY configuration', () => {
      expect(configContent).toMatch(/ANTHROPIC_API_KEY/);
    });

    it('should have base agent file', () => {
      expect(existsSync(join(agentServicePath, 'src/agents/base.py'))).toBe(
        true
      );
    });

    it('should configure add_history_to_context', () => {
      expect(baseAgentContent).toMatch(/add_history_to_context/);
    });

    it('should configure add_memories_to_context', () => {
      expect(baseAgentContent).toMatch(/add_memories_to_context/);
    });

    it('should configure enable_agentic_memory', () => {
      expect(baseAgentContent).toMatch(/enable_agentic_memory/);
    });
  });

  describe('AC4: FastAPI Application', () => {
    let mainContent: string;

    beforeAll(() => {
      const mainPath = join(agentServicePath, 'src/main.py');
      if (existsSync(mainPath)) {
        mainContent = readFileSync(mainPath, 'utf-8');
      }
    });

    it('should have main.py file', () => {
      expect(existsSync(join(agentServicePath, 'src/main.py'))).toBe(true);
    });

    it('should import FastAPI', () => {
      expect(mainContent).toMatch(/from fastapi import|import fastapi/);
    });

    it('should create FastAPI app instance', () => {
      expect(mainContent).toMatch(/FastAPI\(/);
    });

    it('should include routers', () => {
      expect(mainContent).toMatch(/include_router|app\.include/);
    });
  });

  describe('AC5: Health Check Endpoint', () => {
    let healthRouterContent: string;

    beforeAll(() => {
      const healthPath = join(agentServicePath, 'src/routers/health.py');
      if (existsSync(healthPath)) {
        healthRouterContent = readFileSync(healthPath, 'utf-8');
      }
    });

    it('should have health router file', () => {
      expect(existsSync(join(agentServicePath, 'src/routers/health.py'))).toBe(
        true
      );
    });

    it('should define health endpoint', () => {
      expect(healthRouterContent).toMatch(/\/health|@.*get.*health/i);
    });

    it('should return status in health response', () => {
      expect(healthRouterContent).toMatch(/status|healthy|ok/i);
    });
  });

  describe('AC6: Dockerfile', () => {
    let dockerfileContent: string;

    beforeAll(() => {
      const dockerfilePath = join(agentServicePath, 'Dockerfile');
      if (existsSync(dockerfilePath)) {
        dockerfileContent = readFileSync(dockerfilePath, 'utf-8');
      }
    });

    it('should use Python base image', () => {
      expect(dockerfileContent).toMatch(/FROM.*python/i);
    });

    it('should use Python 3.11 or higher', () => {
      expect(dockerfileContent).toMatch(/python:3\.(1[1-9]|[2-9][0-9])/i);
    });

    it('should copy pyproject.toml', () => {
      expect(dockerfileContent).toMatch(/COPY.*pyproject\.toml/i);
    });

    it('should install dependencies', () => {
      expect(dockerfileContent).toMatch(/pip install|uv pip|poetry install/i);
    });

    it('should configure uvicorn as entrypoint', () => {
      expect(dockerfileContent).toMatch(/uvicorn/i);
    });

    it('should expose a port', () => {
      expect(dockerfileContent).toMatch(/EXPOSE\s+\d+/i);
    });
  });

  describe('Package Initialization Files', () => {
    it('should have src/__init__.py', () => {
      expect(existsSync(join(agentServicePath, 'src/__init__.py'))).toBe(true);
    });

    it('should have src/agents/__init__.py', () => {
      expect(existsSync(join(agentServicePath, 'src/agents/__init__.py'))).toBe(
        true
      );
    });

    it('should have src/tools/__init__.py', () => {
      expect(existsSync(join(agentServicePath, 'src/tools/__init__.py'))).toBe(
        true
      );
    });

    it('should have src/memory/__init__.py', () => {
      expect(existsSync(join(agentServicePath, 'src/memory/__init__.py'))).toBe(
        true
      );
    });

    it('should have src/workflows/__init__.py', () => {
      expect(
        existsSync(join(agentServicePath, 'src/workflows/__init__.py'))
      ).toBe(true);
    });

    it('should have src/routers/__init__.py', () => {
      expect(
        existsSync(join(agentServicePath, 'src/routers/__init__.py'))
      ).toBe(true);
    });
  });
});
