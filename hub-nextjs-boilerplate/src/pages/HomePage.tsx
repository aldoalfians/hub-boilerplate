'use client';

import { Card, Row, Col, Typography, Space, Button, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useI18n } from '@/hooks';
import { useAuthStore } from '@/stores';

const { Title, Text, Paragraph } = Typography;

const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 8px 0 32px;
`;

const FeatureCard = styled(Card)`
  border-radius: ${({ theme }) => theme.radiusLg} !important;
  border: 1px solid ${({ theme }) => theme.border} !important;
  box-shadow: ${({ theme }) => theme.shadowCard} !important;
  height: 100%;
  .ant-card-body { padding: 20px 24px !important; }
`;

const features = [
  { title: 'React Query v5', desc: 'Server state, caching, pagination' },
  { title: 'Zustand v5', desc: 'Auth, theme, language stores' },
  { title: 'Ant Design v6', desc: 'UI components with dark mode' },
  { title: 'styled-components v6', desc: 'SSR-ready CSS-in-JS + theme tokens' },
  { title: 'i18next', desc: 'ID/EN translations, lazy loaded' },
  { title: 'Recharts', desc: 'Theme-aware bar, area, line, pie charts' },
  { title: 'DashboardLayout', desc: '4 variants: classic, top-sider, mixed, mini' },
  { title: 'useMutator pattern', desc: 'CRUD hooks co-located with pages' },
];

export default function HomePage() {
  const { t } = useI18n();
  const { user } = useAuthStore();

  return (
    <PageContainer>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0 }}>
          {t('home.welcome')}, {user?.name ?? 'User'}
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
          Hub Next.js Boilerplate — production-ready starter with Next.js 15 App Router.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {features.map((f) => (
          <Col xs={24} sm={12} lg={6} key={f.title}>
            <FeatureCard>
              <Space direction="vertical" size={8}>
                <CheckCircleOutlined style={{ fontSize: 20, color: '#16A34A' }} />
                <Text strong style={{ fontSize: 14 }}>{f.title}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{f.desc}</Text>
              </Space>
            </FeatureCard>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Tag color="blue">Next.js 15</Tag>
        <Tag color="purple">React 19</Tag>
        <Tag color="cyan">TypeScript 5</Tag>
        <Tag color="green">App Router</Tag>
        <Tag color="orange">SSR styled-components</Tag>
      </div>
    </PageContainer>
  );
}
