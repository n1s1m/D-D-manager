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
import type { SpellSchool } from 'shared-types';
import type { SpellsFilters as SpellsFiltersType, SpellsSortOption } from '@/lib/spell/api';

export const SPELL_SCHOOLS: { value: '' | SpellSchool; label: string }[] = [
  { value: '', label: 'All schools' },
  { value: 'abjuration', label: 'Abjuration' },
  { value: 'conjuration', label: 'Conjuration' },
  { value: 'divination', label: 'Divination' },
  { value: 'enchantment', label: 'Enchantment' },
  { value: 'evocation', label: 'Evocation' },
  { value: 'illusion', label: 'Illusion' },
  { value: 'necromancy', label: 'Necromancy' },
  { value: 'transmutation', label: 'Transmutation' },
];

const SORT_OPTIONS: { value: SpellsSortOption; label: string }[] = [
  { value: 'level-asc', label: 'Level (low to high)' },
  { value: 'level-desc', label: 'Level (high to low)' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

const DEFAULT_SORT: SpellsSortOption = 'level-asc';

export type SpellsFiltersProps = {
  onFiltersChange: (filters: SpellsFiltersType) => void;
};

export const SpellsFilters = memo(function SpellsFilters({
  onFiltersChange,
}: SpellsFiltersProps) {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<'' | SpellSchool>('');
  const [sortBy, setSortBy] = useState<SpellsSortOption>(DEFAULT_SORT);

  useEffect(() => {
    onFiltersChange({
      search: search || undefined,
      school: schoolFilter || undefined,
      sort: sortBy,
    });
  }, [search, schoolFilter, sortBy, onFiltersChange]);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      <SearchInputDebounced
        onDebouncedChange={setSearch}
        delayMs={500}
        placeholder="Search by name or description..."
        className="sm:max-w-xs"
        aria-label="Search spells"
      />
      <Select
        value={schoolFilter || 'all'}
        onValueChange={(v) => setSchoolFilter((v === 'all' ? '' : v) as '' | SpellSchool)}
      >
        <SelectTrigger className="w-full sm:w-[180px]" aria-label="School of magic">
          <SelectValue placeholder="All schools" />
        </SelectTrigger>
        <SelectContent>
          {SPELL_SCHOOLS.map(({ value, label }) => (
            <SelectItem key={value || 'all'} value={value || 'all'}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SpellsSortOption)}>
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
