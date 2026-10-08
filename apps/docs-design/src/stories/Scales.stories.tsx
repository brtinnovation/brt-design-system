import { resolve } from '@brt/design';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Scales' };
export default meta;

const t = resolve('brt', 'light');

export const Spacing: StoryObj = {
  render: () => (
    <Section title="Spacing" note="ใช้ร่วมทุก brand">
      <Table
        head={['token', 'px', '']}
        rows={Object.entries(t.spacing).map(([k, v]) => [
          <code style={mono}>spacing.{k}</code>,
          v,
          <div
            style={{
              width: v,
              height: 16,
              background: 'var(--brt-color-primary)',
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
    <Section title="Radius">
      <div style={{ display: 'flex', gap: 24 }}>
        {Object.entries(t.radius).map(([k, v]) => (
          <div key={k} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: v,
                background: 'var(--brt-color-bg-muted)',
                border: '1px solid var(--brt-color-border-strong)',
              }}
            />
            <code style={mono}>
              radius.{k} · {v}px
            </code>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Shadow: StoryObj = {
  render: () => (
    <Section title="Shadow">
      <div style={{ display: 'flex', gap: 32, padding: 16 }}>
        {Object.entries(t.shadow).map(([k, v]) => (
          <div
            key={k}
            style={{
              width: 140,
              height: 90,
              borderRadius: 8,
              boxShadow: v,
              background: 'var(--brt-color-bg-base)',
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
      <Section title="Breakpoint">
        <Table
          head={['token', 'px']}
          rows={Object.entries(t.breakpoint).map(([k, v]) => [
            <code style={mono}>breakpoint.{k}</code>,
            v,
          ])}
        />
      </Section>
      <Section title="Z-index">
        <Table
          head={['token', 'value']}
          rows={Object.entries(t.zIndex).map(([k, v]) => [<code style={mono}>zIndex.{k}</code>, v])}
        />
      </Section>
    </>
  ),
};
