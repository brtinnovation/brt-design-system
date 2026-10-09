import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/utils';

/**
 * ตาม Figma Component/Button: variant = Primary / Secondary / Tertiary, intent = Brand / Neutral / Error
 * ใช้ utility ที่ผูกกับ token เท่านั้น — ห้าม arbitrary value (bg-[#...], rounded-[10px])
 * class ต้องเขียนเต็มเป็นข้อความ (ห้ามประกอบด้วย template string) เพราะ Tailwind ของโปรเจกต์ scan จาก dist
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-8 rounded-sm border border-transparent font-sans font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:border-button-disabled disabled:bg-button-disabled disabled:text-button-disabled',
  {
    variants: {
      variant: { primary: '', secondary: '', tertiary: '' },
      intent: { brand: '', neutral: '', error: '' },
      size: {
        sm: 'h-32 px-12 text-button-sm',
        md: 'h-40 px-16 text-button-md',
        lg: 'h-48 px-20 text-button-lg',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        intent: 'brand',
        class:
          'bg-button-primary-brand text-button-primary-brand hover:bg-button-primary-brand-hover hover:text-button-primary-brand-hover',
      },
      {
        variant: 'primary',
        intent: 'neutral',
        class:
          'bg-button-primary-neutral text-button-primary-neutral hover:bg-button-primary-neutral-hover hover:text-button-primary-neutral-hover',
      },
      {
        variant: 'primary',
        intent: 'error',
        class:
          'bg-button-primary-error text-button-primary-error hover:bg-button-primary-error-hover hover:text-button-primary-error-hover',
      },
      {
        variant: 'secondary',
        intent: 'brand',
        class:
          'border-button-secondary-brand bg-button-secondary-brand text-button-secondary-brand hover:border-button-secondary-brand-hover hover:bg-button-secondary-brand-hover hover:text-button-secondary-brand-hover',
      },
      {
        variant: 'secondary',
        intent: 'neutral',
        class:
          'border-button-secondary-neutral bg-button-secondary-neutral text-button-secondary-neutral hover:border-button-secondary-neutral-hover hover:bg-button-secondary-neutral-hover hover:text-button-secondary-neutral-hover',
      },
      {
        variant: 'secondary',
        intent: 'error',
        class:
          'border-button-secondary-error bg-button-secondary-error text-button-secondary-error hover:border-button-secondary-error-hover hover:bg-button-secondary-error-hover hover:text-button-secondary-error-hover',
      },
      {
        variant: 'tertiary',
        intent: 'brand',
        class:
          'bg-button-tertiary-brand text-button-tertiary-brand hover:bg-button-tertiary-brand-hover hover:text-button-tertiary-brand-hover',
      },
      {
        variant: 'tertiary',
        intent: 'neutral',
        class:
          'bg-button-tertiary-neutral text-button-tertiary-neutral hover:bg-button-tertiary-neutral-hover hover:text-button-tertiary-neutral-hover',
      },
      {
        variant: 'tertiary',
        intent: 'error',
        class:
          'bg-button-tertiary-error text-button-tertiary-error hover:bg-button-tertiary-error-hover hover:text-button-tertiary-error-hover',
      },
    ],
    defaultVariants: { variant: 'primary', intent: 'brand', size: 'md' },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  intent,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, intent, size }), className)} {...props} />;
}

export { buttonVariants };
