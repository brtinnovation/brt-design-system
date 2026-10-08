# Adapter: `@brt/shadcn` (Tailwind v4 + shadcn/ui)

shadcn/ui ปกติใช้วิธี copy component เข้าโปรเจกต์ แต่ที่นี่ **bundle เป็น npm package** เพื่อให้ทุกโปรเจกต์ได้ component และการอัปเดตชุดเดียวกัน

```tsx
import { Button, DatePicker, Select } from '@brt/shadcn';
```

## ชั้นของ CSS

```
@brt/design/tokens.css     --brt-color-primary: ...            (token)
        ▼
@brt/shadcn/styles.css     --primary: var(--brt-color-primary)  (ชื่อตัวแปรแบบ shadcn)
                           @theme inline { --color-primary: var(--primary); ... }
        ▼
component                  className="bg-primary text-primary-foreground"
```

- Tailwind v4 เป็นแบบ **CSS-first** — ไม่มี `tailwind.config.js` / preset แบบ v3 ธีมทั้งหมดอยู่ใน `@theme` ของ `styles.css`
- component ใช้ utility ตามชื่อ semantic ของ shadcn (`bg-primary`, `text-muted-foreground`, `rounded-md`) ห้ามใช้ arbitrary value (`bg-[#0052cc]`, `rounded-[10px]`)

## การส่ง CSS ให้โปรเจกต์ปลายทาง

Tailwind ของโปรเจกต์ปลายทางไม่ scan `node_modules` เอง ถ้าไม่บอก class ที่ใช้ใน component จะไม่ถูก generate และ style หาย

แนวทางที่ใช้: `styles.css` ของ package ประกาศ `@source` ชี้ไปที่ `dist/` ของตัวเอง แล้วโปรเจกต์ import ไฟล์นี้ไฟล์เดียว

```css
/* โปรเจกต์ปลายทาง: app/globals.css */
@import 'tailwindcss';
@import '@brt/shadcn/styles.css'; /* รวม tokens.css + @theme + @source แล้ว */
```

ต้องมีโปรเจกต์ทดสอบใน `apps/showcase` ที่ติดตั้งแบบเดียวกับโปรเจกต์จริง เพื่อยืนยันว่า style ไม่หายหลัง build

## เพิ่ม component

1. เริ่มจากโค้ดของ shadcn/ui ต้นฉบับ (CLI `shadcn add` ใน workspace ชั่วคราว หรือคัดลอกจาก doc) แล้วย้ายเข้า `src/components/`
2. เปลี่ยน import ภายใน (`@/lib/utils`) เป็น relative path ของ package
3. ตรวจว่าไม่มีค่าที่ hardcode — ทุกอย่างผ่าน semantic utility
4. export จาก `src/index.ts` + เพิ่ม story ใน `apps/docs`
5. Radix ที่ใช้ให้อยู่ใน `dependencies` ของ package

## ข้อควรระวัง

- **`"use client"`**: component ที่ใช้ state/Radix ต้องมี directive นี้ใน output ไม่อย่างนั้น Next.js App Router จะ error — tsup ตัด directive ทิ้งตอน bundle ต้องตั้ง `banner` หรือ build แยกไฟล์ให้ directive คงอยู่ แล้วตรวจไฟล์ใน `dist/` ทุกครั้งที่เปลี่ยน build config
- **DatePicker**: shadcn ไม่มี DatePicker สำเร็จรูป ต้องประกอบจาก Calendar (react-day-picker) + Popover + date-fns และต้องรองรับ locale ไทย/ปี พ.ศ. — งานใหญ่กว่า component อื่น ให้วางแผนแยก
- **animation**: ใช้ `tw-animate-css` ตามที่ shadcn สำหรับ Tailwind v4 ใช้ ไม่ต้องผูกกับ Motion (โปรเจกต์ปลายทางเลือกเอง)
- React, Tailwind เป็น peer dependency ห้าม bundle
