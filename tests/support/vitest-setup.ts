/**
 * Vitest Global Setup
 *
 * This file runs before all unit tests.
 * Add global mocks, matchers, or setup here.
 */

import { afterEach, vi } from 'vitest';

// Extend expect with custom matchers from @testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Suppress console during tests (optional)
// beforeAll(() => {
//   vi.spyOn(console, 'log').mockImplementation(() => {});
//   vi.spyOn(console, 'warn').mockImplementation(() => {});
// });

// Clean up mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
