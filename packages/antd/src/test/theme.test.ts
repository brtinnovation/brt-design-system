import { brands, flatten, modes, resolve, viewports, type BrandName } from '@brt/design';
import { describe, expect, it } from 'vitest';
import { antdTokenMap, getThemeConfig } from '../theme';

const cases = (Object.keys(brands) as BrandName[]).flatMap((b) =>
  modes.flatMap((m) => viewports.map((v) => [b, m, v] as const)),
);

describe('@brt/antd coverage', () => {
  it.each(cases)('มี mapping ครบทุก semantic token (%s / %s / %s)', (brand, mode, viewport) => {
    for (const [path] of flatten(resolve(brand, mode, viewport))) {
      expect(antdTokenMap, path).toHaveProperty([path]);
    }
  });

  it('antd token ละหนึ่ง semantic token', () => {
    const targets = Object.values(antdTokenMap).filter(Boolean);
    expect(new Set(targets).size).toBe(targets.length);
  });

  it.each(cases)('ThemeConfig ได้ค่าจาก token (%s / %s / %s)', (brand, mode, viewport) => {
    const config = getThemeConfig(brand, mode, viewport);
    const tokens = resolve(brand, mode, viewport);
    expect(config.token?.colorPrimary).toBe(tokens.color.button.primary.brand.bg);
    expect(config.token?.fontSizeHeading1).toBe(tokens.fontSize.h1);
  });
});
