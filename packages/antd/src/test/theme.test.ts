import { brands, flatten, modes, resolve, type BrandName } from '@brt/design';
import { describe, expect, it } from 'vitest';
import { antdTokenMap, getThemeConfig } from '../theme';

const cases = (Object.keys(brands) as BrandName[]).flatMap((b) =>
  modes.map((m) => [b, m] as const),
);

describe('@brt/antd coverage', () => {
  it.each(cases)('มี mapping ครบทุก semantic token (%s / %s)', (brand, mode) => {
    for (const [path] of flatten(resolve(brand, mode))) {
      expect(antdTokenMap, path).toHaveProperty([path]);
    }
  });

  it.each(cases)('ThemeConfig ได้ค่าจาก token (%s / %s)', (brand, mode) => {
    const config = getThemeConfig(brand, mode);
    expect(config.token?.colorPrimary).toBe(resolve(brand, mode).color.primary);
  });
});
