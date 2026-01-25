# Architecture Gaps Research & Validation Report

**Date:** 2026-01-23
**Source:** `architecture-synthesis-2026-01-23.md` Section 7.1
**Validation Method:** DeepWiki MCP + Context7 MCP + Industry Best Practices
**Status:** Complete

---

## Executive Summary

This report provides comprehensive research and validation for the 8 architecture gaps identified in the synthesis document. Each gap is analyzed against competitor implementations (Dify, n8n, Flowise), industry standards, and current best practices.

**Key Findings:**
- All 8 gaps are valid and require resolution
- Competitor analysis provides clear implementation patterns
- Recommended technologies validated against industry leaders

---

## Gaps Overview

| # | Gap | Risk | Recommendation | Validated By |
|---|-----|------|----------------|--------------|
| 1 | Search/Discovery | High | Meilisearch hybrid search | Dify (Elasticsearch), n8n (NodeSearchEngine), Meilisearch docs |
| 2 | Caching Strategy | Medium | Redis + memory tiered caching | Dify (Redis), n8n (CacheService), Workbox (frontend) |
| 3 | Mobile Support | Medium | Responsive-first + PWA meta tags | Dify (useBreakpoints), n8n (isMobileDevice) |
| 4 | Offline Mode | Medium | Serwist/Workbox service worker | Dify (Serwist), Workbox strategies |
| 5 | Testing Strategy | High | Playwright E2E + Vitest unit | Dify (Vitest), n8n (Playwright Page Objects) |
| 6 | CI/CD Details | Medium | GitHub Actions matrix builds | Dify (Docker multi-arch), n8n (release management) |
| 7 | Monitoring Alerts | High | Prometheus alerting + runbooks | Dify (Grafana/Sentry/OTEL), n8n (Prometheus) |
| 8 | Rate Limiting | High | Redis sliding window + tiered limits | Dify (Redis sliding window), n8n (ConcurrencyControl) |

---

## 1. Search/Discovery

### Gap Description
No full-text search strategy defined for marketplace modules, workflows, documentation, or agents.

### Risk Assessment
- **Severity:** High
- **Impact:** Users unable to discover relevant modules, poor marketplace UX
- **Affected Areas:** Marketplace, documentation, workflow templates

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- Uses **Elasticsearch** for document retrieval in enterprise deployments
- Uses **pgvector** for vector similarity search
- Implements hybrid search combining keyword + semantic search
- `NodeSearchEngine` class for workflow node search

**n8n (DeepWiki):**
- `NodeSearchEngine` uses fuzzy matching (Fuse.js pattern)
- Matches on node name, aliases, and trigger words
- Simple in-memory search suitable for smaller datasets

**Meilisearch (Context7):**
- Hybrid search combining full-text + semantic vectors
- Auto-batching for embeddings generation
- Filterable attributes for faceted search
- Typo-tolerance and ranking rules built-in
- REST API with instant search (<50ms)

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Search Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │  Ingestion │───▶│  Meilisearch  │◀───│   Query API     │ │
│  │  Pipeline  │    │  (hybrid)     │    │  (REST/SDK)     │ │
│  └───────────┘    └──────────────┘    └─────────────────┘ │
│       │                   │                    │           │
│       ▼                   ▼                    ▼           │
│  ┌───────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │ Modules   │    │  Full-text   │    │  Marketplace    │ │
│  │ Workflows │    │  + Semantic  │    │  Documentation  │ │
│  │ Agents    │    │  + Filters   │    │  Workflow Tmpl  │ │
│  └───────────┘    └──────────────┘    └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **Primary: Meilisearch** for marketplace/documentation search
   - Hybrid search (keyword + semantic)
   - Built-in typo tolerance
   - Filterable attributes (category, tags, author)
   - <50ms response times

2. **Alternative: Typesense** if self-hosting complexity is a concern
   - Similar feature set
   - Slightly simpler deployment

3. **Index Strategy:**
   - Modules index with metadata
   - Workflows index with node types
   - Documentation index with sections
   - Agents index with capabilities

---

## 2. Caching Strategy

### Gap Description
Caching approaches fragmented across different research documents with no unified strategy.

### Risk Assessment
- **Severity:** Medium
- **Impact:** Inconsistent performance, cache invalidation issues
- **Affected Areas:** API responses, workflow executions, static assets

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- **Redis** for session storage and rate limiting
- **In-memory caching** for frequently accessed configs
- Pattern: Cache-aside with TTL-based invalidation
- Uses Redis Lua scripts for atomic operations

**n8n (DeepWiki):**
- `CacheService` with pluggable backends:
  - Memory cache (default)
  - Redis (production)
- `N8N_CACHE_ENABLED` always true (v1.24.0+)
- TTL-based expiration
- Namespace isolation for different data types

**Workbox (Context7):**
- Frontend caching strategies:
  - `CacheFirst` for static assets (JS, CSS, images)
  - `NetworkFirst` for API responses
  - `StaleWhileRevalidate` for dynamic content

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Tiered Caching Strategy                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TIER 1: Browser/CDN                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Static Assets: CacheFirst (7 days)                 │   │
│  │  API Responses: NetworkFirst (5 min fallback)       │   │
│  │  Dynamic Content: StaleWhileRevalidate (24 hrs)     │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  TIER 2: API Gateway (Redis)                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Session Data: 24hr TTL                             │   │
│  │  Rate Limit Counters: 1min sliding window           │   │
│  │  Auth Tokens: 15min TTL                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  TIER 3: Application (Memory + Redis)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Hot Config: Memory (5 min TTL)                     │   │
│  │  Workflow Results: Redis (1hr TTL)                  │   │
│  │  LLM Responses: Redis (cache key = prompt hash)     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **Unified CacheService** (following n8n pattern):
```typescript
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  // Namespace support
  namespace(ns: string): CacheService;
}
```

2. **Cache Invalidation Patterns:**
   - Event-driven invalidation via message queue
   - TTL-based expiration for read-heavy data
   - Write-through for consistency-critical data

3. **Frontend Caching** (Workbox/Serwist):
   - Service worker with strategy-based caching
   - Precache manifest for critical assets

---

## 3. Mobile Support

### Gap Description
No mobile-specific research for the platform.

### Risk Assessment
- **Severity:** Medium
- **Impact:** Limited reach, poor mobile UX
- **Affected Areas:** Dashboard, chat interface, workflow monitoring

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- `useBreakpoints` hook for responsive detection:
  - Mobile: width <= 640px
  - Tablet: 640px < width <= 768px
  - PC: width > 768px
- PWA meta tags in `layout.tsx`:
  - `manifest.json` link
  - `apple-mobile-web-app-capable`
  - `theme-color` meta tag
- Mobile-specific components: `HeaderInMobile`, `ChatWithHistory`
- **Note:** Testing docs state "desktop application, no mobile testing required"

**n8n (DeepWiki):**
- `isMobileDevice` computed property via `useMediaQuery`
- Mobile-specific styling classes
- Touch device support (canvas panning, selection)
- Changelog shows explicit mobile fixes:
  - "Make workflows, credentials, executions and new canvas usable on mobile"
  - "Fix canvas selection for touch devices"

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Mobile Support Strategy                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RESPONSIVE BREAKPOINTS (Tailwind-compatible)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  sm:  640px   (mobile landscape)                    │   │
│  │  md:  768px   (tablet portrait)                     │   │
│  │  lg:  1024px  (tablet landscape / small desktop)    │   │
│  │  xl:  1280px  (desktop)                             │   │
│  │  2xl: 1536px  (large desktop)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  MOBILE-OPTIMIZED COMPONENTS                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Chat Interface (primary mobile use case)         │   │
│  │  • Workflow Monitoring (read-only on mobile)        │   │
│  │  • Dashboard Summary                                │   │
│  │  • Settings/Profile                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  DESKTOP-ONLY FEATURES                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Workflow Canvas Editor (complex drag-drop)       │   │
│  │  • Multi-pane layouts                               │   │
│  │  • Advanced configuration screens                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **useBreakpoints Hook** (following Dify pattern):
```typescript
type MediaType = 'mobile' | 'tablet' | 'desktop';

function useBreakpoints(): {
  mediaType: MediaType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
```

2. **PWA Meta Tags:**
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1C64F2" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

3. **Mobile-First Components:**
   - Chat interface: Full mobile support
   - Workflow monitoring: Read-only mobile view
   - Canvas editor: Desktop-only with mobile redirect

---

## 4. Offline Mode

### Gap Description
IndexedDB mentioned but offline-first architecture not detailed.

### Risk Assessment
- **Severity:** Medium
- **Impact:** Poor UX when connectivity is intermittent
- **Affected Areas:** Workflow editing, chat, collaborative features

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- Uses **Serwist** (Workbox-based) for service worker
- Caching strategies in `web/app/sw.ts`:
  - `CacheFirst` for Google Fonts (1 year)
  - `CacheFirst` for images (30 days, 64 entries)
  - `StaleWhileRevalidate` for scripts/styles (24 hrs)
  - `NetworkFirst` for API `/api/*` (10s timeout, 60 min cache)
- Offline fallback to `_offline.html`
- `localStorage` for UI preferences, conversation IDs, auth tokens
- **No IndexedDB usage** in Dify

**n8n (DeepWiki):**
- **No offline mode** for workflow execution
- `localStorage` for UI preferences only:
  - Workflow list sort/filter preferences
  - NDV (Node Data Viewer) states
- Core data always in database (SQLite/PostgreSQL/MySQL)

**Workbox (Context7):**
- Industry-standard caching strategies:
  - `CacheFirst`: Static assets
  - `NetworkFirst`: Dynamic API data
  - `StaleWhileRevalidate`: Semi-dynamic content
- `BroadcastUpdatePlugin` for cache update notifications
- `BackgroundSync` for offline POST requests

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Offline Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVICE WORKER (Serwist/Workbox)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Precache: App shell, critical JS/CSS               │   │
│  │  Runtime:                                           │   │
│  │    /api/chat/*     → NetworkFirst (10s timeout)     │   │
│  │    /api/workflows  → StaleWhileRevalidate           │   │
│  │    /assets/*       → CacheFirst (30 days)           │   │
│  │  Fallback: /offline.html                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  LOCAL STORAGE                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  localStorage:                                      │   │
│  │    • UI preferences (theme, sidebar state)          │   │
│  │    • Recent conversation IDs                        │   │
│  │    • Auth tokens (short-lived)                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  OFFLINE QUEUE (optional - Phase 2)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  IndexedDB (if needed for draft workflows):         │   │
│  │    • Unsaved workflow changes                       │   │
│  │    • Queued chat messages                           │   │
│  │    • Sync on reconnect via BackgroundSync           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **Service Worker Configuration** (Serwist):
```typescript
// sw.ts
import { Serwist } from 'serwist';

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  runtimeCaching: [
    {
      urlPattern: /^\/api\/chat\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'chat-api',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 3600 }
      }
    },
    {
      urlPattern: /^\/api\/workflows.*/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'workflows-api' }
    },
    {
      urlPattern: /\.(js|css|png|jpg|svg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    }
  ],
  fallbacks: { document: '/offline.html' }
});
```

2. **Offline Detection:**
```typescript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

---

## 5. Testing Strategy

### Gap Description
No E2E testing strategy defined for the platform.

### Risk Assessment
- **Severity:** High
- **Impact:** Quality risk, regression bugs, slow release cycles
- **Affected Areas:** All platform components

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- **Unit/Integration:** Vitest for frontend tests
- **E2E:** No Playwright/Cypress found in codebase
- Testing doc states: "No responsive/mobile testing"
- Pytest for backend API testing

**n8n (DeepWiki):**
- **E2E Framework:** Playwright
- **Pattern:** Page Object Model
  - `WorkflowPage`, `CredentialsPage`, `ExecutionsPage`
- **Test Categories:**
  - Workflow execution tests
  - Node-specific tests
  - Integration tests
- **CI Integration:** GitHub Actions with matrix testing

**Playwright (Context7):**
- Industry-standard E2E framework
- Built-in:
  - Auto-waiting
  - Network interception
  - Visual comparison
  - Parallel execution
  - Trace viewer for debugging

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Testing Pyramid                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     ┌─────────┐                             │
│                     │   E2E   │  Playwright                 │
│                     │  (10%)  │  Critical user flows        │
│                   ┌─┴─────────┴─┐                           │
│                   │ Integration │  Vitest + MSW             │
│                   │    (20%)    │  API mocking              │
│                 ┌─┴─────────────┴─┐                         │
│                 │      Unit       │  Vitest                 │
│                 │     (70%)       │  Components, utils      │
│                 └─────────────────┘                         │
│                                                             │
│  E2E TEST SUITES (Playwright)                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • auth.spec.ts      - Login, logout, session       │   │
│  │  • workflow.spec.ts  - Create, edit, execute        │   │
│  │  • chat.spec.ts      - Send message, streaming      │   │
│  │  • marketplace.spec.ts - Browse, install, rate      │   │
│  │  • settings.spec.ts  - Profile, API keys, billing   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  PAGE OBJECTS (following n8n pattern)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • WorkflowPage     - Canvas interactions           │   │
│  │  • ChatPage         - Message composition           │   │
│  │  • MarketplacePage  - Module discovery              │   │
│  │  • SettingsPage     - Configuration forms           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **Playwright Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['junit', { outputFile: 'results.xml' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

2. **Page Object Pattern:**
```typescript
// e2e/pages/workflow.page.ts
export class WorkflowPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/workflows');
  }

  async createWorkflow(name: string) {
    await this.page.click('[data-testid="create-workflow"]');
    await this.page.fill('[data-testid="workflow-name"]', name);
    await this.page.click('[data-testid="save-workflow"]');
  }

  async addNode(nodeType: string) {
    await this.page.click('[data-testid="add-node"]');
    await this.page.click(`[data-node-type="${nodeType}"]`);
  }
}
```

---

## 6. CI/CD Details

### Gap Description
Only high-level CI/CD mentioned (GitHub Actions, Velero).

### Risk Assessment
- **Severity:** Medium
- **Impact:** Deployment friction, manual processes
- **Affected Areas:** Development workflow, release process

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- **GitHub Actions** for CI/CD
- Docker multi-arch builds (amd64, arm64)
- Separate workflows for:
  - API build/test
  - Web build/test
  - Docker image publishing
- Environment-based deployments

**n8n (DeepWiki):**
- Comprehensive GitHub Actions:
  - `ci-pull-requests.yml` - PR validation
  - `ci-master.yml` - Main branch builds
  - `release-create-pr.yml` - Automated release PRs
  - `release-publish.yml` - NPM/Docker publishing
- Matrix testing across Node versions
- Semantic versioning with changesets
- Docker multi-arch builds

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CI/CD Pipeline                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PULL REQUEST WORKFLOW                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Lint (ESLint, Prettier)                         │   │
│  │  2. Type Check (TypeScript)                         │   │
│  │  3. Unit Tests (Vitest)                             │   │
│  │  4. Integration Tests (Vitest + MSW)                │   │
│  │  5. E2E Tests (Playwright) - critical paths only    │   │
│  │  6. Build verification                              │   │
│  │  7. Security scan (npm audit, Snyk)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  MAIN BRANCH WORKFLOW                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. All PR checks                                   │   │
│  │  2. Full E2E test suite                             │   │
│  │  3. Build Docker images (multi-arch)                │   │
│  │  4. Push to staging registry                        │   │
│  │  5. Deploy to staging environment                   │   │
│  │  6. Smoke tests on staging                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  RELEASE WORKFLOW                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Create release PR (changesets)                  │   │
│  │  2. Version bump                                    │   │
│  │  3. Generate changelog                              │   │
│  │  4. Build production images                         │   │
│  │  5. Push to production registry                     │   │
│  │  6. Deploy to production (manual gate)              │   │
│  │  7. Create GitHub release                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **PR Workflow:**
```yaml
# .github/workflows/ci-pr.yml
name: PR Validation
on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit
      - run: pnpm test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

2. **Docker Build Workflow:**
```yaml
# .github/workflows/docker-build.yml
name: Docker Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 7. Monitoring Alerts

### Gap Description
Alert rules not defined for the observability stack.

### Risk Assessment
- **Severity:** High
- **Impact:** Slow incident response, undetected outages
- **Affected Areas:** Production stability, SLA compliance

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- **Grafana** for dashboards and alerting
- **Sentry** for error tracking
- **OpenTelemetry** for distributed tracing
- Custom metrics for:
  - LLM latency
  - Token usage
  - API response times

**n8n (DeepWiki):**
- **Prometheus** `/metrics` endpoint
- Metrics include:
  - Workflow execution counts
  - Execution duration histograms
  - Error rates
  - Queue depths

**Industry Standards:**
- USE method (Utilization, Saturation, Errors)
- RED method (Rate, Errors, Duration)
- Golden signals (Latency, Traffic, Errors, Saturation)

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Alerting Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ALERT CATEGORIES                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  P1 - CRITICAL (Page immediately)                   │   │
│  │    • Service down (health check fails 3x)           │   │
│  │    • Error rate > 10% for 5 min                     │   │
│  │    • Database connection pool exhausted             │   │
│  │    • LLM provider completely unavailable            │   │
│  │                                                     │   │
│  │  P2 - HIGH (Page during business hours)             │   │
│  │    • Latency p99 > 5s for 10 min                    │   │
│  │    • Error rate > 5% for 10 min                     │   │
│  │    • Queue depth > 1000 for 15 min                  │   │
│  │    • Disk usage > 85%                               │   │
│  │                                                     │   │
│  │  P3 - MEDIUM (Slack notification)                   │   │
│  │    • Latency p95 > 2s for 15 min                    │   │
│  │    • Error rate > 1% for 30 min                     │   │
│  │    • Memory usage > 80%                             │   │
│  │    • Certificate expiry < 30 days                   │   │
│  │                                                     │   │
│  │  P4 - LOW (Daily digest)                            │   │
│  │    • Deprecated API usage                           │   │
│  │    • Non-critical background job failures           │   │
│  │    • Cost anomalies                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ALERT ROUTING                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Prometheus → Alertmanager → PagerDuty/Slack        │   │
│  │                                                     │   │
│  │  Routes:                                            │   │
│  │    severity=critical → PagerDuty (on-call)          │   │
│  │    severity=high     → PagerDuty (business hours)   │   │
│  │    severity=medium   → Slack #alerts                │   │
│  │    severity=low      → Slack #alerts-digest         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **Prometheus Alert Rules:**
```yaml
# prometheus/alerts.yml
groups:
  - name: critical
    rules:
      - alert: ServiceDown
        expr: up{job="api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          runbook_url: "https://wiki/runbooks/service-down"

      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Error rate above 10%"

  - name: high
    rules:
      - alert: HighLatency
        expr: histogram_quantile(0.99, http_request_duration_seconds_bucket) > 5
        for: 10m
        labels:
          severity: high
        annotations:
          summary: "P99 latency above 5s"

      - alert: LLMProviderDegraded
        expr: llm_request_errors_total / llm_requests_total > 0.05
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "LLM provider error rate above 5%"
```

2. **Alertmanager Config:**
```yaml
# alertmanager.yml
route:
  receiver: 'slack-notifications'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
    - match:
        severity: high
      receiver: 'pagerduty-high'
      active_time_intervals:
        - business_hours
    - match:
        severity: medium
      receiver: 'slack-alerts'

receivers:
  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<PAGERDUTY_KEY>'
        severity: critical
  - name: 'slack-alerts'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true
```

---

## 8. Rate Limiting

### Gap Description
Rate limiting mentioned but not unified across the platform.

### Risk Assessment
- **Severity:** High
- **Impact:** Inconsistent limits, abuse potential, cost overruns
- **Affected Areas:** API gateway, LLM calls, agent executions

### Research Findings

#### Competitor Analysis

**Dify (DeepWiki):**
- **Redis-based** sliding window rate limiting
- Limits per:
  - User/workspace
  - API endpoint
  - LLM provider calls
- Lua scripts for atomic operations
- Configurable limits via environment variables

**n8n (DeepWiki):**
- `ConcurrencyControlService` for execution limits
- API rate limits per user
- Configurable via environment:
  - `N8N_EXECUTIONS_CONCURRENCY_CONTROL_MAX_EXECUTIONS`
- Queue-based throttling in production mode

#### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Rate Limiting Strategy                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RATE LIMIT TIERS                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tier          API Requests   LLM Calls   Workflows │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Free          100/min        50/day      10/day    │   │
│  │  Pro           1000/min       500/day     100/day   │   │
│  │  Enterprise    10000/min      Unlimited   Unlimited │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  RATE LIMIT TYPES                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Request Rate (sliding window)                   │   │
│  │     • Per user/workspace                            │   │
│  │     • Per endpoint                                  │   │
│  │     • Per IP (for unauthenticated)                  │   │
│  │                                                     │   │
│  │  2. Concurrency (semaphore)                         │   │
│  │     • Active workflow executions                    │   │
│  │     • Concurrent LLM calls                          │   │
│  │     • Agent parallel executions                     │   │
│  │                                                     │   │
│  │  3. Quota (daily/monthly)                           │   │
│  │     • LLM token usage                               │   │
│  │     • Workflow runs                                 │   │
│  │     • Storage                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  IMPLEMENTATION (Redis)                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Sliding Window:                                    │   │
│  │    ZADD rate_limit:{user}:{endpoint} {ts} {uuid}    │   │
│  │    ZREMRANGEBYSCORE ... (remove old entries)        │   │
│  │    ZCARD (count current window)                     │   │
│  │                                                     │   │
│  │  Concurrency:                                       │   │
│  │    SETNX lock:{execution_id} 1 EX 300               │   │
│  │    INCR concurrent:{workspace}                      │   │
│  │    (check against max before proceeding)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Implementation Recommendations

1. **RateLimitService:**
```typescript
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

interface RateLimitService {
  // Request rate limiting
  checkRequestRate(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult>;

  // Concurrency limiting
  acquireConcurrency(
    key: string,
    maxConcurrent: number,
    ttlMs: number
  ): Promise<{ acquired: boolean; release: () => Promise<void> }>;

  // Quota checking
  checkQuota(
    key: string,
    increment: number,
    limit: number,
    period: 'day' | 'month'
  ): Promise<RateLimitResult>;
}
```

2. **Redis Sliding Window (Lua Script):**
```lua
-- sliding_window.lua
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local uuid = ARGV[4]

-- Remove old entries
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

-- Count current entries
local count = redis.call('ZCARD', key)

if count < limit then
    redis.call('ZADD', key, now, uuid)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return {1, limit - count - 1, now + window}
else
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local reset_at = oldest[2] + window
    return {0, 0, reset_at}
end
```

3. **Rate Limit Middleware:**
```typescript
// middleware/rateLimit.ts
export function rateLimitMiddleware(options: {
  keyGenerator: (req: Request) => string;
  limit: number;
  windowMs: number;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator(req);
    const result = await rateLimitService.checkRequestRate(
      key,
      options.limit,
      options.windowMs
    );

    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetAt.toISOString());

    if (!result.allowed) {
      res.setHeader('Retry-After', result.retryAfter);
      return res.status(429).json({ error: 'Too Many Requests' });
    }

    next();
  };
}
```

---

## Appendix: Validation Sources

### DeepWiki Repositories Queried
| Repository | Topics Queried |
|------------|----------------|
| langgenius/dify | Search (Elasticsearch, pgvector), Caching (Redis), Mobile (useBreakpoints, PWA), Offline (Serwist), Testing (Vitest), CI/CD (GitHub Actions), Monitoring (Grafana, Sentry, OTEL), Rate Limiting (Redis sliding window) |
| n8n-io/n8n | Search (NodeSearchEngine), Caching (CacheService), Mobile (isMobileDevice), Offline (localStorage), Testing (Playwright), CI/CD (GitHub Actions), Monitoring (Prometheus), Rate Limiting (ConcurrencyControl) |

### Context7 Libraries Queried
| Library | Topics Queried |
|---------|----------------|
| /meilisearch/meilisearch | Hybrid search, vector search, ranking |
| /googlechrome/workbox | Caching strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate), offline support |
| /vite-pwa/vite-plugin-pwa | Service worker configuration, manifest, offline mode |

---

## Summary & Next Steps

All 8 architecture gaps have been validated and require resolution. Recommended priority:

| Priority | Gap | Reason |
|----------|-----|--------|
| 1 | Rate Limiting | Security + cost control |
| 2 | Testing Strategy | Quality foundation |
| 3 | Search/Discovery | Core UX |
| 4 | Monitoring Alerts | Production readiness |
| 5 | Caching Strategy | Performance |
| 6 | CI/CD Details | Developer productivity |
| 7 | Offline Mode | Progressive enhancement |
| 8 | Mobile Support | Progressive enhancement |

**Action Items:**
1. Create detailed technical specs for each gap
2. Add to PRD Section 3 (Functional Requirements)
3. Include in Architecture Document
4. Create implementation epics

---

*Document completed: 2026-01-23*
