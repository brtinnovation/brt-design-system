import { describe, expect, it } from 'vitest';
import { brands, type BrandName } from '../brands';
import { primitive } from '../index';
import { flatten, modes, resolve } from '../semantic';

const allBrands = Object.keys(brands) as BrandName[];

describe('semantic tokens', () => {
  it.each(allBrands.flatMap((b) => modes.map((m) => [b, m] as const)))(
    '%s / %s มีค่าครบทุก token',
    (brand, mode) => {
      for (const [path, value] of flatten(resolve(brand, mode))) {
        expect(value, path).not.toBe('');
        expect(value, path).not.toBeUndefined();
      }
    },
  );

  it('ทุก brand ได้ token ชุด key เดียวกัน', () => {
    const keys = (b: BrandName) => flatten(resolve(b, 'light')).map(([p]) => p);
    for (const b of allBrands) expect(keys(b)).toEqual(keys('brt'));
  });

  it('สีของ brand มาจาก palette ใน primitive เท่านั้น', () => {
    const known = new Set<string>(
      Object.values(primitive.palette).flatMap((s) => Object.values(s)),
    );
    known.add(primitive.white);
    for (const b of allBrands) {
      for (const m of modes) {
        for (const [path, value] of flatten(resolve(b, m))) {
          if (path.startsWith('color.')) expect(known.has(value as string), path).toBe(true);
        }
      }
    }
  });
});
