import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export type InputProps = TextInputProps & {
  className?: string;
};

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, placeholderTextColor, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-12 rounded-lg border border-border bg-input px-4 font-sans text-paragraph-md text-foreground',
          props.editable === false && 'opacity-50',
          className,
        )}
        placeholderTextColor={placeholderTextColor ?? '#626f86'}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
