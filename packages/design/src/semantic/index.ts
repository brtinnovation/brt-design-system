import { brands, type BrandName } from '../brands';
import {
  alpha,
  breakpoint,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  palette,
  radius,
  shadow,
  spacing,
  white,
  zIndex,
  type ColorScale,
} from '../primitive';

/** mode ที่มีค่าแล้ว — Figma มีแค่ light; เพิ่ม 'dark' ที่นี่เมื่อได้ค่าจาก designer */
export const modes = ['light'] as const;
export type Mode = 'light' | 'dark';

/** Figma มี mode Desktop / Mobile สำหรับ typography และ radius — CSS เป็น mobile-first */
export const viewports = ['mobile', 'desktop'] as const;
export type Viewport = (typeof viewports)[number];

/**
 * กฎกลาง: ขั้นไหนใช้กับอะไร — ตาม collection `03-semantic` ของ Figma (mode BRTDS-BRT-Light)
 * ใช้กับทุก brand: brand เปลี่ยนแค่ palette ที่เลือก
 *
 * ตัดออกจาก Figma: Foreground / Icon (ค่าซ้ำ Text), Quaternary–Senary, *_darker, Transparent_*,
 * ระดับ Light / Lighter / Dark / Darker ของ brand และสถานะ, Component/Utility, Gradient, Input, Breadcrumb
 */
function resolveColor(brandName: BrandName, _mode: Mode) {
  // ยังไม่มีค่า dark จาก Figma — ทุก mode ใช้กฎของ light ไปก่อน
  const brand = brands[brandName];
  const scale = (name: keyof typeof palette) => palette[name] as ColorScale;
  const primary = scale(brand.color.primary);
  const secondary = scale(brand.color.secondary);
  const success = scale(brand.color.success);
  const warning = scale(brand.color.warning);
  const error = scale(brand.color.error);
  const info = scale(brand.color.info);
  const neutral = scale(brand.color.neutral) as Required<ColorScale>;

  return {
    text: {
      primary: neutral['-80'],
      primaryHover: neutral['-95'],
      secondary: neutral['-40'],
      secondaryHover: neutral['-60'],
      tertiary: neutral['+20'],
      tertiaryHover: neutral['-20'],
      placeholder: neutral['+40'],
      disabled: neutral['+60'],
      white,
      brand: primary['-40'],
      brandSecondary: secondary['00'],
      success: success['00'],
      warning: warning['00'],
      error: error['00'],
      info: info['00'],
    },
    bg: {
      primary: white,
      primaryHover: neutral['+95'],
      secondary: neutral['+95'],
      secondaryHover: neutral['+90'],
      tertiary: neutral['+80'],
      tertiaryHover: neutral['+60'],
      solid: neutral['-60'],
      disabled: neutral['+80'],
      disabledSubtle: neutral['+95'],
      brand: primary['00'],
      brandSubtle: primary['+90'],
      brandSubtleHover: primary['+80'],
      success: success['00'],
      successSubtle: success['+90'],
      warning: warning['00'],
      warningSubtle: warning['+90'],
      error: error['00'],
      errorSubtle: error['+90'],
      info: info['00'],
      infoSubtle: info['+90'],
    },
    border: {
      primary: neutral['+80'],
      secondary: neutral['+60'],
      tertiary: neutral['+40'],
      disabled: neutral['+90'],
      white,
      brand: primary['-20'],
      brandSubtle: primary['+80'],
      success: success['00'],
      warning: warning['00'],
      error: error['00'],
      info: info['00'],
    },
    /**
     * Figma `Component/Button` — เก็บไว้เพราะใช้ขั้นที่ไม่มีใน semantic ด้านบน (เช่น brand -50)
     * Icon ใช้ค่าเดียวกับ text จึงตัดออก; disabled ใช้ร่วมทุก variant
     */
    button: {
      primary: {
        brand: {
          bg: primary['-40'],
          bgHover: primary['-50'],
          text: white,
          textHover: primary['+90'],
        },
        neutral: {
          bg: neutral['-60'],
          bgHover: neutral['-80'],
          text: white,
          textHover: neutral['+90'],
        },
        error: {
          bg: error['00'],
          bgHover: error['-20'],
          text: white,
          textHover: error['+90'],
        },
      },
      secondary: {
        brand: {
          bg: alpha['white-1'],
          bgHover: primary['+90'],
          text: primary['-50'],
          textHover: primary['-40'],
          border: primary['00'],
          borderHover: primary['-20'],
        },
        neutral: {
          bg: alpha['white-0'],
          bgHover: neutral['+95'],
          text: neutral['-40'],
          textHover: neutral['-60'],
          border: neutral['+80'],
          borderHover: neutral['+60'],
        },
        error: {
          bg: white,
          bgHover: error['+90'],
          text: error['00'],
          textHover: error['-20'],
          border: error['00'],
          borderHover: error['-20'],
        },
      },
      tertiary: {
        brand: {
          bg: alpha['white-0'],
          bgHover: primary['+90'],
          text: primary['-50'],
          textHover: primary['-40'],
        },
        neutral: {
          bg: alpha['white-0'],
          bgHover: neutral['+95'],
          text: neutral['-60'],
          textHover: neutral['-80'],
        },
        error: {
          bg: alpha['white-0'],
          bgHover: error['+90'],
          text: error['00'],
          textHover: error['-20'],
        },
      },
      disabled: {
        bg: neutral['+90'],
        text: neutral['+40'],
        border: neutral['+95'],
      },
    },
  };
}

export function resolve(brandName: BrandName, mode: Mode, viewport: Viewport = 'mobile') {
  const brand = brands[brandName];
  return {
    color: resolveColor(brandName, mode),
    font: { sans: fontFamily[brand.font.sans] },
    fontSize: fontSize[viewport],
    fontWeight,
    lineHeight: lineHeight[viewport],
    letterSpacing,
    spacing,
    radius: radius[viewport],
    shadow,
    breakpoint,
    zIndex,
  };
}

export type SemanticTokens = ReturnType<typeof resolve>;

/** breakpoint ที่ค่า desktop เริ่มใช้ (CSS เป็น mobile-first) */
export const desktopBreakpoint = 'md' satisfies keyof typeof breakpoint;

/** palette ทั้งชุดของ brand — สำหรับ framework ที่ต้องการ scale (เช่น Mantine) เท่านั้น */
export function resolvePalette(brandName: BrandName) {
  const brand = brands[brandName];
  return {
    primary: palette[brand.color.primary] as ColorScale,
    secondary: palette[brand.color.secondary] as ColorScale,
    tertiary: palette[brand.color.tertiary] as ColorScale,
  };
}

/** path ของ semantic token ทุกตัว เช่น 'color.bg.secondary' — adapter ใช้ทำ mapping ให้ครบ */
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
