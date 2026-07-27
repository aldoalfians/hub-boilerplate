import { Suspense } from 'react';
import AnalyticsPage from '@/pages/AnalyticsPage';

export default function DashMiniRoute() {
  return <Suspense><AnalyticsPage /></Suspense>;
}
