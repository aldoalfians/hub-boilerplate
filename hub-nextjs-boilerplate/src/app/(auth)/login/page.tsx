'use client';

import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useAuthStore } from '@/stores';
import { useI18n } from '@/hooks';

const { Title, Text } = Typography;

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg};
  padding: 24px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  box-shadow: ${({ theme }) => theme.shadowCard} !important;
`;

export default function LoginPage() {
  const router = useRouter();
  const { setAuthData } = useAuthStore();
  const { t } = useI18n();
  const [form] = Form.useForm();

  const handleLogin = (values: { email: string; password: string }) => {
    // Mock login — replace with real API call
    setAuthData('mock-token-123', {
      id: '1',
      email: values.email,
      name: 'John Doe',
      role: 'admin',
      avatarUrl: null,
    });
    // Set cookie for middleware auth check
    document.cookie = `hub-auth-token=mock-token-123; path=/; max-age=${60 * 60 * 24 * 7}`;
    router.push('/home');
  };

  return (
    <PageWrap>
      <LoginCard>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              {process.env.NEXT_PUBLIC_APP_NAME ?? 'Hub App'}
            </Title>
            <Text type="secondary">{t('auth.loginSubtitle') || 'Sign in to your account'}</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
            <Form.Item name="email" label={t('auth.email')}
              rules={[{ required: true, message: t('validation.required') }, { type: 'email', message: t('validation.email') }]}
            >
              <Input prefix={<UserOutlined />} placeholder="admin@example.com" size="large" />
            </Form.Item>
            <Form.Item name="password" label={t('auth.password')}
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block size="large">
                {t('auth.login')}
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 12 }}>
            Demo: any email + any password
          </Text>
        </Space>
      </LoginCard>
    </PageWrap>
  );
}
