# Story 0.1.16: Create Initial Database Schema

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **the initial database schema created with RLS**,
So that **multi-tenancy is enforced from the start**.

## Acceptance Criteria

### AC1: Organizations Table

- **Given** Supabase is configured
- **When** I check the database schema
- **Then** `organizations` table exists with columns:
  - `id` (UUID, primary key)
  - `name` (text, not null)
  - `slug` (text, unique, not null)
  - `created_at` (timestamp with time zone)
- **And** RLS is enabled

### AC2: Organization Members Table

- **Given** organizations table exists
- **When** I check the schema
- **Then** `organization_members` table exists with columns:
  - `organization_id` (UUID, foreign key to organizations)
  - `user_id` (text, Clerk user ID)
  - `role` (text, not null)
  - `created_at` (timestamp with time zone)
- **And** Primary key is (organization_id, user_id)
- **And** RLS is enabled

### AC3: Workspaces Table

- **Given** organizations table exists
- **When** I check the schema
- **Then** `workspaces` table exists with columns:
  - `id` (UUID, primary key)
  - `organization_id` (UUID, foreign key to organizations)
  - `name` (text, not null)
  - `created_at` (timestamp with time zone)
- **And** RLS is enabled

### AC4: Projects Table

- **Given** workspaces table exists
- **When** I check the schema
- **Then** `projects` table exists with columns:
  - `id` (UUID, primary key)
  - `workspace_id` (UUID, foreign key to workspaces)
  - `name` (text, not null)
  - `type` (text, not null)
  - `created_at` (timestamp with time zone)
- **And** RLS is enabled

### AC5: RLS Policies

- **Given** all tables have RLS enabled
- **When** I check RLS policies
- **Then** organizations policy allows users to see orgs they belong to
- **And** workspaces policy allows users to see workspaces in their orgs
- **And** projects policy allows users to see projects in their workspaces

### AC6: Migration File

- **Given** schema is defined
- **When** I check migrations directory
- **Then** `supabase/migrations/00001_initial_schema.sql` exists
- **And** migration creates all tables
- **And** migration enables RLS on all tables
- **And** migration creates all RLS policies

## Technical Notes

### RLS Policy Pattern

Use Clerk `user_id` from JWT:
```sql
auth.uid()::text = organization_members.user_id
```

### Table Relationships

```
organizations
  └── organization_members (user_id from Clerk)
  └── workspaces
        └── projects
```

### Clerk JWT Integration

The `auth.uid()` function in Supabase will return the Clerk user ID when properly configured with a JWT template.

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/migrations/00001_initial_schema.sql` | Initial database schema |
| `supabase/config.toml` | Supabase local config |

## Files to Modify

| File | Changes |
|------|---------|
| `packages/@platform/db/src/types.ts` | Add generated database types |

## Dependencies

### Story Dependencies

- **Story 0.1.5** (Configure Supabase) - Supabase client must be configured

## Test Strategy

### Unit Tests

1. **Migration File Existence:**
   - Verify supabase/migrations directory exists
   - Verify migration file exists

2. **Schema Content Validation:**
   - Verify organizations table DDL
   - Verify organization_members table DDL
   - Verify workspaces table DDL
   - Verify projects table DDL
   - Verify RLS enabled statements
   - Verify RLS policy statements

## Definition of Done

- [x] `supabase/migrations/00001_initial_schema.sql` exists
- [x] organizations table with RLS
- [x] organization_members table with RLS
- [x] workspaces table with RLS
- [x] projects table with RLS
- [x] RLS policies enforce tenant isolation
- [x] Database types updated
- [x] `pnpm typecheck` passes
- [x] All ATDD tests pass

---

## Code Review

**Date:** 2026-01-26
**Reviewer:** Claude (Automated)
**Verdict:** APPROVED

### Summary

| Severity | Count |
|----------|-------|
| HIGH | 0 |
| MEDIUM | 0 |
| LOW | 0 |
| INFO | 2 |

### Findings

#### INFO-1: Manual Type Definitions

- **File:** `packages/@platform/db/src/types.ts`
- **Issue:** Types are manually defined rather than generated from schema
- **Recommendation:** Run `npx supabase gen types typescript` when database is available

#### INFO-2: Clerk JWT Configuration Required

- **Issue:** RLS policies use `auth.uid()` which requires Clerk JWT integration
- **Recommendation:** Configure Clerk JWT template with Supabase during deployment

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `supabase/migrations/00001_initial_schema.sql` | 234 | Initial database schema with RLS |
| `supabase/config.toml` | 51 | Supabase local development config |
| `tests/unit/infrastructure/database-schema.test.ts` | 230 | ATDD tests for schema validation |

### Files Modified

| File | Changes |
|------|---------|
| `packages/@platform/db/src/types.ts` | Added database types for all tables |

### Schema Summary

| Table | Columns | RLS Policies |
|-------|---------|--------------|
| organizations | 5 | 3 (select, insert, update) |
| organization_members | 4 | 3 (select, insert, manage) |
| workspaces | 6 | 4 (select, insert, update, delete) |
| projects | 7 | 4 (select, insert, update, delete) |

### Test Results

- **ATDD Tests:** 37/37 passed
- **TypeScript:** No errors
- **Build:** Successful

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
