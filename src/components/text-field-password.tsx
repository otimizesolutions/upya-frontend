import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TextFieldProps, TextField } from './text-field';
import { useTheme } from '@/domains/theme/contexts';

export type TextFieldPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<TextFieldProps<TFieldValues, TName>, 'secureTextEntry' | 'rightAdorn'>;

export const TextFieldPassword = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: TextFieldPasswordProps<TFieldValues, TName>,
) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { inputVariants } = useTheme();
  const input = inputVariants[props.variant || 'default'];

  return (
    <TextField
      secureTextEntry={!isPasswordVisible}
      rightAdorn={
        <TouchableOpacity onPress={() => setIsPasswordVisible((prev) => !prev)}>
          <Entypo
            name={isPasswordVisible ? 'eye-with-line' : 'eye'}
            size={input.adornIconSize}
            color={input.color}
          />
        </TouchableOpacity>
      }
      {...props}
    />
  );
};
