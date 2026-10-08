# Architecture

## ภาพรวม

```
                 @brt/design  (tokens — framework-agnostic)
                ┌──────────┴──────────┐
          @brt/antd                @brt/shadcn
   (token → antd ThemeConfig)  (token → Tailwind v4 + Radix)
                │                      │
        Project A/B/C            Project X/Y/Z (เช่น brt-landing-page)
     (backoffice / ERP)          (customer-facing)

  Project ที่เขียน UI เอง → ใช้ @brt/design อย่างเดียว (CSS variables / TS object)
```

- **Design Tokens** = ค่าการออกแบบ (สี, ฟอนต์, spacing ฯลฯ) อยู่ใน `@brt/design`
- **Design Guidelines** = วิธีใช้ (เมื่อไหร่ใช้ primary, ระยะห่างระหว่าง section ฯลฯ) อยู่ใน `apps/docs` (Storybook)
- **Component** (Button, Select, DatePicker, Modal/Dialog) อยู่ใน adapter เท่านั้น ไม่อยู่ใน `@brt/design`

## โครงสร้าง repo

```text
brt-design-system/
├── .changeset/                 # changeset ที่รอ release + config.json
├── .github/workflows/
│   ├── ci.yml                  # lint, typecheck, test, build ทุก PR
│   └── release.yml             # version PR / publish ขึ้น npmjs (ดู release.md)
├── apps/
│   ├── docs/                   # Storybook — guidelines + ตัวอย่างทั้งสอง adapter (ไม่ publish)
│   └── showcase/               # app ทดสอบใช้งานจริงของทั้ง antd และ shadcn (ไม่ publish)
├── packages/
│   ├── design/                 # @brt/design
│   │   └── src/
│   │       ├── tokens/         # primitive + semantic tokens (source of truth, ดู tokens.md)
│   │       ├── css/            # generator → tokens.css
│   │       └── index.ts        # export `tokens` (typed object)
│   ├── antd/                   # @brt/antd
│   │   └── src/{theme,provider,components}/
│   └── shadcn/                 # @brt/shadcn
│       └── src/{components,lib,styles}/
├── package.json                # root scripts (turbo), packageManager
├── pnpm-workspace.yaml         # packages/* + apps/*
├── turbo.json
└── tsconfig.base.json
```

## Dependency ระหว่าง package

| Package       | dependencies                 | peerDependencies                                   |
| ------------- | ---------------------------- | -------------------------------------------------- |
| `@brt/design` | — (ไม่มี runtime dependency) | —                                                  |
| `@brt/antd`   | `@brt/design: workspace:^`   | `antd ^6`, `react ^19`, `react-dom ^19`            |
| `@brt/shadcn` | `@brt/design: workspace:^`, Radix, CVA, clsx, tailwind-merge | `react ^19`, `react-dom ^19`, `tailwindcss ^4` |

- antd, React และ Tailwind เป็น **peer** เสมอ — ถ้า bundle เข้าไป โปรเจกต์ปลายทางจะมีสองสำเนาและ context/theme พัง
- ใช้ `workspace:^` (ไม่ใช่ `workspace:*`) เพื่อให้ตอน publish ได้ range `^x.y.z` แทนเวอร์ชันตายตัว
- `apps/*` ตั้ง `"private": true` และอยู่ใน `ignore` ของ changeset

## Build

- ทุก package build ด้วย tsup ลง `dist/` ได้ ESM + CJS + `.d.ts` และประกาศ `exports` ใน `package.json` ให้ครบ (รวม subpath เช่น `@brt/design/tokens.css`)
- `turbo run build` จัดลำดับให้เอง (`dependsOn: ["^build"]`) — `@brt/design` build ก่อน adapter เสมอ
- `@brt/design` ต้อง build `tokens.css` จาก token TS ทุกครั้ง ห้ามแก้ไฟล์ที่ generate ด้วยมือ
