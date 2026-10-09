# ตั้งค่าในโปรเจกต์ที่เรียกใช้

**โปรเจกต์เป็นเจ้าของ 2 อย่าง:** การ map brand (`defineBrand()`) และการตั้งค่า CSS framework — design system ส่งให้แค่ token (CSS variables `--brt-*`, `vars`, ค่าดิบผ่าน `resolve()`)

## ติดตั้ง

| โปรเจกต์                 | ติดตั้ง                                                                                    | token มาจาก                   |
| ------------------------ | ------------------------------------------------------------------------------------------ | ----------------------------- |
| shadcn + Tailwind v4     | `pnpm add @brt-innovation/design` + port component จาก shadcn/ui เอง (`shadcn-mapping.md`) | `@brt-innovation/design`      |
| antd                     | `pnpm add @brt-innovation/antd antd`                                                       | `@brt-innovation/antd/tokens` |
| ไม่ใช้ component ของ BRT | `pnpm add @brt-innovation/design`                                                          | `@brt-innovation/design`      |

`@brt-innovation/antd` มี `@brt-innovation/design` เป็น dependency อยู่แล้ว — ไม่ต้องติดตั้งซ้ำ

## 1. ประกาศ brand

```ts
// src/theme/brand.ts
import { defineBrand } from '@brt-innovation/design';

export const brand = defineBrand({
  name: 'brt',
  color: { primary: 'brtTeal', secondary: 'twilightStorm', tertiary: 'purple' },
  font: { sans: 'kanit' },
});
```

ข้ามขั้นนี้ได้ถ้าใช้ค่าเริ่มต้น (`defaultBrand`) — รายละเอียดใน `brands.md`

## 2. ใส่ token ใน CSS

**shadcn (Next.js App Router)** — port component ตาม `shadcn-mapping.md` แล้วตั้ง CSS:

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '@brt-innovation/design/tokens.css'; /* --brt-* ของ defaultBrand — component ใน src/components/ui/ ถูก scan เองอยู่แล้ว */
```

```tsx
// src/app/layout.tsx (Server Component)
import { generateBrandCss } from '@brt-innovation/design';
import { brand } from '@/theme/brand';

<html data-brand={brand.name}>
  <head>
    {/* dangerouslySetInnerHTML — ถ้าใส่เป็น children React จะ escape ' ใน selector แล้ว CSS พัง */}
    <style dangerouslySetInnerHTML={{ __html: generateBrandCss(brand) }} />
  </head>
  …
```

**antd**

```tsx
<BrtConfigProvider brand={brand}>…</BrtConfigProvider>
```

ถ้าโปรเจกต์ antd เขียน CSS เอง (CSS Modules, Tailwind) ให้ใส่ `@brt-innovation/design/tokens.css` + `generateBrandCss(brand)` แบบเดียวกับ shadcn

**CSS-in-JS** — `vars.color.text.primary` → `'var(--brt-color-text-primary)'`

## 3. ตั้งค่า Tailwind (ของโปรเจกต์)

component ที่แปลง class เป็น `(--brt-*)` ตามตารางไม่ต้องใช้ `@theme` — โปรเจกต์ตั้งเพื่อให้ **โค้ดของตัวเอง** ใช้ token ได้สะดวก มี 2 แบบ

**ก. ไม่ตั้งอะไร** — ใช้ `(--brt-*)` ตรง ๆ แบบ component: `bg-(--brt-color-bg-secondary)`, `text-(length:--brt-font-size-h1)` (ตารางเต็มใน Storybook หน้า **Tokens / Usage**)

**ข. ตั้ง `@theme` ให้ได้ชื่อสั้นตาม Figma** — ตัวอย่าง (เลือกเฉพาะที่โปรเจกต์ใช้):

```css
@theme {
  --color-*: initial; /* ปิด palette ของ Tailwind (bg-blue-500) ให้ใช้ได้แต่ token */
  --breakpoint-*: initial;
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem; /* ตรงกับ desktopBreakpoint ของ token (768px) */
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;
}

@theme inline {
  --color-white: #fff;
  --color-transparent: transparent;
  --text-color-primary: var(--brt-color-text-primary); /* text-primary */
  --text-color-secondary: var(--brt-color-text-secondary);
  --text-color-brand: var(--brt-color-text-brand);
  --background-color-primary: var(--brt-color-bg-primary); /* bg-primary */
  --background-color-secondary: var(--brt-color-bg-secondary);
  --background-color-brand: var(--brt-color-bg-brand);
  --border-color-primary: var(--brt-color-border-primary); /* border-primary */
  --text-h1: var(--brt-font-size-h1); /* text-h1 — เปลี่ยนขนาดตามจอเอง */
  --text-body-md: var(--brt-font-size-body-md);
  --radius-md: var(--brt-radius-md); /* rounded-md */
  --spacing-16: var(--brt-spacing-16); /* p-16 */
  --font-sans: var(--brt-font-sans);
}
```

- แยก namespace สีตามหมวดของ Figma (`--text-color-*`, `--background-color-*`, `--border-color-*`) — `text-primary` กับ `bg-primary` จึงเป็นคนละ token ตาม Figma
- ค่า breakpoint ใน `@theme` ต้องเป็นค่าจริง (`@media` อ่าน `var()` ไม่ได้)
- ถ้าตั้งชื่อ font size เอง (`text-h1`) และใช้ `cn()` ต้อง `extendTailwindMerge` ให้รู้จักชื่อเหล่านั้น ไม่อย่างนั้น `text-h1 text-primary` จะถูกมองเป็นสีทั้งคู่
- **ใช้คู่กับ antd**: preflight ของ Tailwind อาจทับ style ของ antd — จัดลำดับ `@layer` (เช่น `@layer theme, base, antd, components, utilities;`) และตั้ง antd ให้ใส่ style ลง layer ของตัวเอง

## ค่าที่เปลี่ยนตามจอ

typography และ radius มีค่า desktop / mobile จาก Figma — `tokens.css` เป็น mobile-first และเปลี่ยนเป็นค่า desktop ตั้งแต่ 768px เอง โปรเจกต์ไม่ต้องเขียน `md:text-…` เพื่อสลับขนาดตาม Figma
