/**
 * ATDD Tests for Story 0.1.4: Initialize shadcn/ui Component Library
 *
 * These tests verify:
 * 1. components.json exists and is configured correctly
 * 2. Essential components exist in components/ui/
 * 3. Components use cn() utility
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const WEB_ROOT = path.resolve(__dirname, '../../../apps/web');
const UI_COMPONENTS_DIR = path.join(WEB_ROOT, 'components', 'ui');

// List of essential components that must be installed
const ESSENTIAL_COMPONENTS = [
  'button',
  'input',
  'label',
  'card',
  'dialog',
  'sheet',
  'dropdown-menu',
  'form',
  'tabs',
  'accordion',
  'tooltip',
  'table',
  'badge',
  'avatar',
  'sonner',
  'alert',
  'command',
  'popover',
];

describe('shadcn/ui Configuration (AC1, AC3)', () => {
  let config: Record<string, unknown>;

  beforeAll(() => {
    const configPath = path.join(WEB_ROOT, 'components.json');
    if (existsSync(configPath)) {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    }
  });

  it('components.json exists', () => {
    const configPath = path.join(WEB_ROOT, 'components.json');
    expect(
      existsSync(configPath),
      'components.json should exist in apps/web'
    ).toBe(true);
  });

  it('has New York style configured', () => {
    expect(config).toBeDefined();
    expect(config.style, 'Style should be "new-york"').toBe('new-york');
  });

  it('has Neutral base color configured', () => {
    expect(config).toBeDefined();
    // The base color is typically part of the tailwind config or referenced
    // In newer shadcn versions, it may be in tailwind.baseColor
    const tailwindConfig = config.tailwind as Record<string, unknown>;
    expect(tailwindConfig).toBeDefined();
    expect(
      tailwindConfig.baseColor,
      'Base color should be "neutral"'
    ).toBe('neutral');
  });

  it('has CSS variables enabled', () => {
    expect(config).toBeDefined();
    const tailwindConfig = config.tailwind as Record<string, unknown>;
    expect(tailwindConfig).toBeDefined();
    expect(
      tailwindConfig.cssVariables,
      'CSS variables should be enabled'
    ).toBe(true);
  });

  it('has correct component alias path', () => {
    expect(config).toBeDefined();
    const aliases = config.aliases as Record<string, string>;
    expect(aliases).toBeDefined();
    expect(
      aliases.components,
      'Component alias should point to @/components'
    ).toBe('@/components');
  });

  it('has correct utils alias path', () => {
    expect(config).toBeDefined();
    const aliases = config.aliases as Record<string, string>;
    expect(aliases).toBeDefined();
    expect(aliases.utils, 'Utils alias should point to @/lib/utils').toBe(
      '@/lib/utils'
    );
  });
});

describe('shadcn/ui Essential Components (AC2)', () => {
  ESSENTIAL_COMPONENTS.forEach((component) => {
    it(`${component} component exists in components/ui/`, () => {
      const componentPath = path.join(UI_COMPONENTS_DIR, `${component}.tsx`);
      expect(
        existsSync(componentPath),
        `Component ${component}.tsx should exist in components/ui/`
      ).toBe(true);
    });
  });
});

describe('shadcn/ui Components Use cn() Utility (AC4)', () => {
  // Test a sample of components to verify cn() usage
  const componentsToCheck = ['button', 'card', 'input', 'dialog'];

  componentsToCheck.forEach((component) => {
    it(`${component} component imports and uses cn() utility`, () => {
      const componentPath = path.join(UI_COMPONENTS_DIR, `${component}.tsx`);

      if (!existsSync(componentPath)) {
        // Skip if component doesn't exist (will be caught by existence tests)
        expect(true).toBe(true);
        return;
      }

      const content = readFileSync(componentPath, 'utf-8');

      // Check for cn import
      const hasCnImport =
        content.includes('import { cn }') ||
        content.includes('import {cn}') ||
        content.includes('from "@/lib/utils"') ||
        content.includes("from '@/lib/utils'");

      expect(
        hasCnImport,
        `${component} should import cn from @/lib/utils`
      ).toBe(true);

      // Check for cn usage (cn( or cn`)
      const hasCnUsage = content.includes('cn(') || content.includes('cn`');
      expect(hasCnUsage, `${component} should use cn() utility`).toBe(true);
    });
  });
});

describe('shadcn/ui Dependencies Installed', () => {
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    const packagePath = path.join(WEB_ROOT, 'package.json');
    if (existsSync(packagePath)) {
      packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    }
  });

  it('package.json exists', () => {
    expect(packageJson).toBeDefined();
  });

  it('has class-variance-authority installed', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['class-variance-authority']).toBeDefined();
  });

  it('has lucide-react installed for icons', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['lucide-react']).toBeDefined();
  });

  it('has react-hook-form installed for forms', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['react-hook-form']).toBeDefined();
  });

  it('has @hookform/resolvers installed for zod integration', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['@hookform/resolvers']).toBeDefined();
  });

  it('has sonner installed for toasts', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['sonner']).toBeDefined();
  });

  it('has cmdk installed for command palette', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['cmdk']).toBeDefined();
  });

  it('has @radix-ui/react-slot installed', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    expect(deps['@radix-ui/react-slot']).toBeDefined();
  });
});
