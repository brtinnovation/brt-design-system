import type { StorybookConfig } from '@storybook/react-vite';

// host — รวม Storybook ของแต่ละ package ไว้ใน URL เดียว (Storybook Composition)
// แต่ละ ref รันแยก port และ render ใน iframe ของตัวเอง CSS จึงไม่ปนกัน (antd กับ Tailwind)
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  refs: {
    design: { title: '@brt/design — Tokens', url: 'http://localhost:6007' },
    antd: { title: '@brt/antd', url: 'http://localhost:6008' },
    shadcn: { title: '@brt/shadcn', url: 'http://localhost:6009' },
  },
};

export default config;
