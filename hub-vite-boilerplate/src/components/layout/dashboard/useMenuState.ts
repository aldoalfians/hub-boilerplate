import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import type { NavMenuItem } from './types';

type AntMenuItem = Required<MenuProps>['items'][number];

/** Flatten all items (including nested) into a single array */
function flattenItems(items: NavMenuItem[]): NavMenuItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenItems(item.children) : []),
  ]);
}

/** Find the best-matching key for the current pathname */
function findSelectedKey(items: NavMenuItem[], pathname: string): string {
  const flat = flattenItems(items).filter((i) => i.path);
  // Exact match first, then longest prefix match
  const exact = flat.find((i) => i.path === pathname);
  if (exact) return exact.key;
  const prefix = flat
    .filter((i) => i.path && pathname.startsWith(i.path) && i.path !== '/')
    .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0];
  return prefix?.key ?? '';
}

/** Find parent keys of a selected key (for openKeys) */
function findOpenKeys(items: NavMenuItem[], selectedKey: string): string[] {
  for (const item of items) {
    if (!item.children) continue;
    const childKeys = flattenItems(item.children).map((c) => c.key);
    if (childKeys.includes(selectedKey)) {
      return [item.key, ...findOpenKeys(item.children, selectedKey)];
    }
  }
  return [];
}

/** Convert NavMenuItem[] → antd MenuProps items format */
function toAntdItems(items: NavMenuItem[], navigate: (path: string) => void): AntMenuItem[] {
  return items
    .filter((item) => !item.hidden)
    .map((item) => {
      if (item.children?.length) {
        return {
          key: item.key,
          label: item.label,
          icon: item.icon,
          children: toAntdItems(item.children, navigate),
        };
      }
      return {
        key: item.key,
        label: item.label,
        icon: item.icon,
        onClick: item.path ? () => navigate(item.path!) : undefined,
      };
    });
}

interface UseMenuStateReturn {
  selectedKeys: string[];
  defaultOpenKeys: string[];
  antdItems: AntMenuItem[];
}

export function useMenuState(items: NavMenuItem[]): UseMenuStateReturn {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return useMemo(() => {
    const selectedKey = findSelectedKey(items, pathname);
    const openKeys = findOpenKeys(items, selectedKey);
    return {
      selectedKeys: selectedKey ? [selectedKey] : [],
      defaultOpenKeys: openKeys,
      antdItems: toAntdItems(items, navigate),
    };
  }, [items, pathname, navigate]);
}
