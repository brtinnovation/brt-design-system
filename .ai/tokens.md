# Design tokens (`@brt/design`)

## แหล่งความจริง

```
Figma (designer) ──แปลง──▶ packages/design/src/tokens/*.ts ──build──▶ dist/ (tokens.css, index.js, .d.ts)
                            ▲ source of truth (commit ใน git)
```

- token เริ่มต้นจาก Figma แต่ **ไฟล์ TS ใน `src/tokens/` คือแหล่งความจริง** — เมื่อ Figma เปลี่ยน ให้แปลงแล้วแก้ไฟล์ TS ใน PR ไม่ใช่ sync อัตโนมัติ
- ถ้า Figma กับโค้ดไม่ตรงกัน ให้ยึดโค้ด แล้วแจ้ง designer ให้แก้ Figma
- รับค่าจาก Figma ได้ผ่าน Figma MCP (`get_variable_defs`) หรือไฟล์ export ของ designer — ไฟล์ export ดิบไม่ต้อง commit

## หมวดของ token

| หมวด         | ตัวอย่าง key                                                    |
| ------------ | --------------------------------------------------------------- |
| `color`      | primary, secondary, success, warning, error, neutral (+ scale)  |
| `typography` | fontFamily, fontSize, fontWeight, lineHeight                    |
| `spacing`    | xs, sm, md, lg, xl                                              |
| `radius`     | sm, md, lg, full                                                |
| `shadow`     | sm, md, lg                                                      |
| `breakpoint` | sm, md, lg, xl                                                  |
| `zIndex`     | dropdown, sticky, modal, toast                                  |

หมวดที่ยังไม่ได้ตัดสินใจ: motion/duration, opacity, border-width, focus ring — เพิ่มเมื่อมีผู้ใช้จริง

## สองชั้น: primitive → semantic

```
primitive   color.blue.500 = '#0052cc'           ← ค่าดิบจาก palette (ใช้ภายใน @brt/design เท่านั้น)
semantic    color.primary  = color.blue.500      ← ความหมาย (adapter และโปรเจกต์ใช้ชั้นนี้)
            color.bg.surface, color.text.muted, color.border.default ...
```

- adapter และโปรเจกต์ปลายทาง **อ้างอิงได้เฉพาะ semantic token**
- dark mode (ถ้าทำ) = เปลี่ยนค่า semantic ชุดใหม่ ไม่ต้องแตะ adapter

## Output ของ package

| Output                        | ใช้โดย                                    | ตัวอย่าง                         |
| ----------------------------- | ----------------------------------------- | -------------------------------- |
| `@brt/design` (TS object)     | `@brt/antd`, โค้ด JS ที่ต้องการค่าตรง ๆ   | `tokens.color.primary`           |
| `@brt/design/tokens.css`      | `@brt/shadcn`, โปรเจกต์ที่เขียน UI เอง    | `var(--brt-color-primary)`       |

ไม่มี output เฉพาะของ antd หรือ Tailwind ใน package นี้ — mapping อยู่ใน adapter

## การตั้งชื่อ

- CSS variable: `--brt-<หมวด>-<ชื่อ>` แบบ kebab-case เช่น `--brt-color-text-muted`, `--brt-radius-md`, `--brt-spacing-sm`
- TS key: camelCase ตามโครง object เช่น `tokens.color.text.muted`
- ชื่อ TS กับชื่อ CSS ต้องแปลงกันได้ตรง ๆ (generator สร้าง CSS จาก object) ห้ามตั้งชื่อพิเศษเฉพาะจุด
- ค่าความยาวเก็บเป็น number (px) ใน TS เพราะ antd ต้องการ number แล้ว generator ค่อยแปลงเป็น `px`/`rem` ใน CSS

## การเปลี่ยน token กับ semver

| การเปลี่ยน                          | ระดับ |
| ----------------------------------- | ----- |
| เพิ่ม token ใหม่                     | minor |
| เปลี่ยนค่า (เช่นสี primary เข้มขึ้น) | minor — ระบุใน changeset ว่าหน้าตาเปลี่ยน |
| เปลี่ยนชื่อ / ลบ token              | major |
