import DashboardShell from '@/components/layout/dashboard/DashboardShell';

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
