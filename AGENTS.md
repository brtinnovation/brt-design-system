# BRT Design System — AI Agents Context

`brt-design-system` คือ monorepo ที่เก็บ **design token จาก Figma** และ **component กลาง** ของ BRT แยก publish ขึ้น npmjs ได้ทีละ package

| Package                  | หน้าที่                                                                                                     | Publish   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | --------- |
| `@brt-innovation/design` | primitive (สี/ฟอนต์ทั้งหมด), กฎ semantic, `defineBrand()`, `defaultBrand`, CSS variables — ไม่ผูก framework | ✅ public |
| `@brt-innovation/antd`   | token → antd v6 `ThemeConfig`, `BrtConfigProvider`, component ของ BRT + re-export token (`/tokens`)         | ✅ public |

- โปรเจกต์เลือก component framework 1 แบบ: **antd** (`@brt-innovation/antd`) หรือ **shadcn** (`@brt-innovation/design` + component ที่โปรเจกต์ port จาก shadcn/ui เองตาม `.ai/shadcn-mapping.md`)
- **โปรเจกต์ที่เรียกใช้เป็นคน map brand เอง** (primary / secondary / ฟอนต์ ด้วย `defineBrand()`) — ไม่ map = ได้ `defaultBrand` (ค่า BRT จาก Figma) ดู `.ai/brands.md`
- **การตั้งค่า CSS framework (Tailwind ฯลฯ) เป็นของโปรเจกต์** — repo นี้ไม่มี package ที่ map token เข้า CSS framework ส่งให้แค่ CSS variables `--brt-*` ดู `.ai/project-setup.md`

## ขอบเขตของ design system

design system ดูแล **token (สี, ตัวอักษร, scale), component ของ antd และตารางแปลง shadcn → token** เท่านั้น — `@brt-innovation/antd` ใช้แบบ **library** ส่วน shadcn/ui **ไม่มี component กลาง**: แต่ละโปรเจกต์ port จาก shadcn/ui ต้นฉบับเองและเป็นเจ้าของโค้ดนั้น

| อยู่ใน design system                        | ไม่อยู่ใน design system                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| token ทุกตัว (primitive + กฎ semantic)      | component ที่โปรเจกต์ custom เอง (เช่น Input ที่ดึง shadcn/ui ไปแก้)               |
| component กลางที่หลายโปรเจกต์ใช้แบบเดียวกัน | section, layout และ component เฉพาะของโปรเจกต์ใดโปรเจกต์หนึ่ง                      |
| การแก้บั๊กของ component กลาง                | การปรับหน้าตาให้ตรงกับ design ของโปรเจกต์เดียว                                     |
| `defaultBrand` (ค่าเริ่มต้นจาก Figma)       | การ map brand ของโปรเจกต์ (`defineBrand()`) และการตั้งค่า Tailwind / CSS framework |

- โปรเจกต์ **ทำ component ของตัวเองได้** ใน repo ของโปรเจกต์ (ห่อ component ของ antd หรือ port shadcn/ui ตาม `.ai/shadcn-mapping.md`) โดยใช้ token จาก `@brt-innovation/design` — ไม่ต้องรอ design system
- **shadcn/ui: repo นี้ไม่รับ component** — มีแค่ `.ai/shadcn-mapping.md` (ชื่อ class ของ shadcn → token ของ BRT) โปรเจกต์ที่เจอชื่อของ shadcn ที่ยังไม่มีในตาราง ให้เพิ่มแถวที่นี่
- อย่ารับ component **เฉพาะโปรเจกต์** (section, การ์ดแบบเฉพาะ, ปุ่ม CTA ที่ห่อแล้ว) เข้ามาที่นี่ — รับเมื่อ **มีโปรเจกต์มากกว่าหนึ่งต้องการแบบเดียวกัน** แล้วค่อยย้ายมาเป็น component กลาง
- token ไม่มีข้อยกเว้น — โปรเจกต์ห้ามสร้าง token ของตัวเอง สี/ค่าใหม่ต้องเพิ่มที่นี่ (โปรเจกต์ **เลือก** palette ให้ brand ได้ แต่ห้ามใส่ hex)

> ไฟล์นี้เป็นตัวชี้ทางเท่านั้น รายละเอียดแต่ละเรื่องอยู่ใน `.ai/` — **เปิดอ่านไฟล์ที่ตรงกับงานก่อนลงมือ ห้ามเดาจากความจำ**
> repo นี้อยู่ใน hub `brt-hub` (`design-system/brt-design-system`) แต่ใช้งานเดี่ยว ๆ ได้

## Stack โดยย่อ

| ชั้น            | เทคโนโลยี                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Runtime         | **Node 24 LTS**, React 19                                                                           |
| Monorepo        | **pnpm workspaces** + Turborepo, bundle ด้วย tsup (ESM + CJS + `.d.ts`)                             |
| Component       | **Ant Design v6** (`@brt-innovation/antd`) — shadcn/ui ไม่มี component กลาง มีแค่ตารางแปลง          |
| CSS             | CSS variables `--brt-*` — การตั้ง Tailwind / CSS framework เป็นของโปรเจกต์                          |
| Docs            | Storybook 10 แบบ Composition (`apps/docs*`)                                                         |
| Release         | Changesets (independent versioning) → npmjs **publish ด้วยมือโดยคน** ตาม `README.dev.md` (ไม่มี CI) |
| Package manager | **pnpm เท่านั้น** — ห้ามใช้ npm/yarn                                                                |

## คำสั่งที่ใช้บ่อย

```bash
pnpm install        # ใช้ pnpm ตาม packageManager ใน package.json (corepack)
pnpm build          # turbo build ทุก package (design ก่อนเสมอ)
pnpm typecheck      # รวมการตรวจว่า antd map token ครบ
pnpm lint           # ESLint (typescript-eslint, react-hooks, storybook) — pnpm lint:fix แก้อัตโนมัติ
pnpm test           # vitest — token coverage ของทุก brand × mode × viewport
pnpm storybook      # Storybook (host + design + antd) → เปิด http://localhost:6006
pnpm format         # prettier
pnpm changeset      # บันทึกการเปลี่ยนแปลงก่อนเปิด PR
```

คำสั่งเดียวกันเรียกผ่าน `make` ได้ (`make help` ดูทั้งหมด — `make check` = ตรวจครบก่อนส่งงาน)

`make check` (build → typecheck → lint → test → format-check) ต้องผ่านก่อนส่งงาน ห้ามใช้ `eslint-disable` เว้นแต่ผู้ใช้สั่ง — test อยู่ใน `src/test/` ของแต่ละ package

## Non-negotiables

1. **`@brt-innovation/design` ไม่มี dependency กับ framework ใด** — ห้าม import antd / Tailwind / React การแปลงให้เข้ากับ framework อยู่ใน adapter เท่านั้น
2. **`@brt-innovation/antd` ใส่ `@brt-innovation/design` ใน `dependencies` (`workspace:^`) และไม่ bundle** (tsup `external`) — ทั้งสองแยก publish ได้ และโปรเจกต์ได้ design ชุดเดียวกับที่ adapter ใช้
3. **ค่าการออกแบบทุกค่ามาจาก token** — ห้าม hardcode hex, px, radius หรือ shadow ใน adapter ถ้าไม่มี token ที่ต้องการ ให้เพิ่มใน `@brt-innovation/design` ก่อน
4. **adapter ใช้ semantic token ไม่ใช่ primitive** — `color.text.brand` ✅ `palette.brtTeal['-40']` ❌ (ยกเว้น adapter ที่ framework ต้องการ palette scale — ดู `.ai/tokens.md`)
5. **component ต้องรองรับ brand ที่โปรเจกต์ส่งมา** — รับ `Brand` object (antd) หรืออ่าน `var(--brt-*)` ที่ brand override ได้ (CSS) ห้ามผูกกับ `defaultBrand` ตายตัว
6. **brand เลือกค่าจาก primitive เท่านั้น** — `defineBrand()` รับเฉพาะชื่อ palette / ฟอนต์ ห้ามใส่ค่าดิบ ดู `.ai/brands.md`
7. **API ของ component adapter แต่ละตัวไม่ต้องเหมือนกัน** — ใช้ props ตาม library ต้นทาง สิ่งที่ต้องเหมือนคือ token เท่านั้น
8. **ทุก PR ที่แก้ `packages/*` ต้องมี changeset** ของ package ที่แก้ — changesets bump adapter ให้เองเมื่อ design เปลี่ยน (`updateInternalDependencies`) ดู `.ai/release.md`
9. **ห้ามลบหรือเปลี่ยนชื่อ token / CSS variable / export โดยไม่ bump major** — โปรเจกต์อ้าง `--brt-*` และ `vars` ตรง ๆ
10. **หนึ่ง PR ทำหนึ่งเรื่อง** — ห้าม refactor ไฟล์ที่ไม่เกี่ยวข้องไปพร้อมกัน
11. **AI ห้าม publish package เด็ดขาด** แม้ผู้ใช้จะสั่ง — การ publish ทำโดยคนเท่านั้น ดูรายการคำสั่งที่ห้ามใน `.ai/release.md` สิ่งที่ AI ทำได้คือเตรียม changeset และเปิด PR เข้า `develop`

## Context map — เปิดอ่านเมื่อเจอสถานการณ์นี้

**อย่าอ่านไฟล์ใน `.ai/` ทั้งหมดตั้งแต่เริ่มงาน** ให้เปิดเฉพาะไฟล์ที่ตรงกับงาน

| อ่านไฟล์นี้                                      | เมื่อ                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [`.ai/architecture.md`](.ai/architecture.md)     | เริ่มงานครั้งแรก, โครงสร้าง monorepo, dependency, การ build, **เพิ่ม adapter ใหม่**               |
| [`.ai/tokens.md`](.ai/tokens.md)                 | เพิ่ม/แก้ token, รับค่าจาก Figma, ชั้น primitive → brand → semantic, ชื่อ CSS variable, dark mode |
| [`.ai/brands.md`](.ai/brands.md)                 | `defineBrand()`, `defaultBrand`, โปรเจกต์ map brand / สลับ brand                                  |
| [`.ai/adapter-antd.md`](.ai/adapter-antd.md)     | งานใน `packages/antd`                                                                             |
| [`.ai/shadcn-mapping.md`](.ai/shadcn-mapping.md) | โปรเจกต์ใช้ shadcn/ui — แปลงชื่อ class ของ shadcn เป็น token ของ BRT, เพิ่มแถวในตาราง             |
| [`.ai/project-setup.md`](.ai/project-setup.md)   | โปรเจกต์ติดตั้ง package, ตั้งค่า Tailwind / CSS framework กับ `--brt-*`                           |
| [`.ai/storybook.md`](.ai/storybook.md)           | เพิ่ม/แก้ story, หน้า token, เพิ่ม Storybook ของ adapter ใหม่                                     |
| [`.ai/release.md`](.ai/release.md)               | changeset, branch, ขั้นตอน publish ขึ้น npm (คนทำตาม `README.dev.md`), ข้อกำหนด `package.json`    |

## การดูแล `.ai/`

- แต่ละไฟล์ใน `.ai/` ครอบคลุมเรื่องเดียว ถ้าเรื่องใหม่ไม่เข้ากับไฟล์ไหนเลย ให้สร้างไฟล์ใหม่ และเพิ่มแถวใน **Context map**
- เมื่อแก้โค้ดจนทำให้ข้อความใน `.ai/` ไม่ตรงกับความจริง ให้แก้ `.ai/` ใน PR เดียวกัน

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
