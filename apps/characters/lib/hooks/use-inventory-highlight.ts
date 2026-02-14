'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const HIGHLIGHT_DURATION_MS = 2500;

export function useInventoryHighlight<T extends { character_item_id: string }>(
  inventory: T[]
) {
  const [highlightedItemIds, setHighlightedItemIds] = useState<Set<string>>(new Set());
  const prevIdsRef = useRef<Set<string>>(new Set());

  const addHighlight = useCallback((id: string) => {
    setHighlightedItemIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setHighlightedItemIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, HIGHLIGHT_DURATION_MS);
  }, []);

  useEffect(() => {
    const ids = new Set(inventory.map((e) => e.character_item_id));
    const prev = prevIdsRef.current;
    const added = prev.size > 0 ? [...ids].filter((id) => !prev.has(id)) : [];
    if (added.length > 0) {
      added.forEach((id) => addHighlight(id));
    }
    prevIdsRef.current = ids;
  }, [inventory, addHighlight]);

  const highlightedIdsArray = useMemo(
    () => Array.from(highlightedItemIds),
    [highlightedItemIds]
  );

  return { highlightedIdsArray, addHighlight };
}
