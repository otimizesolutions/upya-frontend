import { type ReactNode, useMemo } from 'react';
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from 'react-hook-form';
import { View, type TextInputProps } from 'react-native';
import { FormMessage } from './form-message';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type LoginTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextInputProps,
  'placeholderTextColor' | 'value' | 'onChangeText' | 'onBlur'
> & {
  control?: Control<TFieldValues>;
  name: TName;
  leftAdorn?: ReactNode;
  rightAdorn?: ReactNode;
  containerClassName?: string;
  helperText?: string;
};

/**
 * Input de login no estilo Figma (pill dark, ícone, sem label).
 * InputEmail / InputSenha — 11202:160 / 11202:175.
 */
export function LoginTextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  style,
  className,
  leftAdorn,
  rightAdorn,
  containerClassName,
  helperText,
  ...props
}: LoginTextFieldProps<TFieldValues, TName> & { className?: string }) {
  const { getFieldState, formState } = useFormContext();

  const fieldState = useMemo(() => {
    return getFieldState(name, formState);
  }, [getFieldState, name, formState]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View className={cn('w-full items-stretch', containerClassName)}>
          <View className="h-[52px] w-full flex-row items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4">
            {leftAdorn}
            <Input
              className={cn(
                'h-[52px] flex-1 border-0 bg-transparent px-0 font-sans text-[14px] leading-[1.5] text-gray-100',
                className,
              )}
              style={style}
              placeholderTextColor="#868b91"
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
}
