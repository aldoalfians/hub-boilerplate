'use client';

import { notification } from 'antd';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const notify = (type: ToastType, message: string, description?: string) => {
  notification[type]({ message, description, placement: 'topRight', duration: 3 });
};

const toast = {
  success: (msg: string, desc?: string) => notify('success', msg, desc),
  error: (msg: string, desc?: string) => notify('error', msg, desc),
  warning: (msg: string, desc?: string) => notify('warning', msg, desc),
  info: (msg: string, desc?: string) => notify('info', msg, desc),
};

export function useToast() {
  return toast;
}

export default toast;
