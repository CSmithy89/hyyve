# Story 0-2-4: Create Navigation Components

**Epic:** 0.2 - Frontend Foundation & Design System
**Status:** done
**Priority:** High
**Estimated Effort:** 10-14 hours

## Description

Create reusable navigation components for the Hyyve platform that match the wireframe patterns exactly. These navigation components will be used across the platform to provide consistent navigation experiences. The components must integrate with the layout shells created in Story 0-2-3 and consume the design tokens from Story 0-2-1.

**Components to Create:**

1. **AppHeader** - Top navigation bar with Hyyve logo, global search, notifications, and user menu. Used in AppShell for dashboard/settings pages.

2. **AppSidebar** - Left sidebar navigation with icons and labels for main sections (Home, Projects, Settings, Documentation). Features active state highlighting, hover transitions, and collapsible behavior on mobile.

3. **BuilderHeader** - Builder-specific header with breadcrumb navigation, action buttons (Run, Save, Export), settings button, and user avatar. Used in BuilderLayout for all builder pages.

4. **Breadcrumbs** - Dynamic breadcrumb component that generates navigation path from route segments. Supports custom segment labels and click handlers.

5. **UserMenu** - User avatar dropdown with profile info, plan badge, and menu items (Profile, Settings, Logout). Integrates with Clerk for user data.

6. **MobileNav** - Mobile navigation drawer using shadcn Sheet component. Contains sidebar navigation items in a slide-out panel.

All components must:
- Match the Stitch wireframes pixel-perfect (colors, spacing, typography)
- Use Next.js Link for navigation (not anchor tags)
- Integrate with Clerk for user authentication data
- Support responsive design with mobile-first breakpoints
- Include proper hover/active/focus states
- Use semantic HTML and ARIA attributes for accessibility

## Acceptance Criteria

### AC1: AppHeader Component

- [ ] AC1.1: Creates `apps/web/components/nav/AppHeader.tsx` component
- [ ] AC1.2: Fixed height of `h-16` (64px) matching wireframe specification
- [ ] AC1.3: Background with `bg-background-dark/50 backdrop-blur-md` for translucency
- [ ] AC1.4: Bottom border using `border-border-dark` (#272546)
- [ ] AC1.5: Left side contains Hyyve logo (mobile only) and hamburger menu trigger
- [ ] AC1.6: Center contains global search input (desktop only, `max-w-xl`)
- [ ] AC1.7: Right side contains notification button with badge indicator and quick-add button
- [ ] AC1.8: Search input has proper placeholder text and focus styles
- [ ] AC1.9: Notification badge shows active state with pulse animation
- [ ] AC1.10: Accepts `onMenuClick` prop for mobile sidebar toggle
- [ ] AC1.11: Accepts `rightContent` slot for additional header items
- [ ] AC1.12: Uses `sticky top-0 z-10` positioning

### AC2: AppSidebar Component

- [ ] AC2.1: Creates `apps/web/components/nav/AppSidebar.tsx` component
- [ ] AC2.2: Width of `w-64` (256px) matching wireframe specification
- [ ] AC2.3: Background with `bg-background-dark` (#131221)
- [ ] AC2.4: Right border using `border-border-dark` (#272546)
- [ ] AC2.5: Top section contains Hyyve logo with icon and brand text
- [ ] AC2.6: Navigation section with icon + label links using Material Symbols icons
- [ ] AC2.7: Navigation items: Home, Projects, Settings, Documentation
- [ ] AC2.8: Active state uses `bg-card-border` background and white text
- [ ] AC2.9: Hover state uses `bg-card-border/50` with transition to white text
- [ ] AC2.10: Bottom section contains UserMenu component
- [ ] AC2.11: Sidebar hidden on mobile (`hidden md:flex`)
- [ ] AC2.12: Uses `flex flex-col justify-between` for sticky footer behavior
- [ ] AC2.13: Accepts `activePath` prop to highlight current navigation item
- [ ] AC2.14: Uses Next.js Link component for all navigation links

### AC3: BuilderHeader Component

- [ ] AC3.1: Creates `apps/web/components/nav/BuilderHeader.tsx` component
- [ ] AC3.2: Fixed height of `h-16` (64px) matching AppHeader
- [ ] AC3.3: Background with `bg-[#131221]` solid color (no transparency for canvas)
- [ ] AC3.4: Bottom border using `border-border-dark`
- [ ] AC3.5: Left section contains:
  - Logo SVG matching wireframe (hive icon with brand)
  - Vertical separator (`h-6 w-px bg-border-dark`)
  - Breadcrumbs component
- [ ] AC3.6: Right section contains action buttons:
  - Run button (primary style with play icon and glow shadow)
  - Save button (secondary style with save icon)
  - Export button (secondary style with share icon)
  - Vertical separator
  - Settings button (icon only, rounded-full)
  - UserAvatar with gradient border
- [ ] AC3.7: Run button has `shadow-[0_0_15px_rgba(80,72,229,0.3)]` glow effect
- [ ] AC3.8: Accepts `breadcrumbs` array for Breadcrumbs component
- [ ] AC3.9: Accepts `onRun`, `onSave`, `onExport`, `onSettings` callbacks
- [ ] AC3.10: Action buttons show loading states when callbacks are pending

### AC4: Breadcrumbs Component

- [ ] AC4.1: Creates `apps/web/components/nav/Breadcrumbs.tsx` component
- [ ] AC4.2: Displays navigation path with chevron separators
- [ ] AC4.3: Uses Material Symbols `chevron_right` icon as separator
- [ ] AC4.4: All items except last are clickable links
- [ ] AC4.5: Link items use `text-text-secondary hover:text-white` colors
- [ ] AC4.6: Current item (last) uses `text-white font-medium` with `bg-[#272546]` badge
- [ ] AC4.7: Current item has `px-2 py-0.5 rounded text-xs` styling
- [ ] AC4.8: Accepts `items` array with `{ label: string, href?: string }` shape
- [ ] AC4.9: Items without href render as non-clickable text
- [ ] AC4.10: Uses Next.js Link for navigation items
- [ ] AC4.11: Proper `aria-label="Breadcrumb"` and `aria-current="page"` attributes

### AC5: UserMenu Component

- [ ] AC5.1: Creates `apps/web/components/nav/UserMenu.tsx` component
- [ ] AC5.2: Uses Clerk `useUser()` hook for user data
- [ ] AC5.3: Displays user avatar (circular, gradient border on builder, plain on sidebar)
- [ ] AC5.4: Displays user name truncated with `truncate` class
- [ ] AC5.5: Displays plan badge (e.g., "Pro Plan") in secondary text
- [ ] AC5.6: Expand chevron icon on right side
- [ ] AC5.7: Dropdown menu with DropdownMenu component from shadcn/ui
- [ ] AC5.8: Menu items: Profile, Settings, Sign Out (with Clerk signOut)
- [ ] AC5.9: Menu uses `border border-card-border bg-card-dark` styling
- [ ] AC5.10: Menu items have hover states matching wireframe
- [ ] AC5.11: Sign Out calls `useClerk().signOut()` function
- [ ] AC5.12: Avatar uses Clerk `user.imageUrl` with fallback to initials
- [ ] AC5.13: Accepts `variant` prop ('sidebar' | 'header') for styling variations

### AC6: MobileNav Component

- [ ] AC6.1: Creates `apps/web/components/nav/MobileNav.tsx` component
- [ ] AC6.2: Uses shadcn Sheet component with `side="left"`
- [ ] AC6.3: Sheet width matches sidebar width (`w-64`)
- [ ] AC6.4: Contains same navigation items as AppSidebar
- [ ] AC6.5: Contains UserMenu at bottom
- [ ] AC6.6: Accepts `open` and `onOpenChange` props for controlled state
- [ ] AC6.7: Focus trap enabled when open
- [ ] AC6.8: Backdrop overlay with blur effect
- [ ] AC6.9: Swipe-to-close gesture support on touch devices
- [ ] AC6.10: Proper keyboard navigation (Escape to close)

### AC7: Integration with Layout Shells

- [ ] AC7.1: AppShell uses AppHeader and AppSidebar components
- [ ] AC7.2: BuilderLayout uses BuilderHeader component
- [ ] AC7.3: Navigation components export from `components/nav/index.ts`
- [ ] AC7.4: All navigation respects current route for active states
- [ ] AC7.5: Mobile navigation state managed in layout components

### AC8: Responsive Design

- [ ] AC8.1: AppSidebar hidden below `md` breakpoint (768px)
- [ ] AC8.2: AppHeader shows hamburger menu below `md` breakpoint
- [ ] AC8.3: AppHeader search hidden below `md` breakpoint
- [ ] AC8.4: BuilderHeader responsive behavior matches wireframe
- [ ] AC8.5: UserMenu adapts layout for mobile context
- [ ] AC8.6: All touch targets minimum 44x44px on mobile

### AC9: Accessibility

- [ ] AC9.1: All navigation uses semantic `<nav>` element
- [ ] AC9.2: Navigation has `aria-label` describing purpose
- [ ] AC9.3: Current page indicated with `aria-current="page"`
- [ ] AC9.4: Keyboard navigation works (Tab, Enter, Escape)
- [ ] AC9.5: Focus visible indicators on all interactive elements
- [ ] AC9.6: Screen reader announcements for state changes
- [ ] AC9.7: Skip-to-main-content link (if not in layout)

## Technical Notes

### Wireframe References

| Component | Wireframe Source | Key Lines |
|-----------|------------------|-----------|
| AppHeader | `hyyve_home_dashboard/code.html` | Lines 98-122 |
| AppSidebar | `hyyve_home_dashboard/code.html` | Lines 53-94 |
| BuilderHeader | `hyyve_module_builder/code.html` | Lines 83-129 |
| Breadcrumbs | `hyyve_module_builder/code.html` | Lines 97-103 |
| UserMenu (sidebar) | `hyyve_home_dashboard/code.html` | Lines 86-93 |
| UserMenu (header) | `hyyve_module_builder/code.html` | Lines 123-127 |

### Design Token Mapping

| Element | Wireframe Value | Tailwind Class |
|---------|-----------------|----------------|
| Header height | 64px | `h-16` |
| Sidebar width | 256px | `w-64` |
| Primary color | #5048e5 | `bg-primary`, `text-primary` |
| Primary dark | #3e38b3 | `hover:bg-primary-dark` |
| Background dark | #131221 | `bg-background-dark` |
| Card dark | #1c1b2e | `bg-card-dark` |
| Border dark | #272546 | `border-border-dark`, `border-card-border` |
| Text secondary | #9795c6 | `text-text-secondary` |
| Run button glow | rgba(80,72,229,0.3) | `shadow-[0_0_15px_rgba(80,72,229,0.3)]` |

### CSS Patterns from Wireframes

**AppHeader Pattern (from hyyve_home_dashboard):**
```html
<header class="flex h-16 items-center justify-between border-b border-card-border px-6 py-3 bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
```

**AppSidebar Pattern (from hyyve_home_dashboard):**
```html
<aside class="hidden w-64 flex-col justify-between border-r border-card-border bg-background-dark p-4 md:flex">
```

**Sidebar Logo Section:**
```html
<div class="flex items-center gap-3 px-2">
  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
    <span class="material-symbols-outlined text-white text-2xl">hive</span>
  </div>
  <div class="flex flex-col">
    <h1 class="text-white text-lg font-bold leading-none tracking-tight">Hyyve</h1>
    <p class="text-text-secondary text-xs font-medium">AI Platform</p>
  </div>
</div>
```

**Navigation Link - Active State:**
```html
<a class="flex items-center gap-3 rounded-lg bg-card-border px-3 py-2.5 transition-colors" href="#">
  <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">home</span>
  <span class="text-sm font-medium text-white">Home</span>
</a>
```

**Navigation Link - Default/Hover State:**
```html
<a class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-card-border/50 group" href="#">
  <span class="material-symbols-outlined text-text-secondary group-hover:text-white">folder_open</span>
  <span class="text-sm font-medium text-text-secondary group-hover:text-white">Projects</span>
</a>
```

**User Profile Section (Sidebar):**
```html
<div class="flex items-center gap-3 rounded-lg border border-card-border bg-card-dark p-3">
  <div class="h-9 w-9 rounded-full bg-cover bg-center" style="background-image: url('...');"></div>
  <div class="flex flex-1 flex-col overflow-hidden">
    <p class="truncate text-sm font-medium text-white">Chris Evans</p>
    <p class="truncate text-xs text-text-secondary">Pro Plan</p>
  </div>
  <span class="material-symbols-outlined text-text-secondary text-lg">expand_more</span>
</div>
```

**BuilderHeader Pattern (from hyyve_module_builder):**
```html
<header class="h-16 flex-none flex items-center justify-between border-b border-border-dark bg-[#131221] px-6 z-20">
```

**BuilderHeader Logo:**
```html
<div class="flex items-center gap-3">
  <div class="size-8 text-primary">
    <svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
    </svg>
  </div>
  <h2 class="text-white text-xl font-bold tracking-tight">Hyyve</h2>
</div>
```

**Breadcrumbs Pattern:**
```html
<div class="flex items-center gap-2 text-sm">
  <a class="text-text-secondary hover:text-white transition-colors" href="#">Hyyve</a>
  <span class="text-text-secondary material-symbols-outlined text-[16px]">chevron_right</span>
  <a class="text-text-secondary hover:text-white transition-colors" href="#">Project Alpha</a>
  <span class="text-text-secondary material-symbols-outlined text-[16px]">chevron_right</span>
  <span class="text-white font-medium bg-[#272546] px-2 py-0.5 rounded text-xs">Workflow 1</span>
</div>
```

**Action Buttons Pattern:**
```html
<button class="group flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(80,72,229,0.3)]">
  <span class="material-symbols-outlined text-[20px]">play_arrow</span>
  <span>Run</span>
</button>
<button class="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-[#272546] hover:bg-[#34315c] text-white text-sm font-bold transition-colors">
  <span class="material-symbols-outlined text-[18px]">save</span>
  <span>Save</span>
</button>
```

**User Avatar (Builder - Gradient Border):**
```html
<div class="size-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-[2px] cursor-pointer">
  <div class="size-full rounded-full bg-black">
    <img alt="User Profile Avatar" class="rounded-full w-full h-full bg-white" src="..."/>
  </div>
</div>
```

### File Structure

```
apps/web/
├── components/
│   └── nav/
│       ├── index.ts                # Export all navigation components
│       ├── AppHeader.tsx           # Dashboard/Settings header
│       ├── AppSidebar.tsx          # Main sidebar navigation
│       ├── BuilderHeader.tsx       # Builder-specific header
│       ├── Breadcrumbs.tsx         # Dynamic breadcrumb navigation
│       ├── UserMenu.tsx            # User dropdown menu
│       ├── MobileNav.tsx           # Mobile navigation drawer
│       ├── NavLink.tsx             # Reusable navigation link with active state
│       └── HyyveLogo.tsx           # Logo component (SVG + text variants)
└── __tests__/
    └── nav/
        ├── AppHeader.test.tsx
        ├── AppSidebar.test.tsx
        ├── BuilderHeader.test.tsx
        ├── Breadcrumbs.test.tsx
        ├── UserMenu.test.tsx
        └── MobileNav.test.tsx
```

### TypeScript Interfaces

```typescript
// AppHeader
interface AppHeaderProps {
  onMenuClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

// AppSidebar
interface NavItem {
  label: string;
  href: string;
  icon: string;  // Material Symbols icon name
}

interface AppSidebarProps {
  activePath?: string;
  items?: NavItem[];
  className?: string;
}

// BuilderHeader
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BuilderHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onRun?: () => Promise<void> | void;
  onSave?: () => Promise<void> | void;
  onExport?: () => Promise<void> | void;
  onSettings?: () => void;
  isRunning?: boolean;
  isSaving?: boolean;
  className?: string;
}

// Breadcrumbs
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// UserMenu
interface UserMenuProps {
  variant?: 'sidebar' | 'header';
  className?: string;
}

// MobileNav
interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePath?: string;
  items?: NavItem[];
}

// NavLink (internal)
interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
}
```

### Icon Usage

The wireframes use Material Symbols Outlined. For the React implementation, use one of these approaches:

**Option 1: Material Symbols CSS (recommended for wireframe fidelity)**
```tsx
// Add to globals.css or import Google Fonts
<span className="material-symbols-outlined text-[20px]">home</span>
```

**Option 2: Lucide React (recommended for bundle size)**
```tsx
import { Home, FolderOpen, Settings, BookOpen } from 'lucide-react';
<Home className="size-5" />
```

**Icon Mapping (Material Symbols -> Lucide):**
| Material Symbol | Lucide Icon | Usage |
|-----------------|-------------|-------|
| `home` | `Home` | Home nav item |
| `folder_open` | `FolderOpen` | Projects nav item |
| `settings` | `Settings` | Settings nav item |
| `menu_book` | `BookOpen` | Documentation nav item |
| `search` | `Search` | Search input icon |
| `notifications` | `Bell` | Notifications button |
| `add` | `Plus` | Quick add button |
| `play_arrow` | `Play` | Run button |
| `save` | `Save` | Save button |
| `ios_share` | `Share2` | Export button |
| `chevron_right` | `ChevronRight` | Breadcrumb separator |
| `expand_more` | `ChevronDown` | User menu expand |

### Clerk Integration

```typescript
// UserMenu.tsx
import { useUser, useClerk } from '@clerk/nextjs';

function UserMenu({ variant = 'sidebar' }: UserMenuProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return <UserMenuSkeleton />;
  if (!user) return null;

  const displayName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress;
  const avatarUrl = user.imageUrl;

  // ... render menu
}
```

### Navigation Routes

```typescript
// Default navigation items
const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: 'home' },
  { label: 'Projects', href: '/projects', icon: 'folder_open' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
  { label: 'Documentation', href: '/docs', icon: 'menu_book' },
];
```

### Search Input Behavior

- Placeholder: "Search projects, modules, or docs..."
- Desktop only (hidden on mobile via `hidden md:flex`)
- Focus state: `focus:border-primary focus:bg-card-dark focus:outline-none focus:ring-1 focus:ring-primary`
- Search icon positioned absolutely inside input
- Future: Will integrate with global search functionality (not in scope for this story)

## Dependencies

- **Story 0-2-1: Extract Design System from Wireframes** - COMPLETED
  - Design tokens available in `apps/web/lib/design-tokens.ts`
  - CSS variables in `apps/web/app/globals.css`
  - Tailwind config in `apps/web/tailwind.config.ts`

- **Story 0-2-2: Create shadcn Component Overrides** - COMPLETED
  - Button, DropdownMenu, Sheet components available
  - Component styling matches design system

- **Story 0-2-3: Create Layout Shells** - COMPLETED
  - AppShell and BuilderLayout ready for navigation integration
  - Layout slots defined for header and sidebar content

- **Story 0-1-6: Configure Clerk Authentication** - COMPLETED (Epic 0.1)
  - Clerk SDK configured and available
  - `useUser()` and `useClerk()` hooks work

## Related FRs

This story implements navigation patterns required by multiple functional requirements:

| FR | Requirement | Navigation Component |
|----|-------------|---------------------|
| FR15 | Module Builder visual editor | BuilderHeader, Breadcrumbs |
| FR27 | Chatbot Builder visual editor | BuilderHeader, Breadcrumbs |
| FR31 | Voice Agent Builder | BuilderHeader, Breadcrumbs |
| FR33 | Canvas Builder visual editor | BuilderHeader, Breadcrumbs |
| FR56 | Guided onboarding | AppHeader, AppSidebar |
| FR9 | User profile management | UserMenu |
| FR8 | User logout | UserMenu (Sign Out) |

**NFRs:**
- NFR-MAINT-01: Consistent visual language (navigation enforces consistency)
- NFR-ACC-01: WCAG 2.1 AA accessibility (semantic HTML, ARIA)
- NFR-PERF-01: Optimized navigation (Next.js Link prefetching)

## Implementation Tasks

1. [ ] **Create navigation components directory** - Create `apps/web/components/nav/` folder with index.ts export file

2. [ ] **Create HyyveLogo component** - Reusable logo with SVG and text
   - [ ] Icon-only variant for mobile
   - [ ] Full logo with text variant
   - [ ] Proper sizing and color inheritance

3. [ ] **Implement NavLink component** - Internal reusable link component
   - [ ] Active state detection based on pathname
   - [ ] Icon and label rendering
   - [ ] Proper Link component usage
   - [ ] Hover and focus styles

4. [ ] **Implement AppSidebar component** - Main sidebar navigation
   - [ ] Logo section at top
   - [ ] Navigation items with icons
   - [ ] Active state highlighting
   - [ ] UserMenu at bottom
   - [ ] Responsive hiding on mobile

5. [ ] **Implement AppHeader component** - Dashboard header bar
   - [ ] Mobile menu trigger
   - [ ] Search input (desktop only)
   - [ ] Notification button with badge
   - [ ] Quick add button
   - [ ] Sticky positioning

6. [ ] **Implement Breadcrumbs component** - Path navigation
   - [ ] Dynamic item rendering
   - [ ] Chevron separators
   - [ ] Current page badge styling
   - [ ] Link handling for non-current items
   - [ ] ARIA attributes

7. [ ] **Implement BuilderHeader component** - Builder-specific header
   - [ ] Logo with separator
   - [ ] Breadcrumbs integration
   - [ ] Action buttons (Run, Save, Export)
   - [ ] Settings button
   - [ ] User avatar with gradient border
   - [ ] Button loading states

8. [ ] **Implement UserMenu component** - User dropdown
   - [ ] Clerk integration for user data
   - [ ] Avatar with fallback
   - [ ] Name and plan display
   - [ ] Dropdown menu with items
   - [ ] Sign out functionality
   - [ ] Two variants (sidebar/header)

9. [ ] **Implement MobileNav component** - Mobile drawer
   - [ ] Sheet component integration
   - [ ] Navigation items
   - [ ] UserMenu inclusion
   - [ ] Controlled open state

10. [ ] **Integrate with layout shells** - Wire up navigation to layouts
    - [ ] AppShell uses AppHeader and AppSidebar
    - [ ] BuilderLayout uses BuilderHeader
    - [ ] Mobile navigation state management

11. [ ] **Create test files** - Unit tests for each component
    - [ ] Test rendering and props
    - [ ] Test navigation links
    - [ ] Test responsive behavior
    - [ ] Test Clerk integration mocks
    - [ ] Test accessibility attributes

12. [ ] **Visual verification** - Compare against wireframes
    - [ ] Screenshot AppSidebar against hyyve_home_dashboard
    - [ ] Screenshot BuilderHeader against hyyve_module_builder
    - [ ] Verify colors, spacing, typography match exactly

## Verification Checklist

After implementation, verify:

- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes without warnings
- [ ] All navigation components render correctly
- [ ] Sidebar width is exactly 256px (w-64) on desktop
- [ ] Header height is exactly 64px (h-16)
- [ ] Active navigation state works with current route
- [ ] Hover states match wireframe exactly
- [ ] Run button has visible glow shadow
- [ ] User avatar displays Clerk user image
- [ ] User menu dropdown opens and closes properly
- [ ] Sign out functionality works
- [ ] Mobile navigation drawer opens and closes
- [ ] Breadcrumbs render with proper separators
- [ ] All links navigate correctly with Next.js
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces navigation properly
- [ ] All component tests pass

## Test Coverage Requirements

```typescript
describe('Story 0-2-4: Navigation Components', () => {
  describe('AC1: AppHeader', () => {
    it('should render with h-16 height', () => {});
    it('should show hamburger menu on mobile', () => {});
    it('should show search input on desktop only', () => {});
    it('should render notification button with badge', () => {});
    it('should call onMenuClick when hamburger clicked', () => {});
    it('should render rightContent slot', () => {});
  });

  describe('AC2: AppSidebar', () => {
    it('should render with w-64 width', () => {});
    it('should render Hyyve logo', () => {});
    it('should render all navigation items', () => {});
    it('should highlight active navigation item', () => {});
    it('should render UserMenu at bottom', () => {});
    it('should be hidden on mobile', () => {});
  });

  describe('AC3: BuilderHeader', () => {
    it('should render logo and breadcrumbs', () => {});
    it('should render Run, Save, Export buttons', () => {});
    it('should show loading state when actions pending', () => {});
    it('should call onRun when Run clicked', () => {});
    it('should render user avatar with gradient border', () => {});
  });

  describe('AC4: Breadcrumbs', () => {
    it('should render all items with separators', () => {});
    it('should render last item as current page badge', () => {});
    it('should use Link for non-current items', () => {});
    it('should have proper ARIA attributes', () => {});
  });

  describe('AC5: UserMenu', () => {
    it('should display user name and avatar from Clerk', () => {});
    it('should open dropdown menu on click', () => {});
    it('should call signOut when Sign Out clicked', () => {});
    it('should render sidebar variant correctly', () => {});
    it('should render header variant correctly', () => {});
  });

  describe('AC6: MobileNav', () => {
    it('should open Sheet when open prop is true', () => {});
    it('should render navigation items', () => {});
    it('should call onOpenChange when closed', () => {});
    it('should close on Escape key', () => {});
  });

  describe('AC9: Accessibility', () => {
    it('should use semantic nav elements', () => {});
    it('should have aria-label on navigation', () => {});
    it('should mark current page with aria-current', () => {});
    it('should support keyboard navigation', () => {});
  });
});
```

---

**Source:** Epic file `epics.md`, Story 0.2.4: Create Navigation Components
**Depends On:** Story 0-2-1 (COMPLETED), Story 0-2-2 (COMPLETED), Story 0-2-3 (COMPLETED), Story 0-1-6 (COMPLETED)
**Blocks:** Stories 0.2.8, 0.2.9, 0.2.10, 0.2.11, 0.2.12
**Creates:** `components/nav/AppHeader.tsx`, `components/nav/AppSidebar.tsx`, `components/nav/BuilderHeader.tsx`, `components/nav/Breadcrumbs.tsx`, `components/nav/UserMenu.tsx`, `components/nav/MobileNav.tsx`, `components/nav/NavLink.tsx`, `components/nav/HyyveLogo.tsx`, `components/nav/index.ts`, tests
**Wireframe Sources:** `hyyve_home_dashboard/code.html` (lines 53-122), `hyyve_module_builder/code.html` (lines 83-129)

---

### Follow-up Review (Retry 1)

**Date:** 2026-01-27
**Reviewer:** Claude Code
**Outcome:** APPROVED

#### Issues Verified as Fixed

| Issue # | Severity | Description | Status |
|---------|----------|-------------|--------|
| 2 | HIGH | UserMenu - Link import and usage for Profile/Settings | FIXED - Line 4: `import Link from 'next/link'`; Lines 102, 111, 176, 185: Using `<Link href="/profile">` and `<Link href="/settings">` with `asChild` pattern |
| 3 | HIGH | AppSidebar - ARIA role inappropriate | FIXED - Line 51-52: Changed to `role="region"` with `aria-label="Main navigation sidebar"` |
| 4 | HIGH | AppHeader - notification badge missing animate-pulse | FIXED - Line 100: Badge has `animate-pulse` class |
| 6 | HIGH | UserMenu - signOut missing redirectUrl | FIXED - Lines 62-64: `signOut({ redirectUrl: '/' })` |
| 13 | HIGH | DEFAULT_NAV_ITEMS not in shared constants | FIXED - `constants.ts` exists with exported `DEFAULT_NAV_ITEMS`; `AppSidebar.tsx` imports it on line 9 |

#### Test Results

```
npx vitest run apps/web/__tests__/navigation/navigation-components.test.ts

Test Files  1 passed (1)
Tests       126 passed (126)
Duration    1.15s
```

All 126 navigation component tests pass.

#### Decision

**APPROVED** - All 5 HIGH severity issues from the initial review have been properly addressed. The implementation now:
- Uses Next.js Link for client-side navigation in UserMenu
- Has appropriate ARIA role (`region`) for the sidebar
- Includes pulse animation on the notification badge
- Properly redirects to home on sign out
- Centralizes navigation items in a shared constants file
