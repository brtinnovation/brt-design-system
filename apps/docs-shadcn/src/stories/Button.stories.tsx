import { Button } from '@brt/shadcn';
import type { Meta, StoryObj } from '@storybook/react-vite';

const variants = ['primary', 'secondary', 'tertiary'] as const;
const intents = ['brand', 'neutral', 'error'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'บันทึก', variant: 'primary', intent: 'brand', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    intent: { control: 'inline-radio', options: intents },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** ตาม Figma Component/Button — variant × intent */
export const Variants: Story = {
  render: () => (
    <div className="grid w-max grid-cols-4 items-center gap-16">
      <span />
      {intents.map((intent) => (
        <span key={intent} className="text-body-sm text-tertiary">
          {intent}
        </span>
      ))}
      {variants.map((variant) => [
        <span key={variant} className="text-body-sm text-tertiary">
          {variant}
        </span>,
        ...intents.map((intent) => (
          <Button key={`${variant}-${intent}`} variant={variant} intent={intent}>
            บันทึก
          </Button>
        )),
      ])}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
