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
  expiresInDays: z.number().int().min(1).max(3650).nullable().optional(),
});

export type ApiKeyEnvironment = z.infer<typeof ApiKeyEnvironmentSchema>;
export type ApiKeyScope = z.infer<typeof ApiKeyScopeSchema>;
export type ApiKeyCreateInput = z.infer<typeof ApiKeyCreateSchema>;
