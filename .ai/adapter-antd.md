# Adapter: `@brt-innovation/antd` (Ant Design v6)

## สิ่งที่ export

| Export                                  | หน้าที่                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `BrtConfigProvider`                     | ห่อ `ConfigProvider` ใส่ theme ของ `brand` (object จาก `defineBrand()`, ค่าเริ่มต้น `defaultBrand`) + `mode` และ locale ไทย |
| `getThemeConfig(brand, mode, viewport)` | antd `ThemeConfig` ของ brand นั้น (viewport เริ่มต้น `'desktop'`) — ให้โปรเจกต์ merge เองได้                                |
| component ของ BRT                       | เฉพาะที่ antd ไม่มีหรือ BRT จัด layout เฉพาะ — ตอนนี้มี `StatusTag` (อนาคต: DataTable, SearchFilter …)                      |
| `@brt-innovation/antd/tokens`           | ทุกอย่างของ `@brt-innovation/design` (`defineBrand`, `resolve`, `vars` …) — entry แยก ไม่มี `'use client'`                  |

```tsx
import { BrtConfigProvider, Button, DatePicker } from '@brt-innovation/antd';
import { brand } from '@/theme/brand'; // defineBrand() ของโปรเจกต์ — ดู brands.md

<BrtConfigProvider brand={brand}>
  <Button type="primary">บันทึก</Button>
</BrtConfigProvider>;
```

component ทุกตัวของ antd อ่าน `colorPrimary` ฯลฯ จาก context ของ provider แล้วคำนวณเฉด hover/active/bg เอง โปรเจกต์ไม่ต้องตั้งทีละ component

## Mapping token → antd

- mapping อยู่ใน `packages/antd/src/theme/` ที่เดียว และต้อง **map semantic token ครบทุกตัว** (coverage test)
- ระดับ global ใช้ `token` (`colorPrimary`, `colorSuccess`, `borderRadius`, `fontFamily` ...) ระดับ component ใช้ `components.<Name>`
- `colorPrimary` = `color.button.primary.brand.bg` (BRT Teal -40) ไม่ใช่ `bg.brand` (00) เพราะ antd ใช้สีนี้กับปุ่มและตัวอักษร — ปุ่ม default / text ของ antd map จาก Figma Button Secondary / Tertiary (Neutral) ใน `components.Button`
- antd token ละหนึ่ง semantic token — test ตรวจว่าไม่ map ซ้ำ
- **ใช้ค่าดิบจาก `resolve(brand, mode, viewport)` ไม่ใช่ `var(--brt-*)`** — algorithm ของ antd ต้องใช้ค่าสีจริงเพื่อคำนวณเฉด ถ้าส่ง `var()` จะคำนวณไม่ได้
- dark mode: `mode="dark"` เลือก `theme.darkAlgorithm` แล้ว แต่ token ยังใช้ค่า light (Figma ยังไม่มี dark) — เมื่อ design มีค่า dark จะได้เองผ่าน `resolve(brand, 'dark')`

## Component

- **re-export component ของ antd ตามเดิม** ไม่ต้อง wrap ถ้าไม่ได้เพิ่ม behavior — ธีมมาจาก provider อยู่แล้ว
- wrap เฉพาะเมื่อมี default หรือ behavior ของ BRT จริง ๆ และต้องคง props ของ antd ไว้ครบ (`extends ButtonProps`)

## ใช้คู่กับ CSS framework ของโปรเจกต์

- CSS ของโปรเจกต์ (Tailwind ฯลฯ) อ่าน `var(--brt-*)` ได้สีเดียวกับ antd เพราะมาจาก token และ brand ชุดเดียวกัน
- **ห้ามเอา class ของ CSS framework ไปทาสีทับ component ของ antd** (`<Button className="bg-primary">`) ใช้ได้แค่ layout รอบ ๆ (margin, grid) ถ้าต้องเปลี่ยนหน้าตา ให้แก้ `theme/`
- antd + Tailwind: ดูเรื่องลำดับ `@layer` / preflight ใน `project-setup.md`
- provider **ไม่ตั้ง** `data-brand` ที่ `<html>` แล้ว — ถ้าโปรเจกต์มี CSS ของตัวเองที่อ่าน `--brt-*` ให้ใส่ `generateBrandCss(brand)` เอง (ดู `project-setup.md`)
- ส่ง `brand` ที่ประกาศไว้นอก component (module scope) — object ใหม่ทุก render ทำให้ `useMemo` คำนวณ theme ใหม่ทุกครั้ง

## Locale ไทย / วันที่

- `BrtConfigProvider` ใส่ `antd/locale/th_TH` เป็นค่าเริ่มต้น (override ได้ผ่าน props)
- DatePicker ใช้ dayjs — ถ้าต้องแสดงปี พ.ศ. ต้องตั้ง dayjs locale `th` + plugin `buddhistEra` และกำหนด `format` ให้ชัด

## ข้อควรระวัง

- antd, React เป็น peer dependency ห้าม bundle
- ก่อนใช้ API ใด ให้ตรวจ doc ของ antd v6 — หลาย API ของ v4/v5 ถูกเปลี่ยนหรือเลิกใช้
- ยังไม่มีแอปทดสอบแบบโปรเจกต์จริง — ใช้กับ Next.js App Router ต้องตั้ง `@ant-design/nextjs-registry` ในโปรเจกต์ และทดสอบกับโปรเจกต์แรกที่ใช้ antd
