# @brt/shadcn

BRT components บน shadcn/ui + Tailwind CSS v4 (theme จาก `@brt/tailwind`)

```css
@import 'tailwindcss';
@import '@brt/shadcn/styles.css';
```

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@brt/shadcn';

<Button variant="primary" intent="brand">
  บันทึก
</Button>;
```

สลับ brand ด้วย `<html data-brand="brt">` (dark mode ยังไม่มีค่าจาก Figma)
