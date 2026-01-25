/**
 * Hyyve Test Fixtures
 *
 * Central export for all test fixtures.
 * Import from this file in your tests.
 */

// Base fixtures
export { test, expect, BasePage, testUtils } from './base.fixture';
export type { HyyveFixtures } from './base.fixture';

// Builder fixtures
export { test as builderTest, ModuleBuilderPage, CanvasBuilderPage } from './builder.fixture';
export type { BuilderType, BuilderFixtures } from './builder.fixture';
