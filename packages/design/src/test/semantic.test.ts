import { describe, expect, it } from 'vitest';
import { defaultBrand, defineBrand } from '../brands';
import { generateBrandCss, generateTokensCss, vars } from '../css';
import { primitive } from '../index';
import { flatten, modes, resolve, viewports } from '../semantic';

// brand ที่โปรเจกต์ประกาศเอง — ใช้ตรวจว่า semantic ใช้ได้กับ brand ใดก็ได้ ไม่ใช่แค่ค่าเริ่มต้น
const custom = defineBrand({
  name: 'custom',
  color: { primary: 'royalBlue', secondary: 'pink', tertiary: 'green' },
  font: { sans: 'kanit' },
});
const brands = [defaultBrand, custom];
const cases = brands.flatMap((b) =>
  modes.flatMap((m) => viewports.map((v) => [b.name, b, m, v] as const)),
);

describe('semantic tokens', () => {
  it.each(cases)('%s / %s / %s มีค่าครบทุก token', (_, brand, mode, viewport) => {
    for (const [path, value] of flatten(resolve(brand, mode, viewport))) {
      expect(value, path).not.toBe('');
      expect(value, path).not.toBeUndefined();
    }
  });

  it('ทุก brand × viewport ได้ token ชุด key เดียวกัน', () => {
    const keys = flatten(resolve()).map(([p]) => p);
    for (const [, brand, mode, viewport] of cases)
      expect(flatten(resolve(brand, mode, viewport)).map(([p]) => p)).toEqual(keys);
  });

  it('สีมาจาก primitive เท่านั้น', () => {
    const known = new Set<string>([
      ...Object.values(primitive.palette).flatMap((s) => Object.values(s)),
      ...Object.values(primitive.alpha),
      primitive.white,
      primitive.black,
    ]);
    for (const [, brand, mode] of cases) {
      for (const [path, value] of flatten(resolve(brand, mode))) {
        if (path.startsWith('color.')) expect(known.has(value as string), path).toBe(true);
      }
    }
  });

  it('defaultBrand ตรงกับ Figma (03-semantic)', () => {
    const { color } = resolve();
    expect(color.text.primary).toBe('#12151A');
    expect(color.bg.brand).toBe('#00B7B7');
    expect(color.border.brand).toBe('#039999');
    expect(color.button.primary.brand.bg).toBe('#047B7B');
  });

  it('brand ที่ประกาศเองเปลี่ยนสี brand', () => {
    expect(resolve(custom).color.bg.brand).toBe(primitive.palette.royalBlue['00']);
    expect(resolve(custom).color.text.primary).toBe(resolve().color.text.primary);
  });
});

describe('CSS', () => {
  it('tokens.css override ค่า desktop ใน media query', () => {
    const css = generateTokensCss();
    expect(css).toMatch(/^:root \{[^}]*--brt-font-size-display1: 60px/m);
    expect(css).toMatch(/@media \(min-width: 768px\)[^]*--brt-font-size-display1: 72px/);
  });

  it('CSS ของ brand มีเฉพาะสีและฟอนต์ และชนะ :root', () => {
    const css = generateBrandCss(custom);
    expect(css.startsWith(":root[data-brand='custom'] {")).toBe(true);
    expect(css).toContain(`--brt-color-bg-brand: ${primitive.palette.royalBlue['00']};`);
    expect(css).toContain('--brt-font-sans:');
    expect(css).not.toContain('--brt-spacing-');
    expect(css).not.toContain('--brt-font-size-');
  });

  it('vars อ้าง CSS variable', () => {
    expect(vars.color.bg.secondary).toBe('var(--brt-color-bg-secondary)');
    expect(vars.fontSize.h1).toBe('var(--brt-font-size-h1)');
  });
});
