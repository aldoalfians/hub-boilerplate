import { Suspense } from 'react';
import AnalyticsPage from '@/pages/AnalyticsPage';

export default function AnalyticsRoute() {
  return (
    <Suspense>
      <AnalyticsPage />
    </Suspense>
  );
}
