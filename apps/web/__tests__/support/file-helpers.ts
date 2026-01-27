/**
 * Test File Helpers
 *
 * Shared utilities for reading and validating files in tests.
 * Provides consistent error handling and clearer test failure messages.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Path to the web app root
 */
export const WEB_APP_PATH = join(process.cwd(), 'apps/web');

/**
 * Result of a file read operation
 */
export interface FileReadResult {
  /** Whether the file exists */
  exists: boolean;
  /** File content (empty string if file doesn't exist) */
  content: string;
  /** Full path to the file */
  fullPath: string;
}

/**
 * Safely read a file and return its content with existence status.
 * Returns empty string for content if file doesn't exist.
 *
 * @param relativePath - Path relative to WEB_APP_PATH
 * @returns FileReadResult with exists flag and content
 */
export function readFileContent(relativePath: string): FileReadResult {
  const fullPath = join(WEB_APP_PATH, relativePath);
  const exists = existsSync(fullPath);

  return {
    exists,
    content: exists ? readFileSync(fullPath, 'utf-8') : '',
    fullPath,
  };
}

/**
 * Read a file and return its content, or empty string if not found.
 * Use this when you want to check content with matchers that may fail.
 *
 * @param relativePath - Path relative to WEB_APP_PATH
 * @returns File content or empty string
 */
export function safeReadFile(relativePath: string): string {
  const fullPath = join(WEB_APP_PATH, relativePath);
  if (existsSync(fullPath)) {
    return readFileSync(fullPath, 'utf-8');
  }
  return '';
}

/**
 * Read a file that is expected to exist. Throws a descriptive error if missing.
 * Use this when file existence is already verified in a separate test.
 *
 * @param relativePath - Path relative to WEB_APP_PATH
 * @returns File content
 * @throws Error with helpful message if file is missing
 */
export function readRequiredFile(relativePath: string): string {
  const fullPath = join(WEB_APP_PATH, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(
      `Required file not found: ${relativePath}\n` +
        `Full path: ${fullPath}\n` +
        `Tip: Ensure the file exists before running content tests.`
    );
  }
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Check if a file exists at the given path.
 *
 * @param relativePath - Path relative to WEB_APP_PATH
 * @returns true if file exists
 */
export function fileExists(relativePath: string): boolean {
  return existsSync(join(WEB_APP_PATH, relativePath));
}

/**
 * Create a content reader that initializes with empty content.
 * Useful in beforeEach/beforeAll to avoid uninitialized variables.
 *
 * @param relativePath - Path relative to WEB_APP_PATH
 * @returns Object with content property and load method
 */
export function createFileReader(relativePath: string) {
  let content = '';
  let loaded = false;

  return {
    get content() {
      return content;
    },
    get isLoaded() {
      return loaded;
    },
    load() {
      const result = readFileContent(relativePath);
      content = result.content;
      loaded = result.exists;
      return result.exists;
    },
  };
}
