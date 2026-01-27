import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',

    // Include patterns
    include: ['**/*.{test,spec}.{ts,tsx}'],

    // Exclude E2E tests (handled by Playwright)
    exclude: ['**/tests/e2e/**', '**/node_modules/**'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },

    // Global test setup
    setupFiles: ['./tests/support/vitest-setup.ts'],

    // Alias resolution for monorepo structure
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/tests': path.resolve(__dirname, './tests'),
      // Web app aliases for design system tests
      '@hyyve/web': path.resolve(__dirname, './apps/web'),
    },
  },
});
