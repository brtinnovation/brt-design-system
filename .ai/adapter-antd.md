# Adapter: `@brt/antd` (Ant Design v6)

## สิ่งที่ export

| Export              | หน้าที่                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| `brtThemeConfig`    | antd `ThemeConfig` ที่ map จาก semantic token — ให้โปรเจกต์ merge เองได้     |
| `BrtConfigProvider` | ห่อ `ConfigProvider` ใส่ theme + locale ไทยให้ (override ได้ผ่าน props)     |
| component ของ BRT   | เฉพาะที่ antd ไม่มีหรือ BRT จัด layout เฉพาะ เช่น DataTable, SearchFilter, StatusTag |

การใช้งานในโปรเจกต์:

```tsx
import { BrtConfigProvider, Button, DatePicker, Select } from '@brt/antd';
```

## Mapping token → antd

- mapping ทั้งหมดอยู่ใน `packages/antd/src/theme/` ที่เดียว
- ระดับ global ใช้ `token` (`colorPrimary`, `colorSuccess`, `borderRadius`, `fontFamily` ...) ระดับ component ใช้ `components.<Name>`
- ใช้ semantic token เท่านั้น เช่น `colorPrimary: tokens.color.primary`
- ถ้าต้องตั้งค่า component ที่ไม่มี token รองรับ ให้เพิ่ม token ใน `@brt/design` ก่อน

## Component

- **re-export component ของ antd ตามเดิม** (`Button`, `Select`, `DatePicker`, `Modal` ...) ไม่ต้อง wrap ถ้าไม่ได้เพิ่ม behavior — ธีมมาจาก `BrtConfigProvider` อยู่แล้ว
- wrap เฉพาะเมื่อมี default หรือ behavior ของ BRT จริง ๆ และต้องคง props ของ antd ไว้ครบ (`extends ButtonProps`)
- API ใช้แบบ antd ไม่ต้องตรงกับ `@brt/shadcn` (ดู non-negotiable ข้อ 4 ใน `AGENTS.md`)

## Locale ไทย / วันที่

- `BrtConfigProvider` ใส่ `antd/locale/th_TH` เป็นค่าเริ่มต้น
- DatePicker ของ antd v6 ใช้ dayjs — ถ้าต้องแสดงปี พ.ศ. ต้องตั้ง dayjs locale `th` + plugin `buddhistEra` และกำหนด `format` ให้ชัด ห้ามสันนิษฐานว่า locale ทำให้เอง

## ข้อควรระวัง

- antd, React เป็น peer dependency ห้าม bundle
- ก่อนใช้ API ใด ให้ตรวจ doc ของ antd v6 — หลาย API ของ v4/v5 ถูกเปลี่ยนหรือเลิกใช้ (เช่น props ที่เปลี่ยนชื่อ, CSS-in-JS / CSS variables mode)
- ตรวจความเข้ากันได้กับ Next.js App Router (SSR style extraction ผ่าน `@ant-design/nextjs-registry`) ใน `apps/showcase`
