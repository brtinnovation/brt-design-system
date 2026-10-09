# Design tokens (`@brt-innovation/design`)

## แหล่งความจริง

```
Figma (designer) ──แปลง──▶ packages/design/src/**/*.ts ──build──▶ @brt-innovation/design (npm) ──▶ antd / โปรเจกต์
                            ▲ source of truth (commit ใน git)
```

- token เริ่มจาก Figma แต่ **ไฟล์ TS ใน `packages/design/src/` คือแหล่งความจริง** — เมื่อ Figma เปลี่ยน ให้แปลงแล้วแก้ไฟล์ TS ใน PR ไม่ใช่ sync อัตโนมัติ
- ถ้า Figma กับโค้ดไม่ตรงกัน ให้ยึดโค้ด แล้วแจ้ง designer ให้แก้ Figma
- รับค่าจาก Figma ได้ผ่าน Figma MCP (`get_variable_defs`) หรือไฟล์ export — ไฟล์ export ดิบไม่ต้อง commit
- **Figma มี mapping เกินที่โค้ดใช้** (ทำไว้สำหรับงานใน Figma) — รับเฉพาะส่วนที่อยู่ในตาราง "รับจาก Figma" ข้างล่าง ห้ามคัดลอกทั้งไฟล์

### รับจาก Figma

| Figma collection                               | ใน `@brt-innovation/design`                            | สิ่งที่ตัดออก                                                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `01-primitive-color`                           | `primitive/color.ts` (`palette`, `alpha`, white/black) | Midnight Sky (ค่าซ้ำ Dusky Sky), `_Template`, ตัวเลขที่หลงมา                                                                                 |
| `02-alias`                                     | `brands/*.ts` (Brand/<name>, System, Neutral)          | กลุ่ม Utility, Template                                                                                                                      |
| `03-semantic`                                  | `semantic/` → `color.text/bg/border/button`            | Foreground / Icon (ซ้ำ Text), Quaternary–Senary, `*_darker`, ระดับ Light/Lighter/Dark/Darker, Component/Utility, Gradient, Input, Breadcrumb |
| `04-space`                                     | `primitive/scale.ts` (`spacing`)                       | —                                                                                                                                            |
| Effect styles (Drop Shadow) — ดึงผ่าน Dev Mode | `primitive/scale.ts` (`shadow`)                        | —                                                                                                                                            |
| `05-radius` Desktop/Mobile                     | `primitive/scale.ts` (`radius.desktop/mobile`)         | —                                                                                                                                            |
| `06-typography` Desktop/Mobile                 | `primitive/typography.ts`                              | Paragraph แยกตาม weight, Link / Label / Subtitle / Placeholder / Value List / All Caps (ชื่อซ้ำของ body)                                     |

ถ้างานต้องการสิ่งที่ตัดออกไป ให้เพิ่มกลับเป็น semantic token ทีละตัวเมื่อมีผู้ใช้จริง

## สามชั้น: primitive → brand → semantic

```
primitive   สีทุก palette (scale แบบ Figma: -90 เข้มสุด … 00 สีหลัก … +90 อ่อนสุด),
            alpha, ฟอนต์ทั้งหมด, spacing, radius, shadow, breakpoint, z-index
     │
brand       เลือกจาก primitive: palette ของ primary / secondary / tertiary,
     │      (ไม่บังคับ) success / warning / error / info / neutral, font family
     │      ดู brands.md
     ▼
semantic    resolve(brand, mode, viewport) → color.text.primary, color.bg.secondary,
            color.border.brand, color.button.primary.brand.bg, fontSize.h1, font.sans ...
```

- **primitive** เก็บทุกค่าที่มีได้ — ทุก brand หยิบจากชุดเดียวกัน
- **brand** แค่ _เลือก_ ไม่สร้างค่าใหม่ (ดู non-negotiable ข้อ 6)
- **semantic** คือกฎกลางว่าขั้นไหนใช้กับอะไร เช่น `text.brand = palette[brand.primary]['-40']`, `bg.secondary = palette[brand.neutral]['+95']` — กฎนี้เขียนครั้งเดียวใน `semantic/` (ตาม `03-semantic` ของ Figma) ใช้กับทุก brand ไม่ต้องกำหนดใน brand
- scale ของ Figma **กลับทิศกับ Tailwind**: `-` = เข้มกว่าสีหลัก, `+` = อ่อนกว่า ชื่อขั้นกลาง Figma เขียน `xx-00` ในโค้ดใช้ `'00'`
- token ที่ไม่ใช่สีและฟอนต์ (spacing, radius, shadow, breakpoint, z-index) **ใช้ร่วมทุก brand** ไม่ขึ้นกับ brand

## หมวดของ token

| หมวด                     | ชั้น                                                                                  | ตัวอย่าง                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `color.text`             | semantic                                                                              | primary, secondary, tertiary, placeholder, disabled, white, brand, brandSecondary, success … info (+ `*Hover`) |
| `color.bg`               | semantic                                                                              | primary, secondary, tertiary, solid, disabled, brand, brandSubtle, success / successSubtle …                   |
| `color.border`           | semantic                                                                              | primary, secondary, tertiary, disabled, white, brand, brandSubtle, success … info                              |
| `color.button`           | semantic (Figma Component/Button)                                                     | `{primary,secondary,tertiary}.{brand,neutral,error}.{bg,text,border}{,Hover}`, `disabled.*`                    |
| `font`, `fontWeight`     | primitive → brand (family)                                                            | sans (Kanit), light … bold                                                                                     |
| `fontSize`, `lineHeight` | primitive (ร่วม) · **desktop/mobile**                                                 | display1–6, h1–h6, pageTitle, bodyLg–Xs, buttonLg–Sm, errorMessage · 2xs … 13xl (px)                           |
| `letterSpacing`          | primitive (ร่วม)                                                                      | none, wide                                                                                                     |
| `spacing`                | primitive (ร่วม)                                                                      | 0, 2, 4, 6, 8, 12 … 64 (ชื่อคือ px ตาม Figma)                                                                  |
| `radius`                 | primitive (ร่วม) · **desktop/mobile**                                                 | none, xs, sm, md, lg, xl, full                                                                                 |
| `shadow`                 | primitive (ร่วม) — Figma **Effect styles** (ไม่ใช่ Variables จึงไม่อยู่ในไฟล์ export) | sm, md, lg, xl, 2xl, 3xl — สีอ้าง `gray -60` / `black` + ความทึบ                                               |
| `breakpoint`             | primitive (ร่วม) — ตามค่าเริ่มต้นของ Tailwind v4 (Figma ไม่มี)                        | sm 640, md 768, lg 1024, xl 1280, 2xl 1536                                                                     |
| `zIndex`                 | primitive (ร่วม) — ตาม scale ของ Tailwind (Figma ไม่มี)                               | 0, 10, 20, 30, 40, 50                                                                                          |

หมวดที่ยังไม่ได้ตัดสินใจ: motion/duration, opacity, border-width, focus ring — เพิ่มเมื่อมีผู้ใช้จริง

## Mode (light / dark)

- Figma มีแค่ **light** — `modes = ['light']` แต่ type `Mode` มี `'dark'` และ `resolve(brand, mode)` รับ mode เสมอ ตอนนี้ `'dark'` ใช้กฎของ light
- เมื่อได้ค่า dark: เพิ่มกฎใน `semantic/` แล้วเพิ่ม `'dark'` ใน `modes` — generator, test และ toolbar ของ Storybook จะครอบคลุมเอง
- primitive ไม่มี mode — mode เปลี่ยนแค่การเลือกขั้นในชั้น semantic

## Viewport (desktop / mobile)

- Figma มี mode Desktop / Mobile สำหรับ **typography และ radius** — `resolve(brand, mode, viewport)` (ค่าเริ่มต้น `'mobile'`)
- `tokens.css` เป็น mobile-first: `:root` = ค่า mobile แล้ว `@media (min-width: breakpoint[desktopBreakpoint])` override เฉพาะตัวที่ต่างกัน — `desktopBreakpoint` ตอนนี้คือ `md` (768px) **ยังต้องยืนยันกับ designer**
- adapter ที่อ่านค่าดิบ (`@brt-innovation/antd`) เลือก viewport เอง — antd ใช้ `'desktop'`

## Adapter ใช้ชั้นไหน

- adapter อ่าน **semantic** เท่านั้น และรับ `Brand` จากโปรเจกต์ (ค่าเริ่มต้น `defaultBrand`)
- ข้อยกเว้น: framework ที่ต้องการ palette scale ทั้งชุด (เช่น Mantine ต้องการ 10 shade) อ่าน palette ที่ brand เลือกได้ ผ่าน `resolve()` ไม่ใช่อ่าน `primitive/` ตรง

## Output (API สาธารณะของ `@brt-innovation/design`)

| Output                           | ค่าข้างใน                                                                | ใช้โดย                                   |
| -------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------- |
| `resolve(brand, mode, viewport)` | semantic token ค่าดิบ (`'#047B7B'`, `8`) — ไม่ส่ง brand = `defaultBrand` | `@brt-innovation/antd` (คำนวณเฉดสีเอง)   |
| `tokens.css`                     | `:root` (ค่าของ `defaultBrand`) + `@media` desktop → `--brt-*`           | CSS / component ของโปรเจกต์              |
| `generateBrandCss(brand)`        | `:root[data-brand='<name>']` override สี / ฟอนต์ของ brand                | โปรเจกต์ที่ map brand เอง                |
| `vars`                           | `'var(--brt-color-text-primary)'`                                        | CSS-in-JS ของโปรเจกต์                    |
| `primitive`, `resolvePalette()`  | palette ทั้งชุด                                                          | framework ที่ต้องการ scale (Mantine ฯลฯ) |

ทุกอย่างเป็น **API สาธารณะ** (package public) — เปลี่ยนชื่อ / ลบ = major (ตารางท้ายไฟล์)

## การตั้งชื่อ

- **ชื่อตาม Figma** — `text.primary`, `bg.secondary`, `border.brand` (ไม่ใช้ชื่อแบบ shadcn เช่น `foreground`, `muted`) adapter แปลงเป็นชื่อของ framework เอง
- CSS variable: `--brt-<หมวด>-<ชื่อ>` kebab-case เช่น `--brt-color-text-secondary`, `--brt-radius-md` — prefix `--brt-` กันชื่อชนกับตัวแปรของ Tailwind (`--radius-md`, `--font-sans` …)
- TS key: camelCase ตามโครง object เช่น `color.text.secondary`
- ชื่อ TS กับ CSS แปลงกันได้ตรง ๆ (generator สร้าง CSS จาก object)
- ค่าความยาวเก็บเป็น number (px) ใน TS เพราะ antd ต้องการ number แล้ว generator แปลงเป็น `px` ใน CSS

## การเปลี่ยน token กับ semver

| การเปลี่ยน                                   | ระดับ (design + adapter ที่ได้รับผล)      |
| -------------------------------------------- | ----------------------------------------- |
| เพิ่ม token / palette                        | minor                                     |
| เปลี่ยนค่า (เช่นกฎ semantic, defaultBrand)   | minor — ระบุใน changeset ว่าหน้าตาเปลี่ยน |
| เปลี่ยนชื่อ / ลบ token, CSS variable, export | major                                     |
