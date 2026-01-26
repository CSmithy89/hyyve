/**
 * ATDD Tests for Story 0.1.23: Configure Docker Compose for Local Development
 *
 * Validates Docker Compose configuration for local development.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';

// Get project root
const projectRoot = join(__dirname, '../../..');

describe('Story 0.1.23: Configure Docker Compose for Local Development', () => {
  describe('Docker Compose Files', () => {
    it('should have docker-compose.yml', () => {
      expect(existsSync(join(projectRoot, 'docker-compose.yml'))).toBe(true);
    });

    it('should have docker-compose.override.yml', () => {
      expect(existsSync(join(projectRoot, 'docker-compose.override.yml'))).toBe(
        true
      );
    });
  });

  describe('Services Configuration', () => {
    let composeConfig: Record<string, unknown>;

    beforeAll(() => {
      const composePath = join(projectRoot, 'docker-compose.yml');
      if (existsSync(composePath)) {
        const content = readFileSync(composePath, 'utf-8');
        composeConfig = parseYaml(content) as Record<string, unknown>;
      }
    });

    it('should define services', () => {
      expect(composeConfig).toHaveProperty('services');
    });

    it('should have web service (Next.js frontend)', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('web');
    });

    it('should have agent-service (Python backend)', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('agent-service');
    });

    it('should have temporal-worker service', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('temporal-worker');
    });

    it('should have postgres service', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('postgres');
    });

    it('should have redis service', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('redis');
    });

    it('should have temporal service', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('temporal');
    });

    it('should have langfuse service', () => {
      const services = composeConfig.services as Record<string, unknown>;
      expect(services).toHaveProperty('langfuse');
    });
  });

  describe('Health Checks', () => {
    let composeContent: string;

    beforeAll(() => {
      const composePath = join(projectRoot, 'docker-compose.yml');
      if (existsSync(composePath)) {
        composeContent = readFileSync(composePath, 'utf-8');
      }
    });

    it('should have health checks configured', () => {
      expect(composeContent).toMatch(/healthcheck/i);
    });
  });

  describe('Volume Mounts', () => {
    let overrideContent: string;

    beforeAll(() => {
      const overridePath = join(projectRoot, 'docker-compose.override.yml');
      if (existsSync(overridePath)) {
        overrideContent = readFileSync(overridePath, 'utf-8');
      }
    });

    it('should have volume mounts for hot reload', () => {
      expect(overrideContent).toMatch(/volumes/i);
    });
  });

  describe('Environment File', () => {
    let envDockerContent: string;

    beforeAll(() => {
      const envPath = join(projectRoot, '.env.docker');
      if (existsSync(envPath)) {
        envDockerContent = readFileSync(envPath, 'utf-8');
      }
    });

    it('should have .env.docker file', () => {
      expect(existsSync(join(projectRoot, '.env.docker'))).toBe(true);
    });

    it('should contain database configuration', () => {
      expect(envDockerContent).toMatch(/DATABASE|POSTGRES|SUPABASE/i);
    });

    it('should contain Redis configuration', () => {
      expect(envDockerContent).toMatch(/REDIS/i);
    });
  });

  describe('Scripts', () => {
    let rootPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = join(projectRoot, 'package.json');
      if (existsSync(packagePath)) {
        rootPackageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      }
    });

    it('should have docker:up script', () => {
      const scripts = rootPackageJson.scripts as Record<string, string>;
      expect(scripts['docker:up']).toBeDefined();
    });

    it('should have docker:down script', () => {
      const scripts = rootPackageJson.scripts as Record<string, string>;
      expect(scripts['docker:down']).toBeDefined();
    });
  });

  describe('Startup Script', () => {
    it('should have scripts directory', () => {
      expect(existsSync(join(projectRoot, 'scripts'))).toBe(true);
    });

    it('should have docker-up.sh script', () => {
      expect(existsSync(join(projectRoot, 'scripts/docker-up.sh'))).toBe(true);
    });
  });
});
