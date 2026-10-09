# BRT Design System — AI Agents Context

`brt-design-system` คือ monorepo ที่เก็บ design token ของทุก brand ไว้ที่เดียว แล้วส่งออกให้โปรเจกต์ผ่าน **adapter** — โปรเจกต์ไม่ใช้ token ตรง ๆ

| Package         | ประเภท            | หน้าที่                                                                                          | Publish                          |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------ | -------------------------------- |
| `@brt/design`   | Core (internal)   | primitive (สี/ฟอนต์ทั้งหมด), brand, semantic token — ไม่ผูกกับ framework ใด                      | ❌ private — bundle เข้า adapter |
| `@brt/antd`     | Component adapter | token → antd v6 `ThemeConfig`, `BrtConfigProvider`, component ของ BRT                            | ✅ public                        |
| `@brt/shadcn`   | Component adapter | shadcn/ui components (Radix + CVA) ที่ใช้ theme จาก `@brt/tailwind`                              | ✅ public                        |
| `@brt/tailwind` | Style adapter     | token → Tailwind v4 `@theme` + CSS variables                                                     | ✅ public                        |
| `@brt/css`      | Style adapter     | CSS variables + `vars` (TS) สำหรับ CSS framework อื่น (styled-components, Sass, CSS Modules ...) | ✅ public                        |

โปรเจกต์เลือก **component adapter 1 ตัว** (หรือไม่ใช้เลย) + **style adapter ตาม CSS framework ของตัวเอง** เช่น antd + Tailwind = `@brt/antd` + `@brt/tailwind`

## ขอบเขตของ design system

design system ดูแล **token (สี, ตัวอักษร, scale) และ component กลาง** เท่านั้น — adapter (`@brt/shadcn`, `@brt/antd` …) ถูกใช้แบบ **library** เหมือน antd

| อยู่ใน design system                        | ไม่อยู่ใน design system                                              |
| ------------------------------------------- | -------------------------------------------------------------------- |
| token ทุกตัว และค่าของทุก brand             | component ที่โปรเจกต์ custom เอง (เช่น Input ที่ดึง shadcn/ui ไปแก้) |
| component กลางที่หลายโปรเจกต์ใช้แบบเดียวกัน | section, layout และ component เฉพาะของโปรเจกต์ใดโปรเจกต์หนึ่ง        |
| การแก้บั๊กของ component กลาง                | การปรับหน้าตาให้ตรงกับ design ของโปรเจกต์เดียว                       |

- โปรเจกต์ **ทำ component ของตัวเองได้** ใน repo ของโปรเจกต์ (ห่อ adapter หรือ fork โค้ด shadcn/ui) โดยใช้ token จาก adapter — ไม่ต้องรอ design system
- อย่ารับ component เฉพาะโปรเจกต์เข้ามาที่นี่ — รับเมื่อ **มีโปรเจกต์มากกว่าหนึ่งต้องการแบบเดียวกัน** แล้วค่อยย้ายมาเป็น component กลาง
- token ไม่มีข้อยกเว้น — โปรเจกต์ห้ามสร้าง token ของตัวเอง สี/ค่าใหม่ต้องเพิ่มที่นี่

> ไฟล์นี้เป็นตัวชี้ทางเท่านั้น รายละเอียดแต่ละเรื่องอยู่ใน `.ai/` — **เปิดอ่านไฟล์ที่ตรงกับงานก่อนลงมือ ห้ามเดาจากความจำ**
> repo นี้อยู่ใน hub `brt-hub` (`design-system/brt-design-system`) แต่ใช้งานเดี่ยว ๆ ได้

## Stack โดยย่อ

| ชั้น            | เทคโนโลยี                                                               |
| --------------- | ----------------------------------------------------------------------- |
| Runtime         | **Node 24 LTS**, React 19                                               |
| Monorepo        | **pnpm workspaces** + Turborepo, bundle ด้วย tsup (ESM + CJS + `.d.ts`) |
| Component       | **Ant Design v6**, shadcn/ui (Radix UI, CVA, clsx + tailwind-merge)     |
| CSS             | **Tailwind CSS v4** (CSS-first, `@theme`) — ไม่รองรับ Tailwind v3       |
| Docs            | Storybook 10 แบบ Composition (`apps/docs*`)                             |
| Release         | Changesets (independent versioning) → npmjs ผ่าน GitHub Actions         |
| Package manager | **pnpm เท่านั้น** — ห้ามใช้ npm/yarn                                    |

## คำสั่งที่ใช้บ่อย

```bash
pnpm install        # ใช้ pnpm ตาม packageManager ใน package.json (corepack)
pnpm build          # turbo build ทุก package (@brt/design ก่อนเสมอ)
pnpm typecheck      # รวมการตรวจว่า adapter map token ครบ
pnpm test           # vitest — coverage ของ token ทุก brand × mode
pnpm storybook      # Storybook ทุกตัว → เปิด http://localhost:6006
pnpm format         # prettier (รวม prettier-plugin-tailwindcss)
pnpm changeset      # บันทึกการเปลี่ยนแปลงก่อนเปิด PR
```

`pnpm build`, `pnpm typecheck` และ `pnpm test` ต้องผ่านก่อนส่งงาน — test อยู่ใน `src/test/` ของแต่ละ package

## Non-negotiables

1. **`@brt/design` เป็น private และไม่มี dependency กับ framework ใด** — ห้าม import antd / Tailwind / React การแปลงให้เข้ากับ framework อยู่ใน adapter เท่านั้น
2. **adapter ใส่ `@brt/design` ไว้ใน `devDependencies` และ bundle เข้าไป** (tsup `noExternal`) — ถ้าใส่ใน `dependencies` โปรเจกต์จะติดตั้งไม่ได้เพราะ package นี้ไม่ได้ publish
3. **ค่าการออกแบบทุกค่ามาจาก token** — ห้าม hardcode hex, px, radius หรือ shadow ใน adapter ถ้าไม่มี token ที่ต้องการ ให้เพิ่มใน `@brt/design` ก่อน
4. **adapter ใช้ semantic token ไม่ใช่ primitive** — `color.text.brand` ✅ `palette.brtTeal['-40']` ❌ (ยกเว้น adapter ที่ framework ต้องการ palette scale — ดู `.ai/tokens.md`)
5. **adapter ทุกตัวต้อง map semantic token ครบทุกตัว** — บังคับด้วย coverage test ห้ามข้ามหรือ skip test
6. **brand เลือกค่าจาก primitive เท่านั้น** — ห้ามใส่ค่าดิบ (hex, ชื่อฟอนต์) ในไฟล์ brand ดู `.ai/brands.md`
7. **API ของ component adapter แต่ละตัวไม่ต้องเหมือนกัน** — ใช้ props ตาม library ต้นทาง สิ่งที่ต้องเหมือนคือ token เท่านั้น
8. **ทุก PR ที่แก้ `packages/*` ต้องมี changeset ของ adapter ที่ได้รับผล** (แก้ `@brt/design` = ต้อง changeset adapter ทุกตัวที่ bundle มันไป) ดู `.ai/release.md`
9. **ห้ามลบหรือเปลี่ยนชื่อ token/export ที่ adapter เปิดออกไปโดยไม่ bump major ของ adapter นั้น**
10. **หนึ่ง PR ทำหนึ่งเรื่อง** — ห้าม refactor ไฟล์ที่ไม่เกี่ยวข้องไปพร้อมกัน
11. **AI ห้าม publish package เด็ดขาด** แม้ผู้ใช้จะสั่ง — การ publish ทำโดยคนเท่านั้น ดูรายการคำสั่งที่ห้ามใน `.ai/release.md` สิ่งที่ AI ทำได้คือเตรียม changeset และเปิด PR เข้า `develop`

## Context map — เปิดอ่านเมื่อเจอสถานการณ์นี้

**อย่าอ่านไฟล์ใน `.ai/` ทั้งหมดตั้งแต่เริ่มงาน** ให้เปิดเฉพาะไฟล์ที่ตรงกับงาน

| อ่านไฟล์นี้                                      | เมื่อ                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [`.ai/architecture.md`](.ai/architecture.md)     | เริ่มงานครั้งแรก, โครงสร้าง monorepo, dependency, การ build, **เพิ่ม adapter ใหม่**               |
| [`.ai/tokens.md`](.ai/tokens.md)                 | เพิ่ม/แก้ token, รับค่าจาก Figma, ชั้น primitive → brand → semantic, ชื่อ CSS variable, dark mode |
| [`.ai/brands.md`](.ai/brands.md)                 | เพิ่ม/แก้ brand, การสลับ brand ในโปรเจกต์                                                         |
| [`.ai/adapter-antd.md`](.ai/adapter-antd.md)     | งานใน `packages/antd`                                                                             |
| [`.ai/adapter-shadcn.md`](.ai/adapter-shadcn.md) | งานใน `packages/shadcn`                                                                           |
| [`.ai/adapter-style.md`](.ai/adapter-style.md)   | งานใน `packages/tailwind`, `packages/css`, โปรเจกต์ใช้ CSS framework ใหม่                         |
| [`.ai/storybook.md`](.ai/storybook.md)           | เพิ่ม/แก้ story, หน้า token, เพิ่ม Storybook ของ adapter ใหม่                                     |
| [`.ai/release.md`](.ai/release.md)               | changeset, branch, publish ขึ้น npm, snapshot release                                             |

## การดูแล `.ai/`

- แต่ละไฟล์ใน `.ai/` ครอบคลุมเรื่องเดียว ถ้าเรื่องใหม่ไม่เข้ากับไฟล์ไหนเลย ให้สร้างไฟล์ใหม่ และเพิ่มแถวใน **Context map**
- เมื่อแก้โค้ดจนทำให้ข้อความใน `.ai/` ไม่ตรงกับความจริง ให้แก้ `.ai/` ใน PR เดียวกัน
- ตอนนี้ repo ยังไม่มีโค้ด เอกสารใน `.ai/` คือ **แผนที่ตกลงกันแล้ว** เมื่อลงมือทำจริงแล้วต่างจากแผน ให้แก้เอกสารตามโค้ด

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
