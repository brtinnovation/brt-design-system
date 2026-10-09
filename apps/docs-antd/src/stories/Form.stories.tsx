import { Button, DatePicker, Form, Input, Select } from '@brt-innovation/antd';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = { title: 'Components/Form' };
export default meta;

export const Example: StoryObj = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="ชื่อ" name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
        <Input placeholder="ชื่อ-นามสกุล" />
      </Form.Item>
      <Form.Item label="ประเภท" name="type">
        <Select
          placeholder="เลือกประเภท"
          options={[
            { value: 'a', label: 'บุคคล' },
            { value: 'b', label: 'นิติบุคคล' },
          ]}
        />
      </Form.Item>
      <Form.Item label="วันที่" name="date">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        ส่ง
      </Button>
    </Form>
  ),
};
