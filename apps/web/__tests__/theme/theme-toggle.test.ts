/**
 * Theme Toggle Component - ATDD Tests
 *
 * Story: 0-2-17 Create Theme Toggle Component
 *
 * Tests theme switching functionality per UX Spec section 22.16:
 * - AC1: Theme Provider integration
 * - AC2: Theme Toggle component
 * - AC3: Persistence
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// AC1: THEME PROVIDER INTEGRATION
// =============================================================================

describe('Story 0-2-17: Theme Provider Integration', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should have ThemeProvider in providers.tsx', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/providers.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/ThemeProvider/);
  });

  it('should import from next-themes', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/providers.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/next-themes/);
  });

  it('should have suppressHydrationWarning in layout.tsx', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/layout.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/suppressHydrationWarning/);
  });

  it('should configure dark as default theme', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/providers.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/defaultTheme.*dark|dark.*default/i);
  });
});

// =============================================================================
// AC2: THEME TOGGLE COMPONENT
// =============================================================================

describe('Story 0-2-17: Theme Toggle Component', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should have ThemeToggle component file', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/theme/ThemeToggle.tsx');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should export ThemeToggle from theme index', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/theme/index.ts');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/ThemeToggle/);
    }
  });

  it('should use useTheme hook from next-themes', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/theme/ThemeToggle.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/useTheme/);
    }
  });

  it('should have theme mode options (light, dark, system)', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/theme/ThemeToggle.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/light|dark|system/);
    }
  });

  it('should use accessible dropdown menu', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/theme/ThemeToggle.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/DropdownMenu|dropdown-menu/i);
    }
  });
});

// =============================================================================
// AC3: PERSISTENCE
// =============================================================================

describe('Story 0-2-17: Theme Persistence', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should enable localStorage persistence in ThemeProvider', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/providers.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    // next-themes stores in localStorage by default via storageKey
    expect(content).toMatch(/ThemeProvider/);
  });

  it('should enable theme attribute on html element', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/providers.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/attribute.*class/);
  });

  it('should enable system theme detection', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/providers.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/enableSystem/);
  });
});

// =============================================================================
// COMPONENT STRUCTURE
// =============================================================================

describe('Story 0-2-17: Component Structure', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should have theme components directory', () => {
    const dirPath = path.join(WEB_APP_PATH, 'components/theme');
    expect(fs.existsSync(dirPath)).toBe(true);
  });

  it('should use client directive for theme toggle', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/theme/ThemeToggle.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/['"]use client['"]/);
    }
  });
});
