# Architecture

## ภาพรวม

```text
                @brt-innovation/design   (npm public — primitive / semantic / defineBrand / tokens.css)
                 ▲ dependency                           ▲ ติดตั้งเอง
   @brt-innovation/antd (npm public)          โปรเจกต์ shadcn — port component จาก shadcn/ui เอง
   ThemeConfig ค่าดิบ ← resolve(brand)        src/components/ui/*.tsx แปลง class ตาม shadcn-mapping.md
                                              class อ้าง var(--brt-*) ← tokens.css
```

| ส่วน                     | ส่งให้โปรเจกต์แบบไหน                        | ใช้เมื่อ                                      |
| ------------------------ | ------------------------------------------- | --------------------------------------------- |
| `@brt-innovation/design` | npm package                                 | ทุกโปรเจกต์ (token)                           |
| `@brt-innovation/antd`   | npm package (มี design เป็น dependency)     | โปรเจกต์ใช้ Ant Design v6                     |
| `.ai/shadcn-mapping.md`  | เอกสาร — ตารางแปลง class ของ shadcn → token | โปรเจกต์ใช้ shadcn/ui (เช่น brt-landing-page) |

- **1 โปรเจกต์ใช้ component framework เดียว** ห้ามผสม antd กับ shadcn
- **antd = library, shadcn = โปรเจกต์เป็นเจ้าของ** — antd ถูกใช้ตามที่เป็นแล้วตั้ง theme ผ่าน provider ส่วน shadcn/ui ตั้งใจให้โปรเจกต์คัดลอกโค้ดไปเป็นของตัวเอง repo นี้จึงไม่มี component ของ shadcn — ความสม่ำเสมอระหว่างโปรเจกต์มาจาก token ชุดเดียวกันและตารางแปลงเดียวกัน
- `@brt-innovation/antd` **re-export token ทั้งหมด** ที่ subpath `/tokens` — แยกจาก entry หลักเพราะ entry หลักมี `'use client'` ซึ่ง Server Component ของ Next.js เรียกฟังก์ชันข้างในไม่ได้
- **ไม่มี style adapter** — การ map token เข้า Tailwind / CSS framework อื่นเป็นของโปรเจกต์ (`project-setup.md`) repo นี้ส่งแค่ CSS variables `--brt-*` และ `vars` (TS)
- **Design Guidelines** (วิธีใช้ token / component) อยู่ใน Storybook (`apps/docs*`) ดู `storybook.md`

## โครงสร้าง repo

```text
brt-design-system/
├── .changeset/
├── apps/                       # private ทั้งหมด — ดู storybook.md
│   ├── docs/                   # Storybook host :6006 — รวม design + antd ใน URL เดียว (Composition)
│   ├── docs-design/            # Storybook :6007 — สี, typography, scale, วิธีใช้ CSS variable
│   └── docs-antd/              # Storybook :6008 — @brt-innovation/antd
├── packages/
│   ├── design/                 # @brt-innovation/design
│   │   ├── scripts/build.ts    # → dist/tokens.css
│   │   └── src/
│   │       ├── primitive/      # สีทุก palette, alpha, ฟอนต์, spacing, radius, typography, shadow, breakpoint, z-index
│   │       ├── brands/         # defineBrand(), defaultBrand
│   │       ├── semantic/       # กฎ resolve(brand, mode, viewport) → semantic token
│   │       ├── css/            # generateTokensCss, generateBrandCss, cssVarName, vars
│   │       └── index.ts
│   └── antd/                   # @brt-innovation/antd    src/{theme,provider,components}/, src/tokens.ts (StatusTag)
├── Makefile                    # make help — check, pack, storybook-stop …
├── README.dev.md               # Publishing Guide (คนทำเท่านั้น)
├── eslint.config.mjs           # typescript-eslint + react-hooks + storybook
├── package.json
├── pnpm-workspace.yaml         # packages/* + apps/*
├── turbo.json
└── tsconfig.base.json
```

## Dependency ระหว่าง package

| Package                  | dependencies             | peerDependencies                        |
| ------------------------ | ------------------------ | --------------------------------------- |
| `@brt-innovation/design` | —                        | —                                       |
| `@brt-innovation/antd`   | `@brt-innovation/design` | `antd ^6`, `react ^19`, `react-dom ^19` |

- `@brt-innovation/design` เป็น **dependency จริง** ของ antd (`workspace:^` → `^x.y.z` ตอน publish) ไม่ bundle — tsup ตั้ง `external`
- antd, React เป็น **peer** เสมอ — ถ้า bundle เข้าไป โปรเจกต์จะมีสองสำเนาและ context/theme พัง
- `apps/*` ตั้ง `"private": true`

## Build

- `design`: tsup → ESM + CJS + `.d.ts` และ `scripts/build.ts` → `dist/tokens.css` (`exports["./tokens.css"]`)
- `antd`: tsup สอง entry — `index` (มี banner `'use client'`) และ `tokens` (ไม่มี) build ลง `dist` เดียวกันพร้อมกัน จึงล้าง `dist` ใน script (`rm -rf dist && tsup`) แทน `clean`
- `turbo run build` จัดลำดับให้เอง (`dependsOn: ["^build"]`) — design build ก่อนเสมอ
- ห้ามแก้ไฟล์ที่ generate (`tokens.css`) ด้วยมือ
- ตรวจก่อน release ด้วย `make pack` (pack ทุก package ลง `.pack/` และแสดงไฟล์ใน tarball) ว่า `dependencies` ได้เวอร์ชันจริง (ไม่มี `workspace:`) และมีแค่ `dist`

## เครื่องมือ (เวอร์ชันที่ต้องรู้)

- **TypeScript 6** (ไม่ใช่ 7) — TypeScript 7 เป็น compiler แบบ native ที่ tsup ใช้สร้าง `.d.ts` ไม่ได้ ย้ายเมื่อ tsup รองรับ
- `tsconfig.base.json` ตั้ง `ignoreDeprecations: "6.0"` เพราะ tsup ตั้ง `baseUrl` ภายใน
- **ESLint 9** (flat config `eslint.config.mjs`) — ตัวแปร / argument ที่ขึ้นต้นด้วย `_` = ตั้งใจไม่ใช้ · repo นี้ไม่ใช้ Tailwind แล้ว (Prettier ไม่มี plugin ของ Tailwind)
- **pnpm 10** (`packageManager` ใน `package.json`) — **ห้ามขยับเป็น pnpm 11+** จนกว่า corepack จะรองรับ: pnpm 11+ เปลี่ยนไฟล์รันเป็น `bin/pnpm.mjs` แต่ corepack (รวม 0.36) ยังเรียก `bin/pnpm.cjs` ทำให้ `pnpm` ใช้ไม่ได้บนเครื่องที่ใช้ corepack
- pnpm อนุญาต install script เฉพาะที่ระบุใน `onlyBuiltDependencies` ของ `pnpm-workspace.yaml` (esbuild, @parcel/watcher) — ถ้าเพิ่ม dependency ที่ต้องรัน script ให้เพิ่มที่นั่น

## Test

- test ทุกไฟล์ของ package อยู่ใน **`src/test/`** ของ package นั้น — ห้ามวาง `*.test.ts` ปนกับไฟล์โค้ด
- import โค้ดที่จะทดสอบด้วย relative path (`../theme`, `../semantic`)
- tsup build เฉพาะ entry (`src/index.ts`, `src/tokens.ts`) ไฟล์ใน `src/test/` จึงไม่ติดไปกับ package ที่ publish

## Coverage ของ token

- `antd`: mapping เป็น `Record<SemanticPath, ...>` (`packages/antd/src/theme/mapping.ts`) — เพิ่ม semantic token แล้วไม่ map = **typecheck ไม่ผ่าน** token ที่ antd ไม่มีที่รองรับให้ใส่ `null` พร้อมเหตุผล ห้ามลบ key
- test วนทั้ง `defaultBrand` และ brand ตัวอย่างที่ประกาศใน test เพื่อยืนยันว่าใช้กับ brand ที่โปรเจกต์ส่งมาได้

## เพิ่ม adapter ใหม่

**Component adapter** (เช่น Mantine) — ทำเมื่อมีโปรเจกต์จริงใช้ framework นั้น

1. library ที่ใช้ตามที่เป็น (เหมือน antd) → สร้าง `packages/<name>/` โครงเหมือน `antd` — `@brt-innovation/design` ใน `dependencies`, entry `tokens` re-export design · ถ้าเป็นแบบ copy โค้ด (เหมือน shadcn) → ไม่ทำ package ทำตารางแปลงแบบ `shadcn-mapping.md` แทน
2. รับ `Brand` จากโปรเจกต์ (ค่าเริ่มต้น `defaultBrand`) และ map semantic token ครบทุกตัว
3. สร้าง `apps/docs-<name>/` (port ถัดไป) + เพิ่มใน `refs` ของ `apps/docs` (ดู `storybook.md`)
4. เพิ่มแถวใน `AGENTS.md` + ไฟล์ `.ai/adapter-<name>.md` + changeset

**CSS framework ใหม่** — ไม่ต้องทำ package: โปรเจกต์อ้าง `--brt-*` เอง (ดู `project-setup.md`)
