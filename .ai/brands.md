# Brands

**โปรเจกต์ที่เรียกใช้เป็นคน map brand ของตัวเอง** — design system มีแค่เครื่องมือ (`defineBrand()`) และค่าเริ่มต้น (`defaultBrand`)

## brand คือการเลือก ไม่ใช่การสร้างค่า

brand ต่างกันได้เฉพาะ **สี** (primary, secondary, tertiary และ system color ถ้าต้องการ) กับ **font family** — ทุกค่าต้องเลือกจาก primitive ใน `@brt-innovation/design` ตรงกับ collection `02-alias` ของ Figma

```ts
// โปรเจกต์ที่เรียกใช้ เช่น brt-landing-page: src/theme/brand.ts
import { defineBrand } from '@brt-innovation/design'; // โปรเจกต์ antd ใช้ @brt-innovation/antd/tokens ได้

export const brand = defineBrand({
  name: 'brt', // ใช้เป็น data-brand ใน CSS
  color: {
    primary: 'brtTeal', // ชื่อ palette ใน primitive — type จำกัดให้เลือกได้เฉพาะ palette ที่มี
    secondary: 'twilightStorm',
    tertiary: 'purple',
    // success / warning / error / info / neutral ไม่บังคับ — ไม่ใส่ = System ของ Figma
    // (green / refreshingOrange / red / blue / gray)
  },
  font: { sans: 'kanit' }, // ชื่อฟอนต์ใน primitive
});
```

- ห้ามใส่ hex หรือชื่อฟอนต์ดิบ ถ้า palette/ฟอนต์ที่ต้องการยังไม่มี ให้เพิ่มใน `primitive/` ของ design system ก่อน
- brand เลือก **palette** ไม่ใช่ขั้น — ขั้นที่ใช้แต่ละที่ (`text.brand` = -40 ฯลฯ) มาจากกฎใน `semantic/` ทำให้ทุก brand ได้ hover/subtle/disabled ที่สมดุลเท่ากัน
- `neutral` เลือกได้เฉพาะ palette ที่มีขั้น `-95` / `+95` (ตอนนี้คือ `gray`)
- `tertiary` ยังไม่มี semantic token ใช้ (Figma ไม่ได้อ้าง) — เข้าถึงได้ผ่าน `resolvePalette(brand)`
- spacing, radius, typography ใช้ร่วมทุก brand ไม่อยู่ใน brand

## `defaultBrand`

- ค่าของ Brand/BRT ใน Figma (`brtTeal` / `twilightStorm` / `purple`, Kanit) — อยู่ใน `packages/design/src/brands/default.ts`
- เป็นค่าใน `tokens.css` (`:root`) และค่าเริ่มต้นของ `resolve()`, `getThemeConfig()`, `BrtConfigProvider`
- โปรเจกต์ที่ยังไม่ map brand ใช้ค่านี้ไปก่อนได้เลย — ไม่ต้องทำอะไร

## โปรเจกต์ใช้ brand อย่างไร

| Adapter  | กลไก                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `antd`   | `<BrtConfigProvider brand={brand}>` → `getThemeConfig(brand)` ส่งค่าดิบให้ antd                                                  |
| shadcn   | ใส่ `generateBrandCss(brand)` ใน `<head>` + `<html data-brand="brt">` → override `--brt-color-*` / `--brt-font-*` ของ tokens.css |
| CSS อื่น | เหมือน shadcn — component / style ของโปรเจกต์อ่าน `var(--brt-*)`                                                                 |

- `generateBrandCss(brand)` ใส่เฉพาะ token ที่ขึ้นกับ brand (สี, ฟอนต์) ใน selector `:root[data-brand='<name>']` ซึ่ง specificity สูงกว่า `:root` ของ tokens.css จึงชนะไม่ว่าลำดับไฟล์ CSS จะเป็นอย่างไร
- **หลาย brand ในโปรเจกต์เดียว**: ใส่ CSS ของทุก brand แล้วสลับ `data-brand` (antd ส่ง brand ใหม่ให้ provider)
- ตัวอย่างการตั้งค่าเต็มอยู่ใน `project-setup.md` และ brand `example` ใน `.storybook/globals.ts` ของ Storybook
