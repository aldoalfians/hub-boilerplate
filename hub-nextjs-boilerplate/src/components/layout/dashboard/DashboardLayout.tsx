'use client';

import { useState, useEffect } from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Typography, Drawer, Grid, Tooltip, theme as antTheme } from 'antd';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined,
  UserOutlined, LogoutOutlined, SettingOutlined, GlobalOutlined, MenuOutlined,
  HomeOutlined, BarChartOutlined, TeamOutlined, FileTextOutlined, AppstoreOutlined, ShoppingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styled, { useTheme } from 'styled-components';
import { useAuthStore, useThemeStore } from '@/stores';
import { useI18n } from '@/hooks';
import DashboardMenu from './DashboardMenu';
import { useMenuState } from './useMenuState';
import type { DashboardLayoutProps, DashboardVariant, NavMenuItem } from './types';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

// ── Styled ──────────────────────────────────────────────────

const StyledLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
`;

const ClassicSider = styled(Sider)`
  && {
    background: #0f172a !important;
    border-right: none;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    height: 100%;
    .ant-layout-sider-children { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .ant-menu.ant-menu-dark { background: transparent; flex: 1; }
    .ant-menu-dark .ant-menu-item-selected { background: rgba(255, 255, 255, 0.12) !important; }
    .ant-menu-dark .ant-menu-item:hover { background: rgba(255, 255, 255, 0.08) !important; }
  }
`;

const LightSider = styled(Sider)`
  && {
    background: ${({ theme }) => theme.bgCard} !important;
    border-right: 1px solid ${({ theme }) => theme.border} !important;
    overflow: hidden;
    height: 100%;
    .ant-layout-sider-children { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .ant-menu-light { background: transparent; }
  }
`;

const MiniSider = styled(Sider)`
  && {
    background: #0f172a !important;
    border-right: none;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    height: 100%;
    .ant-layout-sider-children { display: flex; flex-direction: column; align-items: center; height: 100%; padding-top: 8px; overflow-y: auto; }
    .ant-menu.ant-menu-dark { background: transparent; width: 100%; }
  }
`;

const LogoBox = styled.div<{ $dark?: boolean; $centered?: boolean }>`
  padding: ${({ $centered }) => ($centered ? '20px 12px' : '20px 24px')};
  display: flex;
  align-items: center;
  justify-content: ${({ $centered }) => ($centered ? 'center' : 'flex-start')};
  gap: 10px;
  border-bottom: 1px solid ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;

const LogoIcon = styled.div<{ $dark?: boolean }>`
  width: 32px; height: 32px;
  background: ${({ $dark }) => ($dark ? 'rgba(59,143,255,0.9)' : 'var(--ant-color-primary, #1a75ff)')};
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 16px; color: #fff; flex-shrink: 0;
`;

const LogoText = styled.span<{ $dark?: boolean }>`
  font-size: 16px; font-weight: 700;
  color: ${({ $dark }) => ($dark ? '#f1f5f9' : 'inherit')};
  white-space: nowrap; overflow: hidden;
`;

const CollapseBtn = styled(Button)<{ $dark?: boolean }>`
  && {
    width: 100%; height: 44px; border-radius: 0; border: none;
    border-top: 1px solid ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
    background: transparent;
    color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.5)' : 'inherit')};
    display: flex; align-items: center; justify-content: center;
    gap: 8px; font-size: 13px; flex-shrink: 0; transition: background 0.2s;
    &:hover {
      background: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08) !important' : 'rgba(0,0,0,0.04) !important')};
      color: ${({ $dark }) => ($dark ? '#fff !important' : 'inherit')};
    }
  }
`;

const StyledHeader = styled(Header)`
  && {
    background: ${({ theme }) => theme.bgCard};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between;
    height: 56px; line-height: 56px;
    flex-shrink: 0; z-index: 99;
  }
`;

const ContentArea = styled(Content)`
  && {
    background: ${({ theme }) => theme.bg};
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
`;

// ── Default menu items ──────────────────────────────────────

export const DEFAULT_MENU_ITEMS: NavMenuItem[] = [
  { key: 'home', label: 'Dashboard', icon: <HomeOutlined />, path: '/dashboard' },
  { key: 'analytics', label: 'Analytics', icon: <BarChartOutlined />, path: '/analytics' },
  {
    key: 'management', label: 'Management', icon: <AppstoreOutlined />,
    children: [
      { key: 'users', label: 'Users', icon: <TeamOutlined />, path: '/dashboard/users' },
      { key: 'orders', label: 'Orders', icon: <ShoppingOutlined />, path: '/dashboard/orders' },
    ],
  },
  { key: 'reports', label: 'Reports', icon: <FileTextOutlined />, path: '/dashboard/reports' },
];

// ── DefaultLogo ─────────────────────────────────────────────

const DefaultLogo = ({ dark, collapsed }: { dark?: boolean; collapsed?: boolean }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Hub App';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1 }}>
      <LogoIcon $dark={dark}>{appName[0]}</LogoIcon>
      {!collapsed && <LogoText $dark={dark}>{appName}</LogoText>}
    </div>
  );
};

// ── HeaderActions ───────────────────────────────────────────

const HeaderActions = ({ onMobileMenu }: { onMobileMenu?: () => void }) => {
  const router = useRouter();
  const { token } = antTheme.useToken();
  const { mode, toggle } = useThemeStore();
  const { user, clearAuthData, isLoggedIn } = useAuthStore();
  const { t, lang, setLang } = useI18n();

  const handleLogout = () => {
    clearAuthData();
    document.cookie = 'hub-auth-token=; path=/; max-age=0';
    router.push('/login');
  };

  const userMenu = [
    { key: 'profile', icon: <UserOutlined />, label: t('nav.profile'), onClick: () => router.push('/profile') },
    { key: 'settings', icon: <SettingOutlined />, label: t('nav.settings'), onClick: () => router.push('/settings') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: t('nav.logout'), danger: true, onClick: handleLogout },
  ];
  const langMenu = [
    { key: 'id', label: t('language.id'), onClick: () => setLang('id') },
    { key: 'en', label: t('language.en'), onClick: () => setLang('en') },
  ];

  return (
    <Space size={4}>
      {onMobileMenu && <Button type="text" icon={<MenuOutlined />} onClick={onMobileMenu} />}
      <Dropdown menu={{ items: langMenu, selectedKeys: [lang] }} placement="bottomRight">
        <Button type="text" icon={<GlobalOutlined />}>{lang.toUpperCase()}</Button>
      </Dropdown>
      <Button type="text" icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />} onClick={toggle} />
      {isLoggedIn && user ? (
        <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer', padding: '0 4px' }}>
            <Avatar src={user.avatarUrl} icon={!user.avatarUrl ? <UserOutlined /> : undefined}
              size={30} style={{ backgroundColor: token.colorPrimary }} />
            <Text style={{ fontSize: 13 }}>{user.name}</Text>
          </Space>
        </Dropdown>
      ) : (
        <Button type="primary" size="small" onClick={() => router.push('/login')}>{t('nav.login')}</Button>
      )}
    </Space>
  );
};

// ── Variant props ───────────────────────────────────────────

interface VariantProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  isMobile: boolean;
  children: React.ReactNode;
  props: Required<Pick<DashboardLayoutProps, 'menuItems' | 'siderWidth'>> &
    Pick<DashboardLayoutProps, 'logo' | 'logoCollapsed' | 'headerExtra'>;
}

// ── VARIANT: classic ────────────────────────────────────────

const ClassicLayout = ({ collapsed, setCollapsed, drawerOpen, setDrawerOpen, isMobile, children, props }: VariantProps) => {
  const router = useRouter();
  const { token } = antTheme.useToken();
  const { mode, toggle } = useThemeStore();
  const { user, clearAuthData, isLoggedIn } = useAuthStore();
  const { t, lang, setLang } = useI18n();

  const siderBottom = (
    <div style={{ padding: collapsed && !isMobile ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 4, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}>
        <Button type="text" size="small" icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />} onClick={toggle} style={{ color: 'rgba(255,255,255,0.6)' }} />
        <Dropdown menu={{ items: [{ key: 'id', label: 'ID', onClick: () => setLang('id') }, { key: 'en', label: 'EN', onClick: () => setLang('en') }], selectedKeys: [lang] }} placement="topLeft">
          <Button type="text" size="small" icon={<GlobalOutlined />} style={{ color: 'rgba(255,255,255,0.6)' }}>
            {(!collapsed || isMobile) ? lang.toUpperCase() : null}
          </Button>
        </Dropdown>
      </div>
      {isLoggedIn && user && (
        <Dropdown menu={{ items: [
          { key: 'profile', icon: <UserOutlined />, label: t('nav.profile'), onClick: () => router.push('/profile') },
          { key: 'settings', icon: <SettingOutlined />, label: t('nav.settings'), onClick: () => router.push('/settings') },
          { type: 'divider' as const },
          { key: 'logout', icon: <LogoutOutlined />, label: t('nav.logout'), danger: true, onClick: () => { clearAuthData(); document.cookie = 'hub-auth-token=; path=/; max-age=0'; router.push('/login'); } },
        ] }} placement="topLeft">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' }}>
            <Avatar src={user.avatarUrl} icon={!user.avatarUrl ? <UserOutlined /> : undefined} size={28} style={{ backgroundColor: token.colorPrimary, flexShrink: 0 }} />
            {(!collapsed || isMobile) && (
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
            )}
          </div>
        </Dropdown>
      )}
    </div>
  );

  const siderContent = (dark = true) => (
    <>
      <LogoBox $dark={dark} $centered={collapsed && !isMobile} onClick={() => router.push('/')}>
        {props.logo ? (collapsed && !isMobile ? props.logoCollapsed ?? props.logo : props.logo) : <DefaultLogo dark={dark} collapsed={collapsed && !isMobile} />}
      </LogoBox>
      <DashboardMenu items={props.menuItems} theme="dark" collapsed={collapsed && !isMobile} />
      {siderBottom}
      <CollapseBtn $dark type="text" onClick={() => setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}>
        {!collapsed && 'Collapse'}
      </CollapseBtn>
    </>
  );

  return (
    <StyledLayout>
      {isMobile ? (
        <>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8 }} />
            <DefaultLogo dark collapsed={false} />
          </div>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left" width={props.siderWidth}
            styles={{ body: { padding: 0, background: '#0f172a', display: 'flex', flexDirection: 'column' }, header: { display: 'none' } }}>
            {siderContent(true)}
          </Drawer>
        </>
      ) : (
        <ClassicSider width={props.siderWidth} collapsed={collapsed} collapsedWidth={64} trigger={null}>
          {siderContent(true)}
        </ClassicSider>
      )}
      <Layout style={{ overflow: 'hidden', flex: 1 }}>
        <ContentArea>{children}</ContentArea>
      </Layout>
    </StyledLayout>
  );
};

// ── VARIANT: top-sider ──────────────────────────────────────

const TopSiderLayout = ({ collapsed, setCollapsed, drawerOpen, setDrawerOpen, isMobile, children, props }: VariantProps) => {
  const router = useRouter();
  const sc = useTheme();
  const siderContent = () => (
    <>
      <DashboardMenu items={props.menuItems} theme="light" collapsed={collapsed && !isMobile} />
      <CollapseBtn type="text" onClick={() => setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}>
        {!collapsed && 'Collapse'}
      </CollapseBtn>
    </>
  );
  return (
    <StyledLayout>
      <StyledHeader style={{ borderBottom: `1px solid ${sc.border}` }}>
        <Space size={10} align="center" style={{ cursor: 'pointer', lineHeight: 1 }} onClick={() => router.push('/')}>
          {props.logo ?? <DefaultLogo />}
        </Space>
        <Space>{props.headerExtra}<HeaderActions onMobileMenu={isMobile ? () => setDrawerOpen(true) : undefined} /></Space>
      </StyledHeader>
      <Layout style={{ overflow: 'hidden' }}>
        {isMobile ? (
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left" width={props.siderWidth}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' }, header: { display: 'none' } }}>
            {siderContent()}
          </Drawer>
        ) : (
          <LightSider width={props.siderWidth} collapsed={collapsed} collapsedWidth={64} trigger={null}>{siderContent()}</LightSider>
        )}
        <ContentArea>{children}</ContentArea>
      </Layout>
    </StyledLayout>
  );
};

// ── VARIANT: mixed ──────────────────────────────────────────

const MixedLayout = ({ collapsed, setCollapsed, drawerOpen, setDrawerOpen, isMobile, children, props }: VariantProps) => {
  const router = useRouter();
  const sc = useTheme();
  const siderContent = () => (
    <>
      <LogoBox $centered={collapsed && !isMobile} onClick={() => router.push('/')}>
        {props.logo ? (collapsed && !isMobile ? props.logoCollapsed ?? props.logo : props.logo) : <DefaultLogo collapsed={collapsed && !isMobile} />}
      </LogoBox>
      <DashboardMenu items={props.menuItems} theme="light" collapsed={collapsed && !isMobile} />
      <CollapseBtn type="text" onClick={() => setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}>
        {!collapsed && 'Collapse'}
      </CollapseBtn>
    </>
  );
  return (
    <StyledLayout>
      <Layout style={{ overflow: 'hidden' }}>
        {isMobile ? (
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left" width={props.siderWidth}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' }, header: { display: 'none' } }}>
            {siderContent()}
          </Drawer>
        ) : (
          <LightSider width={props.siderWidth} collapsed={collapsed} collapsedWidth={64} trigger={null}
            style={{ borderRight: `1px solid ${sc.border}` }}>
            {siderContent()}
          </LightSider>
        )}
        <Layout style={{ overflow: 'hidden' }}>
          <StyledHeader>
            {isMobile && <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} style={{ marginRight: 8 }} />}
            <div style={{ flex: 1 }} />
            <Space>{props.headerExtra}<HeaderActions /></Space>
          </StyledHeader>
          <ContentArea>{children}</ContentArea>
        </Layout>
      </Layout>
    </StyledLayout>
  );
};

// ── VARIANT: mini ───────────────────────────────────────────

const MiniLayout = ({ drawerOpen, setDrawerOpen, isMobile, children, props }: VariantProps) => {
  const router = useRouter();
  const { selectedKeys, antdItems } = useMenuState(props.menuItems);
  return (
    <StyledLayout>
      <StyledHeader>
        <Space size={10} align="center" style={{ cursor: 'pointer', lineHeight: 1 }} onClick={() => router.push('/')}>
          {props.logo ?? <DefaultLogo />}
        </Space>
        <Space>{props.headerExtra}<HeaderActions onMobileMenu={isMobile ? () => setDrawerOpen(true) : undefined} /></Space>
      </StyledHeader>
      <Layout style={{ overflow: 'hidden' }}>
        {isMobile ? (
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="left" width={props.siderWidth}
            styles={{ body: { padding: 0, background: '#0f172a', display: 'flex', flexDirection: 'column' }, header: { display: 'none' } }}>
            <DashboardMenu items={props.menuItems} theme="dark" />
          </Drawer>
        ) : (
          <MiniSider width={64} collapsedWidth={64} trigger={null}>
            <div style={{ height: 8 }} />
            {antdItems.map((item: any) => (
              <Tooltip key={item.key} title={item.label} placement="right">
                <div onClick={item.onClick} style={{
                  width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 4, cursor: 'pointer', fontSize: 18,
                  color: selectedKeys.includes(item.key) ? '#3b8fff' : 'rgba(255,255,255,0.55)',
                  background: selectedKeys.includes(item.key) ? 'rgba(59,143,255,0.15)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  {item.icon}
                </div>
              </Tooltip>
            ))}
          </MiniSider>
        )}
        <ContentArea>{children}</ContentArea>
      </Layout>
    </StyledLayout>
  );
};

// ── Main ────────────────────────────────────────────────────

const VARIANT_MAP: Record<DashboardVariant, React.ComponentType<VariantProps>> = {
  classic: ClassicLayout,
  'top-sider': TopSiderLayout,
  mixed: MixedLayout,
  mini: MiniLayout,
};

export default function DashboardLayout({
  variant = 'classic',
  menuItems = DEFAULT_MENU_ITEMS,
  logo, logoCollapsed, siderWidth = 240, headerExtra, children,
}: DashboardLayoutProps) {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!screens.xl && screens.lg) setCollapsed(true);
    else if (screens.xl) setCollapsed(false);
  }, [screens.xl, screens.lg]);

  const VariantComponent = VARIANT_MAP[variant];
  return (
    <VariantComponent
      collapsed={collapsed} setCollapsed={setCollapsed}
      drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}
      isMobile={isMobile}
      children={children}
      props={{ menuItems, logo, logoCollapsed, siderWidth, headerExtra }}
    />
  );
}
