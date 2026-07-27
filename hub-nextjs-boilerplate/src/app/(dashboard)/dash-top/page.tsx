import { Suspense } from 'react';
import AnalyticsPage from '@/pages/AnalyticsPage';

export default function DashTopRoute() {
  return <Suspense><AnalyticsPage /></Suspense>;
}
