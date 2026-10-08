# Branch, versioning และ release

## Branch

| Branch      | ใช้ทำอะไร                                                    |
| ----------- | ------------------------------------------------------------ |
| `develop`   | branch หลักของงานพัฒนา — feature branch แตกจากที่นี่และ PR กลับมาที่นี่ |
| `main`      | branch release — merge จาก `develop` เมื่อต้องการ publish    |

changeset config ตั้ง `baseBranch: "main"`

## Changesets

- ทุก PR ที่แก้ `packages/*` ต้องรัน `pnpm changeset` เลือก package + ระดับ (patch/minor/major) + คำอธิบายที่ผู้ใช้ package อ่านเข้าใจ
- versioning แบบ **independent** — แต่ละ package มีเวอร์ชันของตัวเอง
- `updateInternalDependencies: "patch"` — เมื่อ `@brt/design` ขยับ adapter จะได้ patch ตามอัตโนมัติ
- `access: "public"` — จำเป็นสำหรับ scoped package (`@brt/*`)
- `apps/docs`, `apps/showcase` อยู่ใน `ignore`
- ระดับของการเปลี่ยน token ดูตารางท้าย `tokens.md`

## Publish ขึ้น npmjs

flow ใน `.github/workflows/release.yml` เมื่อ push เข้า `main`:

1. มี changeset ค้าง → `changesets/action` เปิด PR "chore(release): version packages" (bump version + CHANGELOG)
2. merge PR นั้น → build แล้ว `pnpm changeset publish`

การตั้งค่า:

- Node **24** ใน CI ให้ตรงกับ local
- ใช้ **npm trusted publishing (OIDC)** จาก GitHub Actions + `--provenance` แทนการเก็บ `NPM_TOKEN` แบบเดิม (workflow ต้องมี `permissions: id-token: write`) และตั้ง trusted publisher ของแต่ละ package บน npmjs
- ก่อน publish ครั้งแรกต้องยืนยันว่า org scope `@brt` บน npmjs เป็นของบริษัท ถ้าไม่ได้ ต้องเปลี่ยน scope ของทุก package (เช่น `@brtinnovation/*`) — **ยังไม่ได้ยืนยัน**

## ทดสอบกับโปรเจกต์ปลายทางก่อน release

- **snapshot release**: `pnpm changeset version --snapshot dev` แล้ว `pnpm changeset publish --tag dev` → ได้เวอร์ชัน `0.0.0-dev-<timestamp>` ให้โปรเจกต์ติดตั้งทดสอบ (`pnpm add @brt/shadcn@dev`) โดยไม่กระทบ `latest`
- **local**: `pnpm link` จากโปรเจกต์ปลายทาง ใช้ระหว่างพัฒนาเท่านั้น ห้าม commit lockfile ที่ link อยู่
