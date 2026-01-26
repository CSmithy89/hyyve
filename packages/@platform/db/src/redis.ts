import Redis from 'ioredis';

/**
 * Redis Client Configuration
 *
 * This file provides:
 * - Singleton Redis client for serverless environments
 * - Cache utilities with TTL support
 * - Pub/Sub publish/subscribe functions
 * - Rate limiting helpers
 */

// Singleton Redis client for connection reuse in serverless
let redisClient: Redis | null = null;

/**
 * Get the singleton Redis client
 * Uses lazy initialization for serverless compatibility
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: false,
      // For serverless, don't keep connections alive too long
      keepAlive: 10000,
    });

    // Handle connection errors gracefully
    redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  return redisClient;
}

/**
 * Close the Redis connection
 * Useful for cleanup in tests or graceful shutdown
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// ============================================================================
// Cache Utilities
// ============================================================================

/**
 * Get a cached value by key
 * @param key - Cache key
 * @returns Parsed value or null if not found
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  const data = await redis.get(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as T;
  } catch {
    // If not JSON, return as string (cast to T)
    return data as unknown as T;
  }
}

/**
 * Set a cached value with TTL
 * @param key - Cache key
 * @param value - Value to cache (will be JSON serialized)
 * @param ttlSeconds - Time to live in seconds
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const redis = getRedisClient();
  const serialized = JSON.stringify(value);
  await redis.setex(key, ttlSeconds, serialized);
}

/**
 * Delete a cached value
 * @param key - Cache key to delete
 */
export async function cacheDelete(key: string): Promise<void> {
  const redis = getRedisClient();
  await redis.del(key);
}

/**
 * Delete multiple cached values by pattern
 * @param pattern - Glob pattern (e.g., "user:*")
 */
export async function cacheDeletePattern(pattern: string): Promise<number> {
  const redis = getRedisClient();
  const keys = await redis.keys(pattern);

  if (keys.length === 0) {
    return 0;
  }

  return await redis.del(...keys);
}

// ============================================================================
// Pub/Sub Utilities
// ============================================================================

// Separate client for subscriptions (Redis requires dedicated connection for sub)
let subscriberClient: Redis | null = null;

/**
 * Get the subscriber client (separate from main client)
 */
function getSubscriberClient(): Redis {
  if (!subscriberClient) {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    subscriberClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }

  return subscriberClient;
}

/**
 * Publish a message to a channel
 * @param channel - Channel name
 * @param message - Message to publish (will be JSON serialized)
 */
export async function publish<T>(channel: string, message: T): Promise<number> {
  const redis = getRedisClient();
  const serialized = JSON.stringify(message);
  return await redis.publish(channel, serialized);
}

/**
 * Subscribe to a channel
 * @param channel - Channel name
 * @param handler - Function to handle received messages
 */
export async function subscribe<T>(
  channel: string,
  handler: (message: T, channel: string) => void
): Promise<void> {
  const subscriber = getSubscriberClient();

  subscriber.on('message', (ch, message) => {
    if (ch === channel) {
      try {
        const parsed = JSON.parse(message) as T;
        handler(parsed, ch);
      } catch {
        // If not JSON, pass as-is
        handler(message as unknown as T, ch);
      }
    }
  });

  await subscriber.subscribe(channel);
}

/**
 * Unsubscribe from a channel
 * @param channel - Channel name
 */
export async function unsubscribe(channel: string): Promise<void> {
  const subscriber = getSubscriberClient();
  await subscriber.unsubscribe(channel);
}

// ============================================================================
// Rate Limiting
// ============================================================================

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Check rate limit using sliding window algorithm
 * @param key - Rate limit key (e.g., "ratelimit:user:123:endpoint")
 * @param limit - Maximum number of requests allowed
 * @param windowSeconds - Time window in seconds
 * @returns Rate limit check result
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Use a sorted set for sliding window rate limiting
  const multi = redis.multi();

  // Remove old entries outside the window
  multi.zremrangebyscore(key, '-inf', windowStart);

  // Add current request
  multi.zadd(key, now, `${now}-${Math.random()}`);

  // Count requests in window
  multi.zcard(key);

  // Set expiry on the key
  multi.expire(key, windowSeconds);

  const results = await multi.exec();

  // Get count from zcard result (index 2)
  const count = (results?.[2]?.[1] as number) ?? 0;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetInSeconds: windowSeconds,
  };
}

/**
 * Simple increment-based rate limiter
 * Good for fixed window rate limiting
 * @param key - Rate limit key
 * @param limit - Maximum requests per window
 * @param windowSeconds - Window size in seconds
 */
export async function checkRateLimitSimple(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  const count = await redis.incr(key);

  if (count === 1) {
    // First request in window, set expiry
    await redis.expire(key, windowSeconds);
  }

  const ttl = await redis.ttl(key);

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetInSeconds: ttl > 0 ? ttl : windowSeconds,
  };
}

// ============================================================================
// Type Exports
// ============================================================================

export type { Redis };
