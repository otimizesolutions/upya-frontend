import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable, type PressableProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import type { PropsWithChildren } from 'react';

const legacyButtonVariants = cva(
  'items-center justify-center rounded-full px-2.5 py-4',
  {
    variants: {
      variant: {
        default: 'border border-primary bg-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type ButtonProps = PropsWithChildren<
  Pick<PressableProps, 'onPress' | 'disabled' | 'style'> &
    VariantProps<typeof legacyButtonVariants> & {
      className?: string;
      textClassName?: string;
    }
>;

export const Button = ({
  children,
  disabled,
  onPress,
  style,
  className,
  textClassName,
  variant = 'default',
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        legacyButtonVariants({ variant }),
        disabled && 'opacity-30',
        className,
      )}
      style={style}
    >
      {typeof children === 'string' ? (
        <Text
          variant="labelMd"
          className={cn('text-primary-foreground', textClassName)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
