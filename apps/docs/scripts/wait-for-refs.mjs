// host ต้องเริ่มหลัง Storybook ของ package พร้อมแล้ว:
// ตอนเริ่ม host จะเช็ก ref แต่ละตัว — ถ้ายังไม่ตอบจะถูกโหลดแบบ credentials แล้วติด CORS ("Something went wrong loading this Storybook")
// port ต้องตรงกับ refs ใน .storybook/main.ts
const refs = ['http://localhost:6007', 'http://localhost:6008'];
const timeoutMs = 180_000;
const start = Date.now();

async function ready(url) {
  try {
    return (await fetch(`${url}/index.json`)).ok;
  } catch {
    return false;
  }
}

for (const url of refs) {
  while (!(await ready(url))) {
    if (Date.now() - start > timeoutMs) {
      console.error(`wait-for-refs: ${url} ไม่ตอบภายใน ${timeoutMs / 1000}s`);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log(`wait-for-refs: ${url} พร้อม`);
}
