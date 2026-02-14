import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { escapeIlike } from 'supabase-client';
import { supabase } from 'supabase-client';
import { spellSchema, spellsArraySchema, type SpellSchool } from 'shared-types';

const SPELLS_PAGE_SIZE = 20;

export type SpellsSortOption = 'level-asc' | 'level-desc' | 'name-asc' | 'name-desc';

const SORT_ORDER: Record<
  SpellsSortOption,
  { column: 'level' | 'name'; ascending: boolean }
> = {
  'level-asc': { column: 'level', ascending: true },
  'level-desc': { column: 'level', ascending: false },
  'name-asc': { column: 'name', ascending: true },
  'name-desc': { column: 'name', ascending: false },
};

export type SpellsFilters = {
  search?: string;
  school?: SpellSchool;
  components?: string;
  range?: string;
  sort?: SpellsSortOption;
};

export const spellApi = {
  baseKey: 'spell' as const,

  queryKeys: {
    all: ['spell'] as const,
    lists: () => ['spells'] as const,
    list: () => spellApi.queryKeys.lists(),
    details: () => [...spellApi.queryKeys.all] as const,
    detail: (id: string) => [...spellApi.queryKeys.details(), id] as const,
  },

  getSpellQueryOptions: (spellId: string) => {
    return queryOptions({
      queryKey: spellApi.queryKeys.detail(spellId),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('spells')
          .select('*')
          .eq('id', spellId)
          .abortSignal(signal)
          .single();

        if (error) throw error;
        return spellSchema.parse(data);
      },
      enabled: !!spellId,
    });
  },

  getSpellsListQueryOptions: () => {
    return queryOptions({
      queryKey: spellApi.queryKeys.list(),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('spells')
          .select('*')
          .order('level', { ascending: true })
          .order('name', { ascending: true })
          .abortSignal(signal);

        if (error) throw error;
        return spellsArraySchema.parse(data ?? []);
      },
    });
  },

  getSpellsInfiniteQueryOptions: (
    pageSize = SPELLS_PAGE_SIZE,
    filters: SpellsFilters = {}
  ) => {
    const { search, school, components, range, sort = 'level-asc' } = filters;
    return infiniteQueryOptions({
      queryKey: [...spellApi.queryKeys.list(), 'infinite', pageSize, filters],
      queryFn: async ({ pageParam, signal }) => {
        const from = pageParam * pageSize;
        const to = from + pageSize - 1;
        let query = supabase.from('spells').select('*');

        if (school) {
          query = query.eq('school', school);
        }
        if (components) {
          query = query.eq('components', components);
        }
        if (range) {
          query = query.eq('range', range);
        }
        const searchTrim = search?.trim();
        if (searchTrim) {
          const escaped = escapeIlike(searchTrim);
          const pattern = `%${escaped}%`;
          query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
        }

        const { column, ascending } = SORT_ORDER[sort];
        query = query.order(column, { ascending });
        if (column === 'level') {
          query = query.order('name', { ascending: true });
        } else {
          query = query.order('level', { ascending: true });
        }

        const { data, error } = await query.range(from, to).abortSignal(signal);
        if (error) throw error;
        return spellsArraySchema.parse(data ?? []);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < pageSize ? undefined : allPages.length,
      placeholderData: (previousData) => previousData,
      select: (result) => result.pages.flatMap((page) => page),
    });
  },
};
