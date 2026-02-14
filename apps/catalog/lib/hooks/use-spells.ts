import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { spellApi, type SpellsFilters } from '@/lib/spell/api';

const LOAD_MORE_ROOT_MARGIN = '100px';

export function useSpells() {
  return useQuery(spellApi.getSpellsListQueryOptions());
}

export function useInfiniteSpells(pageSize = 20, filters: SpellsFilters = {}) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const result = useInfiniteQuery(spellApi.getSpellsInfiniteQueryOptions(pageSize, filters));
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = result;

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ...result, loadMoreRef };
}
