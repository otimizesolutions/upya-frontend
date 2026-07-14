import type { PropsWithChildren } from 'react';
import { Link, type LinkProps } from 'expo-router';
import { Button, type ButtonProps } from '@/components/ui/button';

export type ButtonLinkProps = PropsWithChildren<
  Omit<LinkProps, 'children' | 'asChild'> &
    Pick<
      ButtonProps,
      'variant' | 'size' | 'className' | 'textClassName' | 'disabled'
    >
>;

/** Link estilizado com o Button shadcn (variantes do Figma). */
export const ButtonLink = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  textClassName,
  disabled,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link {...props} asChild>
      <Button
        variant={variant}
        size={size}
        className={className}
        textClassName={textClassName}
        disabled={disabled}
      >
        {children}
      </Button>
    </Link>
  );
};
