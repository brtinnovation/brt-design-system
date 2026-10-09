import {
  defaultBrand,
  flatten,
  resolve,
  type BrandName,
  type Mode,
  type SemanticPath,
  type Viewport,
} from '@brt/design';
import { theme, type ThemeConfig } from 'antd';
import { antdTokenMap } from './mapping';

/**
 * ThemeConfig ของ brand / mode — ใช้ค่าดิบ (ไม่ใช่ var(--brt-*))
 * เพราะ algorithm ของ antd ต้องใช้ค่าสีจริงเพื่อคำนวณเฉด hover / active / bg
 * antd ส่วนใหญ่ใช้ในหน้าจอ desktop จึงใช้ค่า desktop ของ typography / radius เป็นค่าเริ่มต้น
 */
export function getThemeConfig(
  brand: BrandName = defaultBrand,
  mode: Mode = 'light',
  viewport: Viewport = 'desktop',
): ThemeConfig {
  const tokens = resolve(brand, mode, viewport);
  const token: Record<string, string | number> = {};
  for (const [path, value] of flatten(tokens)) {
    const key = antdTokenMap[path as SemanticPath];
    if (key) token[key] = value;
  }

  // Figma Component/Button: Primary = type="primary", Secondary = default, Tertiary = type="text"
  const button = tokens.color.button;
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token,
    components: {
      Button: {
        primaryShadow: 'none',
        defaultShadow: 'none',
        dangerShadow: 'none',
        primaryColor: button.primary.brand.text,
        defaultColor: button.secondary.neutral.text,
        defaultBg: button.secondary.neutral.bg,
        defaultBorderColor: button.secondary.neutral.border,
        defaultHoverColor: button.secondary.neutral.textHover,
        defaultHoverBg: button.secondary.neutral.bgHover,
        defaultHoverBorderColor: button.secondary.neutral.borderHover,
        textTextColor: button.tertiary.neutral.text,
        textTextHoverColor: button.tertiary.neutral.textHover,
        textHoverBg: button.tertiary.neutral.bgHover,
        borderColorDisabled: button.disabled.border,
      },
    },
  };
}

export { antdTokenMap };
