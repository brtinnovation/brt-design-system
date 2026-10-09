import { brt } from './brt';

export { defineBrand, type Brand, type BrandDefinition, type NeutralPaletteName } from './define';

/** register ทุก brand ที่นี่ — key ต้องตรงกับ `name` */
export const brands = { brt } as const;

export type BrandName = keyof typeof brands;

export const defaultBrand: BrandName = 'brt';
