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

### [Story 0.1.8] Configure Redis Client

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Redis Client** in `packages/@platform/db/`
  - `ioredis@^5.9.2` - Full-featured Redis client with TypeScript support
  - Serverless-friendly singleton pattern with lazy connection

- **Redis Client** (`packages/@platform/db/src/redis.ts`)
  - `getRedisClient()` - Singleton Redis client for connection reuse
  - `closeRedisConnection()` - Cleanup for tests and graceful shutdown

- **Cache Utilities**
  - `cacheGet<T>(key)` - Get cached value with JSON deserialization
  - `cacheSet<T>(key, value, ttlSeconds)` - Set cache with TTL
  - `cacheDelete(key)` - Delete single cache entry
  - `cacheDeletePattern(pattern)` - Delete by glob pattern (e.g., "user:\*")

- **Pub/Sub Utilities**
  - `publish<T>(channel, message)` - Publish message to channel
  - `subscribe<T>(channel, handler)` - Subscribe with typed handler
  - `unsubscribe(channel)` - Unsubscribe from channel
  - Separate subscriber client (Redis requirement)

- **Rate Limiting Helpers**
  - `checkRateLimit(key, limit, windowSeconds)` - Sliding window algorithm using sorted sets
  - `checkRateLimitSimple(key, limit, windowSeconds)` - Fixed window using INCR
  - Returns `{ allowed, remaining, resetInSeconds }`

- **Environment Variables** (`.env.example`)
  - `REDIS_URL` - Redis connection URL (redis:// or rediss:// for TLS)

#### Changed

- **Package Exports** (`packages/@platform/db/src/index.ts`)
  - Added Redis exports: `getRedisClient`, `closeRedisConnection`
  - Added cache exports: `cacheGet`, `cacheSet`, `cacheDelete`, `cacheDeletePattern`
  - Added pub/sub exports: `publish`, `subscribe`, `unsubscribe`
  - Added rate limit exports: `checkRateLimit`, `checkRateLimitSimple`, `RateLimitResult`

- **Carryover from Story 0.1.6** (`apps/web/app/page.tsx`)
  - Added `export const dynamic = 'force-dynamic'` for Clerk authentication compatibility

#### Technical

- **Singleton Pattern:** Connection reused across serverless invocations
- **Lazy Connect:** `lazyConnect: true` defers connection until first command
- **Keep Alive:** `keepAlive: 10000` for serverless environments
- **Sliding Window:** Uses Redis sorted sets for accurate rate limiting across time windows
- **Pub/Sub Pattern:** Dedicated subscriber client (Redis limitation)
- **Error Handling:** Graceful connection error logging

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 1 MEDIUM, 3 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.9] Configure Langfuse Observability

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Langfuse SDK** in `apps/web/`
  - `langfuse@^3.38.6` - Langfuse client SDK
  - `@langfuse/core@^4.5.1` - Core Langfuse types

- **Langfuse Client** (`apps/web/lib/observability/langfuse.ts`)
  - `getLangfuseClient()` - Singleton client for serverless environments
  - `shutdownLangfuse()` - Graceful shutdown with event flush
  - `flushLangfuse()` - Manual flush for serverless function termination
  - `isLangfuseConfigured()` - Check if Langfuse credentials are set

- **Trace Wrapper Functions**
  - `traceLLMCall<T>(name, fn, options)` - Trace LLM generations with token/cost tracking
  - `traceAgentRun<T>(name, fn, options)` - Trace agent executions (bond, wendy, morgan, artie)
  - `traceToolExecution<T>(name, fn, options)` - Trace MCP tool executions
  - `createWorkflowTrace(name, options)` - Create trace for multi-step workflows

- **Cost Tracking**
  - `MODEL_COSTS` - Per-model pricing (Claude Sonnet 4, Opus 4, Haiku 4)
  - `calculateCost(model, usage)` - Calculate USD cost from token usage

- **Barrel Exports** (`apps/web/lib/observability/index.ts`)
  - All Langfuse utilities and types exported

- **Environment Variables** (`.env.example`)
  - `LANGFUSE_PUBLIC_KEY` - Langfuse project public key
  - `LANGFUSE_SECRET_KEY` - Langfuse project secret key
  - `LANGFUSE_HOST` - Langfuse host URL (for self-hosted)

#### Technical

- **Singleton Pattern:** Client reused across serverless invocations
- **Serverless Flush:** `flushAt: 1`, `flushInterval: 0` for immediate event export
- **Cost Calculation:** Per-million-token pricing with input/output breakdown
- **Trace Hierarchy:** trace → generation/span structure per Langfuse best practices
- **Type Safety:** Full TypeScript support with generic trace wrappers

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.10] Configure Protocol Stack (CopilotKit + AG-UI)

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **CopilotKit Packages** in `apps/web/`
  - `@copilotkit/react-core@^1.51.2` - Core CopilotKit hooks and provider
  - `@copilotkit/runtime@^1.51.2` - CopilotKit runtime for agent communication

- **CopilotKit Provider** (`apps/web/lib/protocols/copilotkit.tsx`)
  - `CopilotKitProvider` - Wrapper component with configurable runtime URL
  - Re-exports `CopilotKit` from `@copilotkit/react-core`

- **AG-UI Client** (`apps/web/lib/protocols/ag-ui.ts`)
  - `createAGUIClient(options)` - SSE streaming client factory
  - `useAGUI(options)` - React hook for AG-UI streaming
  - Helper functions: `filterEventsByType`, `getTextContent`, `isRunComplete`, `getRunError`

- **AG-UI Event Types** (`apps/web/lib/protocols/types.ts`)
  - All 25 AG-UI protocol event types defined:
    - Lifecycle: `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`
    - Steps: `STEP_STARTED`, `STEP_FINISHED`, `STEP_ERROR`
    - Text: `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`
    - Tools: `TOOL_CALL_START`, `TOOL_CALL_ARGS`, `TOOL_CALL_END`, `TOOL_CALL_RESULT`
    - State: `STATE_SNAPSHOT`, `STATE_DELTA`
    - Activity: `ACTIVITY_START`, `ACTIVITY_DELTA`, `ACTIVITY_END`
    - Messages: `MESSAGES_SNAPSHOT`
    - Raw: `RAW`, `CUSTOM`
  - Extended types: `THOUGHT_START`, `THOUGHT_CONTENT`, `THOUGHT_END`, `METADATA`
  - Full TypeScript interfaces for each event type

- **AG-UI SSE Endpoint** (`apps/web/app/api/ag-ui/route.ts`)
  - GET handler for Server-Sent Events streaming
  - POST handler for JSON body requests
  - Proper SSE headers: `Content-Type: text/event-stream`
  - Event encoding with `ReadableStream`

- **CopilotKit Runtime Endpoint** (`apps/web/app/api/copilotkit/route.ts`)
  - POST handler for CopilotKit runtime communication
  - GET handler for health check
  - Placeholder implementation (real backend integration in later stories)

- **Barrel Exports** (`apps/web/lib/protocols/index.ts`)
  - All protocol utilities, types, and components exported

#### Technical

- **SSE Pattern:** Uses `ReadableStream` for proper Next.js App Router SSE support
- **Event Types:** Enum-based `AGUIEventType` with `as const` for type safety
- **React Hook:** `useAGUI` provides streaming state, events array, and error handling
- **CopilotKit:** Provider configured with default `/api/copilotkit` runtime URL
- **Library Validated:** Implementation matches official CopilotKit and AG-UI documentation

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.11] Configure Stripe Billing

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Stripe SDK** in `apps/web/`
  - `stripe@^20.2.0` - Stripe SDK for Node.js billing operations

- **Stripe Client** (`apps/web/lib/billing/stripe.ts`)
  - `stripe` - Server-side Stripe client singleton
  - `createCustomer(params)` - Create a Stripe customer
  - `getOrCreateCustomer(params)` - Get or create customer by email
  - `createCheckoutSession(params)` - Create subscription checkout session
  - `createPortalSession(params)` - Create billing portal session
  - `getSubscription(id)` - Get subscription by ID
  - `cancelSubscription(id)` - Cancel at period end
  - `resumeSubscription(id)` - Resume canceled subscription
  - `constructWebhookEvent(payload, signature, secret)` - Verify webhook
  - `getWebhookSecret()` - Get webhook secret from environment

- **Stripe Types** (`apps/web/lib/billing/types.ts`)
  - `StripeEventType` - Enum with 26 webhook event types
  - `SubscriptionStatus` - Subscription status enum
  - `BillingPlan` - Plan tiers (free, starter, pro, enterprise)
  - `UsageMetric` - Usage tracking metrics
  - Event data interfaces for subscriptions, invoices, customers, checkout

- **Webhook Handler** (`apps/web/app/api/webhooks/stripe/route.ts`)
  - POST handler for Stripe webhook events
  - Signature verification using `STRIPE_WEBHOOK_SECRET`
  - Event routing to typed handlers
  - Handlers for subscriptions, invoices, checkout, customers

- **Environment Variables** (`.env.example`)
  - `STRIPE_SECRET_KEY` - Stripe secret key
  - `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side public key

#### Technical

- **Server-Side Only:** Stripe client uses secret key, never exposed to browser
- **Webhook Verification:** Uses `stripe.webhooks.constructEvent()` for signature validation
- **Build Compatibility:** No env check at module load time to allow builds without secrets
- **API Version:** Uses Stripe API version 2025-12-15.clover

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.12] Configure Testing Infrastructure

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Testing Library Packages**
  - `@testing-library/react@^16.3.2` - React component testing utilities
  - `@testing-library/jest-dom@^6.9.1` - Custom Jest/Vitest matchers

#### Changed

- **Vitest Setup** (`tests/support/vitest-setup.ts`)
  - Enabled `@testing-library/jest-dom/vitest` matchers import
  - Tests can now use matchers like `toBeInTheDocument()`, `toHaveClass()`

#### Technical

- **Testing Stack Completed:**
  - Vitest 4.0.1 - Unit testing with jsdom environment
  - Playwright 1.51.0 - E2E testing (Chromium, Firefox, WebKit)
  - @testing-library/react - Component testing utilities
  - @testing-library/jest-dom - Custom DOM matchers
  - @vitest/coverage-v8 - Coverage reporting (text, json, html, lcov)

- **Test Scripts:**
  - `pnpm test:unit` - Run unit tests
  - `pnpm test:unit:watch` - Watch mode
  - `pnpm test:unit:coverage` - Coverage report
  - `pnpm test:e2e` - Run E2E tests
  - `pnpm test:e2e:ui` - Interactive UI mode
  - `pnpm test:e2e:headed` - Headed browser mode

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.13] Configure Environment Variables & Secrets

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Environment Validation** (`apps/web/lib/env.ts`)
  - Zod-based schema validation for all environment variables
  - `serverSchema` - Server-only variables (secrets, API keys)
  - `clientSchema` - Client-safe variables (NEXT*PUBLIC*\*)
  - `serverEnv` export for server-side usage
  - `clientEnv` export for client-side usage
  - Type exports: `ServerEnv`, `ClientEnv`

- **Application Configuration** (`.env.example`)
  - `NEXT_PUBLIC_APP_URL` - Base URL for the application

#### Technical

- **Environment Variable Categories:**
  - **Server-only:** SUPABASE_SERVICE_ROLE_KEY, CLERK_SECRET_KEY, STRIPE_SECRET_KEY, etc.
  - **Client-safe:** NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, etc.

- **Validation Features:**
  - Runtime validation on app startup
  - Graceful fallback for missing optional variables
  - Descriptive error messages for invalid values

- **Security:**
  - Server variables never exposed to browser
  - All secrets properly gitignored
  - `.env.example` serves as documentation

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 1 LOW, 1 INFO observations)_

### [Story 0.1.14] Configure ESLint, Prettier, and Git Hooks

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Commitlint** for conventional commit enforcement
  - `@commitlint/cli@^19.8.1` - Commit message linter
  - `@commitlint/config-conventional@^19.8.1` - Conventional config

- **Husky commit-msg Hook** (`.husky/commit-msg`)
  - Runs commitlint on every commit
  - Validates conventional commit format

- **Commitlint Configuration** (`commitlint.config.js`)
  - Enforces conventional commit format
  - Rules for type-case, type-empty, subject-empty
  - Header max length of 100 characters

#### Technical

- **Code Quality Stack:**
  - ESLint 9.x with TypeScript plugin
  - Prettier 3.8.1 with consistent style
  - Husky 9.x for git hooks
  - lint-staged 16.x for pre-commit linting
  - commitlint 19.x for commit message validation

- **Git Hooks:**
  - `pre-commit`: Runs lint-staged (ESLint, Prettier, typecheck)
  - `commit-msg`: Runs commitlint for conventional commits

- **Conventional Commit Types:**
  - feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.15] Configure CI/CD Pipeline

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Verified

- **CI Workflow** (`.github/workflows/ci.yml`)
  - Triggers on push/PR to main and develop branches
  - `lint` job: ESLint and TypeScript typecheck
  - `unit-tests` job: Vitest with coverage, Codecov integration
  - `build` job: Depends on lint and unit-tests, uploads artifacts
  - `e2e-tests` job: Playwright tests with report upload
  - pnpm caching enabled on all jobs
  - Node 20.x runtime

- **E2E Test Workflow** (`.github/workflows/e2e-tests.yml`)
  - Dedicated workflow for comprehensive E2E testing
  - Manual dispatch with browser selection
  - Matrix browser support (chromium by default)
  - Smoke test job for PRs
  - Artifact upload on test failure

#### Added

- **ATDD Tests** (`tests/unit/infrastructure/ci-cd-pipeline.test.ts`)
  - 29 tests validating CI/CD configuration
  - YAML parsing with `yaml` package

#### Technical

- **CI Job Dependencies:**
  - `lint` and `unit-tests` run in parallel
  - `build` depends on lint and unit-tests
  - `e2e-tests` depends on build

- **Secrets Required:**
  - `CODECOV_TOKEN` - Coverage upload
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Build time
  - `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` - E2E credentials
  - `CLERK_SECRET_KEY` - Auth runtime

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.16] Create Initial Database Schema

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Database Schema** (`supabase/migrations/00001_initial_schema.sql`)
  - `organizations` table with id, name, slug, timestamps
  - `organization_members` table linking Clerk users to orgs
  - `workspaces` table for organizational units
  - `projects` table for workflows, chatbots, voice agents, canvas

- **Row Level Security (RLS)**
  - Enabled on all tables
  - Organizations: users see only orgs they belong to
  - Workspaces: users see only workspaces in their orgs
  - Projects: users see only projects in their workspaces
  - Uses `auth.uid()` for Clerk JWT integration

- **Database Indexes**
  - `idx_organizations_slug` for slug lookups
  - `idx_organization_members_user_id` for user membership queries
  - `idx_workspaces_org_id` for org-scoped queries
  - `idx_projects_workspace_id` and `idx_projects_type` for filtering

- **Supabase Configuration** (`supabase/config.toml`)
  - Local development settings
  - Clerk external auth enabled

- **TypeScript Types** (`packages/@platform/db/src/types.ts`)
  - `Organization`, `OrganizationMember`, `Workspace`, `Project`
  - Insert and Update variants for each
  - Full `Database` type for Supabase client

#### Technical

- **Table Relationships:**

  ```
  organizations
    └── organization_members (user_id from Clerk)
    └── workspaces
          └── projects (type: module|chatbot|voice|canvas)
  ```

- **RLS Policy Pattern:**
  - SELECT: Check membership via `organization_members`
  - INSERT: Check organization membership
  - UPDATE: Check organization membership
  - DELETE: Require admin/owner role

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.17] Configure Agno Agent Framework (Python Backend)

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Python Agent Service** (`apps/agent-service/`)
  - `src/agents/` - Agent definitions with Agno framework
  - `src/tools/` - MCP tool implementations
  - `src/memory/` - Memory service integration
  - `src/workflows/` - Agno workflow definitions
  - `src/routers/` - FastAPI API routers

- **FastAPI Application** (`src/main.py`)
  - CORS middleware configured
  - Structured logging with structlog
  - Lifespan management for startup/shutdown

- **Health Check Endpoints** (`src/routers/health.py`)
  - `/health` - Basic health check
  - `/health/detailed` - Dependency status
  - `/ready` - Kubernetes readiness probe
  - `/live` - Kubernetes liveness probe

- **Agent Execution Endpoints** (`src/routers/agents.py`)
  - `GET /api/v1/agents` - List available agents
  - `GET /api/v1/agents/{id}` - Get agent info
  - `POST /api/v1/agents/{id}/execute` - Execute agent

- **Base Agent Class** (`src/agents/base.py`)
  - Agno framework integration
  - `add_history_to_context=True`
  - `add_memories_to_context=True`
  - `enable_agentic_memory=True`
  - PostgreSQL storage for persistent memory

- **Configuration Management** (`src/config.py`)
  - Pydantic Settings for environment variables
  - DATABASE_URL, REDIS_URL, ANTHROPIC_API_KEY

- **Containerization** (`Dockerfile`)
  - Python 3.12-slim base image
  - Multi-stage build with uv
  - Non-root user for security
  - Health check configured

#### Technical

- **Agent Personalities:**
  - Bond - Concierge/orchestrator (polished, confident)
  - Wendy - Workflow assistant (warm, helpful)
  - Morgan - Data analyst (precise, methodical)
  - Artie - Creative/design (enthusiastic, imaginative)

- **Dependencies:**
  - agno>=2.4.0 - Agent framework
  - fastapi>=0.115.0 - HTTP API
  - uvicorn>=0.32.0 - ASGI server
  - psycopg>=3.2.0 - PostgreSQL
  - redis>=5.0.0 - Session cache
  - anthropic>=0.40.0 - Claude LLM

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.18] Configure Temporal Workflow Orchestration

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Temporal Worker Application** (`apps/temporal-worker/`)
  - `src/worker.ts` - Worker entry point with Temporal connection
  - `src/workflows/agent.ts` - Agent execution workflow with HITL support
  - `src/workflows/index.ts` - Workflow exports
  - `src/activities/agent.ts` - Activities for agent service communication
  - `src/activities/index.ts` - Activity exports

- **Agent Execution Workflow**
  - `agentExecutionWorkflow()` - Main workflow function
  - HITL signal handling with `hitlApprovalSignal`
  - Workflow cancellation with `cancelWorkflowSignal`
  - Retry policies with exponential backoff (1s initial, 2x coefficient, 5 max attempts, 30s max interval)
  - 24-hour HITL approval timeout

- **Temporal Activities**
  - `executeAgentTask()` - Send task to Agent Service
  - `getAgentResponse()` - Get completed task response
  - `processHITLApproval()` - Process human approval and continue

- **Temporal Client Package** (`packages/@platform/temporal/`)
  - `src/client.ts` - Temporal client wrapper with singleton pattern
  - `src/index.ts` - Package exports
  - `createTemporalClient()` / `getTemporalClient()` helper functions
  - Zod validation for workflow inputs/outputs

- **Client Methods**
  - `startAgentWorkflow()` - Start new agent workflow
  - `getWorkflowHandle()` - Get existing workflow
  - `sendHITLApproval()` - Send approval signal
  - `cancelWorkflow()` - Cancel running workflow
  - `getWorkflowResult()` - Get workflow result

- **Python Temporal Support** (`apps/agent-service/pyproject.toml`)
  - `temporalio>=1.7.0` - Python Temporal SDK

- **Environment Variables** (`.env.example`)
  - `TEMPORAL_ADDRESS` - Temporal server address (localhost:7233)
  - `TEMPORAL_NAMESPACE` - Temporal namespace (default)
  - `TEMPORAL_TASK_QUEUE` - Agent task queue (hyyve-agent-tasks)

#### Technical

- **Workflow Architecture:**

  ```
  Next.js App ──▶ Temporal Client ──▶ Temporal Server
                                           │
                                    Temporal Worker
                                           │
                                    Agent Service
  ```

- **Dependencies:**
  - @temporalio/client@^1.11.0 - Client SDK
  - @temporalio/worker@^1.11.0 - Worker SDK
  - @temporalio/workflow@^1.11.0 - Workflow definitions
  - @temporalio/activity@^1.11.0 - Activity definitions

- **Retry Policy:**
  - Initial interval: 1 second
  - Backoff coefficient: 2
  - Maximum attempts: 5
  - Maximum interval: 30 seconds

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.19] Configure Anthropic SDK for Claude

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **TypeScript Anthropic SDK** (`apps/web/lib/llm/`)
  - `@anthropic-ai/sdk@^0.71.2` - Official Anthropic SDK
  - `anthropic.ts` - Claude client with retry, timeout, streaming
  - `types.ts` - LLM type definitions and model configs
  - `index.ts` - Barrel exports

- **Claude Client Features**
  - `getAnthropicClient()` - Singleton client with API key
  - `createChatCompletion()` - Non-streaming completions
  - `createStreamingChatCompletion()` - Token-by-token streaming
  - `completeText()` - Simple text completion wrapper
  - `calculateCost()` - Token-based cost calculation

- **Model Configurations**
  - `claude-sonnet-4-20250514` - Default, balanced (default)
  - `claude-opus-4-20250514` - Advanced reasoning
  - `claude-haiku-4-20250514` - Fast, efficient

- **Python Claude Client** (`apps/agent-service/src/llm/`)
  - `claude.py` - ClaudeClient with sync/async methods
  - `__init__.py` - LLM module exports
  - Streaming support with `astream()`
  - Cost calculation per model

- **Environment Variables** (`.env.example`)
  - `ANTHROPIC_API_KEY` - Anthropic API key

#### Technical

- **Client Configuration:**
  - Timeout: 60 seconds
  - Max retries: 3
  - Singleton pattern for connection reuse

- **Streaming Events:**
  - `onTextDelta` - Text chunk handler
  - `onToolUse` - Tool call handler
  - `onComplete` - Usage stats handler
  - `onError` - Error handler

- **Tool Use Support:**
  - `ToolDefinition` interface for MCP-compatible tools
  - `ToolUseResult` for tool call results
  - Automatic conversion to Anthropic format

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.20] Configure MCP (Model Context Protocol) Foundation

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **MCP Package** (`packages/@platform/mcp/`)
  - Complete MCP infrastructure for standardized tool integration
  - Follows MCP 2025-11-25 specification

- **MCP Server** (`src/server/`)
  - `MCPServer` class with tool registration and execution
  - Concurrent execution limits and timeout handling
  - Streaming support with `AsyncGenerator`
  - `registerTool()`, `executeTool()`, `executeToolStreaming()`

- **MCP Client** (`src/client/`)
  - `MCPClient` class for tool discovery and invocation
  - `discoverTools()`, `callTool()`, `invoke()`
  - Retry logic with exponential backoff
  - Streaming response handling

- **Tool Registry** (`src/registry/`)
  - `ToolRegistry` class for centralized tool management
  - Category-based organization
  - `register()`, `get()`, `find()`, `lookup()`, `has()`
  - Search by name or description

- **MCP Types** (`src/types/`)
  - `Tool`, `ToolInput`, `ToolResult`, `ToolResultChunk`
  - `MCPError` class with standard error codes
  - `MCPErrorCode` enum following MCP spec
  - Zod schemas for validation

- **Built-in Tools** (`src/tools/`)
  - `http_request` - HTTP requests to external APIs
  - `database_query` - Read-only SQL queries (scaffold)
  - `file_operation` - Sandboxed file operations (scaffold)

#### Technical

- **Error Handling:**
  - `MCPErrorCode.InvalidRequest` (-32600)
  - `MCPErrorCode.ToolNotFound` (-32000)
  - `MCPErrorCode.ToolExecutionError` (-32001)
  - `MCPErrorCode.ValidationError` (-32004)

- **Security:**
  - Read-only database queries enforced
  - File operations sandboxed to allowed directories
  - Input validation with Zod schemas

---

_Story completed: 2026-01-26_
