import { createVars, type BrtVars } from '@brt/design';

/**
 * semantic token ทุกตัวในรูป 'var(--brt-...)' — ใช้กับ styled-components, emotion, vanilla-extract ฯลฯ
 * ต้อง import '@brt/css/tokens.css' หนึ่งครั้งที่ root ของ app ด้วย
 */
export const vars: BrtVars = createVars();

export type { BrtVars };
