import { z } from 'zod';

export const ApiKeyEnvironmentSchema = z.enum([
  'development',
  'staging',
  'production',
]);

export const ApiKeyScopeSchema = z.enum([
  'chatbot:invoke',
  'chatbot:read',
  'chatbot:write',
  'module:invoke',
  'module:read',
  'module:write',
  'voice:invoke',
  'voice:read',
  'voice:write',
  'analytics:read',
  'webhook:manage',
]);

export const ApiKeyCreateSchema = z.object({
  name: z.string().trim().min(2).max(255),
  environment: ApiKeyEnvironmentSchema,
  scopes: z.array(ApiKeyScopeSchema).min(1),
  rateLimitPerMinute: z.number().int().min(1).max(100000).optional(),
  rateLimitPerDay: z.number().int().min(1).max(10000000).optional(),
  allowedIps: z.array(z.string().min(3)).optional(),
  allowedOrigins: z.array(z.string().min(4)).optional(),
  expiresInDays: z.number().int().min(1).max(3650).nullable().optional(),
});

export const ApiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  key_prefix: z.string(),
  scopes: z.array(ApiKeyScopeSchema),
  environment: ApiKeyEnvironmentSchema,
  project_id: z.string().uuid().nullable().optional(),
  created_at: z.string(),
  expires_at: z.string().nullable().optional(),
  last_used_at: z.string().nullable().optional(),
  revoked_at: z.string().nullable().optional(),
  rate_limit_per_minute: z.number(),
  rate_limit_per_day: z.number(),
  allowed_origins: z.array(z.string()).optional(),
  allowed_ips: z.array(z.string()).optional(),
});

export const ApiKeyListResponseSchema = z.object({
  items: z.array(ApiKeyResponseSchema),
});

export const ApiKeyCreateResponseSchema = z.object({
  apiKey: ApiKeyResponseSchema,
  fullKey: z.string(),
});

export const ApiKeyRevokeResponseSchema = z.object({
  apiKey: ApiKeyResponseSchema,
});

export type ApiKeyEnvironment = z.infer<typeof ApiKeyEnvironmentSchema>;
export type ApiKeyScope = z.infer<typeof ApiKeyScopeSchema>;
export type ApiKeyCreateInput = z.infer<typeof ApiKeyCreateSchema>;
export type ApiKeyResponse = z.infer<typeof ApiKeyResponseSchema>;
