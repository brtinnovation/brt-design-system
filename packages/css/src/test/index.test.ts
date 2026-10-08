import { brands, flatten, modes, resolve, type BrandName } from '@brt/design';
import { describe, expect, it } from 'vitest';
import { vars } from '../index';

describe('@brt/css coverage', () => {
  it.each((Object.keys(brands) as BrandName[]).flatMap((b) => modes.map((m) => [b, m] as const)))(
    'vars มีครบทุก semantic token (%s / %s)',
    (brand, mode) => {
      for (const [path] of flatten(resolve(brand, mode))) {
        expect(vars, path).toHaveProperty(path.split('.'));
      }
    },
  );

  it('ค่าเป็น CSS variable', () => {
    expect(vars.color.bg.surface).toBe('var(--brt-color-bg-surface)');
  });
});
