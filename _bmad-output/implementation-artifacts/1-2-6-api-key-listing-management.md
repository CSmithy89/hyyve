# Story 1.2.6: API Key Listing & Management

Status: done

## Story

As an organization admin,
I want to view and manage all my organization's API keys,
So that I can maintain security oversight.

## Acceptance Criteria

1. Given I am on the API Keys Management page (1.10.3)
2. When the page loads
3. Then I see a list of all keys with:
   - Key name
   - Masked key display (showing prefix + last 4 chars)
   - Environment badge
   - Scopes/permissions summary
   - Created date
   - Last used date
   - Status (Active/Expired/Revoked)
4. And I can search/filter by name, environment, or status

## Tasks / Subtasks

- [ ] Add search and filter controls to API keys listing (AC: 4)
- [ ] Ensure key list displays required fields (AC: 3)
- [ ] Apply client-side filtering by name, environment, and status (AC: 4)
- [ ] Tests (TDD)
  - [ ] Unit tests for listing fields and filter UI

## Dev Notes

- Use existing API key list in `ApiKeysSection`.
- Filter client-side; keep API response shape consistent.
- Preserve existing layout and styling conventions.

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.6)

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

- `pnpm test:unit -- api-key-listing-management.spec.ts` (fails due to existing unrelated auth component test failures; new story tests pass)

### Completion Notes List

- Added search and filter controls (name, environment, status) to API key listing.
- Applied client-side filtering with empty state messaging.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/__tests__/api-keys/api-key-listing-management.spec.ts
- CHANGELOG.md
- _bmad-output/implementation-artifacts/1-2-6-api-key-listing-management.md

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. The "Active Keys" heading is misleading when filters include revoked/expired; consider renaming to "API Keys".
2. Search only targets key names; consider including key prefix or masked key for quicker discovery.
3. Filters are purely client-side; for large organizations, consider server-side pagination and filter params.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-listing-management.spec.ts`

### File List
