# shadcn/ui → token ของ BRT

design system **ไม่มี component ของ shadcn** — โปรเจกต์ที่ใช้ shadcn/ui เป็นเจ้าของ component เอง (`src/components/ui/`) แล้วแปลง class ของ shadcn เป็น token ของ BRT ตามตารางนี้ ทุกโปรเจกต์จะได้แปลงเหมือนกัน

สิ่งที่เป็นของกลาง: **token** (`@brt-innovation/design` — สี / ตัวอักษร / ระยะตาม Figma) และ **ตารางนี้**
สิ่งที่เป็นของโปรเจกต์: โค้ด component, variant, การ override

## ขั้นตอนในโปรเจกต์

1. ติดตั้ง `@brt-innovation/design` แล้วใส่ `tokens.css` + brand ของโปรเจกต์ (`project-setup.md`)
2. ดูโค้ดต้นฉบับของ component: `pnpm dlx shadcn@latest view <name>` (แสดงโค้ดโดยไม่เขียนไฟล์) หรือหน้า docs ของ shadcn/ui
3. วางลง `src/components/ui/<name>.tsx` แล้ว **แปลง class ทุกตัว** ตามตารางข้างล่าง — comment บนสุดของไฟล์บอกว่า port จาก shadcn/ui component ไหน
4. ตรวจว่าไม่เหลือชื่อของ shadcn (`bg-background`, `text-muted-foreground` …) และไม่มีค่าดิบ — ดูตัวอย่างสคริปต์ `check:tokens` ใน brt-landing-page

**ห้ามรัน `shadcn init` / `shadcn add`** — CLI จะเขียน CSS variable ของ shadcn (`--background`, `--primary` …) ลง `globals.css` และสร้าง component ที่ใช้ชื่อเหล่านั้น ซึ่งไม่มีในระบบนี้

## เขียน class แบบไหน

| แบบ                     | ตัวอย่าง                                                               | ใช้เมื่อ                                                            |
| ----------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| อ้าง CSS variable ตรง ๆ | `bg-(--brt-color-bg-primary)`, `text-(length:--brt-font-size-body-sm)` | ทำงานได้ทุกโปรเจกต์ ไม่ขึ้นกับ `@theme` — **แนะนำใน `ui/`**         |
| utility ของโปรเจกต์     | `bg-primary`, `text-body-sm`                                           | โปรเจกต์ที่ตั้ง `@theme` ชื่อตาม Figma แล้ว (เช่น brt-landing-page) |

ระวัง: ชื่อ utility ของโปรเจกต์ที่ตั้งตาม Figma **ความหมายไม่เหมือน shadcn** — `bg-primary` ของ shadcn คือสี brand แต่ของ BRT คือพื้นขาว อย่าคัดลอก class ของ shadcn ไปใช้โดยไม่แปลง

## สี

| shadcn                                                   | BRT token                                                                                                                              | หมายเหตุ                                                    |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `bg-background`                                          | `--brt-color-bg-primary`                                                                                                               | พื้นหลักของหน้า (ขาว)                                       |
| `text-foreground`                                        | `--brt-color-text-primary`                                                                                                             |                                                             |
| `bg-card`, `bg-popover`                                  | `--brt-color-bg-primary`                                                                                                               | popover ใส่ `shadow` จาก token เพิ่ม                        |
| `text-card-foreground`, `text-popover-foreground`        | `--brt-color-text-primary`                                                                                                             |                                                             |
| `bg-muted`                                               | `--brt-color-bg-secondary`                                                                                                             |                                                             |
| `text-muted-foreground`                                  | `--brt-color-text-tertiary`                                                                                                            | ข้อความรอง / คำอธิบาย                                       |
| `bg-accent` (hover ของรายการ, เมนู)                      | `--brt-color-bg-primary-hover`                                                                                                         |                                                             |
| `text-accent-foreground`                                 | `--brt-color-text-primary`                                                                                                             |                                                             |
| `bg-primary` / `hover:bg-primary/90` (ปุ่มหลัก)          | `--brt-color-button-primary-brand-bg` / `…-bg-hover`                                                                                   | ใช้ token ของ Figma Component/Button                        |
| `text-primary-foreground` (บนปุ่มหลัก)                   | `--brt-color-button-primary-brand-text`                                                                                                | บนพื้น brand อื่น ๆ ใช้ `--brt-color-text-white`            |
| `bg-primary` (พื้น brand ที่ไม่ใช่ปุ่ม)                  | `--brt-color-bg-brand` · อ่อน: `--brt-color-bg-brand-subtle`                                                                           |                                                             |
| `text-primary` (ข้อความสี brand, ลิงก์)                  | `--brt-color-text-brand`                                                                                                               |                                                             |
| `bg-secondary` / `text-secondary-foreground` (ปุ่มรอง)   | `--brt-color-button-secondary-neutral-bg` / `…-text` (+ `…-border`)                                                                    |                                                             |
| ปุ่ม `ghost`                                             | `--brt-color-button-tertiary-neutral-*` · `link` → `--brt-color-text-brand`                                                            |                                                             |
| `bg-destructive` (ปุ่มลบ)                                | `--brt-color-button-primary-error-bg` / `…-text`                                                                                       |                                                             |
| `text-destructive`                                       | `--brt-color-text-error`                                                                                                               | พื้นอ่อน: `--brt-color-bg-error-subtle`                     |
| `border`, `border-border`                                | `--brt-color-border-primary`                                                                                                           | เขียน `border border-(--brt-color-border-primary)` ทุกครั้ง |
| `border-input`                                           | `--brt-color-border-primary` · hover / focus: `--brt-color-border-brand`                                                               | ตาม Figma Component/Input                                   |
| `ring-ring`, `focus-visible:border-ring`                 | `--brt-color-border-brand` · วงอ่อน: `--brt-color-border-brand-subtle`                                                                 |                                                             |
| `placeholder:text-muted-foreground`                      | `--brt-color-text-placeholder`                                                                                                         |                                                             |
| `aria-invalid:border-destructive`, `ring-destructive/20` | `--brt-color-border-error` · `--brt-color-bg-error-subtle`                                                                             |                                                             |
| `disabled:opacity-50`                                    | `--brt-color-bg-disabled(-subtle)`, `--brt-color-text-disabled`, `--brt-color-border-disabled` · ปุ่ม: `--brt-color-button-disabled-*` | Figma ใช้สี disabled ไม่ใช่ความโปร่ง                        |
| `dark:*`                                                 | ตัดออก                                                                                                                                 | ยังไม่มีค่า dark จาก Figma                                  |

## ตัวอักษร / ระยะ / มุม

| shadcn                                          | BRT token                                                        | หมายเหตุ                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `text-xs` / `text-sm` / `text-base` / `text-lg` | `--brt-font-size-body-xs` / `-body-sm` / `-body-md` / `-body-lg` | ปุ่มใช้ `--brt-font-size-button-sm/md/lg`                                |
| `font-medium`, `font-semibold`                  | `--brt-font-weight-medium`, `--brt-font-weight-semibold`         | `font-(--brt-font-weight-medium)`                                        |
| ฟอนต์                                           | `--brt-font-sans`                                                | `font-(family-name:--brt-font-sans)`                                     |
| `h-8` / `h-9` / `h-10` (32 / 36 / 40px)         | `--brt-spacing-32` / `-36` / `-40`                               | **คิดเป็น px** — `h-9` ของ shadcn = 36px                                 |
| `px-3`, `px-4`, `gap-2` (12 / 16 / 8px)         | `--brt-spacing-12`, `-16`, `-8`                                  | ตัวเลข Tailwind × 4 = px แล้วเลือก Space ของ Figma ที่ตรง                |
| `rounded-md` (≈ 8px)                            | `--brt-radius-sm`                                                | radius ของ BRT เปลี่ยนตามจอเอง (desktop / mobile)                        |
| `rounded-lg`, `rounded-xl` (≈ 10–14px)          | `--brt-radius-md`                                                |                                                                          |
| `rounded-full`                                  | `--brt-radius-full`                                              |                                                                          |
| `shadow-xs`, `shadow-sm`                        | `--brt-shadow-sm`                                                | ขั้นใหญ่ขึ้น: `--brt-shadow-md` … `--brt-shadow-3xl` (Figma Drop Shadow) |

ไม่มีในตาราง → ดู token ทั้งหมดใน Storybook ของ design system หน้า **Tokens / Usage** ถ้าไม่มี token ที่ใช้ได้ **ถาม / เพิ่ม token ที่ design system** ห้ามใส่ค่าดิบ

## เพิ่ม / แก้ตารางนี้

- เมื่อโปรเจกต์ port component ใหม่แล้วเจอชื่อของ shadcn ที่ยังไม่มีในตาราง ให้เพิ่มแถวที่นี่ (PR เข้า brt-design-system) — โปรเจกต์ถัดไปจะได้แปลงเหมือนกัน
- เปลี่ยนชื่อ token = แก้ตารางนี้ใน PR เดียวกัน
