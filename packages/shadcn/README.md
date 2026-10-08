# @brt/shadcn

BRT components บน shadcn/ui + Tailwind CSS v4 (theme จาก `@brt/tailwind`)

```css
@import 'tailwindcss';
@import '@brt/shadcn/styles.css';
```

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@brt/shadcn';

<Button variant="default">บันทึก</Button>;
```

สลับ brand / mode ด้วย `<html data-brand="brt" data-mode="dark">`
