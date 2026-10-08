import { defineConfig } from 'tsup';

// build ไว้ให้ adapter bundle ต่อ (ไม่ publish) — ต้องมี .d.ts เพื่อให้ adapter inline type ได้
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
});
