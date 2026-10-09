# Storybook

ใช้ **Storybook Composition** — เปิด URL เดียว (http://localhost:6006) แล้ว sidebar แยกกลุ่มตาม package
แต่ละ package มี Storybook ของตัวเองและ render ใน iframe แยก CSS จึงไม่ปนกัน (preflight ของ Tailwind ไม่ทับ antd)

| App                | Port | เนื้อหา                                                                               |
| ------------------ | ---- | ------------------------------------------------------------------------------------- |
| `apps/docs`        | 6006 | host — หน้า Welcome + `refs` ไปหา Storybook ข้างล่าง                                  |
| `apps/docs-design` | 6007 | Colors (palette, semantic ทุก brand × mode, live), Typography, Scales, Tailwind & CSS |
| `apps/docs-antd`   | 6008 | component ของ `@brt/antd` ภายใต้ `BrtConfigProvider`                                  |
| `apps/docs-shadcn` | 6009 | component ของ `@brt/shadcn` บน Tailwind v4                                            |

```bash
pnpm storybook        # build package ก่อน แล้วรันทั้ง 4 ตัวพร้อมกัน
pnpm build-storybook  # static build ลง apps/*/storybook-static (ยังไม่ deploy — ใช้ใน local)
```

## ถ้าเปิดแล้วหน้าขาว / กลุ่มขึ้น "Something went wrong loading this Storybook"

- **port ถูกจองโดย Storybook ตัวเก่า** — ทุกตัวใช้ `--exact-port` จะ error แทนการย้าย port ปิดตัวเก่าด้วย `pkill -f "storybook/dist/bin/dispatcher.js dev"` แล้วรันใหม่
- **host ต้องเริ่มหลัง ref** — ตอนเริ่ม host จะเช็ก ref แต่ละตัว ถ้ายังไม่ตอบจะโหลดแบบ credentials แล้วติด CORS `apps/docs` จึงรัน `scripts/wait-for-refs.mjs` ก่อน `storybook dev` — เพิ่ม ref ใหม่ต้องเพิ่ม port ในสคริปต์นี้ด้วย

## กฎ

- **Storybook อยู่ใน `apps/` ไม่อยู่ใน `packages/*`** — story ใช้ package ตัวที่ build แล้ว (`dist/`) เหมือนที่โปรเจกต์จริงติดตั้ง และไม่เกิด dependency วนระหว่าง package
- story อยู่ใน `apps/docs-<name>/src/stories/*.stories.tsx`
- **หน้า token สร้างจากโค้ดเสมอ** (`primitive`, `resolve()`, `theme.css` ของ `@brt/tailwind`) — ห้ามพิมพ์ค่าสีหรือชื่อ class ลงใน story เอง เพิ่ม palette / brand / token แล้วหน้าอัปเดตเอง
- toolbar **Brand / Mode** ตั้งค่าใน `.storybook/globals.ts` ของแต่ละ app — `docs-design` อ่านรายชื่อ brand จาก `@brt/design` ส่วน antd / shadcn ใช้ค่าเริ่มต้น `['brt']` เมื่อเพิ่ม brand ใหม่ให้ส่งรายชื่อเข้า `createGlobalTypes()` ด้วย
- toolbar Mode มีแค่ Light จนกว่า `@brt/design` จะมีค่า dark — เพิ่ม item `dark` ใน `globals.ts` พร้อมกับเพิ่ม `'dark'` ใน `modes`
- ฟอนต์ของ brand (Kanit) โหลดจาก Google Fonts ใน `.storybook/preview-head.html` ของแต่ละ app — เพิ่มฟอนต์ใหม่ใน primitive ต้องเพิ่มที่นี่ด้วย
- toolbar อยู่ในแต่ละ Storybook ของ package — สลับ brand / mode ที่กลุ่มหนึ่งไม่ส่งผลไปกลุ่มอื่น
- `docs-shadcn` ตั้ง Tailwind แบบเดียวกับโปรเจกต์จริง (`@import 'tailwindcss'; @import '@brt/shadcn/styles.css';`) — ถ้า style หายใน Storybook แปลว่าโปรเจกต์จริงก็หายด้วย

## เพิ่ม Storybook ของ adapter ใหม่

1. คัดลอก `apps/docs-antd/` เป็น `apps/docs-<name>/` แล้วเปลี่ยน `name`, port และ dependency
2. แก้ `.storybook/preview.tsx` ให้ครอบด้วย provider / CSS ของ adapter นั้น
3. เพิ่ม ref ใน `apps/docs/.storybook/main.ts` และ port ใน `apps/docs/scripts/wait-for-refs.mjs`
4. เพิ่มแถวในตารางด้านบน
