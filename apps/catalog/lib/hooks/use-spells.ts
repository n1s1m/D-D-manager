import { useQuery } from '@tanstack/react-query';
import { spellApi, type SpellsFilters } from '@/lib/spell/api';
import { useInfiniteResource } from './use-infinite-resource';

export function useSpells() {
  return useQuery(spellApi.getSpellsListQueryOptions());
}

export function useInfiniteSpells(pageSize = 20, filters: SpellsFilters = {}) {
  return useInfiniteResource(
    spellApi.getSpellsInfiniteQueryOptions.bind(spellApi),
    pageSize,
    filters
  );
}
