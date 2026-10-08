import { StatusTag } from '@brt/antd';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'BRT/StatusTag',
  component: StatusTag,
  args: { status: 'success', children: 'อนุมัติ' },
  argTypes: {
    status: { control: 'select', options: ['success', 'warning', 'error', 'info', 'default'] },
  },
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <StatusTag status="success">อนุมัติ</StatusTag>
      <StatusTag status="warning">รอตรวจสอบ</StatusTag>
      <StatusTag status="error">ปฏิเสธ</StatusTag>
      <StatusTag status="info">กำลังดำเนินการ</StatusTag>
      <StatusTag status="default">ฉบับร่าง</StatusTag>
    </div>
  ),
};
