# @brt/css

BRT design tokens เป็น CSS variables สำหรับ CSS framework ใดก็ได้ (styled-components, emotion, CSS Modules, Sass ...)

```ts
import '@brt/css/tokens.css';
import { vars } from '@brt/css';

const Card = styled.div`
  background: ${vars.color.bg.secondary};
  border-radius: ${vars.radius.md};
`;
```

CSS ล้วน: `background: var(--brt-color-bg-secondary);` — สลับ brand ด้วย `<html data-brand="brt">` (dark mode ยังไม่มีค่าจาก Figma)
