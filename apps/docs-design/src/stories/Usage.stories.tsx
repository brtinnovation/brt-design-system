import { cssVarName, flatten, resolve } from '@brt-innovation/design';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Usage' };
export default meta;

// Tailwind แบบไม่ตั้ง @theme — อ้าง CSS variable ตรง ๆ (แบบที่ตารางแปลง shadcn แนะนำ)
function tailwindClass(path: string): string {
  const v = cssVarName(path);
  if (path.startsWith('color.text.')) return `text-(${v})`;
  if (path.startsWith('color.bg.')) return `bg-(${v})`;
  if (path.startsWith('color.border.')) return `border-(${v})`;
  if (path.startsWith('color.button.'))
    return path.includes('.bg')
      ? `bg-(${v})`
      : path.includes('.text')
        ? `text-(${v})`
        : `border-(${v})`;
  if (path.startsWith('fontSize.')) return `text-(length:${v})`;
  if (path.startsWith('fontWeight.')) return `font-(${v})`;
  if (path.startsWith('font.')) return `font-(family-name:${v})`;
  if (path.startsWith('lineHeight.')) return `leading-(${v})`;
  if (path.startsWith('letterSpacing.')) return `tracking-(${v})`;
  if (path.startsWith('spacing.')) return `p-(${v}) gap-(${v})`;
  if (path.startsWith('radius.')) return `rounded-(${v})`;
  if (path.startsWith('shadow.')) return `shadow-(${v})`;
  if (path.startsWith('zIndex.')) return `z-(${v})`;
  return '— (ใช้ใน @media ไม่ได้)';
}

export const Reference: StoryObj = {
  render: () => (
    <Section
      title="ใช้ token ในโปรเจกต์"
      note="ทุก token เป็น CSS variable --brt-* (จาก tokens.css ที่มากับ adapter) · การตั้ง utility ของ Tailwind / CSS framework เป็นของโปรเจกต์ — คอลัมน์ Tailwind คือแบบไม่ตั้ง @theme"
    >
      <Table
        head={['semantic token', 'CSS variable', 'TS (vars)', 'Tailwind (ไม่ตั้ง @theme)']}
        rows={flatten(resolve()).map(([path]) => [
          <code style={mono}>{path}</code>,
          <code style={mono}>var({cssVarName(path)})</code>,
          <code style={mono}>vars.{path}</code>,
          <code style={mono}>{tailwindClass(path)}</code>,
        ])}
      />
    </Section>
  ),
};
