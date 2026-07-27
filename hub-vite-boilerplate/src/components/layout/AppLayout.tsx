import { Layout, Button, Avatar, Dropdown, Space, Typography, theme as antTheme, Menu } from 'antd';
import {
  MoonOutlined,
  SunOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  GlobalOutlined,
  HomeOutlined,
  BarChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '@/stores';
import { useI18n } from '@/hooks';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antTheme.useToken();
  const { mode, toggle } = useThemeStore();
  const { user, clearAuthData, isLoggedIn } = useAuthStore();
  const { t, lang, setLang } = useI18n();

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('nav.settings'),
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ];

  const langMenuItems = [
    {
      key: 'id',
      label: t('language.id'),
      onClick: () => setLang('id'),
    },
    {
      key: 'en',
      label: t('language.en'),
      onClick: () => setLang('en'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorder}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Space size={0} align="center">
          <Text
            strong
            style={{ fontSize: 18, cursor: 'pointer', color: token.colorPrimary, marginRight: 24 }}
            onClick={() => navigate('/')}
          >
            {import.meta.env.VITE_APP_NAME ?? t('app.name')}
          </Text>

          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['dashboards']}
            disabledOverflow
            style={{ border: 'none', background: 'transparent', minWidth: 240 }}
            items={[
              { key: '/', icon: <HomeOutlined />, label: t('nav.home'), onClick: () => navigate('/') },
              { key: '/analytics', icon: <BarChartOutlined />, label: 'Analytics', onClick: () => navigate('/analytics') },
              {
                key: 'dashboards',
                icon: <AppstoreOutlined />,
                label: 'Dashboard',
                children: [
                  { key: '/dashboard', label: 'Classic', onClick: () => navigate('/dashboard') },
                  { key: '/dash-top', label: 'Top Sider', onClick: () => navigate('/dash-top') },
                  { key: '/dash-mixed', label: 'Mixed', onClick: () => navigate('/dash-mixed') },
                  { key: '/dash-mini', label: 'Mini', onClick: () => navigate('/dash-mini') },
                ],
              },
            ]}
          />
        </Space>

        <Space>
          {/* Language Switcher */}
          <Dropdown menu={{ items: langMenuItems, selectedKeys: [lang] }} placement="bottomRight">
            <Button type="text" icon={<GlobalOutlined />}>
              {lang.toUpperCase()}
            </Button>
          </Dropdown>

          {/* Theme Toggle */}
          <Button
            type="text"
            icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggle}
            title={mode === 'dark' ? t('theme.light') : t('theme.dark')}
          />

          {/* User Menu */}
          {isLoggedIn && user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={user.avatarUrl}
                  icon={!user.avatarUrl ? <UserOutlined /> : undefined}
                  style={{ backgroundColor: token.colorPrimary }}
                />
                <Text style={{ fontSize: 13 }}>{user.name}</Text>
              </Space>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              {t('nav.login')}
            </Button>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px', background: token.colorBgLayout }}>
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorder}`,
          padding: '12px 24px',
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          {import.meta.env.VITE_APP_NAME ?? t('app.name')} &copy; {new Date().getFullYear()}
        </Text>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
