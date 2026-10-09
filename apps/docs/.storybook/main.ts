import type { StorybookConfig } from '@storybook/react-vite';

// host — รวม Storybook ของแต่ละ package ไว้ใน URL เดียว (Storybook Composition)
// แต่ละ ref รันแยก port และ render ใน iframe ของตัวเอง CSS จึงไม่ปนกัน
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  refs: {
    design: { title: '@brt-innovation/design — Tokens', url: 'http://localhost:6007' },
    antd: { title: '@brt-innovation/antd', url: 'http://localhost:6008' },
  },
};

export default config;
