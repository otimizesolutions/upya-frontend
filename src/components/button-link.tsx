import type { PropsWithChildren } from 'react';
import { Link, type LinkProps } from 'expo-router';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export type ButtonLinkProps = PropsWithChildren<
  Omit<LinkProps, 'children'> & {
    className?: string;
    textClassName?: string;
  }
>;

export const ButtonLink = ({
  children,
  style,
  className,
  textClassName,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link
      className={cn(
        'items-center justify-center rounded-full border border-primary bg-primary px-2.5 py-4',
        className,
      )}
      style={style}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          variant="labelMd"
          className={cn('text-center text-primary-foreground', textClassName)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Link>
  );
};
