import { Link as BaseLink, LinkProps as BaseLinkProps } from 'expo-router';
import { ThemeLinkVariant, useTheme } from '@/domains/theme/contexts';

export type LinkProps = BaseLinkProps & {
  variant?: ThemeLinkVariant;
};

export const Link = ({ style, variant = 'default', ...props }: LinkProps) => {
  const { linkVariants } = useTheme();
  const link = linkVariants[variant];

  return (
    <BaseLink
      style={[
        {
          color: link.color,
          fontFamily: link.fontFamily,
          fontSize: link.fontSize,
          fontWeight: link.fontWeight,
        },
        style,
      ]}
      {...props}
    />
  );
};
