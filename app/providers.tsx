'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

const theme = {
  token: {
    colorPrimary: '#B8860B',
    colorLink: '#B8860B',
    borderRadius: 8,
    fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
