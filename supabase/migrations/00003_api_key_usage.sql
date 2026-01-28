-- Migration: 00003_api_key_usage
-- Description: API key usage analytics table
-- Created: 2026-01-28

-- ==========================================================================
-- TABLES
-- ==========================================================================

CREATE TABLE api_key_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTE: Consider monthly partitions for production workloads.

-- ==========================================================================
-- INDEXES
-- ==========================================================================

CREATE INDEX idx_api_key_usage_key_id ON api_key_usage(api_key_id);
CREATE INDEX idx_api_key_usage_org_id ON api_key_usage(organization_id);
CREATE INDEX idx_api_key_usage_created_at ON api_key_usage(created_at);
