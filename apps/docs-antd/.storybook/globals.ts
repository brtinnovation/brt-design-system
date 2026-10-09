import type { Preview } from '@storybook/react-vite';
import {
  defaultBrand,
  defineBrand,
  generateBrandCss,
  type Brand,
} from '@brt-innovation/antd/tokens';

/**
 * brand ใน Storybook — โปรเจกต์จริงประกาศ brand ของตัวเองแบบเดียวกับ `example`
 * `example` มีไว้แสดงว่า override ทำงาน (สีไม่ได้มาจาก Figma)
 */
export const brands: Record<string, Brand> = {
  default: defaultBrand,
  example: defineBrand({
    name: 'example',
    color: { primary: 'confidentBlue', secondary: 'darkPink', tertiary: 'green' },
    font: { sans: 'kanit' },
  }),
};

// toolbar เลือก brand / mode — เหมือนกันทุก Storybook ของ package
export const globalTypes: NonNullable<Preview['globalTypes']> = {
  brand: {
    description: 'Brand',
    toolbar: { title: 'Brand', icon: 'paintbrush', items: Object.keys(brands), dynamicTitle: true },
  },
  mode: {
    description: 'Mode',
    toolbar: {
      title: 'Mode',
      icon: 'mirror',
      // Figma ยังไม่มีค่า dark — เพิ่ม { value: 'dark', title: 'Dark', icon: 'moon' } เมื่อ design มี mode นี้
      items: [{ value: 'light', title: 'Light', icon: 'sun' }],
      dynamicTitle: true,
    },
  },
};

export const initialGlobals = { brand: 'default', mode: 'light' };

/** ทำแบบเดียวกับโปรเจกต์จริง: ใส่ CSS ของ brand แล้วตั้ง data-brand ที่ <html> */
export function applyBrand(name: string) {
  const brand = brands[name] ?? defaultBrand;
  let style = document.getElementById('brt-brand');
  if (!style) {
    style = document.createElement('style');
    style.id = 'brt-brand';
    document.head.appendChild(style);
  }
  style.textContent = brand === defaultBrand ? '' : generateBrandCss(brand);
  document.documentElement.dataset.brand = brand.name;
  return brand;
}
