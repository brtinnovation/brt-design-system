# Adapter: `@brt/shadcn` (shadcn/ui บน Tailwind v4)

shadcn/ui ปกติใช้วิธี copy component เข้าโปรเจกต์ แต่ที่นี่ **bundle เป็น npm package** เพื่อให้ทุกโปรเจกต์ได้ component และการอัปเดตชุดเดียวกัน

```tsx
import { Button, DatePicker, Select } from '@brt/shadcn';
```

## ชั้นของ CSS

```
@brt/tailwind             --brt-color-primary (ต่อ brand/mode)
                          @theme inline { --color-primary, --color-background, --color-muted-foreground ... }
        ▼
@brt/shadcn/styles.css    @import '@brt/tailwind/theme.css'
                          @theme inline { --color-card, --color-destructive, --color-ring ... }  (ชื่อเพิ่มของ shadcn → token เดิม)
                          @source "./dist"
        ▼
component                 className="bg-primary text-primary-foreground"
```

- **theme มาจาก `@brt/tailwind` เท่านั้น** — ห้ามประกาศค่าสี/radius/font ซ้ำใน `@brt/shadcn` ชื่อหลักของ shadcn (`primary`, `background`, `muted-foreground`, `border` ...) มาจาก `@brt/tailwind` อยู่แล้ว ที่นี่ map เฉพาะชื่อเพิ่มเติม (`card`, `popover`, `accent`, `destructive`, `input`, `ring`) ไปหา `--brt-*` และต้องครบทุกตัวที่ component ใช้
- `cn()` ใช้ `extendTailwindMerge` ให้รู้จัก class ตาม token (`text-md`) — เพิ่ม token ขนาดใหม่ต้องเพิ่มใน `src/lib/utils.ts` ด้วย
- สลับ brand/mode ได้อัตโนมัติ เพราะทุกค่าอ้าง `var(--brt-*)` ซึ่งเปลี่ยนตาม `data-brand` / `data-mode`
- component ใช้ utility ตามชื่อ semantic (`bg-primary`, `text-muted-foreground`, `rounded-md`) ห้ามใช้ arbitrary value (`bg-[#0052cc]`)

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
