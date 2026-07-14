import { Link as BaseLink, type LinkProps as BaseLinkProps } from 'expo-router';
import { cn } from '@/lib/utils';

export type LinkProps = BaseLinkProps & {
  className?: string;
};

export const Link = ({ className, style, ...props }: LinkProps) => {
  return (
    <BaseLink
      className={cn(
        'font-sans-semibold text-label-md text-primary',
        className,
      )}
      style={style}
      {...props}
    />
  );
};
