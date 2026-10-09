# Adapter: `@brt/antd` (Ant Design v6)

## สิ่งที่ export

| Export                                  | หน้าที่                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `BrtConfigProvider`                     | ห่อ `ConfigProvider` ใส่ theme ของ `brand` + `mode`, locale ไทย และตั้ง `data-brand` / `data-mode` ที่ `<html>` |
| `getThemeConfig(brand, mode, viewport)` | antd `ThemeConfig` ของ brand นั้น (viewport เริ่มต้น `'desktop'`) — ให้โปรเจกต์ merge เองได้                    |
| component ของ BRT                       | เฉพาะที่ antd ไม่มีหรือ BRT จัด layout เฉพาะ เช่น DataTable, SearchFilter, StatusTag                            |

```tsx
import { BrtConfigProvider, Button, DatePicker } from '@brt/antd';

<BrtConfigProvider brand="brt">
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
- dark mode: ใช้ค่า semantic ของ mode `dark` + `theme.darkAlgorithm` ตามความเหมาะสม

## Component

- **re-export component ของ antd ตามเดิม** ไม่ต้อง wrap ถ้าไม่ได้เพิ่ม behavior — ธีมมาจาก provider อยู่แล้ว
- wrap เฉพาะเมื่อมี default หรือ behavior ของ BRT จริง ๆ และต้องคง props ของ antd ไว้ครบ (`extends ButtonProps`)

## ใช้คู่กับ CSS framework ของโปรเจกต์

- โปรเจกต์ใช้ style adapter คู่กันได้ (`@brt/tailwind`, `@brt/css`) — ได้สีเดียวกันเพราะ build จาก token ชุดเดียว
- **ห้ามเอา class ของ CSS framework ไปทาสีทับ component ของ antd** (`<Button className="bg-primary">`) ใช้ได้แค่ layout รอบ ๆ (margin, grid) ถ้าต้องเปลี่ยนหน้าตา ให้แก้ `theme/`
- antd + Tailwind: ดูเรื่องลำดับ `@layer` / preflight ใน `adapter-style.md`

## Locale ไทย / วันที่

- `BrtConfigProvider` ใส่ `antd/locale/th_TH` เป็นค่าเริ่มต้น (override ได้ผ่าน props)
- DatePicker ใช้ dayjs — ถ้าต้องแสดงปี พ.ศ. ต้องตั้ง dayjs locale `th` + plugin `buddhistEra` และกำหนด `format` ให้ชัด

## ข้อควรระวัง

- antd, React เป็น peer dependency ห้าม bundle
- ก่อนใช้ API ใด ให้ตรวจ doc ของ antd v6 — หลาย API ของ v4/v5 ถูกเปลี่ยนหรือเลิกใช้
- ตรวจความเข้ากันได้กับ Next.js App Router (`@ant-design/nextjs-registry`) ใน `apps/showcase`
