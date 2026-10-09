// token ทั้งหมดจาก @brt-innovation/design — แยก entry จาก component เพราะ index มี 'use client'
// (Server Component ของ Next.js เรียก defineBrand / generateBrandCss จาก module 'use client' ไม่ได้)
export * from '@brt-innovation/design';
