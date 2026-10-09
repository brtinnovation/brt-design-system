# Brands

แต่ละโปรเจกต์มี brand ของตัวเอง ตอนนี้มี **`brt`** brand เดียว (เป็นค่าเริ่มต้น) และจะเพิ่มในอนาคต

## brand คือการเลือก ไม่ใช่การสร้างค่า

brand ต่างกันได้เฉพาะ **สี** (primary, secondary, tertiary และ system color ถ้าต้องการ) กับ **font family** — ทุกค่าต้องเลือกจาก primitive ใน `@brt/design` ตรงกับ collection `02-alias` ของ Figma

```ts
// packages/design/src/brands/brt.ts
export const brt = defineBrand({
  name: 'brt',
  color: {
    primary: 'brtTeal', // ชื่อ palette ใน primitive — type จำกัดให้เลือกได้เฉพาะ palette ที่มี
    secondary: 'twilightStorm',
    tertiary: 'purple',
    // success / warning / error / info / neutral ไม่บังคับ — ไม่ใส่ = System ของ Figma
    // (green / refreshingOrange / red / blue / gray)
  },
  font: { sans: 'kanit' }, // ชื่อฟอนต์ใน primitive
});
```

- `neutral` เลือกได้เฉพาะ palette ที่มีขั้น `-95` / `+95` (ตอนนี้คือ `gray`) เพราะ semantic ใช้ขั้นเหล่านี้
- `tertiary` ยังไม่มี semantic token ใช้ (Figma ไม่ได้อ้าง) — เข้าถึงได้ผ่าน `resolvePalette()`

- ห้ามใส่ hex หรือชื่อฟอนต์ดิบ ถ้า palette/ฟอนต์ที่ต้องการยังไม่มี ให้เพิ่มใน `primitive/` ก่อน
- brand เลือก **palette** ไม่ใช่ shade — shade ที่ใช้แต่ละที่มาจากกฎใน `semantic/` ทำให้ทุก brand ได้ hover/subtle/disabled ที่สมดุลเท่ากัน
- spacing, radius, shadow ฯลฯ ใช้ร่วมทุก brand ถ้าวันหนึ่ง brand ต้องการต่าง ต้องตัดสินใจร่วมกันก่อน ห้ามเพิ่มลง brand เอง

## เพิ่ม brand ใหม่

1. เพิ่ม palette / ฟอนต์ที่ยังไม่มีใน `primitive/`
2. สร้าง `brands/<name>.ts` แล้ว register ใน `brands/index.ts`
3. coverage test ของทุก adapter ต้องผ่านกับ brand ใหม่ (test วนทุก brand × mode × viewport)
4. เพิ่ม brand ใน toolbar ของ Storybook
5. changeset `minor` ของทุก adapter

## โปรเจกต์ตั้ง brand อย่างไร

โปรเจกต์ตั้ง brand **ที่เดียว** แล้ว component adapter กับ style adapter เปลี่ยนตามพร้อมกัน

| สิ่งที่ต้องเปลี่ยน                               | กลไก                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| antd component                                   | `BrtConfigProvider` ส่ง `ThemeConfig` ของ brand เข้า context         |
| CSS (`@brt/tailwind`, `@brt/css`, `@brt/shadcn`) | attribute `data-brand` / `data-mode` ที่ `<html>` เลือกชุด `--brt-*` |

- **โปรเจกต์ antd**: `<BrtConfigProvider brand="brt" mode="light">` — ใส่ `data-brand` / `data-mode` ที่ `<html>` ให้เอง
- **โปรเจกต์ที่ไม่มี provider** (shadcn, CSS ล้วน): ใส่ `<html data-brand="brt" data-mode="light">` ใน root layout
- ไม่ใส่อะไรเลย = `brt` + `light` (`:root` เป็นค่าของ brand เริ่มต้น)
- `tokens.css` มีทุก brand อยู่ในไฟล์เดียว — ขนาดเล็กพอ ยังไม่ต้องแยกไฟล์ต่อ brand จนกว่าจำนวน brand จะทำให้ CSS ใหญ่จนมีผล
