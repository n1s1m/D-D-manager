'use client';

import * as React from 'react';
import TextareaAutosizeLib from 'react-textarea-autosize';

import { cn } from '../../lib/utils';

export interface TextareaAutosizeProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  minRows?: number;
  maxRows?: number;
}

const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ className, ...props }, ref) => {
  return (
    <TextareaAutosizeLib
      ref={ref}
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      minRows={3}
      {...props}
    />
  );
});
TextareaAutosize.displayName = 'TextareaAutosize';

export { TextareaAutosize };
