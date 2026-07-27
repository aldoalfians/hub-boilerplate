'use client';

import { Layout, Button, Avatar, Dropdown, Space, Typography, theme as antTheme, Menu } from 'antd';
import { MoonOutlined, SunOutlined, UserOutlined, LogoutOutlined, SettingOutlined, GlobalOutlined, HomeOutlined, BarChartOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useAuthStore, useThemeStore } from '@/stores';
import { useI18n } from '@/hooks';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: ${({ theme }) => theme.bgCard};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    position: sticky;
    top: 0;
    z-index: 100;
  }
`;

const StyledContent = styled(Content)`
  && {
    padding: 24px;
    background: ${({ theme }) => theme.bg};
  }
`;

const StyledFooter = styled(Footer)`
  && {
    text-align: center;
    background: ${({ theme }) => theme.bgCard};
    border-top: 1px solid ${({ theme }) => theme.border};
    padding: 12px 24px;
  }
`;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = antTheme.useToken();
  const { mode, toggle } = useThemeStore();
  const { user, clearAuthData, isLoggedIn } = useAuthStore();
  const { t, lang, setLang } = useI18n();

  const handleLogout = () => {
    clearAuthData();
    document.cookie = 'hub-auth-token=; path=/; max-age=0';
    router.push('/login');
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: t('nav.profile'), onClick: () => router.push('/profile') },
    { key: 'settings', icon: <SettingOutlined />, label: t('nav.settings'), onClick: () => router.push('/settings') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: t('nav.logout'), danger: true, onClick: handleLogout },
  ];

  const langMenuItems = [
    { key: 'id', label: t('language.id'), onClick: () => setLang('id') },
    { key: 'en', label: t('language.en'), onClick: () => setLang('en') },
  ];

  return (
    <StyledLayout>
      <StyledHeader>
        <Space size={0} align="center">
          <Text strong style={{ fontSize: 18, cursor: 'pointer', color: token.colorPrimary, marginRight: 24 }} onClick={() => router.push('/home')}>
            {process.env.NEXT_PUBLIC_APP_NAME ?? t('app.name')}
          </Text>
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            disabledOverflow
            style={{ border: 'none', background: 'transparent', minWidth: 240 }}
            items={[
              { key: '/home', icon: <HomeOutlined />, label: t('nav.home'), onClick: () => router.push('/home') },
              { key: '/analytics', icon: <BarChartOutlined />, label: 'Analytics', onClick: () => router.push('/analytics') },
              {
                key: 'dashboards',
                icon: <AppstoreOutlined />,
                label: 'Dashboard',
                children: [
                  { key: '/dashboard', label: 'Classic', onClick: () => router.push('/dashboard') },
                  { key: '/dash-top', label: 'Top Sider', onClick: () => router.push('/dash-top') },
                  { key: '/dash-mixed', label: 'Mixed', onClick: () => router.push('/dash-mixed') },
                  { key: '/dash-mini', label: 'Mini', onClick: () => router.push('/dash-mini') },
                ],
              },
            ]}
          />
        </Space>

        <Space>
          <Dropdown menu={{ items: langMenuItems, selectedKeys: [lang] }} placement="bottomRight">
            <Button type="text" icon={<GlobalOutlined />}>{lang.toUpperCase()}</Button>
          </Dropdown>
          <Button type="text" icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />} onClick={toggle} />
          {isLoggedIn && user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={user.avatarUrl} icon={!user.avatarUrl ? <UserOutlined /> : undefined} style={{ backgroundColor: token.colorPrimary }} />
                <Text style={{ fontSize: 13 }}>{user.name}</Text>
              </Space>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => router.push('/login')}>{t('nav.login')}</Button>
          )}
        </Space>
      </StyledHeader>

      <StyledContent>{children}</StyledContent>

      <StyledFooter>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {process.env.NEXT_PUBLIC_APP_NAME ?? t('app.name')} &copy; {new Date().getFullYear()}
        </Text>
      </StyledFooter>
    </StyledLayout>
  );
}
