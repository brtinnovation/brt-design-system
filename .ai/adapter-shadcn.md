# Adapter: `@brt/shadcn` (shadcn/ui บน Tailwind v4)

shadcn/ui ปกติใช้วิธี copy component เข้าโปรเจกต์ แต่ที่นี่ **bundle เป็น npm package** เพื่อให้ทุกโปรเจกต์ได้ component และการอัปเดตชุดเดียวกัน

```tsx
import { Button, DatePicker, Select } from '@brt/shadcn';
```

## ชั้นของ CSS

```
@brt/tailwind             --brt-color-text-primary (ต่อ brand/mode)
                          @theme inline { --text-color-primary, --background-color-secondary, --background-color-button-primary-brand ... }
        ▼
@brt/shadcn/styles.css    @import '@brt/tailwind/theme.css'
                          @theme inline { --color-ring }  (ชื่อเพิ่มที่ utility อื่นต้องใช้ → token เดิม)
                          @source "./dist"
        ▼
component                 className="bg-button-primary-brand text-button-primary-brand"
```

- **theme มาจาก `@brt/tailwind` เท่านั้น** — ห้ามประกาศค่าสี/radius/font ซ้ำใน `@brt/shadcn` สีทุกตัวใช้ชื่อตาม Figma (`text-secondary`, `bg-primary`, `border-brand`) **ไม่ใช้ชื่อของ shadcn** (`foreground`, `muted`, `destructive`) — ตอน fork component จาก shadcn/ui ให้แปลงชื่อเป็นของ Figma ที่นี่ map เพิ่มเฉพาะ `--color-ring`
- **API ตาม Figma** — Button: `variant` = `primary | secondary | tertiary`, `intent` = `brand | neutral | error` (Figma Component/Button) ไม่ใช้ `default | outline | ghost | destructive` ของ shadcn
- `cn()` ใช้ `extendTailwindMerge` ให้รู้จัก class ตาม token (`text-h1`, `leading-13xl`) ไม่อย่างนั้น `text-h1 text-primary` จะถูกมองเป็นสีทั้งคู่ — เพิ่ม fontSize / lineHeight ใหม่ต้องเพิ่มใน `src/lib/utils.ts` (test เทียบกับ `theme.css` ให้)
- สลับ brand/mode ได้อัตโนมัติ เพราะทุกค่าอ้าง `var(--brt-*)` ซึ่งเปลี่ยนตาม `data-brand` / `data-mode`
- component ใช้ utility ตามชื่อ semantic (`bg-primary`, `text-secondary`, `rounded-md`) ห้ามใช้ arbitrary value (`bg-[#047B7B]`, `bg-(--brt-…)`)

## การส่ง CSS ให้โปรเจกต์ปลายทาง

Tailwind ของโปรเจกต์ไม่ scan `node_modules` เอง — `styles.css` จึงประกาศ `@source` ชี้ไปที่ `dist/` ของ package แล้วโปรเจกต์ import ไฟล์นี้ไฟล์เดียว

```css
/* โปรเจกต์ปลายทาง */
@import 'tailwindcss';
@import '@brt/shadcn/styles.css';
```

ต้องมีโปรเจกต์ทดสอบใน `apps/showcase` ที่ติดตั้งแบบเดียวกับโปรเจกต์จริง เพื่อยืนยันว่า style ไม่หายหลัง build

## เพิ่ม component

1. เริ่มจากโค้ดของ shadcn/ui ต้นฉบับ แล้วย้ายเข้า `src/components/`
2. เปลี่ยน import ภายใน (`@/lib/utils`) เป็น relative path ของ package
3. ตรวจว่าไม่มีค่าที่ hardcode — ทุกอย่างผ่าน semantic utility
4. export จาก `src/index.ts` + เพิ่ม story ใน `apps/docs-shadcn/src/stories/` (ทดสอบทุก brand/mode)
5. Radix ที่ใช้ให้อยู่ใน `dependencies` ของ package

## ข้อควรระวัง

- **`"use client"`**: component ที่ใช้ state/Radix ต้องมี directive นี้ใน output — tsup ตัด directive ทิ้งตอน bundle ต้องตั้ง `banner` หรือ build แยกไฟล์ แล้วตรวจไฟล์ใน `dist/` ทุกครั้งที่เปลี่ยน build config
- **DatePicker**: shadcn ไม่มี DatePicker สำเร็จรูป ต้องประกอบจาก Calendar (react-day-picker) + Popover + date-fns และรองรับ locale ไทย/ปี พ.ศ. — วางแผนแยก
- **animation**: ใช้ `tw-animate-css` ตามที่ shadcn สำหรับ Tailwind v4 ใช้ ไม่ผูกกับ Motion
- React, Tailwind เป็น peer dependency ห้าม bundle
