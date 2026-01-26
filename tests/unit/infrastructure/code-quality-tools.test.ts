/**
 * ATDD Tests for Story 0.1.14: Configure ESLint, Prettier, and Git Hooks
 *
 * These tests verify that code quality tools are properly configured
 * including ESLint, Prettier, Husky, lint-staged, and commitlint.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT_DIR = path.resolve(__dirname, '../../..');

describe('Story 0.1.14: Configure ESLint, Prettier, and Git Hooks', () => {
  describe('AC1: ESLint Configuration', () => {
    it('should have eslint.config.mjs at project root', () => {
      const configPath = path.join(ROOT_DIR, 'eslint.config.mjs');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should configure TypeScript ESLint plugin', () => {
      const configPath = path.join(ROOT_DIR, 'eslint.config.mjs');
      const content = fs.readFileSync(configPath, 'utf-8');

      expect(content).toContain('typescript-eslint');
    });

    it('should have unused variable rules configured', () => {
      const configPath = path.join(ROOT_DIR, 'eslint.config.mjs');
      const content = fs.readFileSync(configPath, 'utf-8');

      expect(content).toContain('no-unused-vars');
    });
  });

  describe('AC2: Prettier Configuration', () => {
    it('should have .prettierrc at project root', () => {
      const configPath = path.join(ROOT_DIR, '.prettierrc');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should configure consistent style settings', () => {
      const configPath = path.join(ROOT_DIR, '.prettierrc');
      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);

      // Check for common Prettier settings
      expect(config).toHaveProperty('semi');
      expect(config).toHaveProperty('singleQuote');
      expect(config).toHaveProperty('tabWidth');
    });
  });

  describe('AC3: Husky Git Hooks', () => {
    it('should have husky installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson.devDependencies?.husky).toBeDefined();
    });

    it('should have .husky/pre-commit hook', () => {
      const hookPath = path.join(ROOT_DIR, '.husky/pre-commit');
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it('should have pre-commit hook run lint-staged', () => {
      const hookPath = path.join(ROOT_DIR, '.husky/pre-commit');
      const content = fs.readFileSync(hookPath, 'utf-8');

      expect(content).toContain('lint-staged');
    });

    it('should have .husky/commit-msg hook', () => {
      const hookPath = path.join(ROOT_DIR, '.husky/commit-msg');
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it('should have commit-msg hook run commitlint', () => {
      const hookPath = path.join(ROOT_DIR, '.husky/commit-msg');
      const content = fs.readFileSync(hookPath, 'utf-8');

      expect(content).toContain('commitlint');
    });
  });

  describe('AC4: lint-staged Configuration', () => {
    it('should have lint-staged configuration in package.json', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson['lint-staged']).toBeDefined();
    });

    it('should run ESLint on TypeScript files', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      const tsConfig = packageJson['lint-staged']['*.{ts,tsx}'];
      expect(tsConfig).toBeDefined();
      expect(JSON.stringify(tsConfig)).toContain('eslint');
    });

    it('should run Prettier on JSON/MD/YAML files', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      const mdConfig = packageJson['lint-staged']['*.{json,md,yml,yaml}'];
      expect(mdConfig).toBeDefined();
      expect(JSON.stringify(mdConfig)).toContain('prettier');
    });
  });

  describe('AC5: Commitlint Configuration', () => {
    it('should have commitlint.config.js at project root', () => {
      const configPath = path.join(ROOT_DIR, 'commitlint.config.js');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should use conventional commits configuration', () => {
      const configPath = path.join(ROOT_DIR, 'commitlint.config.js');
      const content = fs.readFileSync(configPath, 'utf-8');

      expect(content).toContain('config-conventional');
    });

    it('should have @commitlint/cli installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson.devDependencies?.['@commitlint/cli']).toBeDefined();
    });

    it('should have @commitlint/config-conventional installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(
        packageJson.devDependencies?.['@commitlint/config-conventional']
      ).toBeDefined();
    });
  });
});
