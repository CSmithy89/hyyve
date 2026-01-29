# Story 1.2.3: API Key Rate Limiting

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an organization admin,
I want to set rate limits on API keys,
so that I can prevent abuse and control API usage costs.

## Acceptance Criteria

1. Given I am creating or editing an API key
2. When I configure rate limits
3. Then I can set:
   - Requests per minute (default: 60)
   - Requests per day (default: 10,000)
4. And the key card displays current rate limit (e.g., "1000 req/min")
5. And API returns 429 with X-RateLimit-* headers when exceeded

## Tasks / Subtasks

- [x] Add rate limit fields to API key creation UI (AC: 1-3)
- [x] Persist rate limits in API key creation endpoint (AC: 1-3)
- [x] Display rate limits on key cards (AC: 4)
- [x] Implement API key rate limiter using Redis (AC: 5)
- [x] Tests (TDD)
  - [x] Unit test rate limit UI fields and display
  - [x] Unit test presence of rate-limit headers logic

## Dev Notes

- Redis utilities exist in `packages/@platform/db/src/redis.ts` (use `checkRateLimitSimple`).
- Rate limit columns already exist in `api_keys` table: `rate_limit_per_minute`, `rate_limit_per_day`.
- Use headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- API key validation should use server-side admin Supabase client (service role) because there is no user session.

### Project Structure Notes

- Settings UI: `apps/web/components/settings/ApiKeysSection.tsx`
- API route: `apps/web/app/api-keys/route.ts`
- Redis utilities: `packages/@platform/db/src/redis.ts`

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.3)
- Technical notes: `_bmad-output/planning-artifacts/epics.md` (Rate limiting notes)
- Redis client: `packages/@platform/db/src/redis.ts`

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

### Completion Notes List

- Added rate limit inputs to API key creation (minute/day) and display on key cards.
- Persisted rate limits through API key creation endpoint.
- Added API key validation + Redis rate limit helper and test endpoint with 429 handling.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/lib/validations/api-keys.ts
- apps/web/app/api-keys/route.ts
- apps/web/lib/api-key-auth.ts
- apps/web/app/api-key-test/route.ts
- apps/web/lib/mock-data/settings.ts
- apps/web/__tests__/api-keys/api-key-rate-limits.spec.ts

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. `api-key-test` route is a placeholder; ensure it’s not exposed in production or document it as a diagnostic endpoint.
2. Rate limit headers only reflect minute limits; consider surfacing both minute/day limits for clarity.
3. API key validation uses service role key; verify environment configuration so it’s available in all deploy targets.
4. UI allows any numeric input; may need bounds or helper text for large values.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-rate-limits.spec.ts`
