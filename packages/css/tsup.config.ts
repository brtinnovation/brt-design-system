import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { defineConfig } from 'tsup';

const require = createRequire(import.meta.url);

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  // @brt/design ไม่ได้ publish — ต้อง bundle ทั้งโค้ดและ type เข้ามา
  noExternal: ['@brt/design'],
  dts: { resolve: ['@brt/design'] },
  onSuccess: async () => {
    copyFileSync(require.resolve('@brt/design/tokens.css'), 'dist/tokens.css');
  },
});
