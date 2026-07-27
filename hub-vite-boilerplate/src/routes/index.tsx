import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components';
import { DashboardLayout } from '@/components/layout/dashboard';
import { useAuthStore } from '@/stores';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <Spin size="large" />
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public layout (top header) ── */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
        </Route>

        {/* ── Dashboard layouts — each variant as nested route group ── */}

        {/* variant: classic (dark sider, no header) */}
        <Route element={<PrivateRoute><DashboardLayout variant="classic" /></PrivateRoute>}>
          <Route path="/dashboard" element={<AnalyticsPage />} />
          <Route path="/dashboard/users" element={<AnalyticsPage />} />
          <Route path="/dashboard/orders" element={<AnalyticsPage />} />
          <Route path="/dashboard/reports" element={<AnalyticsPage />} />
        </Route>

        {/* variant: top-sider (logo in header, light sider) */}
        <Route element={<PrivateRoute><DashboardLayout variant="top-sider" /></PrivateRoute>}>
          <Route path="/dash-top" element={<AnalyticsPage />} />
        </Route>

        {/* variant: mixed (logo in sider + header with actions) */}
        <Route element={<PrivateRoute><DashboardLayout variant="mixed" /></PrivateRoute>}>
          <Route path="/dash-mixed" element={<AnalyticsPage />} />
        </Route>

        {/* variant: mini (icon-only sider + header) */}
        <Route element={<PrivateRoute><DashboardLayout variant="mini" /></PrivateRoute>}>
          <Route path="/dash-mini" element={<AnalyticsPage />} />
        </Route>

        {/* ── Auth ── */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
