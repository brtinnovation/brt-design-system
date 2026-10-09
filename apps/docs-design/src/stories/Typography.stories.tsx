import { brands, cssVarName, primitive, resolve, viewports, type BrandName } from '@brt/design';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Typography' };
export default meta;

const sample = 'ระบบออกแบบ BRT — The quick brown fox 0123456789';
const t = resolve('brt', 'light');
const byViewport = Object.fromEntries(viewports.map((v) => [v, resolve('brt', 'light', v)]));

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
          head={['brand', 'sans']}
          rows={(Object.keys(brands) as BrandName[]).map((b) => [
            b,
            <code style={mono}>{brands[b].font.sans}</code>,
          ])}
        />
      </Section>
    </>
  ),
};

export const Scale: StoryObj = {
  render: () => (
    <>
      <Section
        title="Font size"
        note="Figma มี mode Desktop / Mobile — ตัวอย่างใช้ var() จึงเปลี่ยนตามความกว้างจอ (desktop ตั้งแต่ md)"
      >
        <Table
          head={['token', ...viewports, 'ตัวอย่าง (ตามจอ)']}
          rows={Object.keys(t.fontSize).map((k) => [
            <code style={mono}>fontSize.{k}</code>,
            ...viewports.map((v) => byViewport[v]!.fontSize[k as keyof typeof t.fontSize]),
            <span style={{ fontSize: `var(${cssVarName(`fontSize.${k}`)})`, whiteSpace: 'nowrap' }}>
              ระบบออกแบบ BRT
            </span>,
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
      <Section title="Line height" note="px — Figma ไม่ได้ผูกกับ font size แต่ละตัว">
        <Table
          head={['token', ...viewports]}
          rows={Object.keys(t.lineHeight).map((k) => [
            <code style={mono}>lineHeight.{k}</code>,
            ...viewports.map((v) => byViewport[v]!.lineHeight[k as keyof typeof t.lineHeight]),
          ])}
        />
      </Section>
      <Section title="Letter spacing">
        <Table
          head={['token', 'px']}
          rows={Object.entries(t.letterSpacing).map(([k, v]) => [
            <code style={mono}>letterSpacing.{k}</code>,
            v,
          ])}
        />
      </Section>
    </>
  ),
};
