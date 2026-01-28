/**
 * Database Types
 *
 * This file contains the Supabase database type definitions.
 * These types are manually defined to match the schema in supabase/migrations/00001_initial_schema.sql
 *
 * To regenerate from actual database:
 * npx supabase gen types typescript --local > packages/@platform/db/src/types.ts
 */

// ============================================================================
// ENUMS
// ============================================================================

export type OrganizationMemberRole = 'owner' | 'admin' | 'member';

export type ProjectType = 'module' | 'chatbot' | 'voice' | 'canvas';
export type ApiKeyEnvironment = 'development' | 'staging' | 'production';

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationInsert {
  id?: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationUpdate {
  id?: string;
  name?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role: OrganizationMemberRole;
  created_at: string;
}

export interface OrganizationMemberInsert {
  organization_id: string;
  user_id: string;
  role?: OrganizationMemberRole;
  created_at?: string;
}

export interface OrganizationMemberUpdate {
  organization_id?: string;
  user_id?: string;
  role?: OrganizationMemberRole;
  created_at?: string;
}

export interface Workspace {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceInsert {
  id?: string;
  organization_id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceUpdate {
  id?: string;
  organization_id?: string;
  name?: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  type: ProjectType;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  id?: string;
  workspace_id: string;
  name: string;
  type: ProjectType;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectUpdate {
  id?: string;
  workspace_id?: string;
  name?: string;
  type?: ProjectType;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  project_id: string | null;
  name: string;
  key_prefix: string;
  key_hash: string;
  scopes: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  allowed_origins: string[];
  allowed_ips: string[];
  environment: ApiKeyEnvironment;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
  revoked_at: string | null;
}

export interface ApiKeyInsert {
  id?: string;
  organization_id: string;
  project_id?: string | null;
  name: string;
  key_prefix: string;
  key_hash: string;
  scopes?: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_day?: number;
  allowed_origins?: string[];
  allowed_ips?: string[];
  environment?: ApiKeyEnvironment;
  expires_at?: string | null;
  last_used_at?: string | null;
  created_at?: string;
  revoked_at?: string | null;
}

export interface ApiKeyUpdate {
  id?: string;
  organization_id?: string;
  project_id?: string | null;
  name?: string;
  key_prefix?: string;
  key_hash?: string;
  scopes?: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_day?: number;
  allowed_origins?: string[];
  allowed_ips?: string[];
  environment?: ApiKeyEnvironment;
  expires_at?: string | null;
  last_used_at?: string | null;
  created_at?: string;
  revoked_at?: string | null;
}

export interface ApiKeyUsage {
  id: string;
  api_key_id: string;
  organization_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ApiKeyUsageInsert {
  id?: string;
  api_key_id: string;
  organization_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms?: number | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

export interface ApiKeyUsageUpdate {
  id?: string;
  api_key_id?: string;
  organization_id?: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
  response_time_ms?: number | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

// ============================================================================
// DATABASE TYPE (Supabase format)
// ============================================================================

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: OrganizationInsert;
        Update: OrganizationUpdate;
        Relationships: [];
      };
      organization_members: {
        Row: OrganizationMember;
        Insert: OrganizationMemberInsert;
        Update: OrganizationMemberUpdate;
        Relationships: [
          {
            foreignKeyName: 'organization_members_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      workspaces: {
        Row: Workspace;
        Insert: WorkspaceInsert;
        Update: WorkspaceUpdate;
        Relationships: [
          {
            foreignKeyName: 'workspaces_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [
          {
            foreignKeyName: 'projects_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      api_keys: {
        Row: ApiKey;
        Insert: ApiKeyInsert;
        Update: ApiKeyUpdate;
        Relationships: [
          {
            foreignKeyName: 'api_keys_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'api_keys_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      api_key_usage: {
        Row: ApiKeyUsage;
        Insert: ApiKeyUsageInsert;
        Update: ApiKeyUsageUpdate;
        Relationships: [
          {
            foreignKeyName: 'api_key_usage_api_key_id_fkey';
            columns: ['api_key_id'];
            isOneToOne: false;
            referencedRelation: 'api_keys';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'api_key_usage_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      organization_member_role: OrganizationMemberRole;
      project_type: ProjectType;
    };
  };
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
