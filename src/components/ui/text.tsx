import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('text-content-primary', {
  variants: {
    variant: {
      default: 'font-sans text-paragraph-md',
      displayLg: 'font-display text-display-lg',
      displayMd: 'font-display text-display-md',
      displaySm: 'font-display text-display-sm',
      displayXs: 'font-display text-display-xs',
      heading2xl: 'font-heading text-heading-2xl',
      headingXl: 'font-heading text-heading-xl',
      headingLg: 'font-heading text-heading-lg',
      headingMd: 'font-heading text-heading-md',
      headingSm: 'font-heading text-heading-sm',
      headingXs: 'font-heading text-heading-xs',
      labelLg: 'font-sans-semibold text-label-lg',
      labelMd: 'font-sans-semibold text-label-md',
      labelSm: 'font-sans-semibold text-label-sm',
      labelXs: 'font-sans-semibold text-label-xs',
      paragraphLg: 'font-heading-regular text-paragraph-lg',
      paragraphMd: 'font-heading-regular text-paragraph-md',
      paragraphSm: 'font-heading-regular text-paragraph-sm',
      paragraphXs: 'font-heading-regular text-paragraph-xs',
      muted: 'font-sans text-paragraph-sm text-content-secondary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type TextProps = RNTextProps &
  VariantProps<typeof textVariants> & {
    className?: string;
  };

export function Text({ className, variant, ...props }: TextProps) {
  return (
    <RNText className={cn(textVariants({ variant }), className)} {...props} />
  );
}
