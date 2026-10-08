# Architecture

## ภาพรวม

adapter แบ่งเป็น **2 แกน** ที่ติดตั้งแยกกันได้ และรับ token จาก `@brt/design` ชุดเดียวกัน

```
                         @brt/design  (private — primitive / brands / semantic)
          ┌──────────────────┬───────┴──────────┬──────────────────┐
   Component adapter                     Style adapter
   @brt/antd                             @brt/tailwind   (Tailwind v4)
   @brt/shadcn ───── ใช้ theme จาก ────▶  @brt/css        (CSS framework อื่น)
```

| แกน       | หน้าที่                                         | โปรเจกต์ใช้กับ                                 |
| --------- | ----------------------------------------------- | ---------------------------------------------- |
| Component | component สำเร็จรูปที่ใช้ token ของ brand       | ทุกอย่างที่เป็น component (Button, Select ...) |
| Style     | token ในรูปที่ CSS framework ของโปรเจกต์อ่านได้ | ส่วนที่โปรเจกต์เขียนเอง (layout, section)      |

ตัวอย่าง:

| โปรเจกต์                       | ติดตั้ง                                               |
| ------------------------------ | ----------------------------------------------------- |
| antd + Tailwind                | `@brt/antd` + `@brt/tailwind`                         |
| antd + styled-components       | `@brt/antd` + `@brt/css`                              |
| shadcn (เช่น brt-landing-page) | `@brt/shadcn` (ได้ `@brt/tailwind` มาเป็น dependency) |

- **1 โปรเจกต์ใช้ component framework เดียว** ห้ามผสม antd กับ shadcn
- **ไม่มีขั้นตอนประกอบในโปรเจกต์** — antd กับ Tailwind ไม่ได้ส่งค่าให้กัน แต่ได้สีเดียวกันเพราะ build จาก token ชุดเดียว โปรเจกต์ตั้ง brand ที่เดียว (ดู `brands.md`)
- **Design Guidelines** (วิธีใช้ token / component) อยู่ใน Storybook (`apps/docs*`) ดู `storybook.md`

## โครงสร้าง repo

```text
brt-design-system/
├── .changeset/
├── .github/workflows/
│   ├── ci.yml                  # lint, typecheck, test (รวม token coverage), build ทุก PR
│   └── release.yml             # version PR / publish ขึ้น npmjs (ดู release.md)
├── apps/                       # private ทั้งหมด — ดู storybook.md
│   ├── docs/                   # Storybook host :6006 — รวมทุก package ใน URL เดียว (Composition)
│   ├── docs-design/            # Storybook :6007 — สี, typography, scale, ตาราง Tailwind/CSS
│   ├── docs-antd/              # Storybook :6008 — @brt/antd
│   ├── docs-shadcn/            # Storybook :6009 — @brt/shadcn
│   └── showcase/               # (ยังไม่ได้สร้าง) app ทดสอบติดตั้งแบบโปรเจกต์จริง แยกตามชุด adapter
├── packages/
│   ├── design/                 # @brt/design (private)
│   │   └── src/
│   │       ├── primitive/      # สีทุก palette, ฟอนต์ทั้งหมด, spacing, radius, shadow, breakpoint, z-index
│   │       ├── brands/         # brt.ts, ... — เลือกค่าจาก primitive
│   │       ├── semantic/       # กฎ resolve(brand, mode) → semantic token
│   │       ├── css/            # generator → tokens.css
│   │       └── index.ts
│   ├── antd/                   # @brt/antd      src/{theme,provider,components}/
│   ├── shadcn/                 # @brt/shadcn    src/{components,lib,styles}/
│   ├── tailwind/               # @brt/tailwind  src/theme.css (+ tokens.css ที่ generate)
│   └── css/                    # @brt/css       tokens.css + vars + types
├── package.json
├── pnpm-workspace.yaml         # packages/* + apps/*
├── turbo.json
└── tsconfig.base.json
```

## Dependency ระหว่าง package

| Package         | dependencies                                      | devDependencies (bundle เข้าไป) | peerDependencies                               |
| --------------- | ------------------------------------------------- | ------------------------------- | ---------------------------------------------- |
| `@brt/design`   | —                                                 | —                               | —                                              |
| `@brt/antd`     | —                                                 | `@brt/design`                   | `antd ^6`, `react ^19`, `react-dom ^19`        |
| `@brt/tailwind` | —                                                 | `@brt/design`                   | `tailwindcss ^4`                               |
| `@brt/shadcn`   | `@brt/tailwind`, Radix, CVA, clsx, tailwind-merge | —                               | `react ^19`, `react-dom ^19`, `tailwindcss ^4` |
| `@brt/css`      | —                                                 | `@brt/design`                   | —                                              |

- antd, React, Tailwind เป็น **peer** เสมอ — ถ้า bundle เข้าไป โปรเจกต์จะมีสองสำเนาและ context/theme พัง
- `@brt/shadcn` ไม่ bundle token เอง แต่ใช้ `@brt/tailwind` เป็น dependency จริง (`workspace:^`) เพื่อให้ theme มีแหล่งเดียว
- `apps/*` และ `@brt/design` ตั้ง `"private": true`

## Build

- `@brt/design` build ด้วย tsup → `dist/index.js` + `dist/index.d.ts` และ `scripts/build.ts` → `dist/tokens.css` (ไม่ publish แต่ adapter ต้องใช้ `dist/`)
- adapter ที่เป็น JS (`antd`, `css`, `shadcn`) build ด้วย tsup → ESM + CJS + `.d.ts` ประกาศ `exports` ให้ครบรวม subpath ของ CSS
- `@brt/tailwind` ไม่มี JS — `scripts/build.ts` generate `dist/theme.css` จาก mapping ใน `src/mapping.ts`
- adapter bundle `@brt/design` ด้วย `noExternal` + `dts.resolve` — **`@brt/design` ต้องชี้ `types` ไปที่ `dist/index.d.ts`** ถ้าชี้ไปที่ `.ts` ต้นฉบับ `.d.ts` ของ adapter จะอ้างไฟล์ที่ไม่มีอยู่ ตรวจหลังเปลี่ยน build config ว่า `dist/*.d.ts` ของ adapter ไม่มี import จาก `@brt/design` หรือ path ภายใน
- `turbo run build` จัดลำดับให้เอง (`dependsOn: ["^build"]`) — `@brt/design` build ก่อนเสมอ
- CSS ที่ generate จาก token (`tokens.css`) ถูก copy เข้า `dist/` ของ style adapter ตอน build ห้ามแก้ไฟล์ที่ generate ด้วยมือ

## เครื่องมือ (เวอร์ชันที่ต้องรู้)

- **TypeScript 6** (ไม่ใช่ 7) — TypeScript 7 เป็น compiler แบบ native ที่ tsup ใช้สร้าง `.d.ts` ไม่ได้ ย้ายเมื่อ tsup รองรับ
- `tsconfig.base.json` ตั้ง `ignoreDeprecations: "6.0"` เพราะ tsup ตั้ง `baseUrl` ภายใน
- **pnpm 10** (`packageManager` ใน `package.json`) — **ห้ามขยับเป็น pnpm 11+** จนกว่า corepack จะรองรับ: pnpm 11+ เปลี่ยนไฟล์รันเป็น `bin/pnpm.mjs` แต่ corepack (รวม 0.36) ยังเรียก `bin/pnpm.cjs` ทำให้ `pnpm` ใช้ไม่ได้บนเครื่องที่ใช้ corepack
- pnpm อนุญาต install script เฉพาะที่ระบุใน `onlyBuiltDependencies` ของ `pnpm-workspace.yaml` (esbuild, @parcel/watcher) — ถ้าเพิ่ม dependency ที่ต้องรัน script ให้เพิ่มที่นั่น

## Test

- test ทุกไฟล์ของ package อยู่ใน **`src/test/`** ของ package นั้น (`packages/<name>/src/test/*.test.ts`) — ห้ามวาง `*.test.ts` ปนกับไฟล์โค้ด
- import โค้ดที่จะทดสอบด้วย relative path (`../theme`, `../components/button`)
- tsup build เฉพาะ `src/index.ts` ไฟล์ใน `src/test/` จึงไม่ติดไปกับ package ที่ publish

## Coverage ของ token

adapter ทุกตัวมี mapping เป็น `Record<SemanticPath, ...>` (`packages/antd/src/theme/mapping.ts`, `packages/tailwind/src/mapping.ts`)
เพิ่ม semantic token ใน `@brt/design` แล้วไม่ map = **typecheck ไม่ผ่าน** และ test วนทุก brand × mode ตรวจซ้ำอีกชั้น
token ที่ framework ไม่มีที่รองรับให้ใส่ `null` พร้อมเหตุผล ห้ามลบ key ออก

## เพิ่ม adapter ใหม่

**Component adapter** (เช่น Mantine) — ทำเมื่อมีโปรเจกต์จริงใช้ framework นั้น

1. สร้าง `packages/<name>/` โครง `src/{theme,provider,components}/` เหมือน `antd`
2. map semantic token ครบทุกตัวใน `theme/` จนผ่าน coverage test
3. provider รับ `brand` + `mode` และใส่ `data-brand` / `data-mode` ที่ root (ดู `brands.md`)
4. สร้าง `apps/docs-<name>/` (port ถัดไป) + เพิ่มใน `refs` ของ `apps/docs` (ดู `storybook.md`) + หน้าทดสอบใน `apps/showcase`
5. เพิ่มแถวใน `AGENTS.md` + ไฟล์ `.ai/adapter-<name>.md` + changeset

**Style adapter** — ดูวิธีตัดสินใจใน `adapter-style.md` (ส่วนใหญ่ใช้ `@brt/css` ได้ ไม่ต้องทำใหม่)
