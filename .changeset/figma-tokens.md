---
'@brt/tailwind': minor
'@brt/css': minor
'@brt/antd': minor
'@brt/shadcn': minor
---

ใช้ token จริงจาก Figma แทนค่าตัวอย่าง (breaking — ยังอยู่ในช่วง 0.x)

- palette ของ Figma (scale -90 … 00 … +90), brand `brt` = BRT Teal / Twilight Storm / Purple, ฟอนต์ Kanit
- ชื่อ semantic ตาม Figma: `color.text.*`, `color.bg.*`, `color.border.*`, `color.button.*` แทน `primary`, `bg.surface`, `text.muted` …
- typography และ radius มีค่า desktop / mobile (`tokens.css` เป็น mobile-first, desktop ตั้งแต่ 768px)
- `@brt/tailwind`: class ตาม Figma (`text-primary`, `bg-secondary`, `border-brand`, `text-h1`, `p-16`) และ spacing ตัวเลขเป็น px
- `@brt/shadcn`: `Button` ใช้ `variant="primary|secondary|tertiary"` + `intent="brand|neutral|error"`
- ยังไม่มี dark mode, shadow, breakpoint, z-index จาก Figma (ใช้ค่าตัวอย่าง)
