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

### [Story 0.1.4] Initialize shadcn/ui Component Library

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **18 UI Components** installed in `apps/web/components/ui/`
  - `button.tsx` - Button with variants (default, destructive, outline, secondary, ghost, link)
  - `input.tsx` - Text input with consistent styling
  - `label.tsx` - Form label component
  - `card.tsx` - Card container with header, content, and footer sections
  - `dialog.tsx` - Modal dialog with overlay and animations
  - `sheet.tsx` - Slide-out panel (drawer) component
  - `dropdown-menu.tsx` - Dropdown menu with keyboard navigation
  - `form.tsx` - Form primitives with react-hook-form integration
  - `tabs.tsx` - Tabbed interface component
  - `accordion.tsx` - Collapsible accordion panels
  - `tooltip.tsx` - Hover tooltip component
  - `table.tsx` - Data table with header, body, row, and cell components
  - `badge.tsx` - Status badge with variants
  - `avatar.tsx` - User avatar with image and fallback support
  - `sonner.tsx` - Toast notification wrapper (uses Sonner library)
  - `alert.tsx` - Alert message component with variants
  - `command.tsx` - Command palette (uses cmdk library)
  - `popover.tsx` - Popover floating panel

- **shadcn/ui Configuration** (`apps/web/components.json`)
  - Style: New York
  - Base color: Neutral
  - CSS variables: Enabled
  - Component path: `@/components/ui`
  - Utils path: `@/lib/utils`

- **Radix UI Primitives**
  - `@radix-ui/react-accordion` - Accordion primitive
  - `@radix-ui/react-avatar` - Avatar primitive
  - `@radix-ui/react-dialog` - Dialog primitive
  - `@radix-ui/react-dropdown-menu` - Dropdown menu primitive
  - `@radix-ui/react-label` - Label primitive
  - `@radix-ui/react-popover` - Popover primitive
  - `@radix-ui/react-slot` - Slot primitive for component composition
  - `@radix-ui/react-tabs` - Tabs primitive
  - `@radix-ui/react-tooltip` - Tooltip primitive

- **Form & UI Dependencies**
  - `react-hook-form` - Form state management
  - `@hookform/resolvers` - Zod integration for form validation
  - `sonner` - Toast notification library
  - `cmdk` - Command palette library
  - `class-variance-authority` - Component variant management
  - `lucide-react` - Icon library

#### Technical

- **Configuration:** New York style with Neutral color palette and CSS variables
- **Component Pattern:** All components use `cn()` utility from `@/lib/utils` for className merging
- **Accessibility:** Radix UI primitives provide WCAG-compliant keyboard navigation and focus management
- **Tree-shaking:** Individual component imports enable optimal bundle size
- **Type Safety:** Full TypeScript support with proper prop types and exports

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (3 minor observations, none blocking)_

### [Story 0.1.5] Configure Supabase Database Client

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Supabase SSR Configuration** in `packages/@platform/db/`
  - `@supabase/supabase-js@^2.49.8` - Supabase JavaScript client
  - `@supabase/ssr@^0.8.0` - SSR cookie handling for Next.js

- **Server-Side Client** (`packages/@platform/db/src/server.ts`)
  - `createClient()` - Server component client with cookie handling
  - `createAdminClient()` - Admin client using service role key (bypasses RLS)
  - Proper cookie handling via `next/headers` for Next.js App Router

- **Browser-Side Client** (`packages/@platform/db/src/browser.ts`)
  - `createClient()` - Client component Supabase client
  - Uses `createBrowserClient` from `@supabase/ssr`

- **Middleware Helper** (`packages/@platform/db/src/middleware.ts`)
  - `updateSession()` - Session refresh for auth cookies
  - `isProtectedRoute()` - Helper for route protection logic

- **Next.js Middleware** (`apps/web/middleware.ts`)
  - Integrated Supabase session refresh on all routes
  - Excludes static assets and images from middleware

- **Environment Variables** (`.env.example`)
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous/public key
  - `SUPABASE_SERVICE_ROLE_KEY` - Server-only admin key

#### Changed

- **Package Exports** (`packages/@platform/db/package.json`)
  - Added `./server`, `./browser`, `./middleware` export paths
  - Added `next` as peer dependency for Next.js API support

- **Barrel Exports** (`packages/@platform/db/src/index.ts`)
  - `createServerSupabaseClient` / `createBrowserSupabaseClient` explicit naming
  - Exports middleware helpers `updateSession`, `isProtectedRoute`

#### Technical

- **SSR Pattern:** Uses `@supabase/ssr` cookie handling (not raw `@supabase/supabase-js`)
- **Cookie Management:**
  - Server: Uses `cookies()` from `next/headers` with `getAll`/`setAll`
  - Browser: Automatic cookie handling via `createBrowserClient`
  - Middleware: Cookie refresh on every request via `getUser()`
- **Type Safety:** Generic `Database` type propagated to all clients
- **Placeholder Types:** `Database` type ready for schema generation

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (2 HIGH, 3 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.6] Configure Clerk Authentication

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Clerk Authentication** in `packages/@platform/auth/`
  - `@clerk/nextjs@6.36.10` - Clerk authentication for Next.js
  - Server utilities (`auth`, `currentUser`, `clerkMiddleware`)
  - Client hooks (`useUser`, `useAuth`, `ClerkProvider`)

- **Server-Side Auth** (`packages/@platform/auth/src/server.ts`)
  - `auth()` helper for Server Components
  - `currentUser()` for getting authenticated user
  - `clerkMiddleware()` and `createRouteMatcher()` for route protection

- **Clerk-Supabase Integration** (`packages/@platform/auth/src/supabase.ts`)
  - `createClerkSupabaseClient()` - Supabase client with Clerk JWT
  - Uses `getToken({ template: 'supabase' })` for RLS authentication

- **Auth Pages** in `apps/web/app/`
  - `/sign-in/[[...sign-in]]/page.tsx` - Sign-in page with catch-all
  - `/sign-up/[[...sign-up]]/page.tsx` - Sign-up page with catch-all

- **Client Providers** (`apps/web/app/providers.tsx`)
  - `Providers` component wrapping ClerkProvider
  - Graceful fallback when Clerk keys are not configured

#### Changed

- **Middleware** (`apps/web/middleware.ts`)
  - Combined `clerkMiddleware()` with Supabase session refresh
  - Public routes: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks(.*)`
  - Protected routes require authentication

- **Root Layout** (`apps/web/app/layout.tsx`)
  - Wrapped with `Providers` component for client-side auth

- **Environment Variables** (`.env.example`)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
  - `CLERK_SECRET_KEY` - Clerk secret key
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` - Auth page URLs
  - `CLERK_WEBHOOK_SECRET` - For user sync webhooks

#### Technical

- **Package Exports:**
  - `@platform/auth` - Client components and hooks
  - `@platform/auth/server` - Server-side utilities
  - `@platform/auth/supabase` - Clerk-Supabase integration
- **Middleware Pattern:** Combined Clerk auth + Supabase session refresh
- **Build Compatibility:** Conditional ClerkProvider for builds without keys

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (2 HIGH, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.7] Configure tRPC API Layer

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **tRPC Server Configuration** (`apps/web/lib/trpc/server.ts`)
  - `initTRPC` with superjson transformer for Date/BigInt serialization
  - `createTRPCContext` with Supabase client and Clerk user
  - `publicProcedure` for unauthenticated endpoints
  - `protectedProcedure` with Clerk auth middleware

- **tRPC React Client** (`apps/web/lib/trpc/client.ts`)
  - Type-safe `trpc` client with `createTRPCReact<AppRouter>()`
  - Full TypeScript inference for procedures

- **tRPC Provider** (`apps/web/lib/trpc/provider.tsx`)
  - `TRPCProvider` component with QueryClient and tRPC client
  - `httpBatchLink` for request batching
  - Configured staleTime and refetchOnWindowFocus

- **App Router Integration** (`apps/web/app/api/trpc/[trpc]/route.ts`)
  - `fetchRequestHandler` from `@trpc/server/adapters/fetch`
  - GET and POST handlers for queries and mutations
  - Development error logging

- **Root Router** (`apps/web/lib/trpc/routers/index.ts`)
  - `appRouter` with example procedures
  - `health` - Public health check endpoint
  - `me` - Protected user info endpoint
  - `echo` - Example mutation with Zod validation

- **Package Dependencies**
  - `@trpc/server@11.8.1` - tRPC server
  - `@trpc/client@11.8.1` - tRPC client
  - `@trpc/react-query@11.8.1` - React hooks
  - `@tanstack/react-query@5.90.20` - Data fetching/caching
  - `superjson@2.2.6` - JSON serialization

#### Changed

- **Providers** (`apps/web/app/providers.tsx`)
  - Added `TRPCProvider` wrapping inside ClerkProvider
  - tRPC available even when Clerk keys not configured

#### Technical

- **tRPC v11 Pattern:**
  - Transformer configured at link level (not createClient)
  - Uses fetch adapter (not @trpc/next) for App Router
  - Context includes db (Supabase) and user (Clerk)
- **Type Safety:** Full end-to-end type inference from procedures to hooks
- **Request Batching:** httpBatchLink batches multiple queries into single request

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 1 LOW, 3 INFO observations - none blocking)_
