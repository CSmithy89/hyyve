-- Migration: 00002_api_keys
-- Description: API keys table for scoped key management
-- Created: 2026-01-28

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

  -- Key identification
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,

  -- Scopes and permissions
  scopes TEXT[] NOT NULL DEFAULT '{}',

  -- Rate limiting (defaults for future stories)
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 60,
  rate_limit_per_day INTEGER NOT NULL DEFAULT 10000,

  -- Restrictions
  allowed_origins TEXT[] NOT NULL DEFAULT '{}',
  allowed_ips TEXT[] NOT NULL DEFAULT '{}',

  -- Metadata
  environment TEXT NOT NULL DEFAULT 'production',
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,

  CONSTRAINT unique_api_key_hash UNIQUE (key_hash)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_api_keys_org_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_project_id ON api_keys(project_id);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Only org admins/owners can manage API keys
CREATE POLICY "Admins can view api keys"
  ON api_keys
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = api_keys.organization_id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can create api keys"
  ON api_keys
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = api_keys.organization_id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update api keys"
  ON api_keys
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = api_keys.organization_id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete api keys"
  ON api_keys
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = api_keys.organization_id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );
