# brt-design-system

Monorepo ของ BRT Design System — design token ชุดเดียว ส่งออกเป็น 3 npm packages

| Package       | ใช้เมื่อ                                    | ติดตั้ง                                   |
| ------------- | ------------------------------------------- | ----------------------------------------- |
| `@brt/design` | ต้องการแค่ token (เขียน UI เอง)              | `pnpm add @brt/design`                    |
| `@brt/antd`   | โปรเจกต์ใช้ Ant Design v6                    | `pnpm add @brt/design @brt/antd antd`     |
| `@brt/shadcn` | โปรเจกต์ใช้ Tailwind v4 + shadcn/ui          | `pnpm add @brt/design @brt/shadcn`        |

> 🚧 ยังอยู่ระหว่างวางโครงสร้าง — แผนและสถาปัตยกรรมอยู่ใน [`.ai/`](.ai/) เริ่มจาก [`.ai/architecture.md`](.ai/architecture.md)

## การใช้งาน

**Ant Design**

```tsx
import { BrtConfigProvider, Button, DatePicker } from '@brt/antd';

<BrtConfigProvider>
  <Button type="primary">บันทึก</Button>
</BrtConfigProvider>;
```

**shadcn / Tailwind v4**

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@brt/shadcn/styles.css';
```

```tsx
import { Button } from '@brt/shadcn';

<Button variant="default">บันทึก</Button>;
```

**เขียน UI เอง**

```ts
import '@brt/design/tokens.css';
```

```css
.my-button {
  background: var(--brt-color-primary);
  border-radius: var(--brt-radius-md);
  padding: var(--brt-spacing-sm);
}
```

## Development

ต้องมี Node 24 และ pnpm

```bash
pnpm install
pnpm build        # turbo build ทุก package
pnpm dev          # Storybook (apps/docs)
pnpm changeset    # บันทึกการเปลี่ยนแปลงก่อนเปิด PR
pnpm format       # prettier
```

Workflow: แตก branch จาก `develop` → PR เข้า `develop` → merge `develop` เข้า `main` เพื่อ release (ดู [`.ai/release.md`](.ai/release.md))

## สำหรับ AI Agents

อ่าน [AGENTS.md](AGENTS.md)
