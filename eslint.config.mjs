import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/dist/**', '**/storybook-static/**', '**/node_modules/**', '**/.turbo/**']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,mjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // ตั้งชื่อขึ้นต้นด้วย _ = ตั้งใจไม่ใช้ (เช่น mode ที่ยังไม่มีค่า dark)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['packages/**/*.tsx', 'apps/**/*.tsx'],
    extends: [reactHooks.configs.flat['recommended-latest']],
  },
  // story ใช้ render function ที่มี hook ได้ตามแบบของ Storybook
  storybook.configs['flat/recommended'],
]);
