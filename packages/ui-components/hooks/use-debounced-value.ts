'use client';

import { debounce } from 'lodash';
import { useState, useEffect, useMemo } from 'react';

const SEARCH_DEBOUNCE_MS = 500;
/**
 * Returns a debounced value that updates after `delayMs` ms of no changes (via lodash debounce).
 * Use for controlled inputs: pass immediate value to input, use returned value for query keys / API.
 */
export function useDebouncedValue<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  const setDebouncedValue = useMemo(
    () =>
      debounce((v: T) => {
        setDebounced(v);
      }, delayMs),
    [delayMs]
  );

  useEffect(() => {
    setDebouncedValue(value);
    return () => setDebouncedValue.cancel();
  }, [value, setDebouncedValue]);

  return debounced;
}
