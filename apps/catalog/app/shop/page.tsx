'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteItems } from '@/lib/hooks/use-items';
import { useEmbedCharacterGold, useEmbedBuy, useEmbedBuyPending } from '@/lib/hooks/use-embed-shop';
import type { Item } from 'shared-types';
import type { ItemsFilters } from '@/lib/item/api';
import { LoadMoreSentinel } from '@/components/load-more-sentinel';
import { ItemsTable } from './items-table';
import { ShopFilters } from './shop-filters';
import { ShopListSkeleton } from './shop-list-skeleton';

const PAGE_SIZE = 20;

const DEFAULT_FILTERS: ItemsFilters = { sort: 'name-asc' };

export default function ShopPage() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get('characterId');
  const embed = searchParams.get('embed') === 'true';
  const [filters, setFilters] = useState<ItemsFilters>(DEFAULT_FILTERS);
  const onFiltersChange = useCallback((next: ItemsFilters) => setFilters(next), []);

  const characterGold = useEmbedCharacterGold(embed);
  const handleBuy = useEmbedBuy(embed, characterId);
  const isPendingBuy = useEmbedBuyPending(embed);

  const {
    data: rawItems = [],
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  } = useInfiniteItems(PAGE_SIZE, filters);
  const items = rawItems as Item[];

  if (isLoading) {
    return <ShopListSkeleton />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">D&D Shop</h1>
      {embed && characterId && (
        <p className="text-muted-foreground mb-4">
          Your gold: <strong>{characterGold ?? '…'} gp</strong>
        </p>
      )}
      {!embed && characterId && (
        <p className="text-muted-foreground mb-4">Shopping for character: {characterId}</p>
      )}
      <ShopFilters onFiltersChange={onFiltersChange} />
      {items.length > 0 && (filters.search || filters.type) && (
        <p className="text-muted-foreground text-sm mb-2">
          Showing {items.length} items
        </p>
      )}
      {items.length === 0 ? (
        <p className="text-muted-foreground py-8">
          {isLoading ? 'Loading...' : 'No items match your search. Try a different query or type.'}
        </p>
      ) : (
        <>
          <ItemsTable
            data={items}
            characterId={characterId}
            embed={embed}
            characterGold={characterGold}
            isPendingBuy={isPendingBuy}
            onBuy={handleBuy}
          />
          <LoadMoreSentinel loadMoreRef={loadMoreRef} isFetchingNextPage={isFetchingNextPage} />
        </>
      )}
    </div>
  );
}
