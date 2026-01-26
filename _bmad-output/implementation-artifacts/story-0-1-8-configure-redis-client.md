# Story 0.1.8: Configure Redis Client

## Status

**ready-for-dev**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **Redis configured for caching and pub/sub**,
So that **real-time features and session management are supported**.

## Acceptance Criteria

### AC1: Redis Package Installed

- **Given** a Redis instance is available (Upstash or self-hosted)
- **When** I configure the Redis client
- **Then** `redis` or `ioredis` package is installed

### AC2: Redis Client Created

- **Given** Redis package is installed
- **When** I create the Redis client
- **Then** Redis client is exported from `packages/@platform/db/src/redis.ts`
- **And** connection uses `REDIS_URL` environment variable

### AC3: Cache Utilities

- **Given** Redis client is configured
- **When** I create cache utilities
- **Then** utility functions exist for cache get/set with TTL
- **And** serialization handles JSON objects

### AC4: Pub/Sub Utilities

- **Given** Redis client is configured
- **When** I create pub/sub utilities
- **Then** utility functions exist for publish/subscribe
- **And** handlers can be registered for channels

### AC5: Rate Limiting Helpers

- **Given** Redis client is configured
- **When** I create rate limiting utilities
- **Then** sliding window or token bucket rate limiter is available
- **And** can be used for API endpoint protection

### AC6: Serverless-Friendly Connection

- **Given** Redis client is configured
- **When** deployed to serverless environment
- **Then** connection pooling is configured appropriately
- **And** connections are reused across invocations

## Technical Notes

### Redis Client Setup

```typescript
// packages/@platform/db/src/redis.ts
import Redis from 'ioredis';

// Singleton pattern for serverless
let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redis;
}
```

### Cache Utilities

```typescript
// Cache with TTL
export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
}
```

### Rate Limiting

```typescript
// Sliding window rate limiter
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REDIS_URL` | Redis connection URL (redis:// or rediss://) | Yes |

## Files to Create

| File | Purpose |
|------|---------|
| `packages/@platform/db/src/redis.ts` | Redis client and utilities |

## Files to Modify

| File | Changes |
|------|---------|
| `packages/@platform/db/package.json` | Add redis/ioredis dependency |
| `packages/@platform/db/src/index.ts` | Export Redis utilities |
| `.env.example` | Add REDIS_URL variable |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo) - Package structure must exist
- **Story 0.1.5** (Configure Supabase) - Database package exists

### Package Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `ioredis` | ^5.x | Redis client with TypeScript support |

## Test Strategy

### Unit Tests

1. **Package Verification:**
   - Verify redis/ioredis package is installed

2. **File Structure:**
   - Verify redis.ts exists
   - Verify exports from index.ts

3. **Function Exports:**
   - Verify cache get/set functions exist
   - Verify pub/sub functions exist
   - Verify rate limit functions exist

### Build Verification

```bash
pnpm install
pnpm build
pnpm typecheck
```

## Definition of Done

- [ ] `ioredis` or `redis` package installed
- [ ] Redis client exported from `packages/@platform/db/src/redis.ts`
- [ ] Cache get/set with TTL utilities
- [ ] Pub/Sub publish/subscribe utilities
- [ ] Rate limiting helper functions
- [ ] Serverless-friendly connection management
- [ ] `REDIS_URL` documented in `.env.example`
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` passes

---

## Code Review

**Reviewer:** Senior Developer (AI)
**Date:** 2026-01-26
**Decision:** ✅ APPROVED

### Acceptance Criteria Validation

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC1 | Redis package installed | ✅ IMPLEMENTED | `ioredis: ^5.9.2` in package.json:36 |
| AC2 | Redis client created | ✅ IMPLEMENTED | `getRedisClient()` in redis.ts:20, uses `REDIS_URL` |
| AC3 | Cache utilities | ✅ IMPLEMENTED | `cacheGet`, `cacheSet`, `cacheDelete`, `cacheDeletePattern` with TTL & JSON |
| AC4 | Pub/Sub utilities | ✅ IMPLEMENTED | `publish`, `subscribe`, `unsubscribe` with separate subscriber client |
| AC5 | Rate limiting helpers | ✅ IMPLEMENTED | `checkRateLimit` (sliding window), `checkRateLimitSimple` (fixed window) |
| AC6 | Serverless-friendly | ✅ IMPLEMENTED | Singleton pattern with `lazyConnect: true`, `keepAlive: 10000` |

### Findings Summary

- **0 HIGH** | **1 MEDIUM** | **3 LOW** | **2 INFO**

### Medium Issues

1. **Unrelated file in staging** - `apps/web/app/page.tsx` contains `export const dynamic = 'force-dynamic'` from Story 0.1.6 (Clerk Auth). Documented but not blocking.

### Low Issues

1. Missing explicit `./redis` export path in package.json (optional enhancement)
2. Silent JSON parse fallback in `cacheGet` could mask data issues
3. Subscriber client lacks dedicated cleanup function

### Library Validation (Context7)

- ✅ Implementation follows ioredis best practices
- ✅ Lazy connect pattern correctly implemented
- ✅ Separate client for subscriptions (as documented)
- ✅ Sorted sets used correctly for sliding window rate limiting

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
