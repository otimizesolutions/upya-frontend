import { ThemeButtonVariant, useTheme } from '@/domains/theme/contexts';
import { PropsWithChildren } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Link, LinkProps } from 'expo-router';

export type ButtonLinkProps = PropsWithChildren<
  Omit<LinkProps, 'children'> & {
    variant?: ThemeButtonVariant;
    textStyle?: Pick<TextProps, 'style'>['style'];
  }
>;

export const ButtonLink = ({
  children,
  style,
  textStyle,
  variant = 'default',
  ...props
}: ButtonLinkProps) => {
  const { buttonVariants } = useTheme();
  const button = buttonVariants[variant];

  return (
    <Link
      style={[
        styles.button,
        {
          backgroundColor: button.backgroundColor,
          borderColor: button.borderColor,
          borderWidth: button.borderWidth,
          paddingHorizontal: button.paddingHorizontal,
          paddingVertical: button.paddingVertical,
          borderRadius: button.borderRadius,
        },
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            {
              color: button.color,
              fontSize: button.fontSize,
              fontWeight: button.fontWeight,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        <>{children}</>
      )}
    </Link>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
