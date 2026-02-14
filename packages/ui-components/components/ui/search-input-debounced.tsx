'use client';

import { useState, useEffect } from 'react';
import { Input } from './input';
import { useDebouncedValue } from '../../hooks/use-debounced-value';

export type SearchInputDebouncedProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> & {
  onDebouncedChange: (value: string) => void;
  delayMs?: number;
};

/**
 * Search input that keeps its own state and notifies parent only when the value
 * stops changing (debounced). Use this so the parent re-renders only when the
 * debounced value changes, not on every keystroke — avoids table/image flicker.
 */
export function SearchInputDebounced({
  onDebouncedChange,
  delayMs = 500,
  placeholder = 'Search...',
  className,
  ...rest
}: SearchInputDebouncedProps) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, delayMs);

  useEffect(() => {
    onDebouncedChange(debouncedSearch);
  }, [debouncedSearch, onDebouncedChange]);

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className={className}
      {...rest}
    />
  );
}
