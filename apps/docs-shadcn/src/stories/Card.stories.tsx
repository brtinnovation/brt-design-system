import { Button, Card, CardContent, CardHeader, CardTitle } from '@brt/shadcn';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = { title: 'Components/Card' };
export default meta;

export const Example: StoryObj = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>แพ็กเกจเริ่มต้น</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-16">
        <p>เหมาะสำหรับทีมเล็กที่เพิ่งเริ่มต้นใช้งาน</p>
        <Button className="self-start">เลือกแพ็กเกจ</Button>
      </CardContent>
    </Card>
  ),
};
