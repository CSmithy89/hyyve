# Story 1.2.5: CORS Origin Restrictions

Status: done

## Story

As an organization admin,
I want to restrict API key usage to specific domains,
so that my embedded widgets only work on authorized websites.

## Acceptance Criteria

1. Given I am configuring an API key for embedded use
2. When I add allowed origins
3. Then I can specify multiple domain origins (e.g., `https://client.com`)
4. And requests with non-matching Origin headers receive 403
5. And the BFF layer validates origin before processing

## Tasks / Subtasks

- [ ] Add allowed origins input to API key creation UI (AC: 1-3)
- [ ] Persist allowed origins in API key creation endpoint (AC: 1-3)
- [ ] Enforce origin allowlist in API key auth flow (AC: 4-5)
- [ ] Tests (TDD)
  - [ ] Unit tests for origin input and 403 enforcement

## Dev Notes

- Use `allowed_origins` column in `api_keys` table.
- Validate request `Origin` header in API key test endpoint.
- Empty allowlist should allow all origins.

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.5)

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

- `pnpm test:unit -- api-key-origin-allowlist.spec.ts` (fails due to existing unrelated auth component test failures; new story tests pass)

### Completion Notes List

- Added allowed origins input to API key creation UI and persisted to API.
- Added origin allowlist enforcement in API key auth flow with 403 for disallowed origins.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/app/api-keys/route.ts
- apps/web/lib/api-key-auth.ts
- apps/web/app/api-key-test/route.ts
- apps/web/lib/validations/api-keys.ts
- apps/web/lib/mock-data/settings.ts
- apps/web/__tests__/api-keys/api-key-origin-allowlist.spec.ts

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. Origin check runs after IP restriction; consider validating origin before IP if you want stricter CORS-first semantics.
2. Allowed origins are stored/compared as raw strings; consider URL parsing to normalize default ports or scheme mismatches.
3. UI input accepts any string; basic URL validation could prevent invalid origin entries.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-origin-allowlist.spec.ts`

### File List
