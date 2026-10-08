import { brands, flatten, modes, resolve, type BrandName } from '@brt/design';
import { describe, expect, it } from 'vitest';
import { tailwindTheme } from '../mapping';

describe('@brt/tailwind coverage', () => {
  it.each((Object.keys(brands) as BrandName[]).flatMap((b) => modes.map((m) => [b, m] as const)))(
    'map semantic token ครบทุกตัว (%s / %s)',
    (brand, mode) => {
      for (const [path] of flatten(resolve(brand, mode))) {
        expect(tailwindTheme, path).toHaveProperty([path]);
      }
    },
  );
});
