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

// ----- ยังไม่มีใน Figma — ค่าตัวอย่าง (mock) รอค่าจริงจาก designer -----

export const shadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const breakpoint = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export const zIndex = { base: 0, dropdown: 1000, sticky: 1100, modal: 1300, toast: 1400 } as const;
