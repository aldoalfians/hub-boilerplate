'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import type { NavMenuItem } from './types';

type AntMenuItem = Required<MenuProps>['items'][number];

function flattenItems(items: NavMenuItem[]): NavMenuItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenItems(item.children) : [])]);
}

function findSelectedKey(items: NavMenuItem[], pathname: string): string {
  const flat = flattenItems(items).filter((i) => i.path);
  const exact = flat.find((i) => i.path === pathname);
  if (exact) return exact.key;
  const prefix = flat
    .filter((i) => i.path && pathname.startsWith(i.path) && i.path !== '/')
    .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0];
  return prefix?.key ?? '';
}

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

function toAntdItems(items: NavMenuItem[], push: (path: string) => void): AntMenuItem[] {
  return items
    .filter((item) => !item.hidden)
    .map((item) => {
      if (item.children?.length) {
        return { key: item.key, label: item.label, icon: item.icon, children: toAntdItems(item.children, push) };
      }
      return { key: item.key, label: item.label, icon: item.icon, onClick: item.path ? () => push(item.path!) : undefined };
    });
}

export function useMenuState(items: NavMenuItem[]) {
  const pathname = usePathname();
  const router = useRouter();

  return useMemo(() => {
    const selectedKey = findSelectedKey(items, pathname);
    const openKeys = findOpenKeys(items, selectedKey);
    return {
      selectedKeys: selectedKey ? [selectedKey] : [],
      defaultOpenKeys: openKeys,
      antdItems: toAntdItems(items, (path) => router.push(path)),
    };
  }, [items, pathname, router]);
}
