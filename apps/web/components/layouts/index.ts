/**
 * Layout Shells - Barrel Export
 *
 * Story: 0-2-3 Create Layout Shells (App, Builder, Auth)
 *
 * This module exports all layout shell components and their TypeScript interfaces.
 *
 * Layouts:
 * - AppShell: Main authenticated layout for dashboard, settings, projects
 * - BuilderLayout: Three-panel layout for Module Builder, Chatbot Builder, etc.
 * - AuthLayout: Centered card layout for authentication pages
 */

export { AppShell } from './AppShell';
export type { AppShellProps } from './AppShell';

export { BuilderLayout } from './BuilderLayout';
export type { BuilderLayoutProps } from './BuilderLayout';

export { AuthLayout } from './AuthLayout';
export type { AuthLayoutProps } from './AuthLayout';
