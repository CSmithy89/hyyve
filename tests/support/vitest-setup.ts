/**
 * Vitest Global Setup
 *
 * This file runs before all unit tests.
 * Add global mocks, matchers, or setup here.
 */

// Extend expect with custom matchers if needed
// import '@testing-library/jest-dom/vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Suppress console during tests (optional)
// beforeAll(() => {
//   vi.spyOn(console, 'log').mockImplementation(() => {});
//   vi.spyOn(console, 'warn').mockImplementation(() => {});
// });

// Clean up mocks after each test
afterEach(() => {
  // vi.clearAllMocks();
});
