import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import type { ComponentProps } from 'react';

const buttonVariants = cva(
  'flex-row items-center justify-center gap-2 rounded-full web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-primary active:bg-red-600',
        secondary: 'bg-secondary active:bg-gray-300',
        outline: 'border border-border bg-transparent active:bg-muted',
        ghost: 'bg-transparent active:bg-muted',
        destructive: 'bg-destructive active:bg-red-700',
        link: 'bg-transparent',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4',
        lg: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva('font-sans-semibold text-label-md', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      ghost: 'text-foreground',
      destructive: 'text-destructive-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: '',
      sm: 'text-label-sm',
      lg: 'text-label-lg',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
  };

function Button({
  className,
  variant,
  size,
  children,
  disabled,
  textClassName,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size }),
        disabled && 'opacity-40',
        className,
      )}
      disabled={disabled}
      role="button"
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            buttonTextVariants({ variant, size }),
            textClassName,
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
