# Story 1.2.8: API Key Revocation

Status: done

## Story

As an organization admin,
I want to immediately revoke compromised API keys,
So that I can prevent unauthorized access.

## Acceptance Criteria

1. Given I am viewing an API key's details
2. When I click "Revoke Key" and confirm
3. Then the key is immediately invalidated
4. And `revoked_at` timestamp is recorded
5. And all subsequent requests using that key receive 401 Unauthorized
6. And the key card shows "Revoked" status

## Tasks / Subtasks

- [x] Add revoke action to API key listing UI (AC: 1-2, 6)
- [x] Implement revoke endpoint to set `revoked_at` (AC: 3-4)
- [x] Enforce revocation in API key auth flow (AC: 5)
- [x] Tests (TDD)
  - [x] Unit tests for revoke action and 401 enforcement

## Dev Notes

- Use `revoked_at` on `api_keys` table to invalidate keys.
- Surface status change in API key list UI.

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.8)

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

- `pnpm test:unit -- api-key-revocation.spec.ts` (fails due to existing unrelated auth component test failures; new story tests pass)

### Completion Notes List

- Added revoke endpoint to set `revoked_at` for API keys.
- Added revoke action with confirmation prompt and status update in UI.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/app/api-keys/[id]/revoke/route.ts
- apps/web/__tests__/api-keys/api-key-revocation.spec.ts
- CHANGELOG.md
- _bmad-output/implementation-artifacts/1-2-8-api-key-revocation.md

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. UI uses `window.confirm`; consider a styled modal for consistent UX and accessibility.
2. Revocation endpoint returns 400 for already-revoked keys; could be 200 idempotent for retry safety.
3. Revocation does not surface server response in UI; consider showing a toast for success.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-revocation.spec.ts`
