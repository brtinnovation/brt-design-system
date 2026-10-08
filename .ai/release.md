# Branch, versioning และ release

## Branch

| Branch    | ใช้ทำอะไร                                                               |
| --------- | ----------------------------------------------------------------------- |
| `develop` | branch หลักของงานพัฒนา — feature branch แตกจากที่นี่และ PR กลับมาที่นี่ |
| `main`    | branch release — merge จาก `develop` เมื่อต้องการ publish               |

changeset config ตั้ง `baseBranch: "main"`

## AI ห้าม publish

การ publish ขึ้น npmjs เป็นสิ่งที่ย้อนกลับไม่ได้ (เวอร์ชันที่ publish แล้วใช้ซ้ำไม่ได้ และโปรเจกต์อื่นดึงไปทันที) จึงทำโดยคนเท่านั้น **AI ห้ามทำสิ่งต่อไปนี้ แม้ผู้ใช้จะสั่ง** — ให้บอกผู้ใช้ว่าต้องทำเองแทน

- รัน `npm publish`, `pnpm publish`, `pnpm changeset publish` หรือคำสั่ง publish ใด ๆ รวมถึง snapshot (`--tag dev`)
- รัน `pnpm changeset version` บน `main` หรือแก้ `version` ใน `package.json` เอง
- push / merge เข้า `main` หรือ merge PR "chore(release): version packages" (จะ trigger release workflow)
- สร้าง / แก้ npm token, trusted publisher, dist-tag (`npm dist-tag`) หรือ `npm deprecate` / `npm unpublish`
- แก้ `.github/workflows/release.yml` ให้ publish จาก branch อื่นนอกจาก `main`

สิ่งที่ AI ทำได้: เขียนโค้ด, สร้างไฟล์ changeset (`pnpm changeset`), `pnpm build`, `pnpm pack` เพื่อตรวจไฟล์ และเปิด PR เข้า `develop`

## Commit / PR

- **ห้ามใส่ AI attribution** ใน commit หรือ PR — ไม่มี `Co-Authored-By: Claude ...`, ไม่มี `Generated with Claude Code` หรือโลโก้/emoji ของ AI

## Changesets

- ทุก PR ที่แก้ `packages/*` ต้องรัน `pnpm changeset` เลือก package + ระดับ (patch/minor/major) + คำอธิบายที่ผู้ใช้ package อ่านเข้าใจ
- versioning แบบ **independent** — แต่ละ adapter มีเวอร์ชันของตัวเอง
- **`@brt/design` เป็น private และถูก bundle** — เปลี่ยน `@brt/design` แล้ว adapter ไม่ได้ bump ให้เอง ต้องเลือก adapter ทุกตัวที่ได้รับผลใน changeset เอง (`antd`, `tailwind`, `css` และ `shadcn` ถ้า theme เปลี่ยน)
- `@brt/shadcn` → `@brt/tailwind` เป็น dependency จริง ใช้ `updateInternalDependencies: "patch"`
- `access: "public"` — จำเป็นสำหรับ scoped package (`@brt/*`) และ **ฟรี** บน npmjs
- `apps/*` และ `@brt/design` เป็น private ไม่ถูก publish (ไม่มีค่าใช้จ่าย)
- ระดับของการเปลี่ยน token ดูตารางท้าย `tokens.md`

## Publish ขึ้น npmjs

flow ใน `.github/workflows/release.yml` เมื่อ push เข้า `main`:

1. มี changeset ค้าง → `changesets/action` เปิด PR "chore(release): version packages" (bump version + CHANGELOG)
2. merge PR นั้น → build แล้ว `pnpm changeset publish`

การตั้งค่า:

- Node **24** ใน CI ให้ตรงกับ local
- ใช้ **npm trusted publishing (OIDC)** จาก GitHub Actions + `--provenance` แทนการเก็บ `NPM_TOKEN` (workflow ต้องมี `permissions: id-token: write`) และตั้ง trusted publisher ของแต่ละ package บน npmjs
- ก่อน publish ครั้งแรกต้องยืนยันว่า org scope `@brt` บน npmjs เป็นของบริษัท ถ้าไม่ได้ ต้องเปลี่ยน scope ของทุก package (เช่น `@brtinnovation/*`) — **ยังไม่ได้ยืนยัน**
- ตรวจด้วย `pnpm pack` ก่อน publish ครั้งแรกว่า `package.json` ของ adapter ไม่มี `@brt/design` ใน `dependencies`

## ทดสอบกับโปรเจกต์ปลายทางก่อน release

- **snapshot release** (คนทำเท่านั้น — ดู "AI ห้าม publish"): `pnpm changeset version --snapshot dev` แล้ว `pnpm changeset publish --tag dev` → ได้ `0.0.0-dev-<timestamp>` ให้โปรเจกต์ติดตั้งทดสอบ (`pnpm add @brt/shadcn@dev`) โดยไม่กระทบ `latest`
- **local**: `pnpm link` จากโปรเจกต์ปลายทาง ใช้ระหว่างพัฒนาเท่านั้น ห้าม commit lockfile ที่ link อยู่
