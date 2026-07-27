import { Suspense } from 'react';
import AnalyticsPage from '@/pages/AnalyticsPage';

export default function DashMixedRoute() {
  return <Suspense><AnalyticsPage /></Suspense>;
}
