import type { SemanticPath } from '@brt/design';
import type { ThemeConfig } from 'antd';

type AntdToken = keyof NonNullable<ThemeConfig['token']>;

/**
 * semantic token → global token ของ antd
 * เป็น Record ของ SemanticPath ทุกตัว: เพิ่ม token ใน @brt/design แล้วไม่ map ที่นี่ = typecheck ไม่ผ่าน
 * `null` = antd ไม่มี token ที่ตรงกัน (ใช้ใน component ของ BRT เอง หรือ map ระดับ component แทน)
 */
export const antdTokenMap = {
  'color.primary': 'colorPrimary',
  'color.primaryHover': 'colorPrimaryHover',
  'color.primaryActive': 'colorPrimaryActive',
  'color.primaryForeground': 'colorTextLightSolid',
  'color.secondary': null, // antd ไม่มี secondary — ใช้ใน component ของ BRT
  'color.secondaryForeground': null,
  'color.success': 'colorSuccess',
  'color.warning': 'colorWarning',
  'color.error': 'colorError',
  'color.info': 'colorInfo',
  'color.bg.base': 'colorBgLayout',
  'color.bg.surface': 'colorBgContainer',
  'color.bg.muted': 'colorFillTertiary',
  'color.text.base': 'colorText',
  'color.text.muted': 'colorTextSecondary',
  'color.text.inverse': null, // ใช้ colorTextLightSolid ร่วมกับ primaryForeground แล้ว
  'color.border.default': 'colorBorder',
  'color.border.strong': null,
  'font.sans': 'fontFamily',
  'font.mono': 'fontFamilyCode',
  'fontSize.xs': null,
  'fontSize.sm': 'fontSizeSM',
  'fontSize.md': 'fontSize',
  'fontSize.lg': 'fontSizeLG',
  'fontSize.xl': 'fontSizeXL',
  'fontSize.2xl': 'fontSizeHeading3',
  'fontSize.3xl': 'fontSizeHeading2',
  'fontWeight.regular': null,
  'fontWeight.medium': null,
  'fontWeight.semibold': 'fontWeightStrong',
  'fontWeight.bold': null,
  'lineHeight.tight': null,
  'lineHeight.normal': 'lineHeight',
  'lineHeight.relaxed': null,
  'spacing.xs': 'paddingXS',
  'spacing.sm': 'paddingSM',
  'spacing.md': 'padding',
  'spacing.lg': 'paddingLG',
  'spacing.xl': 'paddingXL',
  'radius.sm': 'borderRadiusSM',
  'radius.md': 'borderRadius',
  'radius.lg': 'borderRadiusLG',
  'radius.full': null,
  'shadow.sm': 'boxShadowTertiary',
  'shadow.md': 'boxShadowSecondary',
  'shadow.lg': 'boxShadow',
  'breakpoint.sm': 'screenSM',
  'breakpoint.md': 'screenMD',
  'breakpoint.lg': 'screenLG',
  'breakpoint.xl': 'screenXL',
  'zIndex.base': 'zIndexBase',
  'zIndex.dropdown': 'zIndexPopupBase',
  'zIndex.sticky': null,
  'zIndex.modal': null,
  'zIndex.toast': null,
} as const satisfies Record<SemanticPath, AntdToken | null>;
