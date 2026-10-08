import { Tag, type TagProps } from 'antd';

// ตัวอย่าง component ของ BRT: ห่อ antd โดยคง props เดิมไว้ครบ แล้วเพิ่มค่าเริ่มต้นของ BRT
export type Status = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface StatusTagProps extends Omit<TagProps, 'color'> {
  status: Status;
}

const statusColor: Record<Status, TagProps['color']> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'processing',
  default: 'default',
};

export function StatusTag({ status, ...rest }: StatusTagProps) {
  return <Tag bordered={false} color={statusColor[status]} {...rest} />;
}
