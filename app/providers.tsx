'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

const theme = {
  token: {
    colorPrimary: '#D94800',
    colorLink: '#D94800',
    borderRadius: 12,
    fontFamily: 'var(--font-outfit), Arial, sans-serif',
    colorBgContainer: '#FFFDF9',
    colorBgElevated: '#FFFDF9',
    colorBorder: '#E0D4C3',
    colorText: '#2d1e18',
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 20,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 10,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 10,
    },
    Table: {
      borderRadius: 12,
    },
    Card: {
      borderRadius: 16,
    },
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
