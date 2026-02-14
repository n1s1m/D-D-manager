'use client';

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input, Label, Textarea } from '@repo/ui-components';

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  multilineMinRows?: number;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  error,
  multiline = false,
  multilineMinRows = 3,
}: FormTextFieldProps<T>) {
  const id = String(name);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          multiline ? (
            <Textarea
              id={id}
              className="mt-1 min-h-[80px]"
              placeholder={placeholder}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              rows={multilineMinRows}
            />
          ) : (
            <Input
              id={id}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className="mt-1"
              placeholder={placeholder}
            />
          )
        }
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
