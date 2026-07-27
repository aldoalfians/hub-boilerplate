# Layout System

## Overview

Two layout types: `AppLayout` (public/landing pages) and `DashboardLayout` (authenticated app with sider).

---

## AppLayout

Used for public-facing pages. Top header + footer, no sider.

```
Routes:   /          (PrivateRoute → HomePage)
          /analytics (PrivateRoute → AnalyticsPage)
```

**Header features:**
- App name/logo → navigates to `/`
- Horizontal nav menu (Home, Analytics, Dashboard submenu)
- Language switcher dropdown
- Theme toggle (light/dark)
- User avatar dropdown (profile, settings, logout) or Login button

```tsx
// routes/index.tsx
<Route element={<AppLayout />}>
  <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
  <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
</Route>
```

---

## DashboardLayout

Authenticated dashboard with collapsible sider. Four variants — all share:
- Sider fixed height, only content area scrolls
- Collapsible sider (collapse button at bottom)
- Auto-collapse on tablet (xl breakpoint)
- Mobile: sider replaced by Drawer (hamburger trigger)
- Active menu item auto-detected from current pathname (including nested routes)
- Submenu open state auto-computed on load

### Props

```tsx
interface DashboardLayoutProps {
  variant?: 'classic' | 'top-sider' | 'mixed' | 'mini';  // default: 'classic'
  menuItems?: NavMenuItem[];       // default: DEFAULT_MENU_ITEMS
  logo?: React.ReactNode;          // custom logo (full)
  logoCollapsed?: React.ReactNode; // custom logo when collapsed
  siderWidth?: number;             // default: 240
  headerExtra?: React.ReactNode;   // extra content in header (if variant has header)
}
```

### NavMenuItem type

```tsx
interface NavMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;       // navigates to this path on click
  children?: NavMenuItem[]; // submenu items
}
```

---

## Variants

### classic

**Dark sider only — no top header.**

User actions (theme toggle, language, user avatar) live at the **bottom of the sider**. Content area is full width without a top bar. Best for dense admin dashboards (Notion-style, Linear-style).

```
Layout:
  [Dark Sider]  Logo
                Menu (flex: 1, scrollable)
                ── Theme | Lang
                   User avatar
                ── Collapse btn
  [Content]     Full width, scrolls independently
```

```tsx
// routes/index.tsx
<Route element={<PrivateRoute><DashboardLayout variant="classic" /></PrivateRoute>}>
  <Route path="/dashboard" element={<AnalyticsPage />} />
  <Route path="/dashboard/users" element={<AnalyticsPage />} />
  <Route path="/dashboard/orders" element={<AnalyticsPage />} />
  <Route path="/dashboard/reports" element={<AnalyticsPage />} />
</Route>
```

---

### top-sider

**Logo in top header + light sider below.**

Header spans full width (logo left, actions right). Sider sits below header on the left. Good for SaaS products where the header carries branding.

```
Layout:
  [Header]     Logo                    Lang | Theme | User
  ─────────────────────────────────────────────────────────
  [Light Sider] Menu (scrollable)
  [Content]     Scrolls independently  Collapse btn at sider bottom
```

```tsx
<Route element={<PrivateRoute><DashboardLayout variant="top-sider" /></PrivateRoute>}>
  <Route path="/dash-top" element={<AnalyticsPage />} />
</Route>
```

---

### mixed

**Light sider with logo + header with actions only.**

Sider owns the logo and nav. Header has no logo — just user actions on the right. Clean separation: navigation on left, controls on top-right.

```
Layout:
  [Light Sider] Logo
                Menu (scrollable)
                Collapse btn
  [Header]                             Lang | Theme | User
  [Content]     Scrolls independently
```

```tsx
<Route element={<PrivateRoute><DashboardLayout variant="mixed" /></PrivateRoute>}>
  <Route path="/dash-mixed" element={<AnalyticsPage />} />
</Route>
```

---

### mini

**Icon-only dark sider + header with logo.**

Sider shows only icons (64px wide, no text, no collapse). Tooltip on hover shows label. Header carries logo + actions. Good for space-efficient power-user dashboards.

```
Layout:
  [Header]     Logo                    Lang | Theme | User
  ─────────────────────────────────────────────────────────
  [Mini Sider] [icon]  ← tooltip on hover, 64px fixed
               [icon]
               [icon]
  [Content]    Scrolls independently
```

> Mini variant does not support submenus — only top-level items with `path` are rendered.

```tsx
<Route element={<PrivateRoute><DashboardLayout variant="mini" /></PrivateRoute>}>
  <Route path="/dash-mini" element={<AnalyticsPage />} />
</Route>
```

---

## Variant Comparison

| Feature | classic | top-sider | mixed | mini |
|---------|---------|-----------|-------|------|
| Sider color | Dark | Light | Light | Dark |
| Top header | No | Yes | Yes | Yes |
| Logo location | Sider | Header | Sider | Header |
| User actions | Sider bottom | Header | Header | Header |
| Collapsible | Yes | Yes | Yes | No (fixed 64px) |
| Submenu support | Yes | Yes | Yes | No |
| Mobile drawer | Yes | Yes | Yes | Yes |

---

## Custom Menu Items

```tsx
import { DashboardLayout } from '@/components';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';

const menu = [
  { key: 'home', label: 'Home', icon: <HomeOutlined />, path: '/' },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    children: [
      { key: 'profile', label: 'Profile', path: '/settings/profile' },
      { key: 'billing', label: 'Billing', path: '/settings/billing' },
    ],
  },
];

<DashboardLayout variant="classic" menuItems={menu} siderWidth={260} />
```

---

## Active State Logic

`useMenuState(items)` auto-computes selected + open keys from `useLocation().pathname`.

- **Selected key**: longest-prefix match — `/dashboard/users` selects `users`, not `home`
- **Open keys**: parent keys of selected item are auto-opened on mount

No manual `selectedKeys` management needed.

---

## Scroll Behavior

All variants use overflow containment — no `position: fixed` tricks:

```
StyledLayout   height: 100vh; overflow: hidden   ← viewport container
  Sider        height: 100%; overflow: hidden     ← stays in place
    Menu       flex: 1; overflow: auto            ← menu scrolls if long
  Layout       overflow: hidden                   ← inner wrapper
    Header     flex-shrink: 0                     ← stays at top
    ContentArea overflow-y: auto; flex: 1         ← only this scrolls
```
