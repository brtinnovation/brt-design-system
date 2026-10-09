import { cssVarName, flatten, resolve } from '@brt/design';
import themeCss from '@brt/tailwind/theme.css?raw';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Tailwind & CSS' };
export default meta;

// อ่านจาก theme.css ที่ @brt/tailwind build จริง — ตารางนี้จึงตรงกับ package เสมอ
const toTailwindVar = new Map<string, string>();
for (const [, tw, brt] of themeCss.matchAll(/(--[\w-]+):\s*var\((--brt-[\w-]+)\)/g))
  toTailwindVar.set(brt!, tw!);
for (const [, name, brt] of themeCss.matchAll(
  /@utility (z-[\w-]+) \{\s*z-index: var\((--brt-[\w-]+)\)/g,
))
  toTailwindVar.set(brt!, `@utility ${name}`);

const namespaces: [string, (k: string) => string][] = [
  ['--text-color-', (k) => `text-${k}`],
  ['--background-color-', (k) => `bg-${k}`],
  ['--border-color-', (k) => `border-${k}`],
  ['--color-', (k) => `ring-${k}`],
  ['--text-', (k) => `text-${k}`],
  ['--font-weight-', (k) => `font-${k}`],
  ['--font-', (k) => `font-${k}`],
  ['--leading-', (k) => `leading-${k}`],
  ['--tracking-', (k) => `tracking-${k}`],
  ['--radius-', (k) => `rounded-${k}`],
  ['--shadow-', (k) => `shadow-${k}`],
  ['--spacing-', (k) => `p-${k} m-${k} gap-${k}`],
];

function tailwindUtility(path: string): string {
  if (path.startsWith('breakpoint.')) return `${path.split('.')[1]}:`;
  const tw = toTailwindVar.get(cssVarName(path));
  if (!tw) return '—';
  if (tw.startsWith('@utility ')) return tw.replace('@utility ', '');
  for (const [prefix, fmt] of namespaces)
    if (tw.startsWith(prefix)) return fmt(tw.slice(prefix.length));
  return tw;
}

export const Reference: StoryObj = {
  render: () => (
    <Section
      title="ใช้ token กับ CSS framework"
      note="@brt/tailwind → utility class · @brt/css → CSS variable / vars (TS) — ทั้งสองอ้างค่าเดียวกันและเปลี่ยนตาม brand / mode"
    >
      <Table
        head={['semantic token', '@brt/tailwind', '@brt/css (CSS)', '@brt/css (TS)']}
        rows={flatten(resolve('brt', 'light')).map(([path]) => [
          <code style={mono}>{path}</code>,
          <code style={mono}>{tailwindUtility(path)}</code>,
          <code style={mono}>var({cssVarName(path)})</code>,
          <code style={mono}>vars.{path}</code>,
        ])}
      />
    </Section>
  ),
};
