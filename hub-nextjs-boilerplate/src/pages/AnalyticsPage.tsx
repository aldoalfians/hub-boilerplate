'use client';

import { Row, Col, Card, Typography, Select, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DollarOutlined, ShoppingOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { BarChartWidget, AreaChartWidget, LineChartWidget, PieChartWidget } from '@/components/charts';
import { useI18n } from '@/hooks';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 0 32px;
`;

const ChartCard = styled(Card)`
  border-radius: ${({ theme }) => theme.radiusLg} !important;
  border: 1px solid ${({ theme }) => theme.border} !important;
  box-shadow: ${({ theme }) => theme.shadowCard} !important;
  overflow: hidden;
  .ant-card-head { border-bottom: 1px solid ${({ theme }) => theme.border}; min-height: auto; padding: 14px 20px; }
  .ant-card-head-title { font-weight: 700; font-size: 15px; padding: 0; }
  .ant-card-extra { padding: 0; }
  .ant-card-body { padding: 20px !important; }
`;

const StatCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => !['$trend'].includes(prop),
})<{ $trend?: 'up' | 'down' | 'neutral' }>`
  border-radius: ${({ theme }) => theme.radiusLg} !important;
  border: 1px solid ${({ theme }) => theme.border} !important;
  box-shadow: ${({ theme }) => theme.shadowCard} !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  &:hover { box-shadow: ${({ theme }) => theme.shadowHover} !important; transform: translateY(-2px); }
  .ant-card-body { padding: 20px 24px !important; }
  .stat-icon {
    width: 44px; height: 44px; border-radius: ${({ theme }) => theme.radiusMd};
    background: ${({ theme }) => theme.primaryLight};
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: ${({ theme }) => theme.primary}; margin-bottom: 12px;
  }
  .trend {
    color: ${({ theme, $trend }) => $trend === 'up' ? theme.success : $trend === 'down' ? theme.danger : theme.textMuted};
    font-size: 12px; font-weight: 600;
    display: flex; align-items: center; gap: 4px; margin-top: 8px;
  }
`;

const monthlyData = [
  { name: 'Jan', revenue: 4200, users: 240, orders: 180 },
  { name: 'Feb', revenue: 5800, users: 310, orders: 220 },
  { name: 'Mar', revenue: 4900, users: 280, orders: 195 },
  { name: 'Apr', revenue: 7200, users: 420, orders: 310 },
  { name: 'May', revenue: 6800, users: 390, orders: 285 },
  { name: 'Jun', revenue: 8400, users: 510, orders: 380 },
  { name: 'Jul', revenue: 9100, users: 560, orders: 420 },
];

const categoryData = [
  { name: 'Electronics', value: 4200 },
  { name: 'Clothing', value: 3100 },
  { name: 'Food', value: 2800 },
  { name: 'Books', value: 1400 },
  { name: 'Other', value: 900 },
];

const weeklyData = [
  { name: 'Mon', visits: 1200 },
  { name: 'Tue', visits: 1850 },
  { name: 'Wed', visits: 1600 },
  { name: 'Thu', visits: 2200 },
  { name: 'Fri', visits: 1900 },
  { name: 'Sat', visits: 2800 },
  { name: 'Sun', visits: 2100 },
];

const stats = [
  { title: 'Total Users', value: 12840, icon: <UserOutlined />, trend: 'up' as const, trendValue: '+12.5%' },
  { title: 'Revenue', value: 48200, prefix: '$', icon: <DollarOutlined />, trend: 'up' as const, trendValue: '+8.2%' },
  { title: 'Orders', value: 1985, icon: <ShoppingOutlined />, trend: 'down' as const, trendValue: '-3.1%' },
  { title: 'Page Views', value: 94200, icon: <EyeOutlined />, trend: 'up' as const, trendValue: '+24.8%' },
];

const AnalyticsPage = () => {
  const { t } = useI18n();
  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Analytics</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Overview dashboard — data updates in real time</Text>
        </div>
        <Select defaultValue="7d" style={{ width: 130 }} options={[
          { label: 'Last 7 days', value: '7d' },
          { label: 'Last 30 days', value: '30d' },
          { label: 'Last 3 months', value: '3m' },
          { label: 'This year', value: '1y' },
        ]} />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <StatCard $trend={stat.trend}>
              <div className="stat-icon">{stat.icon}</div>
              <Statistic title={<Text type="secondary" style={{ fontSize: 13 }}>{stat.title}</Text>} value={stat.value} prefix={stat.prefix} valueStyle={{ fontSize: 26, fontWeight: 700 }} />
              <div className="trend">
                {stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {stat.trendValue} vs last period
              </div>
            </StatCard>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={15}>
          <ChartCard title="Monthly Revenue" extra={<Text type="secondary">Jan – Jul</Text>}>
            <AreaChartWidget data={monthlyData} dataKeys={['revenue']} xKey="name" height={260} formatter={(val) => `$${val.toLocaleString()}`} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={9}>
          <ChartCard title="Sales by Category" extra={<Text type="secondary">This month</Text>}>
            <PieChartWidget data={categoryData} innerRadius={55} outerRadius={90} height={260} formatter={(val) => `$${val.toLocaleString()}`} />
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <ChartCard title="Monthly Orders" extra={<Text type="secondary">{t('common.see_all')}</Text>}>
            <BarChartWidget data={monthlyData} dataKeys={['orders']} xKey="name" height={240} barRadius={8} formatter={(val) => `${val} orders`} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard title="New Users" extra={<Text type="secondary">Monthly</Text>}>
            <AreaChartWidget data={monthlyData} dataKeys={['users']} xKey="name" height={240} colors={['#16A34A']} formatter={(val) => `${val} users`} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard title="Daily Page Visits" extra={<Text type="secondary">This week</Text>}>
            <LineChartWidget data={weeklyData} dataKeys={['visits']} xKey="name" height={240} showDots colors={['#9333EA']} formatter={(val) => `${val.toLocaleString()} views`} />
          </ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AnalyticsPage;
