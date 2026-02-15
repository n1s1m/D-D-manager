import { useQuery } from '@tanstack/react-query';
import { itemApi, type ItemsFilters } from '@/lib/item/api';
import { useInfiniteResource } from './use-infinite-resource';

export function useItems() {
  return useQuery(itemApi.getItemsListQueryOptions());
}

export function useInfiniteItems(pageSize = 20, filters: ItemsFilters = {}) {
  return useInfiniteResource(
    itemApi.getItemsInfiniteQueryOptions.bind(itemApi),
    pageSize,
    filters
  );
}
