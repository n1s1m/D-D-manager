import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { itemApi, type ItemsFilters } from '@/lib/item/api';

const LOAD_MORE_ROOT_MARGIN = '100px';

export function useItems() {
  return useQuery(itemApi.getItemsListQueryOptions());
}

export function useInfiniteItems(pageSize = 20, filters: ItemsFilters = {}) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const  { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(itemApi.getItemsInfiniteQueryOptions(pageSize, filters));

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

  return { 
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef
  };
}
