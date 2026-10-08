# @brt/css

BRT design tokens เป็น CSS variables สำหรับ CSS framework ใดก็ได้ (styled-components, emotion, CSS Modules, Sass ...)

```ts
import '@brt/css/tokens.css';
import { vars } from '@brt/css';

const Card = styled.div`
  background: ${vars.color.bg.surface};
  border-radius: ${vars.radius.md};
`;
```

CSS ล้วน: `background: var(--brt-color-bg-surface);` — สลับ brand / mode ด้วย `<html data-brand="brt" data-mode="dark">`
