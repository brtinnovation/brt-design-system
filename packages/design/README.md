# @brt-innovation/design

BRT design tokens จาก Figma — ไม่ผูกกับ framework ใด

```ts
import { defineBrand, generateBrandCss, resolve, vars } from '@brt-innovation/design';
import '@brt-innovation/design/tokens.css'; // --brt-* ของ defaultBrand (mobile-first, desktop ตั้งแต่ 768px)

// map brand ของโปรเจกต์ — เลือกจาก palette ของ Figma เท่านั้น
const brand = defineBrand({
  name: 'brt',
  color: { primary: 'brtTeal', secondary: 'twilightStorm', tertiary: 'purple' },
  font: { sans: 'kanit' },
});

generateBrandCss(brand); // ":root[data-brand='brt'] { --brt-color-…; }" — ใส่ใน <head> + <html data-brand="brt">
resolve(brand).color.text.primary; // '#12151A'
vars.color.bg.secondary; // 'var(--brt-color-bg-secondary)'
```

ใช้คู่กับ [`@brt-innovation/antd`](https://www.npmjs.com/package/@brt-innovation/antd) (re-export ทุกอย่างของ package นี้ที่ `/tokens`) หรือ component แบบ shadcn/ui ที่โปรเจกต์ port เอง (ตารางแปลงอยู่ใน [`shadcn-mapping.md`](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/shadcn-mapping.md))

- การ map brand ด้วย `defineBrand()`: [brands.md](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/brands.md)
- การตั้งค่าในโปรเจกต์ (Tailwind / CSS framework กับ `--brt-*`): [project-setup.md](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/project-setup.md)

## License

UNLICENSED - Internal use only for BRT Innovation
