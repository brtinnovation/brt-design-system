import { defineBrand } from './define';

/**
 * ค่าเริ่มต้นเมื่อโปรเจกต์ยังไม่ได้ประกาศ brand ของตัวเอง — ตาม Figma `02-alias` → Brand/BRT
 * โปรเจกต์ map brand เองด้วย `defineBrand()` แล้วส่งให้ adapter (ดู .ai/brands.md)
 */
export const defaultBrand = defineBrand({
  name: 'default',
  color: { primary: 'brtTeal', secondary: 'twilightStorm', tertiary: 'purple' },
  font: { sans: 'kanit' },
});
