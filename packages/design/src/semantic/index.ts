import { brands, type BrandName } from '../brands';
import {
  breakpoint,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  palette,
  radius,
  shadow,
  spacing,
  white,
  zIndex,
  type ColorScale,
} from '../primitive';

export const modes = ['light', 'dark'] as const;
export type Mode = (typeof modes)[number];

/**
 * กฎกลาง: shade ไหนใช้กับอะไร ต่อ mode — ใช้กับทุก brand
 * dark ใส่ไว้ให้โครงพร้อม ค่ายังเป็นค่าตัวอย่าง
 */
function resolveColor(brandName: BrandName, mode: Mode) {
  const brand = brands[brandName];
  const p = (name: keyof typeof palette) => palette[name] as ColorScale;
  const primary = p(brand.color.primary);
  const secondary = p(brand.color.secondary);
  const gray = palette.gray;
  const light = mode === 'light';

  return {
    primary: light ? primary[600] : primary[400],
    primaryHover: light ? primary[700] : primary[300],
    primaryActive: light ? primary[800] : primary[200],
    primaryForeground: light ? white : gray[950],
    secondary: light ? secondary[600] : secondary[400],
    secondaryForeground: light ? white : gray[950],
    success: p(brand.color.success)[light ? 600 : 400],
    warning: p(brand.color.warning)[light ? 500 : 400],
    error: p(brand.color.error)[light ? 600 : 400],
    info: p(brand.color.info)[light ? 600 : 400],
    bg: {
      base: light ? white : gray[950],
      surface: light ? gray[50] : gray[900],
      muted: light ? gray[100] : gray[800],
    },
    text: {
      base: light ? gray[900] : gray[50],
      muted: light ? gray[500] : gray[400],
      inverse: light ? white : gray[950],
    },
    border: {
      default: light ? gray[200] : gray[800],
      strong: light ? gray[300] : gray[700],
    },
  };
}

export function resolve(brandName: BrandName, mode: Mode) {
  const brand = brands[brandName];
  return {
    color: resolveColor(brandName, mode),
    font: { sans: fontFamily[brand.font.sans], mono: fontFamily[brand.font.mono] },
    fontSize,
    fontWeight,
    lineHeight,
    spacing,
    radius,
    shadow,
    breakpoint,
    zIndex,
  };
}

export type SemanticTokens = ReturnType<typeof resolve>;

/** palette ทั้งชุดของ brand — สำหรับ framework ที่ต้องการ scale (เช่น Mantine) เท่านั้น */
export function resolvePalette(brandName: BrandName) {
  const brand = brands[brandName];
  return {
    primary: palette[brand.color.primary] as ColorScale,
    secondary: palette[brand.color.secondary] as ColorScale,
  };
}

/** path ของ semantic token ทุกตัว เช่น 'color.bg.surface' — adapter ใช้ทำ mapping ให้ครบ */
type Paths<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string | number ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];

export type SemanticPath = Paths<SemanticTokens>;

/** แปลง token เป็น list ของ [path, value] — ใช้ใน generator และ coverage test */
export function flatten(tokens: SemanticTokens): [SemanticPath, string | number][] {
  const out: [string, string | number][] = [];
  const walk = (obj: object, prefix: string) => {
    for (const [k, v] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null) walk(v, path);
      else out.push([path, v as string | number]);
    }
  };
  walk(tokens, '');
  return out as [SemanticPath, string | number][];
}
