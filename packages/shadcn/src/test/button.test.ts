import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { buttonVariants } from '../components/button';
import { brtFontSizes, brtLineHeights, cn } from '../lib/utils';

const variants = ['primary', 'secondary', 'tertiary'] as const;
const intents = ['brand', 'neutral', 'error'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

describe('Button', () => {
  it.each(variants.flatMap((v) => intents.flatMap((i) => sizes.map((s) => [v, i, s] as const))))(
    'ใช้ utility ตาม token เท่านั้น ไม่มี arbitrary value (%s / %s / %s)',
    (variant, intent, size) => {
      const cls = buttonVariants({ variant, intent, size });
      expect(cls).not.toMatch(/\[[^\]]+\]|\(--/);
      expect(cls).toContain(`bg-button-${variant}-${intent}`);
    },
  );

  it('ค่าเริ่มต้นคือ primary / brand / md', () => {
    expect(buttonVariants()).toContain('bg-button-primary-brand');
    expect(buttonVariants()).toContain('text-button-md');
  });
});

describe('cn', () => {
  it('แยกขนาดตัวอักษรกับสีของ BRT ออกจากกัน', () => {
    // แยก argument — prettier-plugin-tailwindcss เรียงลำดับ class ภายใน string เดียวกันใหม่
    expect(cn('text-h1', 'text-primary')).toBe('text-h1 text-primary');
    expect(cn('text-h1', 'text-body-md')).toBe('text-body-md');
    expect(cn('leading-lg', 'leading-13xl')).toBe('leading-13xl');
  });

  it('รายชื่อตรงกับ @brt/tailwind/theme.css', () => {
    const require = createRequire(import.meta.url);
    const css = readFileSync(require.resolve('@brt/tailwind/theme.css'), 'utf8');
    const names = (ns: string) =>
      [...css.matchAll(new RegExp(`^\\s+--${ns}-([\\w-]+):`, 'gm'))].map((m) => m[1]);
    expect(names('text').filter((n) => !n?.startsWith('color-'))).toEqual(brtFontSizes);
    expect(names('leading')).toEqual(brtLineHeights);
  });
});
