/**
 * ATDD Tests for Story 0.1.16: Create Initial Database Schema
 *
 * Validates the initial database schema with RLS for multi-tenancy.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');

describe('Story 0.1.16: Create Initial Database Schema', () => {
  let migrationContent: string;

  beforeAll(() => {
    const migrationPath = join(
      projectRoot,
      'supabase/migrations/00001_initial_schema.sql'
    );

    if (existsSync(migrationPath)) {
      migrationContent = readFileSync(migrationPath, 'utf-8');
    }
  });

  describe('AC1: Organizations Table', () => {
    it('should have migration file in supabase/migrations/', () => {
      const migrationPath = join(
        projectRoot,
        'supabase/migrations/00001_initial_schema.sql'
      );
      expect(existsSync(migrationPath)).toBe(true);
    });

    it('should create organizations table', () => {
      expect(migrationContent).toMatch(/CREATE TABLE.*organizations/i);
    });

    it('should have id column as UUID primary key', () => {
      expect(migrationContent).toMatch(
        /organizations[\s\S]*?id\s+UUID.*PRIMARY KEY|organizations[\s\S]*?PRIMARY KEY.*\(id\)/i
      );
    });

    it('should have name column', () => {
      expect(migrationContent).toMatch(/organizations[\s\S]*?name\s+TEXT/i);
    });

    it('should have slug column with unique constraint', () => {
      expect(migrationContent).toMatch(/organizations[\s\S]*?slug\s+TEXT/i);
      expect(migrationContent).toMatch(/slug.*UNIQUE|UNIQUE.*slug/i);
    });

    it('should have created_at column', () => {
      expect(migrationContent).toMatch(
        /organizations[\s\S]*?created_at\s+(TIMESTAMP|TIMESTAMPTZ)/i
      );
    });

    it('should enable RLS on organizations', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE.*organizations.*ENABLE ROW LEVEL SECURITY/i
      );
    });
  });

  describe('AC2: Organization Members Table', () => {
    it('should create organization_members table', () => {
      expect(migrationContent).toMatch(/CREATE TABLE.*organization_members/i);
    });

    it('should have organization_id as foreign key', () => {
      expect(migrationContent).toMatch(
        /organization_members[\s\S]*?organization_id\s+UUID/i
      );
      expect(migrationContent).toMatch(
        /organization_members[\s\S]*?REFERENCES.*organizations/i
      );
    });

    it('should have user_id column for Clerk user ID', () => {
      expect(migrationContent).toMatch(
        /organization_members[\s\S]*?user_id\s+TEXT/i
      );
    });

    it('should have role column', () => {
      expect(migrationContent).toMatch(
        /organization_members[\s\S]*?role\s+TEXT/i
      );
    });

    it('should have composite primary key', () => {
      expect(migrationContent).toMatch(
        /organization_members[\s\S]*?PRIMARY KEY.*\(organization_id.*user_id\)|PRIMARY KEY.*\(user_id.*organization_id\)/i
      );
    });

    it('should enable RLS on organization_members', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE.*organization_members.*ENABLE ROW LEVEL SECURITY/i
      );
    });
  });

  describe('AC3: Workspaces Table', () => {
    it('should create workspaces table', () => {
      expect(migrationContent).toMatch(/CREATE TABLE.*workspaces/i);
    });

    it('should have id column as UUID primary key', () => {
      expect(migrationContent).toMatch(
        /workspaces[\s\S]*?id\s+UUID.*PRIMARY KEY|workspaces[\s\S]*?PRIMARY KEY.*\(id\)/i
      );
    });

    it('should have organization_id as foreign key', () => {
      expect(migrationContent).toMatch(
        /workspaces[\s\S]*?organization_id\s+UUID/i
      );
      expect(migrationContent).toMatch(
        /workspaces[\s\S]*?REFERENCES.*organizations/i
      );
    });

    it('should have name column', () => {
      expect(migrationContent).toMatch(/workspaces[\s\S]*?name\s+TEXT/i);
    });

    it('should have created_at column', () => {
      expect(migrationContent).toMatch(
        /workspaces[\s\S]*?created_at\s+(TIMESTAMP|TIMESTAMPTZ)/i
      );
    });

    it('should enable RLS on workspaces', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE.*workspaces.*ENABLE ROW LEVEL SECURITY/i
      );
    });
  });

  describe('AC4: Projects Table', () => {
    it('should create projects table', () => {
      expect(migrationContent).toMatch(/CREATE TABLE.*projects/i);
    });

    it('should have id column as UUID primary key', () => {
      expect(migrationContent).toMatch(
        /projects[\s\S]*?id\s+UUID.*PRIMARY KEY|projects[\s\S]*?PRIMARY KEY.*\(id\)/i
      );
    });

    it('should have workspace_id as foreign key', () => {
      expect(migrationContent).toMatch(/projects[\s\S]*?workspace_id\s+UUID/i);
      expect(migrationContent).toMatch(
        /projects[\s\S]*?REFERENCES.*workspaces/i
      );
    });

    it('should have name column', () => {
      expect(migrationContent).toMatch(/projects[\s\S]*?name\s+TEXT/i);
    });

    it('should have type column', () => {
      expect(migrationContent).toMatch(/projects[\s\S]*?type\s+TEXT/i);
    });

    it('should have created_at column', () => {
      expect(migrationContent).toMatch(
        /projects[\s\S]*?created_at\s+(TIMESTAMP|TIMESTAMPTZ)/i
      );
    });

    it('should enable RLS on projects', () => {
      expect(migrationContent).toMatch(
        /ALTER TABLE.*projects.*ENABLE ROW LEVEL SECURITY/i
      );
    });
  });

  describe('AC5: RLS Policies', () => {
    it('should create RLS policy for organizations', () => {
      expect(migrationContent).toMatch(
        /CREATE POLICY.*ON.*organizations|CREATE POLICY.*organizations/i
      );
    });

    it('should create RLS policy for organization_members', () => {
      expect(migrationContent).toMatch(
        /CREATE POLICY[\s\S]*?ON\s+organization_members/i
      );
    });

    it('should create RLS policy for workspaces', () => {
      expect(migrationContent).toMatch(
        /CREATE POLICY.*ON.*workspaces|CREATE POLICY.*workspaces/i
      );
    });

    it('should create RLS policy for projects', () => {
      expect(migrationContent).toMatch(
        /CREATE POLICY.*ON.*projects|CREATE POLICY.*projects/i
      );
    });

    it('should use auth.uid() for user identification', () => {
      expect(migrationContent).toMatch(/auth\.uid\(\)/i);
    });
  });

  describe('AC6: Migration Structure', () => {
    it('should have supabase directory', () => {
      const supabasePath = join(projectRoot, 'supabase');
      expect(existsSync(supabasePath)).toBe(true);
    });

    it('should have migrations directory', () => {
      const migrationsPath = join(projectRoot, 'supabase/migrations');
      expect(existsSync(migrationsPath)).toBe(true);
    });

    it('should have valid SQL syntax (no trailing statements without semicolons)', () => {
      // Basic check - all CREATE/ALTER statements should end with semicolon
      const statements = migrationContent.match(
        /CREATE\s+(TABLE|POLICY|INDEX)|ALTER\s+TABLE/gi
      );
      const semicolons = migrationContent.match(/;\s*$/gm);
      // Should have at least as many semicolons as statements
      expect(semicolons?.length).toBeGreaterThanOrEqual(statements?.length ?? 0);
    });

    it('should create tables in correct order (dependencies first)', () => {
      const orgIndex = migrationContent.indexOf('CREATE TABLE');
      const wsIndex = migrationContent.indexOf('workspaces');
      const projIndex = migrationContent.indexOf('projects');

      // workspaces depends on organizations, projects depends on workspaces
      expect(wsIndex).toBeGreaterThan(orgIndex);
      expect(projIndex).toBeGreaterThan(wsIndex);
    });
  });

  describe('Database Types', () => {
    it('should have database types file', () => {
      const typesPath = join(
        projectRoot,
        'packages/@platform/db/src/types.ts'
      );
      expect(existsSync(typesPath)).toBe(true);
    });

    it('should export Database type', () => {
      const typesPath = join(
        projectRoot,
        'packages/@platform/db/src/types.ts'
      );
      const typesContent = readFileSync(typesPath, 'utf-8');
      expect(typesContent).toMatch(/export.*type.*Database/);
    });
  });
});
