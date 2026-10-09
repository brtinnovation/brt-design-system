# brt-design-system

Monorepo ของ BRT Design System — design token จาก Figma, component ของ antd และตารางแปลง shadcn/ui → token · publish ขึ้น npmjs ทีละ package

## ส่วนประกอบ

| ส่วน                     | ส่งให้โปรเจกต์ | ใช้เมื่อ                                                            |
| ------------------------ | -------------- | ------------------------------------------------------------------- |
| `@brt-innovation/design` | npm package    | ทุกโปรเจกต์ — token (CSS variables / TS), `defineBrand()`           |
| `@brt-innovation/antd`   | npm package    | โปรเจกต์ใช้ Ant Design v6                                           |
| `.ai/shadcn-mapping.md`  | เอกสาร         | โปรเจกต์ใช้ shadcn/ui — port component เองแล้วแปลง class เป็น token |

```bash
pnpm add @brt-innovation/antd antd                       # antd
pnpm add @brt-innovation/design                          # shadcn: token (component port เอง — .ai/shadcn-mapping.md)
```

## การใช้งาน

**1. map brand ของโปรเจกต์** (ข้ามได้ถ้าใช้ค่าเริ่มต้น — Brand/BRT ของ Figma)

```ts
import { defineBrand } from '@brt-innovation/design';

export const brand = defineBrand({
  name: 'brt',
  color: { primary: 'brtTeal', secondary: 'twilightStorm', tertiary: 'purple' },
  font: { sans: 'kanit' },
});
```

**2. shadcn** — Tailwind ตั้งที่โปรเจกต์ ส่วน component ที่ port จาก shadcn/ui แปลง class เป็น `var(--brt-*)` ตาม `.ai/shadcn-mapping.md`

```css
@import 'tailwindcss';
@import '@brt-innovation/design/tokens.css';
```

```tsx
// layout — override สี / ฟอนต์ของ brand
<html data-brand={brand.name}>
  <head>
    <style dangerouslySetInnerHTML={{ __html: generateBrandCss(brand) }} />
  </head>
  …
// src/components/ui/button.tsx — port จาก shadcn/ui เป็นของโปรเจกต์
<Button variant="primary" intent="brand">บันทึก</Button>
```

**antd**

```tsx
import { BrtConfigProvider, Button } from '@brt-innovation/antd';

<BrtConfigProvider brand={brand}>
  <Button type="primary">บันทึก</Button>
</BrtConfigProvider>;
```

**CSS อื่น / CSS-in-JS** — `var(--brt-color-bg-secondary)` หรือ `vars.color.bg.secondary`

รายละเอียด (ตั้ง `@theme` ของ Tailwind, หลาย brand, antd + Tailwind) อยู่ใน [`.ai/project-setup.md`](.ai/project-setup.md)

## Development

ต้องมี Node 24 และ pnpm

```bash
pnpm install
pnpm build        # turbo build ทุก package
pnpm storybook    # Storybook (design + antd) → http://localhost:6006
pnpm test         # token coverage ทุก brand × mode × viewport
pnpm changeset    # บันทึกการเปลี่ยนแปลงก่อนเปิด PR
pnpm lint         # ESLint
pnpm format       # prettier
```

คำสั่งเดียวกันเรียกผ่าน `make` ได้ (`make help` ดูทั้งหมด — `make check` = ตรวจครบก่อนส่งงาน)

Workflow: แตก branch จาก `develop` → PR เข้า `develop` → merge `develop` เข้า `main` → publish ด้วยมือตาม [`README.dev.md`](README.dev.md) (Publishing Guide)

## สำหรับ AI Agents

อ่าน [AGENTS.md](AGENTS.md)
