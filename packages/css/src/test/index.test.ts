import { brands, flatten, modes, resolve, viewports, type BrandName } from '@brt/design';
import { describe, expect, it } from 'vitest';
import { vars } from '../index';

describe('@brt/css coverage', () => {
  it.each(
    (Object.keys(brands) as BrandName[]).flatMap((b) =>
      modes.flatMap((m) => viewports.map((v) => [b, m, v] as const)),
    ),
  )('vars มีครบทุก semantic token (%s / %s / %s)', (brand, mode, viewport) => {
    for (const [path] of flatten(resolve(brand, mode, viewport))) {
      expect(vars, path).toHaveProperty(path.split('.'));
    }
  });

  it('ค่าเป็น CSS variable', () => {
    expect(vars.color.bg.secondary).toBe('var(--brt-color-bg-secondary)');
    expect(vars.fontSize.h1).toBe('var(--brt-font-size-h1)');
  });
});
