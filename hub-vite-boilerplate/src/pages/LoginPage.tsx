import { Card, Form, Input, Button, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { useToast, useI18n } from '@/hooks';
import type { AuthUser } from '@/types/api';

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [form] = Form.useForm<LoginForm>();
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();
  const toast = useToast();
  const { t } = useI18n();

  const handleLogin = (values: LoginForm) => {
    // TODO: ganti dengan useMutationSubmit ke API real
    const mockUser: AuthUser = {
      id: '1',
      email: values.email,
      name: 'John Doe',
      role: 'admin',
      avatarUrl: null,
    };
    setAuthData('mock-token', mockUser);
    toast.success(t('auth.login.success'));
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 130px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ width: 400, padding: '8px 0' }}>
        <Space
          direction="vertical"
          size={4}
          style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}
        >
          <Title level={3} style={{ margin: 0 }}>
            {t('auth.login.title')}
          </Title>
          <Text type="secondary">{t('auth.login.subtitle')}</Text>
        </Space>

        <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
          <Form.Item
            name="email"
            label={t('auth.login.email')}
            rules={[
              { required: true, message: t('validation.required', { field: t('auth.login.email') }) },
              { type: 'email', message: t('validation.email_invalid') },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('auth.login.email_placeholder')} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('auth.login.password')}
            rules={[
              { required: true, message: t('validation.required', { field: t('auth.login.password') }) },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.login.password_placeholder')} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button type="primary" htmlType="submit" block>
              {t('auth.login.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
