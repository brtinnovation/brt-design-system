# @brt/antd

BRT design tokens + components สำหรับ Ant Design v6

```tsx
import { BrtConfigProvider, Button, StatusTag } from '@brt/antd';

<BrtConfigProvider brand="brt" mode="light">
  <Button type="primary">บันทึก</Button>
  <StatusTag status="success">อนุมัติ</StatusTag>
</BrtConfigProvider>;
```

`BrtConfigProvider` ใส่ theme ของ brand, locale ไทย และตั้ง `data-brand` / `data-mode` ที่ `<html>` ให้ style adapter (`@brt/tailwind`, `@brt/css`) เปลี่ยนตาม
