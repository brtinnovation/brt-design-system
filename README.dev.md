# Publishing Guide

ขั้นตอน publish `@brt-innovation/design` และ `@brt-innovation/antd` ขึ้น npmjs — **ทำโดยคนเท่านั้น** (AI ห้าม publish ดู `.ai/release.md`)

แต่ละ package มีเวอร์ชันของตัวเองและ publish แยกกันได้ — การ bump เวอร์ชันใช้ [changesets](https://github.com/changesets/changesets) แทน `npm version` เพราะต้องจัดการหลาย package และ dependency ระหว่างกัน (adapter ขึ้นกับ `design`)

## Pre-requisites

- Node 24 และ pnpm ตาม `packageManager` (corepack)
- เป็นสมาชิก org `brt-innovation` บน npmjs ที่มีสิทธิ์ publish
- login npm registry:

  ```bash
  npm login
  npm whoami   # ต้องเห็น user ของตัวเอง
  ```

## Deployment Workflow

### 1. Verify Build

ก่อน merge ตรวจบน `develop` ว่าทุกอย่างผ่าน

```bash
pnpm install
make check   # build → typecheck → lint → test → format-check
```

ทุก PR ที่แก้ `packages/*` ต้องมีไฟล์ใน `.changeset/` แล้ว (สร้างด้วย `pnpm changeset`)

### 2. Merge to Main

- เปิด PR จาก `develop` เข้า `main`
- review แล้ว merge

### 3. Prepare Release

```bash
git checkout main
git pull origin main
```

### 4. Bump Version

```bash
pnpm changeset version
```

- อ่านไฟล์ใน `.changeset/` แล้ว bump `version` ของแต่ละ package ตามระดับที่ระบุ (patch / minor / major), เขียน `CHANGELOG.md` ของแต่ละ package และลบไฟล์ changeset ที่ใช้แล้ว
- ถ้า `design` ถูก bump — adapter ที่ใช้ `design` จะถูก bump `patch` ให้เองด้วย (`updateInternalDependencies`)
- ตรวจ diff ของ `package.json` / `CHANGELOG.md` ว่าเวอร์ชันถูกต้อง

### 5. Update README.md

อัปเดต `README.md` ของ package ที่ API / วิธีใช้เปลี่ยน (`packages/<name>/README.md` — เป็นหน้าที่แสดงบน npmjs) แล้ว commit

```bash
pnpm install   # อัปเดต lockfile ตามเวอร์ชันใหม่
git add -A
git commit -m "chore(release): version packages"
git push origin main
```

### 6. Publish

ตรวจไฟล์ที่จะ publish ก่อน (ครั้งแรกหรือเมื่อเปลี่ยน build config)

```bash
make pack   # build แล้ว pack ทุก package ลง .pack/ พร้อมรายชื่อไฟล์ใน tarball
# ใน tarball ต้องมีแค่ dist + package.json + README/CHANGELOG
# dependencies ของ adapter ต้องเป็น "@brt-innovation/design": "^x.y.z" (ไม่มี workspace:)
```

publish ทุก package ที่เวอร์ชันยังไม่มีบน npmjs

```bash
pnpm changeset publish   # publish design ก่อน adapter ให้เอง + สร้าง git tag ต่อ package
git push origin main --follow-tags
```

publish **ทีละ package** ได้ด้วย

```bash
pnpm --filter @brt-innovation/design publish
pnpm --filter @brt-innovation/antd publish
```

- ถ้า adapter อ้าง `design` เวอร์ชันใหม่ ต้อง publish `design` **ก่อน** เสมอ ไม่อย่างนั้นโปรเจกต์ติดตั้ง adapter ไม่ได้
- `prepublishOnly` ของทุก package รัน build + test ให้อีกรอบก่อนส่งขึ้น npmjs

### 7. Sync กลับ develop

```bash
git checkout develop
git merge main
git push origin develop
```

## ทดสอบกับโปรเจกต์ก่อน release จริง (snapshot)

```bash
pnpm changeset version --snapshot dev
pnpm changeset publish --tag dev      # ได้ 0.0.0-dev-<timestamp> ที่ tag dev — ไม่กระทบ latest
git checkout -- .                      # ทิ้งการเปลี่ยนเวอร์ชันของ snapshot ห้าม commit
```

โปรเจกต์ติดตั้งด้วย `pnpm add @brt-innovation/design@dev`

## How to Deprecate npm version

> example
>
> ```bash
> npm deprecate @brt-innovation/design@0.1.0 "token สี error ใน 0.1.0 ผิด ให้ใช้ 0.1.1 ขึ้นไป"
> ```
