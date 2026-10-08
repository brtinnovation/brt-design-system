# @brt/tailwind

BRT design tokens สำหรับ Tailwind CSS v4

```css
@import 'tailwindcss';
@import '@brt/tailwind/theme.css';
```

```html
<html data-brand="brt" data-mode="light">
  <div class="rounded-md bg-surface p-md text-foreground shadow-sm">...</div>
</html>
```

utility ที่ได้: `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-md`, `p-md`, `text-lg`, `font-semibold`, `z-modal` ฯลฯ — palette default ของ Tailwind (`bg-blue-500`) ถูกปิดไว้
