import { useMemo, useEffect } from 'react';
import { notification, App } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  title?: string;
  description?: string;
  type?: ToastType;
  placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
  duration?: number;
}

let globalNotification: NotificationInstance | null = null;

export const setNotificationInstance = (instance: NotificationInstance) => {
  globalNotification = instance;
};

const ICON_COLORS: Record<ToastType, { color: string }> = {
  success: { color: '#16A34A' },
  error: { color: '#DC2626' },
  warning: { color: '#D97706' },
  info: { color: '#2563EB' },
};

function showToast(type: ToastType, options: ToastOptions, api?: NotificationInstance) {
  const { message, title, description, placement = 'topRight', duration = 3 } = options;
  const { color } = ICON_COLORS[type];
  const instance = api ?? globalNotification ?? notification;

  instance.open({
    message: title ?? (type.charAt(0).toUpperCase() + type.slice(1)),
    description: description ?? message,
    placement,
    duration,
    style: { borderLeft: `4px solid ${color}`, borderRadius: '10px' },
  });
}

function normalize(first: ToastOptions | string, second?: string): ToastOptions {
  if (typeof first === 'object') return first;
  if (typeof second === 'string') return { message: first, title: second };
  return { message: first };
}

/** Static toast — usable outside React components */
const toast = Object.assign(
  (options: ToastOptions) => {
    if (options.type) showToast(options.type, options);
  },
  {
    success: (a: ToastOptions | string, b?: string) => showToast('success', normalize(a, b)),
    error: (a: ToastOptions | string, b?: string) => showToast('error', normalize(a, b)),
    warning: (a: ToastOptions | string, b?: string) => showToast('warning', normalize(a, b)),
    info: (a: ToastOptions | string, b?: string) => showToast('info', normalize(a, b)),
  },
);

/** React hook version — uses Ant Design App context for proper theming */
export const useToast = () => {
  const { notification: notifApi } = App.useApp();

  useEffect(() => {
    setNotificationInstance(notifApi);
  }, [notifApi]);

  return useMemo(() => {
    return Object.assign(
      (options: ToastOptions) => {
        if (options.type) showToast(options.type, options, notifApi);
      },
      {
        success: (a: ToastOptions | string, b?: string) =>
          showToast('success', normalize(a, b), notifApi),
        error: (a: ToastOptions | string, b?: string) =>
          showToast('error', normalize(a, b), notifApi),
        warning: (a: ToastOptions | string, b?: string) =>
          showToast('warning', normalize(a, b), notifApi),
        info: (a: ToastOptions | string, b?: string) =>
          showToast('info', normalize(a, b), notifApi),
      },
    );
  }, [notifApi]);
};

export default toast;
