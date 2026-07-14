import { ThemeButtonVariant, useTheme } from '@/domains/theme/contexts';
import { PropsWithChildren } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  TextProps,
} from 'react-native';

export type ButtonProps = PropsWithChildren<
  Pick<TouchableOpacityProps, 'onPress' | 'disabled' | 'style'> & {
    variant?: ThemeButtonVariant;
    textStyle?: Pick<TextProps, 'style'>['style'];
  }
>;

export const Button = ({
  children,
  disabled,
  onPress,
  style,
  textStyle,
  variant = 'default',
}: ButtonProps) => {
  const { buttonVariants } = useTheme();
  const button = buttonVariants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
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
        disabled && styles.disabledButton,
        style,
      ]}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
  text: {},
});
