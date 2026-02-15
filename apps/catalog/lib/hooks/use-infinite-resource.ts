import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const LOAD_MORE_ROOT_MARGIN = '100px';

/**
 * Generic hook for infinite list with intersection-based "load more".
 * Used by shop (items) and spells to avoid duplicating observer and query wiring.
 */
type InfiniteQueryOptionsArg = Parameters<typeof useInfiniteQuery>[0];

export function useInfiniteResource<TFilters>(
  getQueryOptions: (pageSize: number, filters: TFilters) => unknown,
  pageSize: number,
  filters: TFilters
) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const options = getQueryOptions(pageSize, filters) as InfiniteQueryOptionsArg;
  const result = useInfiniteQuery(options);
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
