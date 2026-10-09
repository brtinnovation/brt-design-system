# @brt/tailwind

BRT design tokens สำหรับ Tailwind CSS v4

```css
@import 'tailwindcss';
@import '@brt/tailwind/theme.css';
```

```html
<html data-brand="brt" data-mode="light">
  <div class="rounded-md border border-primary bg-secondary p-16 text-body-md text-primary">
    ...
  </div>
</html>
```

utility ที่ได้ (ชื่อตาม Figma): `text-primary`, `text-secondary`, `bg-secondary`, `bg-brand-subtle`, `border-primary`, `border-brand`, `bg-button-primary-brand`, `text-h1`, `text-body-md`, `leading-lg`, `rounded-md`, `p-16`, `gap-8`, `font-semibold`, `z-modal` ฯลฯ — palette default ของ Tailwind (`bg-blue-500`) ถูกปิดไว้ และตัวเลข spacing เป็น px (`h-40` = 40px)
