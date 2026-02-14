import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { escapeIlike } from 'supabase-client';
import { supabase } from 'supabase-client';
import { itemSchema, itemsArraySchema, type Item, type ItemType } from 'shared-types';

const ITEMS_PAGE_SIZE = 20;

export type ItemsSortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const SORT_ORDER: Record<ItemsSortOption, { column: 'name' | 'price'; ascending: boolean }> = {
  'name-asc': { column: 'name', ascending: true },
  'name-desc': { column: 'name', ascending: false },
  'price-asc': { column: 'price', ascending: true },
  'price-desc': { column: 'price', ascending: false },
};

export type ItemsFilters = {
  search?: string;
  type?: ItemType;
  sort?: ItemsSortOption;
};

export const itemApi = {
  baseKey: 'item' as const,

  queryKeys: {
    all: ['item'] as const,
    lists: () => ['items'] as const,
    list: () => itemApi.queryKeys.lists(),
    details: () => [...itemApi.queryKeys.all] as const,
    detail: (id: string) => [...itemApi.queryKeys.details(), id] as const,
  },

  getItemQueryOptions: (itemId: string) => {
    return queryOptions({
      queryKey: itemApi.queryKeys.detail(itemId),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', itemId)
          .abortSignal(signal)
          .single();

        if (error) throw error;
        return itemSchema.parse(data);
      },
      enabled: !!itemId,
    });
  },

  getItemsListQueryOptions: () => {
    return queryOptions({
      queryKey: itemApi.queryKeys.list(),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('name', { ascending: true })
          .abortSignal(signal);

        if (error) throw error;
        return itemsArraySchema.parse(data ?? []);
      },
    });
  },

  getItemsInfiniteQueryOptions: (
    pageSize = ITEMS_PAGE_SIZE,
    filters: ItemsFilters = {}
  ) => {
    const { search, type, sort = 'name-asc' } = filters;
    return infiniteQueryOptions({
      queryKey: [...itemApi.queryKeys.list(), 'infinite', pageSize, filters],
      queryFn: async ({ pageParam, signal }) => {
        const from = pageParam * pageSize;
        const to = from + pageSize - 1;
        let query = supabase.from('items').select('*');

        if (type) {
          query = query.eq('type', type);
        }
        const searchTrim = search?.trim();
        if (searchTrim) {
          const escaped = escapeIlike(searchTrim);
          const pattern = `%${escaped}%`;
          query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
        }

        const { column, ascending } = SORT_ORDER[sort];
        query = query.order(column, { ascending });

        const { data, error } = await query.range(from, to).abortSignal(signal);
        if (error) throw error;
        return itemsArraySchema.parse(data ?? []) as Item[];
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < pageSize ? undefined : allPages.length,
      placeholderData: (previousData) => previousData,
      select: (result) => result.pages.flatMap((page) => page) as Item[],
    });
  },
};
