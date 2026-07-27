'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';
import type { DashboardVariant } from './types';

const VARIANT_MAP: Array<{ prefix: string; variant: DashboardVariant }> = [
  { prefix: '/dash-top', variant: 'top-sider' },
  { prefix: '/dash-mixed', variant: 'mixed' },
  { prefix: '/dash-mini', variant: 'mini' },
  { prefix: '/dashboard', variant: 'classic' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const match = VARIANT_MAP.find((v) => pathname.startsWith(v.prefix));
  const variant: DashboardVariant = match?.variant ?? 'classic';

  return <DashboardLayout variant={variant}>{children}</DashboardLayout>;
}
