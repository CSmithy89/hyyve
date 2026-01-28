# Epic 1.2 Code Review TODOs

Source: Gemini Code Assist + CodeAnt + CodeRabbit on PR #6
Date: 2026-01-29

## P0 – Security / Tenant Isolation (must fix before merge)
- [x] **Multi-tenant org context**: Replace `getAdminOrganizationId` usage with an explicit org context (from session/claims or request param) and centralize in a shared helper. Prevent "first admin org" selection to avoid cross-tenant actions. (Routes: `apps/web/app/api-keys/route.ts`, `apps/web/app/api-keys/[id]/rotate/route.ts`, `apps/web/app/api-keys/[id]/revoke/route.ts`)
- [x] **RLS for api_key_usage**: Enable RLS + add read/insert policies scoped to organization membership in `supabase/migrations/00003_api_key_usage.sql`.
- [x] **RLS UPDATE policy hardening**: Add `WITH CHECK` to `api_keys` UPDATE policy to prevent cross-org reassignment. (`supabase/migrations/00002_api_keys.sql`)
- [x] **IP allowlist bypass**: Replace naive `x-forwarded-for` usage with a trusted IP extraction strategy (platform header or `NextRequest.ip`) and document trust boundaries. (`apps/web/app/api-key-test/route.ts`)

## P1 – Reliability / Error Handling / API Contract
- [x] **Guard JSON parse**: Wrap `request.json()` in try/catch for POST handlers (create + rotate) to return 400 on invalid JSON. (`apps/web/app/api-keys/route.ts`, `apps/web/app/api-keys/[id]/rotate/route.ts`)
- [x] **Handle helper errors**: Wrap `getAdminOrganizationId` calls in try/catch and return JSON 500 on failure. (same routes)
- [x] **Avoid leaking DB errors**: Replace `error.message` responses with generic 500 messages for Supabase errors in API routes. (create/list/rotate)
- [x] **Rotation atomicity**: Ensure rotate is atomic (transaction) or rollback new key if old key update fails. (`apps/web/app/api-keys/[id]/rotate/route.ts`)
- [x] **Rate-limit reset header**: When blocked, set reset time based on the limiting window (minute/day) instead of always `Math.min`. (`apps/web/lib/api-key-auth.ts`)
- [x] **Key prefix uniqueness**: Set `key_prefix` to a short prefix of the full key (e.g., first 10–12 chars) so it is key-specific. (`apps/web/lib/api-keys.ts`)

## P2 – Data Integrity / Types
- [x] **api_key_usage insert typing**: Remove `as any` and use correct insert type from generated DB types. (`apps/web/lib/api-key-auth.ts`)
- [x] **Environment enum**: Replace `environment TEXT` with enum type and use it in `api_keys` table. (`supabase/migrations/00002_api_keys.sql`)

## P3 – UX / UI Robustness
- [x] **Clipboard error handling**: Wrap clipboard writes in try/catch and show non-blocking error feedback. (`apps/web/components/settings/ApiKeysSection.tsx`)
- [x] **Confirm dialog**: Replace `window.confirm` with app-styled dialog for revoke. (`apps/web/components/settings/ApiKeysSection.tsx`)
- [x] **Sidebar active tab**: Use `startsWith('/settings/api-keys')` and validate `tab` param against allowed list. (`apps/web/components/settings/SettingsSidebar.tsx`)
- [x] **Perf memoization**: `useMemo` for `filteredKeys`/`expiringSoonKeys` if key list grows. (`apps/web/components/settings/ApiKeysSection.tsx`)
- [x] **Usage snapshot clarity**: Mark stats as sample data or wire real per-key analytics. (`apps/web/components/settings/ApiKeysSection.tsx`)

## P4 – Tests / Docs Hygiene
- [x] **ATDD path robustness**: Use `__dirname`-based pathing to avoid CWD assumptions in API key ATDD tests. (multiple `apps/web/__tests__/api-keys/*.spec.ts`)
- [x] **Reset test content**: Ensure content string is reset to empty when file missing to prevent stale assertions. (same tests)
- [x] **Tighten assertions**: Make tests check for specific error strings/status pairs (e.g., "IP not allowed" + 403; "CREATE TABLE api_key_usage").
- [x] **Story checklists**: Mark tasks as [x] where status is done; remove duplicate empty File List headers. (`_bmad-output/implementation-artifacts/1-2-3*.md`, `1-2-6*.md`, `1-2-7*.md`, `1-2-8*.md`, `1-2-9*.md`)

## Items to Verify Before Acting
- [x] **Next.js 15 params as Promise**: Confirm whether route handler `params` is async in this repo's Next.js version before changing. (Revoke/Rotate route handlers)
- [x] **CIDR allowlists**: Decide whether CIDR support is a requirement or future enhancement. (`apps/web/lib/api-key-auth.ts`)
