import type { ReactNode } from 'react';

export type DashboardVariant = 'classic' | 'top-sider' | 'mixed' | 'mini';

export interface NavMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  /** Route path — used for active state matching */
  path?: string;
  children?: NavMenuItem[];
  /** Hide item from menu */
  hidden?: boolean;
}

export interface DashboardLayoutProps {
  /** Layout variant. Default: 'classic' */
  variant?: DashboardVariant;
  /** Menu items with optional nested children */
  menuItems?: NavMenuItem[];
  /** Logo node shown in full (uncollapsed) state */
  logo?: ReactNode;
  /** Logo node shown when sider is collapsed (icon/small) */
  logoCollapsed?: ReactNode;
  /** Sider width in px. Default: 240 */
  siderWidth?: number;
  /** Page content */
  children?: ReactNode;
  /** Extra actions for header (right side) */
  headerExtra?: ReactNode;
}
