'use client';

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input, Label } from '@repo/ui-components';

interface FormNumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  min?: number;
  max?: number;
  error?: string;
}

export function FormNumberField<T extends FieldValues>({
  control,
  name,
  label,
  min,
  max,
  error,
}: FormNumberFieldProps<T>) {
  const id = String(name);
  const emptyFallback = min !== undefined ? min : 0;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={id}
            type="number"
            min={min}
            max={max}
            className="mt-1"
            value={field.value}
            onChange={(e) =>
              field.onChange(e.target.value === '' ? emptyFallback : Number(e.target.value))
            }
            onBlur={field.onBlur}
          />
        )}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
