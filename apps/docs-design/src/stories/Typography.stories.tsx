import { brands, primitive, resolve, type BrandName } from '@brt/design';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Typography' };
export default meta;

const sample = 'ระบบออกแบบ BRT — The quick brown fox 0123456789';

export const FontFamily: StoryObj = {
  render: () => (
    <>
      <Section title="Font family ทั้งหมด" note="primitive — brand เลือกจากชุดนี้">
        <Table
          head={['key', 'ตัวอย่าง', 'value']}
          rows={Object.entries(primitive.fontFamily).map(([k, v]) => [
            <code style={mono}>{k}</code>,
            <span style={{ fontFamily: v, fontSize: 18 }}>{sample}</span>,
            <code style={mono}>{v}</code>,
          ])}
        />
      </Section>
      <Section title="Brand">
        <Table
          head={['brand', 'sans', 'mono']}
          rows={(Object.keys(brands) as BrandName[]).map((b) => [
            b,
            <code style={mono}>{brands[b].font.sans}</code>,
            <code style={mono}>{brands[b].font.mono}</code>,
          ])}
        />
      </Section>
    </>
  ),
};

export const Scale: StoryObj = {
  render: () => {
    const t = resolve('brt', 'light');
    return (
      <>
        <Section title="Font size">
          <Table
            head={['token', 'px', 'ตัวอย่าง']}
            rows={Object.entries(t.fontSize).map(([k, v]) => [
              <code style={mono}>fontSize.{k}</code>,
              v,
              <span style={{ fontSize: `var(--brt-font-size-${k})` }}>{sample}</span>,
            ])}
          />
        </Section>
        <Section title="Font weight">
          <Table
            head={['token', 'value', 'ตัวอย่าง']}
            rows={Object.entries(t.fontWeight).map(([k, v]) => [
              <code style={mono}>fontWeight.{k}</code>,
              v,
              <span style={{ fontWeight: v, fontSize: 18 }}>{sample}</span>,
            ])}
          />
        </Section>
        <Section title="Line height">
          <Table
            head={['token', 'value', 'ตัวอย่าง']}
            rows={Object.entries(t.lineHeight).map(([k, v]) => [
              <code style={mono}>lineHeight.{k}</code>,
              v,
              <p
                style={{
                  lineHeight: v,
                  margin: 0,
                  maxWidth: 360,
                  background: 'var(--brt-color-bg-muted)',
                }}
              >
                {sample} {sample}
              </p>,
            ])}
          />
        </Section>
      </>
    );
  },
};
