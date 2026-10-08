import { describe, expect, it } from 'vitest';
import { buttonVariants } from '../components/button';

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

describe('Button', () => {
  it.each(variants.flatMap((v) => sizes.map((s) => [v, s] as const)))(
    'ใช้ utility ตาม token เท่านั้น ไม่มี arbitrary value (%s / %s)',
    (variant, size) => {
      expect(buttonVariants({ variant, size })).not.toMatch(/\[[^\]]+\]/);
    },
  );

  it('ค่าเริ่มต้นคือ primary ขนาด md', () => {
    expect(buttonVariants()).toContain('bg-primary');
    expect(buttonVariants()).toContain('px-md');
  });
});
