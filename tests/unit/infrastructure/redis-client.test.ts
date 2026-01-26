import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.8: Configure Redis Client
 *
 * ATDD Tests for Redis Client Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Redis Package Installed
 * - AC2: Redis Client Created
 * - AC3: Cache Utilities
 * - AC4: Pub/Sub Utilities
 * - AC5: Rate Limiting Helpers
 * - AC6: Serverless-Friendly Connection
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-8-configure-redis-client.md
 */

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const DB_PACKAGE_PATH = path.join(PROJECT_ROOT, 'packages', '@platform', 'db');

describe('Story 0.1.8: Configure Redis Client', () => {
  describe('AC1: Redis Package Installed', () => {
    let packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(DB_PACKAGE_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have redis or ioredis installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const hasRedis = deps['redis'] !== undefined || deps['ioredis'] !== undefined;
      expect(hasRedis).toBe(true);
    });
  });

  describe('AC2: Redis Client Created', () => {
    it('should have redis.ts file', () => {
      const redisPath = path.join(DB_PACKAGE_PATH, 'src', 'redis.ts');
      expect(fs.existsSync(redisPath)).toBe(true);
    });

    describe('redis.ts content', () => {
      let redisContent: string;

      beforeAll(() => {
        const redisPath = path.join(DB_PACKAGE_PATH, 'src', 'redis.ts');
        if (fs.existsSync(redisPath)) {
          redisContent = fs.readFileSync(redisPath, 'utf-8');
        } else {
          redisContent = '';
        }
      });

      it('should import from redis or ioredis', () => {
        const hasRedisImport =
          redisContent.includes("from 'redis'") ||
          redisContent.includes("from 'ioredis'") ||
          redisContent.includes('from "redis"') ||
          redisContent.includes('from "ioredis"');
        expect(hasRedisImport).toBe(true);
      });

      it('should use REDIS_URL environment variable', () => {
        expect(redisContent).toContain('REDIS_URL');
      });

      it('should export a function to get Redis client', () => {
        const hasExport =
          redisContent.includes('export function getRedisClient') ||
          redisContent.includes('export const getRedisClient') ||
          redisContent.includes('export const redis') ||
          redisContent.includes('export function createRedisClient');
        expect(hasExport).toBe(true);
      });
    });
  });

  describe('AC3: Cache Utilities', () => {
    let redisContent: string;

    beforeAll(() => {
      const redisPath = path.join(DB_PACKAGE_PATH, 'src', 'redis.ts');
      if (fs.existsSync(redisPath)) {
        redisContent = fs.readFileSync(redisPath, 'utf-8');
      } else {
        redisContent = '';
      }
    });

    it('should have cache get function', () => {
      const hasGet =
        redisContent.includes('cacheGet') ||
        redisContent.includes('getCache') ||
        redisContent.includes('get(');
      expect(hasGet).toBe(true);
    });

    it('should have cache set function', () => {
      const hasSet =
        redisContent.includes('cacheSet') ||
        redisContent.includes('setCache') ||
        redisContent.includes('set(') ||
        redisContent.includes('setex');
      expect(hasSet).toBe(true);
    });

    it('should support TTL for cache entries', () => {
      const hasTtl =
        redisContent.includes('ttl') ||
        redisContent.includes('TTL') ||
        redisContent.includes('expire') ||
        redisContent.includes('setex') ||
        redisContent.includes('EX');
      expect(hasTtl).toBe(true);
    });

    it('should handle JSON serialization', () => {
      const hasJson =
        redisContent.includes('JSON.stringify') ||
        redisContent.includes('JSON.parse');
      expect(hasJson).toBe(true);
    });
  });

  describe('AC4: Pub/Sub Utilities', () => {
    let redisContent: string;

    beforeAll(() => {
      const redisPath = path.join(DB_PACKAGE_PATH, 'src', 'redis.ts');
      if (fs.existsSync(redisPath)) {
        redisContent = fs.readFileSync(redisPath, 'utf-8');
      } else {
        redisContent = '';
      }
    });

    it('should have publish function', () => {
      const hasPublish =
        redisContent.includes('publish') || redisContent.includes('pub');
      expect(hasPublish).toBe(true);
    });

    it('should have subscribe function', () => {
      const hasSubscribe =
        redisContent.includes('subscribe') || redisContent.includes('sub');
      expect(hasSubscribe).toBe(true);
    });
  });

  describe('AC5: Rate Limiting Helpers', () => {
    let redisContent: string;

    beforeAll(() => {
      const redisPath = path.join(DB_PACKAGE_PATH, 'src', 'redis.ts');
      if (fs.existsSync(redisPath)) {
        redisContent = fs.readFileSync(redisPath, 'utf-8');
      } else {
        redisContent = '';
      }
    });

    it('should have rate limiting function', () => {
      const hasRateLimit =
        redisContent.includes('rateLimit') ||
        redisContent.includes('checkRateLimit') ||
        redisContent.includes('rateLimiter') ||
        redisContent.includes('incr');
      expect(hasRateLimit).toBe(true);
    });
  });

  describe('AC6: Serverless-Friendly Connection', () => {
    let redisContent: string;

    beforeAll(() => {
      const redisPath = path.join(DB_PACKAGE_PATH, 'src', 'redis.ts');
      if (fs.existsSync(redisPath)) {
        redisContent = fs.readFileSync(redisPath, 'utf-8');
      } else {
        redisContent = '';
      }
    });

    it('should implement singleton or lazy connection pattern', () => {
      const hasSingleton =
        redisContent.includes('let redis') ||
        redisContent.includes('let client') ||
        redisContent.includes('globalThis') ||
        redisContent.includes('lazyConnect') ||
        redisContent.includes('singleton');
      expect(hasSingleton).toBe(true);
    });
  });

  describe('Package Exports', () => {
    let indexContent: string;

    beforeAll(() => {
      const indexPath = path.join(DB_PACKAGE_PATH, 'src', 'index.ts');
      if (fs.existsSync(indexPath)) {
        indexContent = fs.readFileSync(indexPath, 'utf-8');
      } else {
        indexContent = '';
      }
    });

    it('should export redis utilities from index', () => {
      const hasRedisExport =
        indexContent.includes('./redis') ||
        indexContent.includes('redis') ||
        indexContent.includes('Redis');
      expect(hasRedisExport).toBe(true);
    });
  });

  describe('Environment Variables', () => {
    it('should have REDIS_URL in .env.example', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envContent).toContain('REDIS_URL');
    });
  });
});
