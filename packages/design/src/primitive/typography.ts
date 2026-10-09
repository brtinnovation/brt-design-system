// จาก Figma `06-typography` — ฟอนต์ทั้งหมดที่ brand เลือกได้ brand อ้างด้วย key ไม่ใช่ชื่อฟอนต์ดิบ
export const fontFamily = {
  kanit: '"Kanit", sans-serif',
} as const;

export type FontName = keyof typeof fontFamily;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** Letter Spacing 0 / 1 ของ Figma (px) */
export const letterSpacing = { none: 0, wide: 0.4 } as const;

/**
 * ขนาดตัวอักษร (px) ตาม role — Figma มี mode Desktop / Mobile
 * ตัดออกจาก Figma: Paragraph ที่แยกตาม weight (ขนาดเท่ากัน ใช้ fontWeight ประกอบแทน)
 * และ Link / Label / Subtitle / Placeholder / Value List / All Caps ที่เป็นชื่อซ้ำของ body
 */
export const fontSize = {
  desktop: {
    display1: 72,
    display2: 64,
    display3: 56,
    display4: 48,
    display5: 44,
    display6: 36,
    h1: 40,
    h2: 32,
    h3: 28,
    h4: 24,
    h5: 20,
    h6: 16,
    pageTitle: 28,
    bodyLg: 18,
    bodyMd: 16,
    bodySm: 14,
    bodyXs: 12,
    buttonLg: 20,
    buttonMd: 16,
    buttonSm: 14,
    errorMessage: 10,
  },
  mobile: {
    display1: 60,
    display2: 56,
    display3: 48,
    display4: 44,
    display5: 40,
    display6: 32,
    h1: 36,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    pageTitle: 24,
    bodyLg: 18,
    bodyMd: 16,
    bodySm: 14,
    bodyXs: 12,
    buttonLg: 18,
    buttonMd: 16,
    buttonSm: 14,
    errorMessage: 10,
  },
} as const satisfies Record<'desktop' | 'mobile', Record<string, number>>;

/** line-height (px) — Figma ไม่ได้ผูกกับ font size แต่ละตัว จึงเก็บเป็น scale ให้เลือกใช้ */
export const lineHeight = {
  desktop: {
    '2xs': 10,
    xs: 16,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 26,
    '2xl': 30,
    '3xl': 32,
    '4xl': 34,
    '5xl': 36,
    '6xl': 38,
    '7xl': 44,
    '8xl': 48,
    '9xl': 52,
    '10xl': 56,
    '11xl': 64,
    '12xl': 76,
    '13xl': 86,
  },
  mobile: {
    '2xs': 10,
    xs: 16,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 24,
    '2xl': 28,
    '3xl': 28,
    '4xl': 34,
    '5xl': 32,
    '6xl': 38,
    '7xl': 40,
    '8xl': 44,
    '9xl': 48,
    '10xl': 52,
    '11xl': 56,
    '12xl': 64,
    '13xl': 72,
  },
} as const satisfies Record<'desktop' | 'mobile', Record<string, number>>;
