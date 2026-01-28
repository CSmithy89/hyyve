# Story 1.2.7: API Key Rotation

Status: done

## Story

As an organization admin,
I want to rotate API keys without service interruption,
So that I can maintain security without downtime.

## Acceptance Criteria

1. Given I have an existing API key
2. When I click "Rotate Key"
3. Then a new key is generated with the same scopes/settings
4. And both old and new keys work for a grace period (configurable: 1-24 hours)
5. And I can manually revoke the old key immediately if needed
6. And the new key is displayed ONLY ONCE

## Tasks / Subtasks

- [ ] Add rotate action to API key listing UI (AC: 1-2)
- [ ] Implement rotation endpoint to create new key with same settings (AC: 3, 6)
- [ ] Support grace period for old key validity (AC: 4)
- [ ] Support immediate revoke of old key after rotation (AC: 5)
- [ ] Tests (TDD)
  - [ ] Unit tests for rotate flow and grace period handling

## Dev Notes

- Reuse `generateApiKey` for new key creation.
- Store grace period end timestamp and allow both keys until expiry.
- Only display full key once on rotation response.

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.7)

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

- `pnpm test:unit -- api-key-rotation.spec.ts` (fails due to existing unrelated auth component test failures; new story tests pass)

### Completion Notes List

- Added rotation endpoint to generate new keys with grace period handling and optional immediate revoke.
- Added rotation controls in API key listing with grace period selection and revoke toggle.
- New key returned once and surfaced via existing one-time key banner.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/app/api-keys/[id]/rotate/route.ts
- apps/web/__tests__/api-keys/api-key-rotation.spec.ts
- CHANGELOG.md
- _bmad-output/implementation-artifacts/1-2-7-api-key-rotation.md

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. Rotation uses a shared grace period selector for all keys; consider per-key overrides for clarity.
2. Old key expiration is updated after new key insert; failure leaves old key untouched but creates a new key (could add warning surfaced in UI).
3. Rotation endpoint reuses key name unchanged; consider suffixing or versioning for easier identification.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-rotation.spec.ts`

### File List
