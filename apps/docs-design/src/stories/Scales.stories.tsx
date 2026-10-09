import { resolve, viewports } from '@brt/design';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Scales' };
export default meta;

const t = resolve('brt', 'light');
const byViewport = Object.fromEntries(viewports.map((v) => [v, resolve('brt', 'light', v)]));

export const Spacing: StoryObj = {
  render: () => (
    <Section title="Spacing" note="Figma Space — ชื่อคือค่า px · Tailwind: p-8, gap-16, h-40">
      <Table
        head={['token', 'px', '']}
        rows={Object.entries(t.spacing).map(([k, v]) => [
          <code style={mono}>spacing.{k}</code>,
          v,
          <div
            style={{
              width: v,
              height: 16,
              background: 'var(--brt-color-bg-brand)',
              borderRadius: 2,
            }}
          />,
        ])}
      />
    </Section>
  ),
};

export const Radius: StoryObj = {
  render: () => (
    <Section
      title="Radius"
      note="Figma มี mode Desktop / Mobile — ตัวอย่างใช้ var() จึงเปลี่ยนตามความกว้างจอ (desktop ตั้งแต่ md)"
    >
      <Table
        head={['token', ...viewports, 'ตัวอย่าง (ตามจอ)']}
        rows={Object.keys(t.radius).map((k) => [
          <code style={mono}>radius.{k}</code>,
          ...viewports.map((v) => `${byViewport[v]!.radius[k as keyof typeof t.radius]}px`),
          <div
            style={{
              width: 80,
              height: 48,
              borderRadius: `var(--brt-radius-${k})`,
              background: 'var(--brt-color-bg-secondary)',
              border: '1px solid var(--brt-color-border-secondary)',
            }}
          />,
        ])}
      />
    </Section>
  ),
};

export const Shadow: StoryObj = {
  render: () => (
    <Section title="Shadow" note="ยังไม่มีใน Figma — ค่าตัวอย่าง">
      <div style={{ display: 'flex', gap: 32, padding: 16 }}>
        {Object.entries(t.shadow).map(([k, v]) => (
          <div
            key={k}
            style={{
              width: 140,
              height: 90,
              borderRadius: 8,
              boxShadow: v,
              background: 'var(--brt-color-bg-primary)',
              padding: 8,
            }}
          >
            <code style={mono}>shadow.{k}</code>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const BreakpointAndZIndex: StoryObj = {
  name: 'Breakpoint & Z-index',
  render: () => (
    <>
      <Section title="Breakpoint" note="ยังไม่มีใน Figma — ค่าตัวอย่าง">
        <Table
          head={['token', 'px']}
          rows={Object.entries(t.breakpoint).map(([k, v]) => [
            <code style={mono}>breakpoint.{k}</code>,
            v,
          ])}
        />
      </Section>
      <Section title="Z-index" note="ยังไม่มีใน Figma — ค่าตัวอย่าง">
        <Table
          head={['token', 'value']}
          rows={Object.entries(t.zIndex).map(([k, v]) => [<code style={mono}>zIndex.{k}</code>, v])}
        />
      </Section>
    </>
  ),
};
