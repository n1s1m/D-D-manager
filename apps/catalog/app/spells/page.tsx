'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteSpells } from '@/lib/hooks/use-spells';
import type { SpellsFilters as SpellsFiltersType } from '@/lib/spell/api';
import { LoadMoreSentinel } from '@/components/load-more-sentinel';
import { SpellsTable } from './spells-table';
import { SpellsFilters } from './spells-filters';
import { SpellsListSkeleton } from './spells-list-skeleton';

const PAGE_SIZE = 20;

const DEFAULT_FILTERS: SpellsFiltersType = { sort: 'level-asc' };

export default function SpellsPage() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get('characterId');
  const [filters, setFilters] = useState<SpellsFiltersType>(DEFAULT_FILTERS);
  const onFiltersChange = useCallback((next: SpellsFiltersType) => setFilters(next), []);

  const {
    data: spells = [],
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  } = useInfiniteSpells(PAGE_SIZE, filters);

  if (isLoading) {
    return <SpellsListSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-destructive">Failed to load spells.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">D&D Spells</h1>
      {characterId && (
        <p className="text-muted-foreground mb-4">
          Adding spells for character: {characterId}
        </p>
      )}
      <SpellsFilters onFiltersChange={onFiltersChange} />
      {spells.length > 0 && (filters.search || filters.school) && (
        <p className="text-muted-foreground text-sm mb-2">
          Showing {spells.length} spells
        </p>
      )}
      {spells.length === 0 ? (
        <p className="text-muted-foreground mt-8">
          {isLoading ? 'Loading...' : 'No spells match your filters.'}
        </p>
      ) : (
        <>
          <SpellsTable data={spells} characterId={characterId} />
          <LoadMoreSentinel loadMoreRef={loadMoreRef} isFetchingNextPage={isFetchingNextPage} />
        </>
      )}
    </div>
  );
}
