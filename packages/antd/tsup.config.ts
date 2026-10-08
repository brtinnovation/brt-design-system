import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  external: ['antd', 'react', 'react-dom'],
  // @brt/design ไม่ได้ publish — ต้อง bundle ทั้งโค้ดและ type เข้ามา
  noExternal: ['@brt/design'],
  dts: { resolve: ['@brt/design'] },
  // provider ใช้ hook — Next.js App Router ต้องเห็น directive นี้ใน output
  banner: { js: "'use client';" },
});
