import { defineConfig } from 'tsup';

// @brt-innovation/design เป็น dependency ที่ publish แยก — ไม่ bundle
const external = ['antd', 'react', 'react-dom', '@brt-innovation/design'];

// สอง entry build พร้อมกันใน dist เดียว — ล้าง dist ใน script build แทน `clean`
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    external,
    // provider ใช้ hook — Next.js App Router ต้องเห็น directive นี้ใน output
    banner: { js: "'use client';" },
  },
  {
    // ไม่มี 'use client' — ใช้ใน Server Component ได้
    entry: ['src/tokens.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    external,
  },
]);
