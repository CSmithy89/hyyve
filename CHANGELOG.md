# Changelog

All notable changes to the Hyyve Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [Story 0.1.1] Scaffold Turborepo Monorepo with Next.js 15

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Monorepo Structure** with Turborepo for orchestrated builds
  - `apps/web/` - Next.js 15 frontend application with App Router
  - `apps/web/app/` - App Router pages directory
  - `apps/web/components/` - React components directory
  - `apps/web/hooks/` - Custom React hooks directory
  - `apps/web/lib/` - Utilities and clients directory
  - `apps/web/stores/` - Zustand stores directory

- **Shared Packages** under `packages/@platform/`
  - `@platform/ui` - Shared UI components package
  - `@platform/db` - Supabase client & types package
  - `@platform/auth` - Authentication helpers package
  - `packages/tsconfig/` - Shared TypeScript configurations

- **Core Dependencies**
  - Next.js 15.5.8 with App Router
  - React 19.2.3 and React DOM 19.2.3
  - TypeScript 5.8.3
  - Zustand 5.0.8 for state management
  - Zod 4.0.1 for schema validation
  - @xyflow/react 12.10.0 for flow diagrams

- **Agent Protocol Dependencies**
  - @ag-ui/client 0.0.43 for AG-UI streaming
  - @copilotkit/a2ui-renderer 1.51.2 for A2UI rendering
  - @copilotkit/react-ui 1.51.2 for CopilotKit integration

- **Styling Infrastructure**
  - Tailwind CSS 4.1.8
  - PostCSS 8.5.4
  - Autoprefixer 10.4.21
  - `tailwind.config.ts` with proper content paths for monorepo
  - `postcss.config.js` with tailwindcss and autoprefixer plugins

- **Testing Infrastructure**
  - Playwright 1.51.0 for E2E testing
  - Vitest 4.0.1 for unit testing
  - @vitest/coverage-v8 4.0.1 for coverage reporting

- **Code Quality Tools**
  - ESLint 9.x with TypeScript support
  - Prettier 3.8.1
  - Husky 9.x for git hooks
  - lint-staged 16.x for pre-commit linting

- **Configuration Files**
  - `turbo.json` - Turborepo pipeline configuration (build, lint, typecheck, test, dev)
  - `pnpm-workspace.yaml` - pnpm workspace configuration
  - `.nvmrc` - Node.js 20.x version specification
  - Root `package.json` with workspace scripts

#### Technical

- **Package Manager:** pnpm 10.15.0 with workspace protocol (`workspace:*`)
- **Turbo Pipelines:**
  - `build` - Depends on ^build, outputs .next/** and dist/**
  - `lint` - Depends on ^lint
  - `typecheck` - Depends on ^typecheck
  - `test` - Depends on ^build
  - `dev` - No cache, persistent mode
- **Path Aliases:** Configured `@/` for app-local imports, `@platform/` for shared packages
- **Workspace Links:** All @platform packages linked via pnpm workspace protocol

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer_

### [Story 0.1.2] Configure TypeScript with Strict Mode

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Base TypeScript Configuration** (`packages/tsconfig/base.json`)
  - Central strict mode configuration for all packages
  - Target ES2022 with bundler module resolution

- **Specialized Configurations**
  - `packages/tsconfig/nextjs.json` - Next.js App Router settings with JSX support
  - `packages/tsconfig/react-library.json` - Shared React component packages with declaration files

#### Changed

- **apps/web/tsconfig.json** - Updated to extend shared nextjs.json config
- **Path Alias Resolution** - Changed from wildcard pattern to explicit per-package aliases for reliable sub-path imports

#### Technical

- **TypeScript Version:** 5.8.3 (exceeds 5.x requirement)
- **Strict Mode Settings:**
  - `strict: true` - Enables all strict type-checking options
  - `noUncheckedIndexedAccess: true` - Adds undefined to index signature results
  - `noImplicitReturns: true` - Requires explicit returns in all code paths
  - `noUnusedLocals: true` - Reports errors on unused local variables
  - `noUnusedParameters: true` - Reports errors on unused function parameters
- **Module Settings:**
  - `moduleResolution: "bundler"` - Modern bundler-compatible resolution
  - `esModuleInterop: true` - CommonJS/ES module interoperability
- **Path Aliases Configured:**
  - `@/*` - Maps to app-local source directory
  - `@platform/ui`, `@platform/ui/*` - UI components package
  - `@platform/auth`, `@platform/auth/*` - Authentication helpers package
  - `@platform/db`, `@platform/db/*` - Database client package
- **Configuration Hierarchy:**
  ```
  packages/tsconfig/base.json         <- Strict mode foundation
      ├── nextjs.json                 <- Apps extend this
      └── react-library.json          <- Shared packages extend this
  ```

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (2 review cycles)_

### [Story 0.1.3] Install Core Frontend Dependencies

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Core Dependencies Installed** in `apps/web/`
  - `tailwindcss@4.1.8` - Utility-first CSS framework with CSS-first configuration
  - `zustand@5.0.8` - Lightweight state management
  - `immer@11.1.3` - Immutable state updates for Zustand middleware
  - `zod@4.0.1` - Runtime schema validation
  - `@xyflow/react@12.10.0` - Visual flow editor for builders
  - `clsx@2.1.1` - Conditional className utility
  - `tailwind-merge@3.4.0` - Tailwind class conflict resolution

- **Utility Functions** (`apps/web/lib/utils.ts`)
  - `cn()` function combining clsx and tailwind-merge for class merging
  - Properly resolves conflicting Tailwind classes (e.g., `p-4` + `p-2` = `p-2`)

- **Stores Directory** (`apps/web/stores/`)
  - Barrel export file for Zustand stores with immer middleware support

#### Changed

- **Tailwind CSS Configuration** (`apps/web/tailwind.config.ts`)
  - Extended with shadcn/ui theme defaults
  - CSS variable-based theming for light/dark mode support
  - Container configuration with responsive breakpoints

- **Global Styles** (`apps/web/app/globals.css`)
  - Tailwind CSS 4.x import-based setup (`@import "tailwindcss"`)
  - Complete shadcn CSS variable set for light theme
  - Complete shadcn CSS variable set for dark theme
  - Chart color variables for data visualization

- **PostCSS Configuration** (`apps/web/postcss.config.js`)
  - Configured with `@tailwindcss/postcss` plugin for Tailwind 4.x

#### Technical

- **Tailwind 4.x Migration:**
  - Uses CSS-based `@import "tailwindcss"` instead of legacy `@tailwind` directives
  - Native CSS variable support for theming
  - PostCSS plugin changed to `@tailwindcss/postcss`

- **shadcn/ui CSS Variables Configured:**
  - Background, foreground, card, popover colors
  - Primary, secondary, muted, accent semantic colors
  - Destructive states for error handling
  - Border, input, ring for form elements
  - Chart colors (1-5) for data visualization
  - Sidebar component variables
  - `--radius: 0.5rem` for consistent border radius

- **State Management Pattern:**
  - Zustand with immer middleware for immutable updates
  - Pattern established for future store implementations

- **Validation Pattern:**
  - Zod for runtime validation of external data
  - Type inference with `z.infer<typeof schema>`

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (5 observations, none blocking)_
