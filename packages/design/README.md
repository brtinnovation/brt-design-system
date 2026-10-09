# @brt-innovation/design

BRT design tokens จาก Figma — สี, ตัวอักษร, spacing, radius, shadow ในรูป **CSS variables (`--brt-*`)** และ **TypeScript** ไม่ผูกกับ framework ใด

- ใช้ได้กับทุก stack: Tailwind, CSS Modules, CSS-in-JS, หรือ CSS ธรรมดา
- โปรเจกต์ **map brand ของตัวเอง** (สี primary / secondary / ฟอนต์) ด้วย `defineBrand()` — ไม่ map = ได้ค่าเริ่มต้นของ BRT
- ใช้ Ant Design? ติดตั้ง [`@brt-innovation/antd`](https://www.npmjs.com/package/@brt-innovation/antd) แทน (มี package นี้เป็น dependency อยู่แล้ว)

## ติดตั้ง

```bash
pnpm add @brt-innovation/design
```

ต้องการ Node.js 24 ขึ้นไป · ใช้ได้ทั้ง ESM (`import`) และ CommonJS (`require`) · มี type ของ TypeScript ในตัว

## เริ่มต้นใช้งาน

### 1. ใส่ `tokens.css`

import ครั้งเดียวที่ CSS หลักของโปรเจกต์ จะได้ `--brt-*` ทุกตัวของค่าเริ่มต้นที่ `:root`

```css
/* globals.css */
@import '@brt-innovation/design/tokens.css';
```

หรือ import จาก JS / TS (Next.js, Vite)

```ts
import '@brt-innovation/design/tokens.css';
```

แล้วใช้ได้ทันที

```css
.card {
  background: var(--brt-color-bg-secondary);
  color: var(--brt-color-text-primary);
  border-radius: var(--brt-radius-md);
  padding: var(--brt-spacing-16);
  font-family: var(--brt-font-sans);
}
```

> `tokens.css` กำหนดแค่ชื่อฟอนต์ (`"Kanit", sans-serif`) — โปรเจกต์ต้องโหลดไฟล์ฟอนต์เอง เช่น `next/font/google` หรือ Google Fonts

### 2. map brand ของโปรเจกต์ (ข้ามได้ถ้าใช้ค่าเริ่มต้น)

```ts
// src/theme/brand.ts
import { defineBrand } from '@brt-innovation/design';

export const brand = defineBrand({
  name: 'brt', // ใช้เป็น data-brand ใน HTML
  color: { primary: 'brtTeal', secondary: 'twilightStorm', tertiary: 'purple' },
  font: { sans: 'kanit' },
});
```

ค่าที่ส่งได้คือ **ชื่อ palette / ฟอนต์จาก Figma เท่านั้น** (TypeScript ตรวจให้) — ใส่ hex เองไม่ได้ ดูรายชื่อในหัวข้อ “ค่าที่เลือกได้ใน `defineBrand()`” ด้านล่าง

| field             | ต้องใส่ | ค่าเริ่มต้น        |
| ----------------- | ------- | ------------------ |
| `name`            | ✅      | —                  |
| `color.primary`   | ✅      | —                  |
| `color.secondary` | ✅      | —                  |
| `color.tertiary`  | ✅      | —                  |
| `color.success`   |         | `green`            |
| `color.warning`   |         | `refreshingOrange` |
| `color.error`     |         | `red`              |
| `color.info`      |         | `blue`             |
| `color.neutral`   |         | `gray`             |
| `font.sans`       | ✅      | —                  |

### 3. ใส่ CSS ของ brand ใน `<head>`

`generateBrandCss(brand)` คืน CSS ที่ override เฉพาะสีและฟอนต์ของ brand ภายใต้ `:root[data-brand='<name>']` — ใส่ใน `<head>` และตั้ง `data-brand` ที่ `<html>`

```tsx
// Next.js App Router — src/app/layout.tsx (Server Component)
import { generateBrandCss } from '@brt-innovation/design';
import { brand } from '@/theme/brand';
import './globals.css'; // มี @import '@brt-innovation/design/tokens.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" data-brand={brand.name}>
      <head>
        {/* ต้องใช้ dangerouslySetInnerHTML — ถ้าใส่เป็น children React จะ escape ' ใน selector แล้ว CSS พัง */}
        <style dangerouslySetInnerHTML={{ __html: generateBrandCss(brand) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

ไม่ใช้ React ก็ได้ — สร้าง CSS ตอน build แล้วเขียนลงไฟล์

```ts
import { writeFileSync } from 'node:fs';
import { generateBrandCss } from '@brt-innovation/design';
import { brand } from './src/theme/brand';

writeFileSync('public/brand.css', generateBrandCss(brand));
```

ต้องการหลาย brand ในแอปเดียว: ใส่ `generateBrandCss()` ของแต่ละ brand แล้วสลับค่า `data-brand` ที่ `<html>`

## การใช้ token

### CSS variables

ชื่อ variable = `--brt-` + path ของ token แบบ kebab-case เช่น `color.bg.brandSubtle` → `--brt-color-bg-brand-subtle`

| กลุ่ม           | ตัวอย่าง                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| สีข้อความ       | `--brt-color-text-{primary, secondary, tertiary, placeholder, disabled, brand, success, error, …}`         |
| สีพื้นหลัง      | `--brt-color-bg-{primary, secondary, tertiary, solid, brand, brand-subtle, success-subtle, …}`             |
| สีเส้นขอบ       | `--brt-color-border-{primary, secondary, tertiary, brand, error, …}`                                       |
| ปุ่ม            | `--brt-color-button-{primary, secondary, tertiary}-{brand, neutral, error}-{bg, bg-hover, text, …}`        |
| ฟอนต์           | `--brt-font-sans`                                                                                          |
| ขนาดตัวอักษร    | `--brt-font-size-{display1…display6, h1…h6, page-title, body-lg, body-md, body-sm, body-xs, button-md, …}` |
| น้ำหนักตัวอักษร | `--brt-font-weight-{light, regular, medium, semibold, bold}`                                               |
| line height     | `--brt-line-height-{2xs, xs, sm, md, lg, xl, 2xl … 13xl}`                                                  |
| letter spacing  | `--brt-letter-spacing-{none, wide}`                                                                        |
| spacing         | `--brt-spacing-{0, 2, 4, 6, 8, 12, 16, 20, 24, … 64}` (ตัวเลข = px)                                        |
| radius          | `--brt-radius-{none, xs, sm, md, lg, xl, full}`                                                            |
| shadow          | `--brt-shadow-{sm, md, lg, xl, 2xl, 3xl}`                                                                  |
| z-index         | `--brt-z-index-{0, 10, 20, 30, 40, 50}`                                                                    |
| breakpoint      | `--brt-breakpoint-{sm, md, lg, xl, 2xl}`                                                                   |

**ค่าที่เปลี่ยนตามจอ:** ขนาดตัวอักษร, line height และ radius มีค่า mobile / desktop จาก Figma — `tokens.css` เป็น mobile-first แล้วสลับเป็นค่า desktop ตั้งแต่ 768px ให้เอง ไม่ต้องเขียน media query เพื่อเปลี่ยนขนาดตาม Figma

### Tailwind CSS v4

ใช้ variable ตรง ๆ ได้เลยโดยไม่ต้องตั้งค่า

```tsx
<div className="bg-(--brt-color-bg-secondary) text-(length:--brt-font-size-h1) rounded-(--brt-radius-md)" />
```

หรือตั้ง `@theme inline` ในโปรเจกต์เพื่อให้ได้ class สั้น ๆ (เลือกเฉพาะที่ใช้)

```css
@import 'tailwindcss';
@import '@brt-innovation/design/tokens.css';

@theme inline {
  --text-color-primary: var(--brt-color-text-primary); /* text-primary */
  --background-color-secondary: var(--brt-color-bg-secondary); /* bg-secondary */
  --text-h1: var(--brt-font-size-h1); /* text-h1 */
  --radius-md: var(--brt-radius-md); /* rounded-md */
  --font-sans: var(--brt-font-sans);
}
```

ตัวอย่างเต็ม (ปิด palette ของ Tailwind, breakpoint, ใช้คู่กับ antd) อยู่ใน [project-setup.md](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/project-setup.md)

### CSS-in-JS — `vars`

`vars` มีโครงเดียวกับ token แต่ค่าเป็น `var(--brt-*)` — สลับ brand ได้ผ่าน CSS ตามปกติ

```ts
import { vars } from '@brt-innovation/design';

const style = {
  color: vars.color.text.primary, // 'var(--brt-color-text-primary)'
  background: vars.color.bg.brandSubtle, // 'var(--brt-color-bg-brand-subtle)'
  borderRadius: vars.radius.md, // 'var(--brt-radius-md)'
};
```

### ค่าดิบ — `resolve()`

สำหรับที่ใช้ CSS variable ไม่ได้ (canvas, chart, email, ส่งค่าให้ library อื่น)

```ts
import { resolve } from '@brt-innovation/design';
import { brand } from '@/theme/brand';

const tokens = resolve(brand); // (brand = defaultBrand, mode = 'light', viewport = 'mobile')
tokens.color.text.primary; // '#12151A'
tokens.fontSize.h1; // ค่า px ของ mobile (number)

resolve(brand, 'light', 'desktop').fontSize.h1; // ค่า px ของ desktop
```

## ค่าที่เลือกได้ใน `defineBrand()`

**palette** (`color.*`)

`softPurple` · `lavenderPurple` · `purple` · `twilightStorm` · `duskySky` · `royalBlue` · `skyMist` · `blue` · `oceanBlue` · `deepBlue` · `trustedNavy` · `confidentBlue` · `brightTeal` · `brtTeal` · `green` · `specialGreen` · `refreshingGreen` · `refreshingOrange` · `darkOrange` · `red` · `darkPink` · `pink` · `lightPink` · `gray`

`color.neutral` ต้องเป็น palette ที่มีขั้น `-95` และ `+95` (ตอนนี้คือ `gray`)

**ฟอนต์** (`font.sans`): `kanit`

ต้องการสีหรือฟอนต์ที่ไม่มีในรายการ ให้เพิ่มที่ design system (Figma → package นี้) — โปรเจกต์สร้าง token เองไม่ได้

## API

| export                                          | ใช้ทำอะไร                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `defineBrand(def)`                              | ประกาศ brand ของโปรเจกต์ (เติม system color ที่ไม่ระบุให้)                     |
| `defaultBrand`                                  | brand เริ่มต้นของ BRT (ค่าที่อยู่ใน `tokens.css`)                              |
| `generateBrandCss(brand, { selector?, mode? })` | CSS override สี / ฟอนต์ของ brand — selector เริ่มต้น `:root[data-brand='…']`   |
| `generateTokensCss()`                           | สร้างเนื้อหาเดียวกับ `tokens.css`                                              |
| `vars`                                          | token ในรูป `var(--brt-*)` สำหรับ CSS-in-JS                                    |
| `resolve(brand?, mode?, viewport?)`             | token ค่าดิบ (hex, px) ของ brand                                               |
| `resolvePalette(brand?)`                        | scale เต็มของ primary / secondary / tertiary — สำหรับ library ที่ต้องการ scale |
| `cssVarName(path)`                              | `'color.bg.secondary'` → `'--brt-color-bg-secondary'`                          |
| `primitive`                                     | ค่าจาก Figma ทั้งหมด (`palette`, `fontFamily`, `fontSize`, `spacing`, …)       |
| `desktopBreakpoint`                             | breakpoint ที่เริ่มใช้ค่า desktop (`'md'` = 768px)                             |
| `@brt-innovation/design/tokens.css`             | CSS variables ทุกตัวของ `defaultBrand`                                         |

type ที่ใช้บ่อย: `Brand`, `BrandDefinition`, `SemanticTokens`, `SemanticPath`, `BrtVars`

> ยังไม่มี dark mode — `mode: 'dark'` ให้ค่าเดียวกับ light จนกว่าจะมีค่าจาก Figma

## เอกสารเพิ่มเติม

- [brands.md](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/brands.md) — การ map และสลับ brand
- [project-setup.md](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/project-setup.md) — ตั้งค่าในโปรเจกต์ (Tailwind, antd + Tailwind)
- [shadcn-mapping.md](https://github.com/brtinnovation/brt-design-system/blob/main/.ai/shadcn-mapping.md) — ใช้กับ component ที่ port จาก shadcn/ui
- [`@brt-innovation/antd`](https://www.npmjs.com/package/@brt-innovation/antd) — สำหรับโปรเจกต์ Ant Design v6

## License

UNLICENSED - Internal use only for BRT Innovation
