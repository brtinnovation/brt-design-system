import { brands, flatten, modes, primitive, resolve, type BrandName } from '@brt/design';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Swatch, Table, mono } from '../ui';

const meta: Meta = { title: 'Tokens/Colors' };
export default meta;

/** primitive — สีทั้งหมดที่ brand เลือกได้ (สร้างจาก primitive.palette อัตโนมัติ) */
export const Palette: StoryObj = {
  render: () => (
    <Section
      title="Palette"
      note="primitive — ใช้ภายใน @brt/design เท่านั้น brand เลือก palette จากชุดนี้"
    >
      <div style={{ display: 'grid', gap: 20 }}>
        {Object.entries(primitive.palette).map(([name, scale]) => (
          <div key={name}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{name}</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(11, minmax(72px, 1fr))',
                gap: 8,
              }}
            >
              {Object.entries(scale).map(([step, hex]) => (
                <Swatch key={step} color={hex} label={step} sub={hex} />
              ))}
            </div>
          </div>
        ))}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>white</div>
          <Swatch color={primitive.white} label="white" sub={primitive.white} />
        </div>
      </div>
    </Section>
  ),
};

const colorPaths = flatten(resolve('brt', 'light'))
  .map(([path]) => path)
  .filter((p) => p.startsWith('color.'));

/** semantic — ค่าจริงของทุก brand × mode */
export const Semantic: StoryObj = {
  render: () => {
    const cols = (Object.keys(brands) as BrandName[]).flatMap((b) =>
      modes.map((m) => [b, m] as const),
    );
    return (
      <Section
        title="Semantic colors"
        note="ค่าที่ adapter ใช้จริง — brand เลือก palette ส่วน shade มาจากกฎกลางใน semantic/"
      >
        <Table
          head={['token', ...cols.map(([b, m]) => `${b} / ${m}`)]}
          rows={colorPaths.map((path) => [
            <code style={mono}>{path}</code>,
            ...cols.map(([b, m]) => {
              const value = flatten(resolve(b, m)).find(([p]) => p === path)?.[1] as string;
              return <Swatch color={value} label="" sub={value} />;
            }),
          ])}
        />
      </Section>
    );
  },
};

/** ตาม toolbar — สีผ่าน CSS variable เปลี่ยนตาม brand / mode ที่เลือก */
export const Live: StoryObj = {
  render: () => (
    <Section
      title="Live (ตาม toolbar)"
      note="แสดงผ่าน var(--brt-*) — ลองสลับ Brand / Mode ที่ toolbar"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          background: 'var(--brt-color-bg-base)',
          padding: 16,
          borderRadius: 12,
        }}
      >
        {colorPaths.map((path) => {
          const cssVar = `--brt-${path
            .split('.')
            .map((s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
            .join('-')}`;
          return (
            <Swatch key={path} color={`var(${cssVar})`} label="" sub={path.replace('color.', '')} />
          );
        })}
      </div>
    </Section>
  ),
};
