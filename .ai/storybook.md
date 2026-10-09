# Storybook

ใช้ **Storybook Composition** — เปิด URL เดียว (http://localhost:6006) แล้ว sidebar แยกกลุ่มตาม package
แต่ละ package มี Storybook ของตัวเองและ render ใน iframe แยก CSS จึงไม่ปนกัน

| App                | Port | เนื้อหา                                                                                     |
| ------------------ | ---- | ------------------------------------------------------------------------------------------- |
| `apps/docs`        | 6006 | host — หน้า Welcome + `refs` ไปหา Storybook ข้างล่าง                                        |
| `apps/docs-design` | 6007 | Colors (palette, semantic ของ brand `default` / `example`, live), Typography, Scales, Usage |
| `apps/docs-antd`   | 6008 | component ของ `@brt-innovation/antd` ภายใต้ `BrtConfigProvider`                             |

```bash
pnpm storybook        # build package ก่อน แล้วรันทั้ง 3 ตัวพร้อมกัน (host + design + antd)
pnpm build-storybook  # static build ลง apps/*/storybook-static (ยังไม่ deploy — ใช้ใน local)
```

## ถ้าเปิดแล้วหน้าขาว / กลุ่มขึ้น "Something went wrong loading this Storybook"

- **Vite หา import ไม่เจอหลังเปลี่ยนชื่อ / exports ของ package** — ลบ cache `rm -rf apps/*/node_modules/.cache` แล้วรันใหม่
- **port ถูกจองโดย Storybook ตัวเก่า** — ทุกตัวใช้ `--exact-port` จะ error แทนการย้าย port ปิดตัวเก่าด้วย `pkill -f "storybook/dist/bin/dispatcher.js dev"` แล้วรันใหม่
- **host ต้องเริ่มหลัง ref** — ตอนเริ่ม host จะเช็ก ref แต่ละตัว ถ้ายังไม่ตอบจะโหลดแบบ credentials แล้วติด CORS `apps/docs` จึงรัน `scripts/wait-for-refs.mjs` ก่อน `storybook dev` — เพิ่ม ref ใหม่ต้องเพิ่ม port ในสคริปต์นี้ด้วย

## กฎ

- **Storybook อยู่ใน `apps/` ไม่อยู่ใน `packages/*`** — story ใช้ package ตัวที่ build แล้ว (`dist/`) เหมือนที่โปรเจกต์จริงติดตั้ง และไม่เกิด dependency วนระหว่าง package
- story อยู่ใน `apps/docs-<name>/src/stories/*.stories.tsx`
- **หน้า token สร้างจากโค้ดเสมอ** (`primitive`, `resolve()`, `cssVarName()`) — ห้ามพิมพ์ค่าสีหรือชื่อ class ลงใน story เอง เพิ่ม palette / brand / token แล้วหน้าอัปเดตเอง
- toolbar **Brand** ตั้งใน `.storybook/globals.ts` ของแต่ละ app: `default` (= `defaultBrand`) และ `example` (brand ตัวอย่างที่ประกาศด้วย `defineBrand()` แบบที่โปรเจกต์ทำ — สีไม่ได้มาจาก Figma) — `applyBrand()` ใส่ `generateBrandCss()` + `data-brand` แบบเดียวกับโปรเจกต์จริง ส่วน antd ส่ง brand object เข้า `BrtConfigProvider`
- component ใหม่ต้องดูทั้ง `default` และ `example` — ถ้าสีไม่เปลี่ยนตาม `example` แปลว่า component ผูกกับค่าตายตัว
- toolbar Mode มีแค่ Light จนกว่า `@brt-innovation/design` จะมีค่า dark — เพิ่ม item `dark` ใน `globals.ts` พร้อมกับเพิ่ม `'dark'` ใน `modes`
- ฟอนต์ของ brand (Kanit) โหลดจาก Google Fonts ใน `.storybook/preview-head.html` ของแต่ละ app — เพิ่มฟอนต์ใหม่ใน primitive ต้องเพิ่มที่นี่ด้วย
- toolbar อยู่ในแต่ละ Storybook ของ package — สลับ brand / mode ที่กลุ่มหนึ่งไม่ส่งผลไปกลุ่มอื่น

## เพิ่ม Storybook ของ adapter ใหม่

1. คัดลอก `apps/docs-antd/` เป็น `apps/docs-<name>/` แล้วเปลี่ยน `name`, port และ dependency
2. แก้ `.storybook/preview.tsx` ให้ครอบด้วย provider / CSS ของ adapter นั้น
3. เพิ่ม ref ใน `apps/docs/.storybook/main.ts` และ port ใน `apps/docs/scripts/wait-for-refs.mjs`
4. เพิ่มแถวในตารางด้านบน
