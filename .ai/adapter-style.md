# Style adapters: `@brt/tailwind`, `@brt/css`

style adapter ให้ token ในรูปที่ CSS framework ของโปรเจกต์อ่านได้ ใช้กับ **ส่วนที่โปรเจกต์เขียนเอง** (layout, section) ไม่เกี่ยวกับ component adapter — โปรเจกต์ antd + Tailwind ติดตั้งทั้ง `@brt/antd` และ `@brt/tailwind`

## `@brt/tailwind` (Tailwind v4)

```css
@import 'tailwindcss';
@import '@brt/tailwind/theme.css';
```

- `theme.css` (generate จาก `src/mapping.ts`) = `tokens.css` (ทุก brand/mode) + `@theme inline` ที่ map token เข้า namespace ของ Tailwind ครบทุกหมวด
- ค่าอ้าง `var(--brt-*)` จึงเปลี่ยนตาม `data-brand` / `data-mode` และค่า desktop/mobile ของ typography/radius — ยกเว้น **breakpoint** ที่ใช้ใน `@media` ซึ่งอ่าน `var()` ไม่ได้ จึงใส่ค่าจริง
- **ปิดค่า default ของ Tailwind** ในหมวดที่ BRT กำหนดเอง (`--color-*: initial` ฯลฯ) — `bg-blue-500`, `rounded-3xl` ใช้ไม่ได้ ใช้ได้เฉพาะ token
- **ชื่อสีตาม Figma** แยก namespace ตามหมวด: `color.text.*` → `--text-color-*` (`text-primary`), `color.bg.*` → `--background-color-*` (`bg-primary`), `color.border.*` → `--border-color-*` (`border-primary`) — `text-primary` กับ `bg-primary` จึงเป็นคนละ token ตาม Figma
- `color.button.*` → `bg-button-primary-brand`, `text-button-primary-brand`, `border-button-secondary-brand` (+ `-hover`) สำหรับ custom button ของโปรเจกต์
- typography: `text-display1` … `text-h1` … `text-body-md`, `text-button-sm`, `text-error-message` · `leading-2xs` … `leading-13xl` · `tracking-none` / `tracking-wide`
- spacing ตาม Figma ตั้งชื่อเป็น px (`p-8`, `gap-16`) และตั้ง `--spacing: 1px` ทำให้ตัวเลขของ Tailwind ทุกตัวเป็น px (`h-40` = 40px) — ใช้ค่าที่มีใน Figma Space เป็นหลัก
- z-index: Tailwind ไม่มี namespace ให้ จึง generate `@utility z-<name>` (`z-modal`, `z-toast`)
- ไม่รองรับ Tailwind v3
- **ใช้คู่กับ antd**: preflight ของ Tailwind อาจทับ style ของ antd — ต้องจัดลำดับ `@layer` (เช่น `@layer theme, base, antd, components, utilities;`) และตั้ง antd ให้ใส่ style ลง layer ของตัวเอง ทดสอบใน `apps/showcase` ชุด antd + tailwind และเขียนวิธีตั้งค่าไว้ใน README ของ package

## `@brt/css` (CSS framework อื่น)

| Export                | ค่าข้างใน                         | ใช้กับ                                               |
| --------------------- | --------------------------------- | ---------------------------------------------------- |
| `@brt/css/tokens.css` | `--brt-*` ทุก brand/mode          | CSS Modules, Sass/Less, vanilla CSS                  |
| `vars` (TS)           | `'var(--brt-color-text-primary)'` | styled-components, emotion, vanilla-extract, Linaria |
| type `BrtVars`        | โครงของ `vars`                    | `DefaultTheme` ของ styled-components ฯลฯ             |

```tsx
import '@brt/css/tokens.css';
import { vars } from '@brt/css';

<ThemeProvider theme={vars}>...</ThemeProvider>;
```

- เปิดเฉพาะ **semantic token** ห้ามเปิด primitive
- ใช้ `var()` ไม่ใช่ค่าดิบ — สลับ brand/mode ได้ทันทีโดยไม่ re-render และค่าตรงกับ adapter อื่นเสมอ

## โปรเจกต์ใช้ CSS framework ใหม่ — ตัดสินอย่างไร

1. framework อ่าน `var(--brt-*)` ได้ไหม → **ได้** = ใช้ `@brt/css` ไม่ต้องทำ adapter ใหม่ (กรณีส่วนใหญ่)
2. framework ต้องคำนวณจากค่าจริงไหม (เช่น `darken()` ของ Sass, preset ของ UnoCSS/Panda ที่ต้องใช้ค่าตอน build) →
   - ถ้าเลี่ยงได้ด้วย `color-mix()` ของ CSS ให้เลี่ยง แล้วใช้ `@brt/css`
   - ถ้าเลี่ยงไม่ได้ → ทำ style adapter ใหม่ `packages/<name>/` ตามขั้นตอนใน `architecture.md`
