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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
  containerClassName?: string;
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
  className,
  rightAdorn,
  containerClassName,
  helperText,
  ...props
}: TextFieldProps<TFieldValues, TName> & { className?: string }) => {
  const { getFieldState, formState } = useFormContext();

  const fieldState = useMemo(() => {
    return getFieldState(name, formState);
  }, [getFieldState, name, formState]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View className={cn('mb-5 items-stretch', containerClassName)}>
          <Label>{label}</Label>
          <View className="flex-row items-center rounded-lg border border-border bg-input px-4">
            <Input
              className={cn(
                'h-12 flex-1 border-0 bg-transparent px-0',
                className,
              )}
              style={style}
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
