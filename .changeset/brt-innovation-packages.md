---
'@brt-innovation/design': minor
'@brt-innovation/antd': minor
---

เปิด package ชุดแรกภายใต้ scope `@brt-innovation` — publish แยกกันได้ทั้งสองตัว

- `@brt-innovation/design` (public): token จาก Figma — palette (scale -90 … 00 … +90), semantic `color.text/bg/border/button`, typography / radius แบบ desktop + mobile, `defineBrand()`, `defaultBrand`, `tokens.css`, `generateBrandCss()`, `vars`
- โปรเจกต์ map brand เองด้วย `defineBrand()` — ไม่ map = `defaultBrand` (Brand/BRT ของ Figma)
- `@brt-innovation/antd`: `BrtConfigProvider` / `getThemeConfig` รับ `brand` เป็น object · re-export token ที่ `@brt-innovation/antd/tokens`
- ยกเลิก `@brt/tailwind`, `@brt/css` และ `@brt-innovation/shadcn` (ไม่เคย publish) — การตั้งค่า CSS framework เป็นของโปรเจกต์ ส่วน component ของ shadcn/ui โปรเจกต์ port เองตามตารางแปลงใน `.ai/shadcn-mapping.md`
- shadow 6 ขั้นจาก Figma Effect styles · breakpoint (เพิ่ม 2xl) และ z-index (0–50) ตาม Tailwind · ยังไม่มี dark mode
