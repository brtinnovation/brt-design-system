import { Button } from '@brt-innovation/antd';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'บันทึก', type: 'primary' },
  argTypes: {
    type: { control: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    size: { control: 'inline-radio', options: ['small', 'middle', 'large'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
      <Button type="primary" danger>
        Danger
      </Button>
      <Button type="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};
