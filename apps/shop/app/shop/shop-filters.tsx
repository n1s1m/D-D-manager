'use client';

import { memo, useState, useEffect } from 'react';
import {
  SearchInputDebounced,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui-components';
import type { ItemType } from 'shared-types';
import type { ItemsFilters, ItemsSortOption } from '@/lib/item/api';

const ITEM_TYPES: { value: '' | ItemType; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'armor', label: 'Armor' },
  { value: 'consumable', label: 'Consumable' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS: { value: ItemsSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const DEFAULT_SORT: ItemsSortOption = 'name-asc';

export type ShopFiltersProps = {
  onFiltersChange: (filters: ItemsFilters) => void;
};

export const ShopFilters = memo(function ShopFilters({ onFiltersChange }: ShopFiltersProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'' | ItemType>('');
  const [sortBy, setSortBy] = useState<ItemsSortOption>(DEFAULT_SORT);

  useEffect(() => {
    onFiltersChange({
      search: search || undefined,
      type: typeFilter || undefined,
      sort: sortBy,
    });
  }, [search, typeFilter, sortBy, onFiltersChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <SearchInputDebounced
        onDebouncedChange={setSearch}
        delayMs={500}
        placeholder="Search by name or description..."
        className="sm:max-w-xs"
        aria-label="Search items"
      />
      <Select
        value={typeFilter || 'all'}
        onValueChange={(v) => setTypeFilter((v === 'all' ? '' : v) as '' | ItemType)}
      >
        <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by type">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          {ITEM_TYPES.map(({ value, label }) => (
            <SelectItem key={value || 'all'} value={value || 'all'}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={(v) => setSortBy(v as ItemsSortOption)}>
        <SelectTrigger className="w-full sm:w-[180px]" aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
