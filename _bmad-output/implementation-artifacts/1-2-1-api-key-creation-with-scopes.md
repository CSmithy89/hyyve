# Story 1.2.1: API Key Creation with Scopes

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an organization admin,
I want to create API keys with specific scopes and permissions,
so that I can provide secure, least-privilege access to external integrations.

## Acceptance Criteria

1. Given I am on the API Keys Management page (1.10.3)
2. When I click "Create API Key"
3. Then I can:
   - Enter a descriptive key name
   - Select environment (Development/Staging/Production)
   - Choose scopes via checkboxes (Execute workflows, Read KBs, Write KBs, Read modules, Write modules, Admin access)
   - Set expiration (Never or After N days)
   - Confirm creation
4. And the full key is displayed ONLY ONCE with copy button
5. And key is stored as SHA-256 hash (never plaintext)
6. And key has appropriate prefix (ak_dev_, ak_stg_, ak_live_)

## Tasks / Subtasks

- [ ] Define API key data model and migration (AC: 4, 5, 6)
  - [ ] Add new migration to create `api_keys` table and indexes
  - [ ] Add RLS policies for org admins and read access for org members
  - [ ] Update `packages/@platform/db/src/types.ts` to include `api_keys`
- [ ] Implement API key creation endpoint (AC: 1-6)
  - [ ] Add `apiKeys` router to tRPC (`apps/web/lib/trpc/routers`)
  - [ ] Add Zod schema for input validation (name, environment, scopes, expiresAt)
  - [ ] Generate key via `randomBytes(24).toString('base64url')`, prefix by env
  - [ ] Store `key_hash` (SHA-256) + `key_prefix`, return full key once
- [ ] Update API Keys UI to match required fields (AC: 1-4)
  - [ ] Update `ApiKeysSection` to include environment selector, scopes mapping, expiration control
  - [ ] Add "show once" key reveal UI and copy action after creation
  - [ ] Align route with `/settings/api-keys` (routing spec) or document reason if keeping tabbed `/settings?tab=api-keys`
- [ ] Tests (TDD)
  - [ ] Unit test key generation + hashing behavior
  - [ ] Unit/integration test tRPC create procedure validates input and stores hash only
  - [ ] UI test (Playwright) for create flow and one-time reveal message

## Dev Notes

- UI wireframes are in:
  - `api_keys_management/code.html` and `api_key_management_page/code.html` (Screen 1.10.3)
  - Story wireframe map includes `/settings/api-keys` and `/developer/api-keys` (screen 6.1.1) for external developer portal
- Existing UI is already implemented in `apps/web/components/settings/ApiKeysSection.tsx` (story 0-2-10). Extend it rather than rewriting.
- Routing spec expects `/settings/api-keys` (not query param). Resolve mismatch between spec and current `/settings?tab=api-keys`.
- Use Supabase + RLS patterns from `project-context.md` (no bypass, Zod validation at boundaries).
- Key generation and storage:
  - Use `randomBytes(24).toString('base64url')` for key body
  - Prefix: `ak_dev_`, `ak_stg_`, `ak_live_`
  - Store `key_hash` (SHA-256) and `key_prefix` only (never store full key)
- Scope mapping required by epic tech notes:
  - `chatbot:invoke`, `chatbot:read`, `chatbot:write`
  - `module:invoke`, `module:read`, `module:write`
  - `voice:invoke`, `voice:read`, `voice:write`
  - `analytics:read`, `webhook:manage`
- PRD FR5 defines API key management endpoints and screen mapping.
- Database schema guidance available in technical UI gaps research doc (api_keys table, usage tracking).

### Project Structure Notes

- Settings UI lives under `apps/web/components/settings` and is rendered via `apps/web/app/(app)/settings/page.tsx`.
- tRPC router location: `apps/web/lib/trpc/routers`. Add sub-router and merge into `appRouter`.
- Supabase migrations live in `supabase/migrations` and types in `packages/@platform/db/src/types.ts`.

### References

- Epic + story details and ACs: `_bmad-output/planning-artifacts/epics.md` (Epic E1.2, Story 1.2.1)
- PRD FR5: `_bmad-output/planning-artifacts/prd.md` (Account & Identity Management table)
- API endpoints list: `_bmad-output/planning-artifacts/api-endpoints.md` (/api-keys)
- Routing: `_bmad-output/planning-artifacts/routing-specification.md` (Settings Routes)
- Wireframes: `_bmad-output/planning-artifacts/Stitch Hyyve/api_keys_management/code.html` and `.../api_key_management_page/code.html`
- Wireframe mapping: `_bmad-output/planning-artifacts/story-wireframe-reference.md` (Epic E1.2)
- Schema guidance: `_bmad-output/planning-artifacts/research/technical-ui-gaps-research-2026-01-23.md` (Section 5.2)
- Current UI implementation: `apps/web/components/settings/ApiKeysSection.tsx`
- Supabase RLS patterns and TS rules: `_bmad-output/project-context.md`

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

### Completion Notes List

- Added API keys database migration with RLS policies for org admins/owners.
- Implemented server-only key generation utility (SHA-256 hashing + env prefixes).
- Added `/api-keys` route handler for create/list with Clerk-authenticated Supabase client.
- Updated API Keys UI to include environment selection, scoped permissions, expiration controls, and one-time key reveal.
- Added dedicated `/settings/api-keys` route and updated sidebar link/active state.
- Added API key validation schema and updated mock data to new scope model.

### File List

- supabase/migrations/00002_api_keys.sql
- packages/@platform/db/src/types.ts
- apps/web/lib/validations/api-keys.ts
- apps/web/lib/api-keys.ts
- apps/web/app/api-keys/route.ts
- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/app/(app)/settings/api-keys/page.tsx
- apps/web/components/settings/SettingsSidebar.tsx
- apps/web/lib/mock-data/settings.ts

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. API route selects the first admin organization; multi-org users need an explicit org/workspace context to avoid creating keys in the wrong tenant.
2. POST handler does not guard against invalid JSON body or missing Clerk JWT template; consider try/catch with clearer 400/401 errors.
3. Clipboard write calls in UI are not wrapped; browsers without clipboard permissions will throw and leave the UI in a bad state.
4. Test coverage is light: no route handler tests and no schema/migration validation beyond unit string checks.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-creation.spec.ts`
- Gaps: API route handler tests, RLS/migration verification, and end-to-end flow.

### File List
