// ฟอนต์ทั้งหมดที่ brand เลือกได้ — brand อ้างด้วย key ไม่ใช่ชื่อฟอนต์ดิบ
export const fontFamily = {
  ibmPlexSansThai: '"IBM Plex Sans Thai", "IBM Plex Sans", sans-serif',
  notoSansThai: '"Noto Sans Thai", sans-serif',
  inter: '"Inter", sans-serif',
  jetbrainsMono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export type FontName = keyof typeof fontFamily;

// px
export const fontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 } as const;

export const fontWeight = { regular: 400, medium: 500, semibold: 600, bold: 700 } as const;

export const lineHeight = { tight: 1.25, normal: 1.5, relaxed: 1.75 } as const;
