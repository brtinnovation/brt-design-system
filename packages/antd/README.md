# @brt-innovation/antd

BRT design tokens + components สำหรับ Ant Design v6

```tsx
import { BrtConfigProvider, Button, StatusTag } from '@brt-innovation/antd';
import { defineBrand } from '@brt-innovation/antd/tokens';

const brand = defineBrand({
  name: 'brt',
  color: { primary: 'brtTeal', secondary: 'twilightStorm', tertiary: 'purple' },
  font: { sans: 'kanit' },
});

<BrtConfigProvider brand={brand}>
  <Button type="primary">บันทึก</Button>
  <StatusTag status="success">อนุมัติ</StatusTag>
</BrtConfigProvider>;
```

ไม่ส่ง `brand` = ค่าเริ่มต้นจาก Figma · `BrtConfigProvider` ใส่ locale ไทยให้ด้วย · token ทั้งหมดอยู่ที่ `@brt-innovation/antd/tokens`
