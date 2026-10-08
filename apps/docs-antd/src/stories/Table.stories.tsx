import { StatusTag, Table, type Status } from '@brt/antd';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = { title: 'Components/Table' };
export default meta;

const data: { key: number; name: string; amount: number; status: Status; label: string }[] = [
  { key: 1, name: 'สมชาย ใจดี', amount: 12500, status: 'success', label: 'อนุมัติ' },
  { key: 2, name: 'สมหญิง รักงาน', amount: 8300, status: 'warning', label: 'รอตรวจสอบ' },
  { key: 3, name: 'บริษัท ตัวอย่าง จำกัด', amount: 54000, status: 'error', label: 'ปฏิเสธ' },
];

export const Example: StoryObj = {
  render: () => (
    <Table
      dataSource={data}
      pagination={false}
      columns={[
        { title: 'ชื่อ', dataIndex: 'name' },
        {
          title: 'ยอดเงิน',
          dataIndex: 'amount',
          align: 'right',
          render: (v: number) => v.toLocaleString('th-TH'),
        },
        {
          title: 'สถานะ',
          dataIndex: 'status',
          render: (s: Status, r) => <StatusTag status={s}>{r.label}</StatusTag>,
        },
      ]}
    />
  ),
};
