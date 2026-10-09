import { describe, expect, it } from 'vitest';
import { brands, type BrandName } from '../brands';
import { generateTokensCss } from '../css';
import { primitive } from '../index';
import { flatten, modes, resolve, viewports } from '../semantic';

const allBrands = Object.keys(brands) as BrandName[];
const cases = allBrands.flatMap((b) =>
  modes.flatMap((m) => viewports.map((v) => [b, m, v] as const)),
);

describe('semantic tokens', () => {
  it.each(cases)('%s / %s / %s มีค่าครบทุก token', (brand, mode, viewport) => {
    for (const [path, value] of flatten(resolve(brand, mode, viewport))) {
      expect(value, path).not.toBe('');
      expect(value, path).not.toBeUndefined();
    }
  });

  it('ทุก brand × viewport ได้ token ชุด key เดียวกัน', () => {
    const keys = (b: BrandName, v: (typeof viewports)[number]) =>
      flatten(resolve(b, 'light', v)).map(([p]) => p);
    for (const b of allBrands)
      for (const v of viewports) expect(keys(b, v)).toEqual(keys('brt', 'mobile'));
  });

  it('สีของ brand มาจาก primitive เท่านั้น', () => {
    const known = new Set<string>([
      ...Object.values(primitive.palette).flatMap((s) => Object.values(s)),
      ...Object.values(primitive.alpha),
      primitive.white,
      primitive.black,
    ]);
    for (const [b, m] of cases) {
      for (const [path, value] of flatten(resolve(b, m))) {
        if (path.startsWith('color.')) expect(known.has(value as string), path).toBe(true);
      }
    }
  });

  it('brt ตรงกับ Figma (03-semantic)', () => {
    const { color } = resolve('brt', 'light');
    expect(color.text.primary).toBe('#12151A');
    expect(color.bg.brand).toBe('#00B7B7');
    expect(color.border.brand).toBe('#039999');
    expect(color.button.primary.brand.bg).toBe('#047B7B');
  });

  it('tokens.css override ค่า desktop ใน media query', () => {
    const css = generateTokensCss();
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toMatch(/@media[^]*--brt-font-size-display1: 72px/);
    expect(css).toMatch(/:root,[^}]*--brt-font-size-display1: 60px/);
  });
});
