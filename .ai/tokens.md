# Design tokens (`@brt/design`)

## แหล่งความจริง

```
Figma (designer) ──แปลง──▶ packages/design/src/**/*.ts ──build──▶ adapter (bundle)
                            ▲ source of truth (commit ใน git)
```

- token เริ่มจาก Figma แต่ **ไฟล์ TS ใน `packages/design/src/` คือแหล่งความจริง** — เมื่อ Figma เปลี่ยน ให้แปลงแล้วแก้ไฟล์ TS ใน PR ไม่ใช่ sync อัตโนมัติ
- ถ้า Figma กับโค้ดไม่ตรงกัน ให้ยึดโค้ด แล้วแจ้ง designer ให้แก้ Figma
- รับค่าจาก Figma ได้ผ่าน Figma MCP (`get_variable_defs`) หรือไฟล์ export — ไฟล์ export ดิบไม่ต้อง commit
- Figma variable **collection/mode** ควรตรงกับโครงข้างล่าง: primitive 1 collection, brand = mode, light/dark = mode

## สามชั้น: primitive → brand → semantic

```
primitive   สีทุก palette (แต่ละ palette มี scale 50–950), ฟอนต์ทั้งหมด,
            spacing, radius, shadow, breakpoint, z-index
     │
brand       เลือกจาก primitive: palette ของ primary / secondary,
     │      (ไม่บังคับ) palette ของ success / warning / error / info, font family
     │      ดู brands.md
     ▼
semantic    resolve(brand, mode) → color.primary, color.primaryHover,
            color.bg.surface, color.text.muted, color.border.default, font.sans ...
```

- **primitive** เก็บทุกค่าที่มีได้ — ทุก brand หยิบจากชุดเดียวกัน
- **brand** แค่ _เลือก_ ไม่สร้างค่าใหม่ (ดู non-negotiable ข้อ 6)
- **semantic** คือกฎกลางว่า shade ไหนใช้กับอะไร เช่น light: `primary = palette[brand.primary][600]`, dark: `[400]` — กฎนี้เขียนครั้งเดียวใน `semantic/` ใช้กับทุก brand ไม่ต้องกำหนดใน brand
- token ที่ไม่ใช่สีและฟอนต์ (spacing, radius, shadow, breakpoint, z-index) **ใช้ร่วมทุก brand** ไม่ขึ้นกับ brand

## หมวดของ token

| หมวด         | ชั้น                         | ตัวอย่าง                                                                           |
| ------------ | ---------------------------- | ---------------------------------------------------------------------------------- |
| `color`      | primitive → brand → semantic | primary, secondary, success, warning, error, info, neutral, bg._, text._, border.* |
| `typography` | primitive → brand (family)   | fontFamily, fontSize, fontWeight, lineHeight                                       |
| `spacing`    | primitive (ร่วม)             | xs, sm, md, lg, xl                                                                 |
| `radius`     | primitive (ร่วม)             | sm, md, lg, full                                                                   |
| `shadow`     | primitive (ร่วม)             | sm, md, lg                                                                         |
| `breakpoint` | primitive (ร่วม)             | sm, md, lg, xl                                                                     |
| `zIndex`     | primitive (ร่วม)             | dropdown, sticky, modal, toast                                                     |

หมวดที่ยังไม่ได้ตัดสินใจ: motion/duration, opacity, border-width, focus ring — เพิ่มเมื่อมีผู้ใช้จริง

## Mode (light / dark)

- ตอนนี้ทำ **light** ก่อน แต่โครงต้องรองรับ dark ตั้งแต่แรก: `resolve(brand, mode)` รับ mode เสมอ และ semantic ทุกตัวต้องมีกฎของทั้งสอง mode (dark ใช้ค่าเดียวกับ light ไปก่อนได้)
- primitive ไม่มี mode — mode เปลี่ยนแค่การเลือก shade ในชั้น semantic

## Adapter ใช้ชั้นไหน

- adapter อ่าน **semantic** เท่านั้น
- ข้อยกเว้น: framework ที่ต้องการ palette scale ทั้งชุด (เช่น Mantine ต้องการ 10 shade) อ่าน palette ที่ brand เลือกได้ ผ่าน `resolve()` ไม่ใช่อ่าน `primitive/` ตรง

## Output (ใช้ภายใน adapter เท่านั้น)

| Output                 | ค่าข้างใน                                       | ใช้โดย                      |
| ---------------------- | ----------------------------------------------- | --------------------------- |
| `resolve(brand, mode)` | semantic token ค่าดิบ (`'#0052cc'`, `8`)        | `@brt/antd` (คำนวณเฉดสีเอง) |
| `tokens.css`           | `:root` + `[data-brand][data-mode]` → `--brt-*` | `@brt/tailwind`, `@brt/css` |
| `vars`                 | `'var(--brt-color-primary)'`                    | `@brt/css`                  |

## การตั้งชื่อ

- CSS variable: `--brt-<หมวด>-<ชื่อ>` kebab-case เช่น `--brt-color-text-muted`, `--brt-radius-md`
- TS key: camelCase ตามโครง object เช่น `color.text.muted`
- ชื่อ TS กับ CSS แปลงกันได้ตรง ๆ (generator สร้าง CSS จาก object)
- ค่าความยาวเก็บเป็น number (px) ใน TS เพราะ antd ต้องการ number แล้ว generator แปลงเป็น `px`/`rem` ใน CSS

## การเปลี่ยน token กับ semver (นับที่ adapter)

| การเปลี่ยน                                   | ระดับของ adapter ที่ได้รับผล              |
| -------------------------------------------- | ----------------------------------------- |
| เพิ่ม token / palette / brand                | minor                                     |
| เปลี่ยนค่า (เช่นสี primary ของ brand)        | minor — ระบุใน changeset ว่าหน้าตาเปลี่ยน |
| เปลี่ยนชื่อ / ลบ token ที่ adapter เปิดออกไป | major                                     |
