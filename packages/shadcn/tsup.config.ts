import { copyFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  external: ['react', 'react-dom'],
  // component ใช้ Radix / state — Next.js App Router ต้องเห็น directive นี้ใน output
  banner: { js: "'use client';" },
  onSuccess: async () => {
    copyFileSync('src/styles/styles.css', 'dist/styles.css');
  },
});
