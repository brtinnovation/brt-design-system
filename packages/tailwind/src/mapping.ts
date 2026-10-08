import type { SemanticPath } from '@brt/design';

/**
 * semantic token → ตัวแปร theme ของ Tailwind v4
 * เป็น Record ของ SemanticPath ทุกตัว: เพิ่ม token ใน @brt/design แล้วไม่ map ที่นี่ = typecheck ไม่ผ่าน
 * `null` = ตั้งใจไม่ map (ต้องมีเหตุผลกำกับ)
 *
 * ชื่อสีตั้งให้ตรงกับชื่อของ shadcn (background, foreground, muted-foreground ...) เพื่อให้ @brt/shadcn ใช้ต่อได้ตรง ๆ
 */
export const tailwindTheme = {
  'color.primary': '--color-primary',
  'color.primaryHover': '--color-primary-hover',
  'color.primaryActive': '--color-primary-active',
  'color.primaryForeground': '--color-primary-foreground',
  'color.secondary': '--color-secondary',
  'color.secondaryForeground': '--color-secondary-foreground',
  'color.success': '--color-success',
  'color.warning': '--color-warning',
  'color.error': '--color-error',
  'color.info': '--color-info',
  'color.bg.base': '--color-background',
  'color.bg.surface': '--color-surface',
  'color.bg.muted': '--color-muted',
  'color.text.base': '--color-foreground',
  'color.text.muted': '--color-muted-foreground',
  'color.text.inverse': '--color-inverse',
  'color.border.default': '--color-border',
  'color.border.strong': '--color-border-strong',
  'font.sans': '--font-sans',
  'font.mono': '--font-mono',
  'fontSize.xs': '--text-xs',
  'fontSize.sm': '--text-sm',
  'fontSize.md': '--text-md',
  'fontSize.lg': '--text-lg',
  'fontSize.xl': '--text-xl',
  'fontSize.2xl': '--text-2xl',
  'fontSize.3xl': '--text-3xl',
  'fontWeight.regular': '--font-weight-regular',
  'fontWeight.medium': '--font-weight-medium',
  'fontWeight.semibold': '--font-weight-semibold',
  'fontWeight.bold': '--font-weight-bold',
  'lineHeight.tight': '--leading-tight',
  'lineHeight.normal': '--leading-normal',
  'lineHeight.relaxed': '--leading-relaxed',
  'spacing.xs': '--spacing-xs',
  'spacing.sm': '--spacing-sm',
  'spacing.md': '--spacing-md',
  'spacing.lg': '--spacing-lg',
  'spacing.xl': '--spacing-xl',
  'radius.sm': '--radius-sm',
  'radius.md': '--radius-md',
  'radius.lg': '--radius-lg',
  'radius.full': '--radius-full',
  'shadow.sm': '--shadow-sm',
  'shadow.md': '--shadow-md',
  'shadow.lg': '--shadow-lg',
  // breakpoint ใช้ใน @media ซึ่งอ่าน var() ไม่ได้ — build ใส่ค่าจริง (ใช้ร่วมทุก brand จึงไม่ต้องสลับ)
  'breakpoint.sm': '--breakpoint-sm',
  'breakpoint.md': '--breakpoint-md',
  'breakpoint.lg': '--breakpoint-lg',
  'breakpoint.xl': '--breakpoint-xl',
  // Tailwind ไม่มี namespace ของ z-index — build สร้าง @utility z-<name> ให้แทน
  'zIndex.base': null,
  'zIndex.dropdown': null,
  'zIndex.sticky': null,
  'zIndex.modal': null,
  'zIndex.toast': null,
} as const satisfies Record<SemanticPath, string | null>;
