/**
 * ATDD Tests for Story 0.1.17: Configure Agno Agent Framework (Python Backend)
 *
 * Validates the Python agent service using AgentOS pattern.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const agentServicePath = join(projectRoot, 'apps/agent-service');

describe('Story 0.1.17: Configure Agno Agent Framework with AgentOS', () => {
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

    it('should specify agno dependency (includes AgentOS)', () => {
      expect(pyprojectContent).toMatch(/agno/i);
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

  describe('AC3: AgentOS Configuration', () => {
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

    it('should import AgentOS from agno.os', () => {
      expect(mainContent).toMatch(/from agno\.os import AgentOS/);
    });

    it('should create AgentOS instance', () => {
      expect(mainContent).toMatch(/AgentOS\(/);
    });

    it('should use agent_os.get_app() for FastAPI app', () => {
      expect(mainContent).toMatch(/get_app\(\)/);
    });

    it('should have agent definitions file', () => {
      expect(
        existsSync(join(agentServicePath, 'src/agents/definitions.py'))
      ).toBe(true);
    });

    it('should import agents and teams in main.py', () => {
      expect(mainContent).toMatch(/from src\.agents\.definitions import/);
    });
  });

  describe('AC4: Agent Definitions', () => {
    let definitionsContent: string;

    beforeAll(() => {
      const definitionsPath = join(
        agentServicePath,
        'src/agents/definitions.py'
      );
      if (existsSync(definitionsPath)) {
        definitionsContent = readFileSync(definitionsPath, 'utf-8');
      }
    });

    it('should define Bond agent', () => {
      expect(definitionsContent).toMatch(/bond\s*=\s*create_agent/);
      expect(definitionsContent).toMatch(/agent_id="bond"/);
    });

    it('should define Wendy agent', () => {
      expect(definitionsContent).toMatch(/wendy\s*=\s*create_agent/);
      expect(definitionsContent).toMatch(/agent_id="wendy"/);
    });

    it('should define Morgan agent', () => {
      expect(definitionsContent).toMatch(/morgan\s*=\s*create_agent/);
      expect(definitionsContent).toMatch(/agent_id="morgan"/);
    });

    it('should define Artie agent', () => {
      expect(definitionsContent).toMatch(/artie\s*=\s*create_agent/);
      expect(definitionsContent).toMatch(/agent_id="artie"/);
    });

    it('should configure add_history_to_context', () => {
      expect(definitionsContent).toMatch(/add_history_to_context=True/);
    });

    it('should configure add_memories_to_context', () => {
      expect(definitionsContent).toMatch(/add_memories_to_context=True/);
    });

    it('should configure enable_agentic_memory', () => {
      expect(definitionsContent).toMatch(/enable_agentic_memory=True/);
    });

    it('should define builder_team with all agents', () => {
      expect(definitionsContent).toMatch(/builder_team\s*=\s*Team\(/);
      expect(definitionsContent).toMatch(/team_id="hyyve-builders"/);
    });

    it('should export all_agents list', () => {
      expect(definitionsContent).toMatch(/all_agents\s*=/);
    });

    it('should export all_teams list', () => {
      expect(definitionsContent).toMatch(/all_teams\s*=/);
    });
  });

  describe('AC5: No Redundant Routers (AgentOS provides these)', () => {
    it('should NOT have src/routers directory', () => {
      expect(existsSync(join(agentServicePath, 'src/routers'))).toBe(false);
    });

    it('should NOT have custom health.py router', () => {
      expect(
        existsSync(join(agentServicePath, 'src/routers/health.py'))
      ).toBe(false);
    });

    it('should NOT have custom agents.py router', () => {
      expect(
        existsSync(join(agentServicePath, 'src/routers/agents.py'))
      ).toBe(false);
    });

    it('should NOT have old base.py file', () => {
      expect(existsSync(join(agentServicePath, 'src/agents/base.py'))).toBe(
        false
      );
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

  describe('Configuration Management', () => {
    let configContent: string;

    beforeAll(() => {
      const configPath = join(agentServicePath, 'src/config.py');
      if (existsSync(configPath)) {
        configContent = readFileSync(configPath, 'utf-8');
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
  });
});
