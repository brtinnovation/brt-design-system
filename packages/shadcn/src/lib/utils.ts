import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * ชื่อ token ของ BRT ที่ tailwind-merge ไม่รู้จัก — ถ้าไม่บอก `text-h1 text-primary` จะถูกมองเป็นสีทั้งคู่และ h1 หายไป
 * ต้องตรงกับ `--text-*` / `--leading-*` ใน @brt/tailwind/theme.css (test ตรวจให้)
 */
export const brtFontSizes = [
  'display1',
  'display2',
  'display3',
  'display4',
  'display5',
  'display6',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'page-title',
  'body-lg',
  'body-md',
  'body-sm',
  'body-xs',
  'button-lg',
  'button-md',
  'button-sm',
  'error-message',
];

export const brtLineHeights = [
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl',
  '11xl',
  '12xl',
  '13xl',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: brtFontSizes }],
      leading: [{ leading: brtLineHeights }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
