import {
  defaultBrand,
  defineBrand,
  flatten,
  modes,
  primitive,
  resolve,
  viewports,
} from '@brt-innovation/design';
import { describe, expect, it } from 'vitest';
import { antdTokenMap, getThemeConfig } from '../theme';

const custom = defineBrand({
  name: 'custom',
  color: { primary: 'royalBlue', secondary: 'pink', tertiary: 'green' },
  font: { sans: 'kanit' },
});
const cases = [defaultBrand, custom].flatMap((b) =>
  modes.flatMap((m) => viewports.map((v) => [b.name, b, m, v] as const)),
);

describe('@brt-innovation/antd', () => {
  it.each(cases)('มี mapping ครบทุก semantic token (%s / %s / %s)', (_, brand, mode, viewport) => {
    for (const [path] of flatten(resolve(brand, mode, viewport))) {
      expect(antdTokenMap, path).toHaveProperty([path]);
    }
  });

  it('antd token ละหนึ่ง semantic token', () => {
    const targets = Object.values(antdTokenMap).filter(Boolean);
    expect(new Set(targets).size).toBe(targets.length);
  });

  it.each(cases)('ThemeConfig ได้ค่าจาก token (%s / %s / %s)', (_, brand, mode, viewport) => {
    const config = getThemeConfig(brand, mode, viewport);
    const tokens = resolve(brand, mode, viewport);
    expect(config.token?.colorPrimary).toBe(tokens.color.button.primary.brand.bg);
    expect(config.token?.fontSizeHeading1).toBe(tokens.fontSize.h1);
  });

  it('brand ที่โปรเจกต์ประกาศเองเปลี่ยน colorPrimary', () => {
    expect(getThemeConfig(custom).token?.colorPrimary).toBe(primitive.palette.royalBlue['-40']);
  });
});
