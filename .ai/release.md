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
- รัน `npm login` / `npm adduser` หรือใช้ npm token ใด ๆ
- รัน `pnpm changeset version`, `npm version` หรือแก้ `version` ใน `package.json` เอง
- push / merge เข้า `main`, สร้างหรือ push git tag ของ release (`git push --follow-tags`)
- `npm dist-tag`, `npm deprecate`, `npm unpublish` หรือแก้สิทธิ์ของ org บน npmjs
- สร้าง CI workflow ที่ publish อัตโนมัติ — การ publish ต้องเป็นคนรันเองตาม `README.dev.md`
- ลบ / ผ่อน `prepublishOnly` ของ package (กันการ publish โดยไม่ build + test)

สิ่งที่ AI ทำได้: เขียนโค้ด, สร้างไฟล์ changeset (`pnpm changeset` หรือเขียนไฟล์ใน `.changeset/` เอง), `make check`, `make pack` เพื่อตรวจไฟล์, อัปเดต README ของ package และเปิด PR เข้า `develop`

เมื่อผู้ใช้ขอให้ publish ให้ตอบว่า AI ทำไม่ได้ แล้วชี้ขั้นตอนใน `README.dev.md` (ถ้ายังมีอะไรต้องเตรียม เช่น changeset หรือ README ให้ทำส่วนนั้นให้)

## Commit / PR

- **ห้ามใส่ AI attribution** ใน commit หรือ PR — ไม่มี `Co-Authored-By: Claude ...`, ไม่มี `Generated with Claude Code` หรือโลโก้/emoji ของ AI

## Changesets

- ทุก PR ที่แก้ `packages/*` ต้องรัน `pnpm changeset` เลือก package + ระดับ (patch/minor/major) + คำอธิบายที่ผู้ใช้ package อ่านเข้าใจ
- versioning แบบ **independent** — `design` และ `antd` มีเวอร์ชันของตัวเองและ **publish แยกกันได้**
- **adapter ใช้ `@brt-innovation/design` เป็น dependency จริง** (`workspace:^`) — เปลี่ยน design แล้ว changesets bump adapter ให้เอง (`updateInternalDependencies: "patch"`) ใส่ adapter ใน changeset เพิ่มเมื่อหน้าตา / API ของ adapter เปลี่ยนด้วย
- `access: "public"` (และ `publishConfig.access` ในแต่ละ package) — จำเป็นสำหรับ scoped package (`@brt-innovation/*`) และ **ฟรี** บน npmjs
- `apps/*` เป็น private ไม่ถูก publish
- ระดับของการเปลี่ยน token ดูตารางท้าย `tokens.md`

## Publish ขึ้น npmjs (คนทำเท่านั้น)

ขั้นตอนเต็มสำหรับคนอยู่ใน **`README.dev.md`** (แนวเดียวกับ `aether-utility-lib` ของ BRT) — publish ด้วยมือจาก `main` ไม่มี CI release

1. ตรวจบน `develop` (`make check`) → PR `develop` → `main` แล้ว merge
2. `git checkout main && git pull`
3. `pnpm changeset version` — bump เวอร์ชัน + CHANGELOG ของแต่ละ package จากไฟล์ใน `.changeset/`
4. อัปเดต README ของ package ที่เปลี่ยน → commit `chore(release): version packages` → push `main`
5. `npm login` แล้ว `pnpm changeset publish` (หรือ `pnpm --filter <package> publish` ทีละตัว) → `git push --follow-tags`
6. merge `main` กลับเข้า `develop`

ข้อกำหนดของ package (ตั้งไว้แล้วใน `package.json` ทุกตัว — ตามแบบ `@brt-innovation/aether-utility`):

| field                    | ค่า                                                  |
| ------------------------ | ---------------------------------------------------- |
| `name`                   | `@brt-innovation/<name>`                             |
| `files`                  | `["dist"]` — publish แค่ build output                |
| `exports`                | `types` / `import` (ESM) / `require` (CJS) ทุก entry |
| `publishConfig.access`   | `public` (scoped package ต้องตั้ง)                   |
| `scripts.prepublishOnly` | `pnpm run build && pnpm run test`                    |
| `engines.node`           | `>=20`                                               |
| `license`                | `UNLICENSED` (ใช้ภายใน BRT Innovation)               |
| `repository`             | `brtinnovation/brt-design-system` + `directory`      |

- ก่อน publish ครั้งแรกต้องยืนยันว่าคนที่ release เป็นสมาชิก org `brt-innovation` บน npmjs ที่มีสิทธิ์ publish (org มีอยู่แล้ว — `@brt-innovation/aether-utility` ใช้ scope นี้)
- ตรวจด้วย `make pack` ว่า `dependencies` ของ adapter เป็น `@brt-innovation/design: ^x.y.z` (ไม่มี `workspace:`) และใน tarball มีแค่ `dist`
- publish **design ก่อน adapter** เสมอ (`changeset publish` จัดลำดับให้) — ถ้า publish adapter ก่อน โปรเจกต์จะติดตั้งไม่ได้เพราะหา design เวอร์ชันนั้นไม่เจอ

## ทดสอบกับโปรเจกต์ปลายทางก่อน release

- **snapshot release** (คนทำเท่านั้น — ดู "AI ห้าม publish" และ `README.dev.md`): ได้ `0.0.0-dev-<timestamp>` ที่ tag `dev` ให้โปรเจกต์ติดตั้งทดสอบ (`pnpm add @brt-innovation/design@dev`) โดยไม่กระทบ `latest`
- **local (ใน hub)**: โปรเจกต์ติดตั้ง tarball ที่ `pnpm pack` จาก repo นี้ (brt-landing-page: `make local-packages` → `.local-packages/`) — ใช้ระหว่างพัฒนาเท่านั้น หลัง publish ให้เปลี่ยนเป็นเวอร์ชันจาก npm
