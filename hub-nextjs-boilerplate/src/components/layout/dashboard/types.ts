import type { ReactNode } from 'react';

export type DashboardVariant = 'classic' | 'top-sider' | 'mixed' | 'mini';

export interface NavMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: NavMenuItem[];
  hidden?: boolean;
}

export interface DashboardLayoutProps {
  variant?: DashboardVariant;
  menuItems?: NavMenuItem[];
  logo?: ReactNode;
  logoCollapsed?: ReactNode;
  siderWidth?: number;
  children?: ReactNode;
  headerExtra?: ReactNode;
}
