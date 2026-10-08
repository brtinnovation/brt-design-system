import { BrtConfigProvider, type BrandName, type Mode } from '@brt/antd';
import type { Preview } from '@storybook/react-vite';
import { theme } from 'antd';
import { useEffect, type ReactNode } from 'react';
import { createGlobalTypes, initialGlobals } from './globals';

// พื้นหลังทั้งหน้าตาม token ของ antd (สลับตาม mode)
function PageBackground({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  useEffect(() => {
    document.body.style.background = token.colorBgLayout;
  }, [token.colorBgLayout]);
  return children;
}

// ใช้ @brt/antd ตัวที่ build แล้ว (dist) — เหมือนที่โปรเจกต์จริงติดตั้ง
const preview: Preview = {
  globalTypes: createGlobalTypes(),
  initialGlobals,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { globals }) => (
      <BrtConfigProvider brand={globals.brand as BrandName} mode={globals.mode as Mode}>
        <PageBackground>
          <Story />
        </PageBackground>
      </BrtConfigProvider>
    ),
  ],
};

export default preview;
