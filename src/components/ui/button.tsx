import { forwardRef, type ComponentProps, type ElementRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

/**
 * Botões alinhados ao Figma (UPYA / Buttons):
 * - default: verde neon (#e8ff00) + texto preto
 * - secondary: gray-900 (#1e1e1e) + texto neon-100 (#fdfff2)
 */
const buttonVariants = cva(
  'flex-row items-center justify-center gap-2 rounded-full p-2 web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-neon active:opacity-90',
        secondary: 'bg-gray-900 active:bg-gray-800',
        outline: 'border border-border bg-transparent active:bg-muted',
        ghost: 'bg-transparent active:bg-muted',
        destructive: 'bg-destructive active:bg-red-700',
        link: 'bg-transparent p-0',
      },
      size: {
        default: 'h-[52px] w-full px-2',
        sm: 'h-10 px-4',
        lg: 'h-14 w-full px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva('text-center', {
  variants: {
    variant: {
      default: 'font-display-semibold text-[20px] leading-[1.4] text-gray-1000',
      secondary:
        'font-display-semibold text-[20px] leading-[1.4] text-neon-100',
      outline: 'font-sans-semibold text-label-md text-foreground',
      ghost: 'font-sans-semibold text-label-md text-foreground',
      destructive:
        'font-sans-semibold text-label-md text-destructive-foreground',
      link: 'font-sans-semibold text-label-md text-primary underline',
    },
    size: {
      default: '',
      sm: 'text-label-sm',
      lg: '',
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

const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  (
    { className, variant, size, children, disabled, textClassName, ...props },
    ref,
  ) => {
    return (
      <Pressable
        ref={ref}
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
            className={cn(buttonTextVariants({ variant, size }), textClassName)}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
