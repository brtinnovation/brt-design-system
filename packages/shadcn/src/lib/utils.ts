import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// แจ้ง tailwind-merge ว่ามี class ตาม token ของ BRT (text-md, p-md) ไม่อย่างนั้นจะ merge ผิด
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
