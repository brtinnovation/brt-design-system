import type { FontName, PaletteName, palette } from '../primitive';

/** palette ที่มีขั้น -95 / +95 — ใช้เป็น neutral ได้ (semantic ใช้ขั้นเหล่านี้) */
export type NeutralPaletteName = {
  [K in PaletteName]: (typeof palette)[K] extends Record<'-95' | '+95', string> ? K : never;
}[PaletteName];

/**
 * brand = การเลือกจาก primitive เท่านั้น — ห้ามใส่ hex หรือชื่อฟอนต์ดิบ
 * type บังคับให้เลือกได้เฉพาะ palette / ฟอนต์ที่มีใน primitive
 * ตรงกับ collection `02-alias` ของ Figma (Brand/<name>, System, Global/Neutral)
 * โปรเจกต์ที่เรียกใช้เป็นคนประกาศ brand ของตัวเอง — `name` ใช้เป็น `data-brand` ใน CSS
 */
export interface BrandDefinition {
  name: string;
  color: {
    primary: PaletteName;
    secondary: PaletteName;
    tertiary: PaletteName;
    success?: PaletteName;
    warning?: PaletteName;
    error?: PaletteName;
    info?: PaletteName;
    neutral?: NeutralPaletteName;
  };
  font: {
    sans: FontName;
  };
}

export type Brand = {
  name: string;
  color: Required<BrandDefinition['color']>;
  font: Required<BrandDefinition['font']>;
};

/** System colors ของ Figma — brand ใช้ร่วมกันถ้าไม่ระบุเอง */
const defaults = {
  color: {
    success: 'green',
    warning: 'refreshingOrange',
    error: 'red',
    info: 'blue',
    neutral: 'gray',
  },
} as const satisfies { color: Partial<Brand['color']> };

export function defineBrand(def: BrandDefinition): Brand {
  return {
    name: def.name,
    color: { ...defaults.color, ...def.color },
    font: { ...def.font },
  };
}
