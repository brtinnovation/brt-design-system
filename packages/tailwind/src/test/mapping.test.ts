import { brands, flatten, modes, resolve, viewports, type BrandName } from '@brt/design';
import { describe, expect, it } from 'vitest';
import { tailwindTheme } from '../mapping';

const cases = (Object.keys(brands) as BrandName[]).flatMap((b) =>
  modes.flatMap((m) => viewports.map((v) => [b, m, v] as const)),
);

describe('@brt/tailwind coverage', () => {
  it.each(cases)('map semantic token ครบทุกตัว (%s / %s / %s)', (brand, mode, viewport) => {
    for (const [path] of flatten(resolve(brand, mode, viewport))) {
      expect(tailwindTheme, path).toHaveProperty([path]);
    }
  });

  it('ไม่มีตัวแปร Tailwind ซ้ำกัน', () => {
    const targets = Object.values(tailwindTheme).filter(Boolean);
    expect(new Set(targets).size).toBe(targets.length);
  });
});
