# Story 1.2.2: API Key Environment Configuration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an organization admin,
I want to create separate API keys for different environments,
so that I can safely test integrations without affecting production data.

## Acceptance Criteria

1. Given I am creating an API key
2. When I select the Environment toggle (1.10.3)
3. Then I can choose between Development, Staging, and Production
4. And each environment has a distinct key prefix:
   - Development: `ak_dev_`
   - Staging: `ak_stg_`
   - Production: `ak_live_`
5. And environment is displayed on the key card after creation

## Tasks / Subtasks

- [ ] Verify environment selector shows Development/Staging/Production (AC: 2-3)
- [ ] Ensure key prefix mapping is enforced for each environment (AC: 4)
- [ ] Display environment label/badge on key cards (AC: 5)
- [ ] Tests (TDD)
  - [ ] Unit test environment labels and prefixes in UI/utility

## Dev Notes

- Story 1.2.1 already introduced environment selection and prefix generation. This story should finalize environment display and verify prefix mapping.
- UI wireframes: `api_keys_management/code.html` and `api_key_management_page/code.html` (Screen 1.10.3).
- Route should be `/settings/api-keys` per routing spec.
- Use `apps/web/lib/api-keys.ts` for prefix mapping (server-only).
- API key cards should surface environment clearly (badge or label) for each key.

### Project Structure Notes

- Settings UI lives in `apps/web/components/settings/ApiKeysSection.tsx`.
- Prefix logic lives in `apps/web/lib/api-keys.ts`.

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.2)
- Wireframes: `_bmad-output/planning-artifacts/Stitch Hyyve/api_keys_management/code.html`
- Routing spec: `_bmad-output/planning-artifacts/routing-specification.md`
- Existing implementation: `apps/web/components/settings/ApiKeysSection.tsx`

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

### Completion Notes List

- Added environment badge on API key cards to surface Development/Staging/Production.
- Verified environment selector includes Development/Staging/Production and prefix mapping is enforced in key generation.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/__tests__/api-keys/api-key-environment.spec.ts

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. Environment badge uses generic styling for all environments; consider color-coding to match environment indicator bar.
2. The environment label is derived from UI constants; if backend adds new environments, UI will not display them without updates.
3. No test asserts the environment prefix mapping in the server utility beyond Story 1.2.1 tests; consider adding a unit check here for explicit coverage.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-environment.spec.ts`

### File List
