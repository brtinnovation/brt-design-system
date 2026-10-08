import type { FontName, PaletteName } from '../primitive';

/**
 * brand = การเลือกจาก primitive เท่านั้น — ห้ามใส่ hex หรือชื่อฟอนต์ดิบ
 * type บังคับให้เลือกได้เฉพาะ palette / ฟอนต์ที่มีใน primitive
 */
export interface BrandDefinition {
  name: string;
  color: {
    primary: PaletteName;
    secondary: PaletteName;
    success?: PaletteName;
    warning?: PaletteName;
    error?: PaletteName;
    info?: PaletteName;
  };
  font: {
    sans: FontName;
    mono?: FontName;
  };
}

export type Brand = {
  name: string;
  color: Required<BrandDefinition['color']>;
  font: Required<BrandDefinition['font']>;
};

const defaults = {
  color: { success: 'green', warning: 'amber', error: 'red', info: 'sky' },
  font: { mono: 'jetbrainsMono' },
} as const satisfies { color: Partial<Brand['color']>; font: Partial<Brand['font']> };

export function defineBrand(def: BrandDefinition): Brand {
  return {
    name: def.name,
    color: { ...defaults.color, ...def.color },
    font: { ...defaults.font, ...def.font },
  };
}
