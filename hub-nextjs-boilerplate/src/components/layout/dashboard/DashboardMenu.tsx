'use client';

import { Menu } from 'antd';
import type { NavMenuItem } from './types';
import { useMenuState } from './useMenuState';

interface DashboardMenuProps {
  items: NavMenuItem[];
  theme?: 'dark' | 'light';
  collapsed?: boolean;
  mode?: 'inline' | 'vertical';
}

const DashboardMenu = ({ items, theme = 'dark', collapsed = false, mode = 'inline' }: DashboardMenuProps) => {
  const { selectedKeys, defaultOpenKeys, antdItems } = useMenuState(items);
  return (
    <Menu
      mode={mode}
      theme={theme}
      selectedKeys={selectedKeys}
      defaultOpenKeys={collapsed ? [] : defaultOpenKeys}
      items={antdItems}
      inlineCollapsed={collapsed}
      style={{ border: 'none', flex: 1, overflow: 'auto' }}
    />
  );
};

export default DashboardMenu;
