# brt-design-system

Monorepo ของ BRT Design System — design token ของทุก brand อยู่ที่เดียว ส่งให้โปรเจกต์ผ่าน adapter

> 🚧 ยังอยู่ระหว่างวางโครงสร้าง — แผนและสถาปัตยกรรมอยู่ใน [`.ai/`](.ai/) เริ่มจาก [`.ai/architecture.md`](.ai/architecture.md)

## เลือก package

เลือก **component adapter** ตาม UI library (ไม่ใช้ก็ได้) + **style adapter** ตาม CSS framework ของโปรเจกต์

| Package         | ประเภท    | ใช้เมื่อ                                                                  |
| --------------- | --------- | ------------------------------------------------------------------------- |
| `@brt/antd`     | Component | โปรเจกต์ใช้ Ant Design v6                                                 |
| `@brt/shadcn`   | Component | โปรเจกต์ใช้ shadcn/ui (รวม `@brt/tailwind` มาให้แล้ว)                     |
| `@brt/tailwind` | Style     | โปรเจกต์ใช้ Tailwind CSS v4                                               |
| `@brt/css`      | Style     | โปรเจกต์ใช้ CSS framework อื่น (styled-components, Sass, CSS Modules ...) |

| โปรเจกต์                 | ติดตั้ง                                 |
| ------------------------ | --------------------------------------- |
| antd + Tailwind          | `pnpm add @brt/antd @brt/tailwind antd` |
| antd + styled-components | `pnpm add @brt/antd @brt/css antd`      |
| shadcn                   | `pnpm add @brt/shadcn`                  |

`@brt/design` (token) เป็น package ภายใน ไม่ได้ publish — ใช้ผ่าน adapter เท่านั้น

## การใช้งาน

**antd** — ตั้ง brand ที่ provider

```tsx
import { BrtConfigProvider, Button } from '@brt/antd';

<BrtConfigProvider brand="brt">
  <Button type="primary">บันทึก</Button>
</BrtConfigProvider>;
```

**shadcn / Tailwind v4**

```css
@import 'tailwindcss';
@import '@brt/shadcn/styles.css'; /* หรือ '@brt/tailwind/theme.css' ถ้าไม่ใช้ component */
```

```tsx
import { Button } from '@brt/shadcn';

<Button variant="primary" intent="brand">
  บันทึก
</Button>;
```

**CSS framework อื่น**

```tsx
import '@brt/css/tokens.css';
import { vars } from '@brt/css';

const Card = styled.div`
  background: ${vars.color.bg.secondary};
`;
```

**brand / mode** — โปรเจกต์ที่ไม่มี provider ตั้งที่ `<html data-brand="brt" data-mode="light">` ไม่ตั้ง = `brt` + `light`

## Development

ต้องมี Node 24 และ pnpm

```bash
pnpm install
pnpm build        # turbo build ทุก package
pnpm storybook    # Storybook ทุก package → http://localhost:6006
pnpm test         # รวม token coverage test ของทุก adapter
pnpm changeset    # บันทึกการเปลี่ยนแปลงก่อนเปิด PR
pnpm format       # prettier
```

Workflow: แตก branch จาก `develop` → PR เข้า `develop` → merge `develop` เข้า `main` เพื่อ release (ดู [`.ai/release.md`](.ai/release.md))

## สำหรับ AI Agents

อ่าน [AGENTS.md](AGENTS.md)
