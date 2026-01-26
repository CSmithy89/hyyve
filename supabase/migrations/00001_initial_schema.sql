-- Migration: 00001_initial_schema
-- Description: Initial database schema with multi-tenancy RLS
-- Created: 2026-01-26

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Organizations table
-- Root entity for multi-tenancy
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization members table
-- Links Clerk users to organizations with roles
CREATE TABLE organization_members (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

-- Workspaces table
-- Organizational unit within an organization
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
-- Container for workflows, chatbots, voice agents, etc.
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'module', 'chatbot', 'voice', 'canvas'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Organization members
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_org_id ON organization_members(organization_id);

-- Workspaces
CREATE INDEX idx_workspaces_org_id ON workspaces(organization_id);

-- Projects
CREATE INDEX idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX idx_projects_type ON projects(type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Organizations: Users can only see organizations they are members of
CREATE POLICY "Users can view their organizations"
  ON organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert organizations"
  ON organizations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Organization admins can update"
  ON organizations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- Organization members: Users can see members of orgs they belong to
CREATE POLICY "Users can view org members"
  ON organization_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert themselves as members"
  ON organization_members
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Admins can manage members"
  ON organization_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()::text
      AND om.role IN ('owner', 'admin')
    )
  );

-- Workspaces: Users can see workspaces in their organizations
CREATE POLICY "Users can view org workspaces"
  ON workspaces
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = workspaces.organization_id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create workspaces in their orgs"
  ON workspaces
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = workspaces.organization_id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update workspaces in their orgs"
  ON workspaces
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = workspaces.organization_id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Admins can delete workspaces"
  ON workspaces
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = workspaces.organization_id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- Projects: Users can see projects in their workspaces
CREATE POLICY "Users can view workspace projects"
  ON projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      JOIN organization_members ON organization_members.organization_id = workspaces.organization_id
      WHERE workspaces.id = projects.workspace_id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create projects in their workspaces"
  ON projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      JOIN organization_members ON organization_members.organization_id = workspaces.organization_id
      WHERE workspaces.id = projects.workspace_id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update projects in their workspaces"
  ON projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      JOIN organization_members ON organization_members.organization_id = workspaces.organization_id
      WHERE workspaces.id = projects.workspace_id
      AND organization_members.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Admins can delete projects"
  ON projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      JOIN organization_members ON organization_members.organization_id = workspaces.organization_id
      WHERE workspaces.id = projects.workspace_id
      AND organization_members.user_id = auth.uid()::text
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
