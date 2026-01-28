# Story 1.2.4: Enterprise IP Allowlisting

Status: done

## Story

As an enterprise organization admin,
I want to restrict API key usage to specific IP addresses,
so that my API keys can only be used from authorized locations.

## Acceptance Criteria

1. Given I am on the API Key configuration screen (1.10.3)
2. When I enter IP addresses in the IP Restrictions field
3. Then I can add multiple IP addresses (IPv4/IPv6)
4. And requests from non-allowed IPs receive 403 Forbidden
5. And empty allowlist means all IPs are permitted

## Tasks / Subtasks

- [ ] Add IP allowlist input to API key creation UI (AC: 1-3)
- [ ] Persist allowed IPs in API key creation endpoint (AC: 1-3)
- [ ] Enforce allowlist in API key auth flow (AC: 4-5)
- [ ] Tests (TDD)
  - [ ] Unit tests for allowlist UI and enforcement logic

## Dev Notes

- Use `allowed_ips` column in `api_keys` table (already present).
- Enforce allowlist in API key test endpoint using `x-forwarded-for` or `x-real-ip`.
- Empty allowlist should allow all requests.

### References

- Epic + story details: `_bmad-output/planning-artifacts/epics.md` (Story 1.2.4)
- Wireframes: `_bmad-output/planning-artifacts/Stitch Hyyve/api_keys_management/code.html`

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex CLI)

### Debug Log References

### Completion Notes List

- Added IP allowlist inputs (IPv4/IPv6) to API key creation UI and persisted to API.
- Added allowlist enforcement in API key auth flow with 403 for non-allowed IPs.

### File List

- apps/web/components/settings/ApiKeysSection.tsx
- apps/web/lib/validations/api-keys.ts
- apps/web/app/api-keys/route.ts
- apps/web/lib/api-key-auth.ts
- apps/web/app/api-key-test/route.ts
- apps/web/lib/mock-data/settings.ts
- apps/web/__tests__/api-keys/api-key-ip-allowlist.spec.ts

## Senior Developer Review

Outcome: APPROVE (with notes)

Findings:
1. Allowlist matching is exact string; consider CIDR support or trimming whitespace consistently.
2. IP extraction relies on headers; confirm reverse proxy behavior in production.
3. UI doesn’t validate IP format; could add basic validation to reduce invalid entries.

Test Coverage:
- Unit: `apps/web/__tests__/api-keys/api-key-ip-allowlist.spec.ts`

### File List
