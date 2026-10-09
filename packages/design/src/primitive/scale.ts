import { black, palette } from './color';

// ใช้ร่วมทุก brand — หน่วยความยาวเป็น px (generator แปลงเป็น px ใน CSS)

/** จาก Figma `04-space` — ชื่อคือค่า px */
export const spacing = {
  '0': 0,
  '2': 2,
  '4': 4,
  '6': 6,
  '8': 8,
  '12': 12,
  '16': 16,
  '20': 20,
  '24': 24,
  '28': 28,
  '32': 32,
  '36': 36,
  '40': 40,
  '44': 44,
  '48': 48,
  '52': 52,
  '56': 56,
  '60': 60,
  '64': 64,
} as const;

/** จาก Figma `05-radius` — mode BRT-Desktop / BRT-Mobile */
export const radius = {
  desktop: { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  mobile: { none: 0, xs: 4, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
} as const satisfies Record<'desktop' | 'mobile', Record<string, number>>;

/** สีจาก palette + ความทึบ → `rgb(r g b / a)` — Figma เก็บเป็น hex 8 หลัก (#242A341A = gray -60 ทึบ 0x1A/255) */
function withAlpha(hex: string, alphaHex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const a = Math.round((parseInt(alphaHex, 16) / 255) * 1000) / 1000;
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${a})`;
}

const shadowColor = palette.gray['-60']; // #242A34

/**
 * จาก Figma Effect styles "Drop Shadow" (ไม่ใช่ Variables จึงไม่อยู่ในไฟล์ export token)
 * sm–2xl ใช้สี gray -60 ต่างกันที่ความทึบและระยะฟุ้ง — 3xl ใช้ดำทึบ 3% ซึ่งหลุดจากแพตเทิร์น (ยืนยันกับ designer)
 */
export const shadow = {
  sm: `0 1px 3px 0 ${withAlpha(shadowColor, '1A')}`,
  md: `0 4px 8px 0 ${withAlpha(shadowColor, '1A')}`,
  lg: `0 6px 12px 0 ${withAlpha(shadowColor, '1A')}`,
  xl: `0 8px 24px 0 ${withAlpha(shadowColor, '1A')}`,
  '2xl': `0 12px 36px 0 ${withAlpha(shadowColor, '1F')}`,
  '3xl': `0 8px 32px 0 ${withAlpha(black, '08')}`,
} as const;

/** ตามค่าเริ่มต้นของ Tailwind CSS v4 (px) — Figma ไม่มี breakpoint */
export const breakpoint = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;

/** ตาม scale ของ Tailwind (`z-0` … `z-50`) — Figma ไม่มี z-index */
export const zIndex = { '0': 0, '10': 10, '20': 20, '30': 30, '40': 40, '50': 50 } as const;
