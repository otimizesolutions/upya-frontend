import { ReactNode, useMemo } from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { ThemeInputVariant, useTheme } from '@/domains/theme/contexts';
import {
  Text,
  TextInput,
  View,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FormMessage } from './form-message';

export type TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextInputProps,
  'placeholderTextColor' | 'value' | 'onChangeText' | 'onBlur'
> & {
  control?: Control<TFieldValues>;
  name: TName;
  label: string;
  rightAdorn?: ReactNode;
  variant?: ThemeInputVariant;
  containerStyle?: StyleProp<ViewStyle>;
  helperText?: string;
};

export const TextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  style,
  rightAdorn,
  containerStyle,
  helperText,
  variant = 'default',
  ...props
}: TextFieldProps<TFieldValues, TName>) => {
  const { inputVariants } = useTheme();
  const { getFieldState, formState } = useFormContext();
  const input = inputVariants[variant];

  const fieldState = useMemo(() => {
    return getFieldState(name, formState);
  }, [name, formState]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View
          style={[
            styles.container,
            { marginBottom: input.spacing },
            containerStyle,
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: input.labelColor,
                fontFamily: input.labelFontFamily,
                fontSize: input.labelFontSize,
                marginBottom: input.labelSpacing,
              },
            ]}
          >
            {label}
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                borderWidth: input.borderWidth,
                borderColor: input.borderColor,
                backgroundColor: input.backgroundColor,
                borderRadius: input.borderRadius,
                paddingHorizontal: input.paddingHorizontal,
                paddingVertical: input.paddingVertical,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  fontFamily: input.fontFamily,
                  fontSize: input.fontSize,
                },
                style,
              ]}
              placeholderTextColor={input.placeholderColor}
              onChangeText={(text) => field.onChange(text)}
              value={field.value}
              ref={field.ref}
              onBlur={() => field.onBlur()}
              {...props}
            />
            {rightAdorn}
          </View>

          <FormMessage
            error={fieldState?.error?.message}
            message={helperText}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  label: {
    marginBottom: 5,
  },
});
