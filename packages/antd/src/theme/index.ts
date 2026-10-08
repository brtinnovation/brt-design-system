import {
  defaultBrand,
  flatten,
  resolve,
  type BrandName,
  type Mode,
  type SemanticPath,
} from '@brt/design';
import { theme, type ThemeConfig } from 'antd';
import { antdTokenMap } from './mapping';

/**
 * ThemeConfig ของ brand / mode — ใช้ค่าดิบ (ไม่ใช่ var(--brt-*))
 * เพราะ algorithm ของ antd ต้องใช้ค่าสีจริงเพื่อคำนวณเฉด hover / active / bg
 */
export function getThemeConfig(brand: BrandName = defaultBrand, mode: Mode = 'light'): ThemeConfig {
  const token: Record<string, string | number> = {};
  for (const [path, value] of flatten(resolve(brand, mode))) {
    const key = antdTokenMap[path as SemanticPath];
    if (key) token[key] = value;
  }

  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token,
    components: {
      Button: { primaryShadow: 'none' },
    },
  };
}

export { antdTokenMap };
