# BRT Design System — AI Agents Context

`brt-design-system` คือ monorepo ที่ผลิต **3 npm packages** จาก design token ชุดเดียว:

| Package       | หน้าที่                                                                       | ผู้ใช้                                       |
| ------------- | ----------------------------------------------------------------------------- | -------------------------------------------- |
| `@brt/design` | Design tokens (single source of truth) — ไม่ผูกกับ UI framework ใด             | ทุกโปรเจกต์ รวมถึงโปรเจกต์ที่เขียน UI เอง   |
| `@brt/antd`   | Adapter: token → antd `ThemeConfig`, `BrtConfigProvider`, component ของ BRT   | Backoffice / Enterprise (Project A/B/C)      |
| `@brt/shadcn` | Adapter: token → Tailwind v4 + shadcn/ui components (Radix + CVA) แบบ bundle | Customer-facing / Landing (Project X/Y/Z)    |

> ไฟล์นี้เป็นตัวชี้ทางเท่านั้น รายละเอียดแต่ละเรื่องอยู่ใน `.ai/` — **เปิดอ่านไฟล์ที่ตรงกับงานก่อนลงมือ ห้ามเดาจากความจำ**
> repo นี้อยู่ใน hub `brt-hub` (`design-system/brt-design-system`) แต่ใช้งานเดี่ยว ๆ ได้

## Stack โดยย่อ

| ชั้น            | เทคโนโลยี                                                                    |
| --------------- | ---------------------------------------------------------------------------- |
| Runtime         | **Node 24 LTS**, React 19                                                    |
| Monorepo        | **pnpm workspaces** + Turborepo, bundle ด้วย tsup (ESM + CJS + `.d.ts`)       |
| Adapter antd    | **Ant Design v6** (peer dependency)                                          |
| Adapter shadcn  | **Tailwind CSS v4** (CSS-first, `@theme`), Radix UI, CVA, clsx + tailwind-merge |
| Docs            | Storybook (`apps/docs`)                                                      |
| Release         | Changesets (independent versioning) → npmjs ผ่าน GitHub Actions             |
| Package manager | **pnpm เท่านั้น** — ห้ามใช้ npm/yarn                                          |

## Non-negotiables

1. **`@brt/design` ห้าม import หรือรู้จัก antd / Tailwind / React** — การแปลง token ให้เข้ากับ framework อยู่ใน adapter เท่านั้น ดู `.ai/architecture.md`
2. **ค่าการออกแบบทุกค่ามาจาก token** — ห้าม hardcode hex, px, radius หรือ shadow ใน adapter ถ้าไม่มี token ที่ต้องการ ให้เพิ่มใน `@brt/design` ก่อน ดู `.ai/tokens.md`
3. **Adapter ใช้ semantic token ไม่ใช่ primitive** — `color.primary` / `color.bg.surface` ✅ แต่ `color.blue.500` ❌ ไม่อย่างนั้น antd กับ shadcn จะค่อย ๆ หน้าตาเพี้ยนจากกัน
4. **API ของ `@brt/antd` กับ `@brt/shadcn` ไม่ต้องเหมือนกัน** — ใช้ props ตาม library ต้นทาง (antd `type="primary"`, shadcn `variant="default"`) สิ่งที่ต้องเหมือนคือ token เท่านั้น ห้ามสร้าง abstraction เพื่อรวม API สองฝั่ง
5. **ทุก PR ที่แก้โค้ดใน `packages/*` ต้องมี changeset** (`pnpm changeset`) ดู `.ai/release.md`
6. **ห้ามเปลี่ยนชื่อหรือลบ token หรือ export โดยไม่ bump major** — โปรเจกต์ปลายทางพังทันที
7. **หนึ่ง PR ทำหนึ่งเรื่อง** — ห้าม refactor ไฟล์ที่ไม่เกี่ยวข้องไปพร้อมกัน

## Context map — เปิดอ่านเมื่อเจอสถานการณ์นี้

**อย่าอ่านไฟล์ใน `.ai/` ทั้งหมดตั้งแต่เริ่มงาน** ให้เปิดเฉพาะไฟล์ที่ตรงกับงาน

| อ่านไฟล์นี้                                        | เมื่อ                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`.ai/architecture.md`](.ai/architecture.md)       | เริ่มงานครั้งแรก, โครงสร้าง monorepo, dependency ระหว่าง package, การ build  |
| [`.ai/tokens.md`](.ai/tokens.md)                   | เพิ่ม/แก้ token, รับ token จาก Figma, ชื่อ CSS variable, output ของ `@brt/design` |
| [`.ai/adapter-antd.md`](.ai/adapter-antd.md)       | งานใน `packages/antd` — theme, `BrtConfigProvider`, locale ไทย, component BRT |
| [`.ai/adapter-shadcn.md`](.ai/adapter-shadcn.md)   | งานใน `packages/shadcn` — Tailwind v4 theme, เพิ่ม component, การส่ง CSS     |
| [`.ai/release.md`](.ai/release.md)                 | changeset, branch, publish ขึ้น npm, snapshot release สำหรับทดสอบ            |

## การดูแล `.ai/`

- แต่ละไฟล์ใน `.ai/` ครอบคลุมเรื่องเดียว ถ้าเรื่องใหม่ไม่เข้ากับไฟล์ไหนเลย ให้สร้างไฟล์ใหม่ และเพิ่มแถวใน **Context map**
- เมื่อแก้โค้ดจนทำให้ข้อความใน `.ai/` ไม่ตรงกับความจริง ให้แก้ `.ai/` ใน PR เดียวกัน
- ตอนนี้ repo ยังไม่มีโค้ด เอกสารใน `.ai/` คือ **แผนที่ตกลงกันแล้ว** เมื่อลงมือทำจริงแล้วต่างจากแผน ให้แก้เอกสารตามโค้ด
