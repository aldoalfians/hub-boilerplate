import { Card, Typography, Row, Col, Button, Space, Tag } from 'antd';
import {
  ThunderboltOutlined,
  ApiOutlined,
  DatabaseOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '@/stores';
import { useToast, useI18n } from '@/hooks';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const { mode, toggle } = useThemeStore();
  const toast = useToast();
  const { t } = useI18n();

  const features = [
    {
      icon: <ThunderboltOutlined style={{ fontSize: 24 }} />,
      title: 'Vite + React + TypeScript',
      description: 'Fast HMR, type-safe development, modern tooling out of the box.',
    },
    {
      icon: <ApiOutlined style={{ fontSize: 24 }} />,
      title: 'React Query + Axios',
      description: 'useQueryFetch & useMutationSubmit with auto error handling & caching.',
    },
    {
      icon: <DatabaseOutlined style={{ fontSize: 24 }} />,
      title: 'Zustand',
      description: 'Auth store + Theme store + Language store with localStorage persistence.',
    },
    {
      icon: <BgColorsOutlined style={{ fontSize: 24 }} />,
      title: 'Ant Design 6 + i18n',
      description: 'Global theme (light/dark) + i18next with namespace support.',
    },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Tag color="blue" style={{ marginBottom: 16 }}>
          {t('home.badge')}
        </Tag>
        <Title level={1} style={{ margin: 0 }}>
          {t('home.title')}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginTop: 12 }}>
          {t('home.subtitle')}
        </Paragraph>
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" size="large">
            {t('common.get_started')}
          </Button>
          <Button size="large" onClick={toggle}>
            {mode === 'dark' ? t('home.switch_light') : t('home.switch_dark')}
          </Button>
          <Button
            size="large"
            onClick={() => toast.success(t('home.toast_test_message'), t('home.test_toast'))}
          >
            {t('home.test_toast')}
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {features.map((feat) => (
          <Col xs={24} sm={12} key={feat.title}>
            <Card hoverable>
              <Space direction="vertical" size={8}>
                <Text style={{ color: '#1A75FF' }}>{feat.icon}</Text>
                <Text strong style={{ fontSize: 16 }}>
                  {feat.title}
                </Text>
                <Text type="secondary">{feat.description}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
