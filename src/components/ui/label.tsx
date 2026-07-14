import * as React from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export type LabelProps = React.ComponentProps<typeof Text> & {
  className?: string;
};

function Label({ className, ...props }: LabelProps) {
  return (
    <Text
      variant="labelMd"
      className={cn('mb-1.5 text-content-primary', className)}
      {...props}
    />
  );
}

export { Label };
