'use client';

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input, Label } from '@repo/ui-components';

interface FormPasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  error?: string;
  autoComplete?: 'current-password' | 'new-password';
}

export function FormPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = '••••••••',
  error,
  autoComplete = 'current-password',
}: FormPasswordFieldProps<T>) {
  const id = String(name);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={id}
            type="password"
            autoComplete={autoComplete}
            placeholder={placeholder}
            className="mt-1"
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
          />
        )}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
