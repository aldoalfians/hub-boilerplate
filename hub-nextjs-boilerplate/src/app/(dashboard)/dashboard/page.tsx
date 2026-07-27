import { Suspense } from 'react';
import AnalyticsPage from '@/pages/AnalyticsPage';

// variant: classic — configured in DashboardShell via pathname
export default function DashboardRoute() {
  return (
    <Suspense>
      <AnalyticsPage />
    </Suspense>
  );
}
