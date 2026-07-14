import { useState } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { TextField, type TextFieldProps } from './text-field';

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

  return (
    <TextField
      secureTextEntry={!isPasswordVisible}
      rightAdorn={
        <Pressable
          onPress={() => setIsPasswordVisible((prev) => !prev)}
          hitSlop={8}
        >
          {isPasswordVisible ? (
            <EyeOff size={20} color="#172b4d" />
          ) : (
            <Eye size={20} color="#172b4d" />
          )}
        </Pressable>
      }
      {...props}
    />
  );
};
