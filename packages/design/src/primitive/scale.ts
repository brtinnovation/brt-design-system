// ใช้ร่วมทุก brand — หน่วยความยาวเป็น px (generator แปลงเป็น rem/px ใน CSS)
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 4, md: 8, lg: 12, full: 9999 } as const;

export const shadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const breakpoint = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export const zIndex = { base: 0, dropdown: 1000, sticky: 1100, modal: 1300, toast: 1400 } as const;
