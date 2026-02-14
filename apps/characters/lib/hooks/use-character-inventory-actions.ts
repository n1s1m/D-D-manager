'use client';

import { useCallback, useMemo } from 'react';
import { toast } from '@repo/ui-components';
import type { InventoryEntry } from 'shared-types';
import { useCharacterItems } from '@/lib/hooks/use-character-items';
import { useInventoryHighlight } from '@/lib/hooks/use-inventory-highlight';

export interface CharacterDetailInventoryActions {
  handleEquip: (entry: InventoryEntry, slot: 'weapon' | 'armor') => void;
  handleUnequip: (entry: InventoryEntry) => void;
  handleDrop: (entry: InventoryEntry, qty?: number) => void;
  handleSell: (entry: InventoryEntry) => void;
  handleUseConsumable: (entry: InventoryEntry, healAmount: number) => void;
  inventoryPending: {
    equip: boolean;
    unequip: boolean;
    drop: boolean;
    sell: boolean;
    consumable: boolean;
  };
  highlightedIdsArray: string[];
}

export function useCharacterInventoryActions(characterId: string, inventory: InventoryEntry[]): CharacterDetailInventoryActions {
  const { equipItem, unequipItem, dropItem, sellItem, useConsumable } = useCharacterItems();
  const { highlightedIdsArray, addHighlight } = useInventoryHighlight(inventory);

  const inventoryPending = useMemo(
    () => ({
      equip: equipItem.isPending,
      unequip: unequipItem.isPending,
      drop: dropItem.isPending,
      sell: sellItem.isPending,
      consumable: useConsumable.isPending,
    }),
    [
      equipItem.isPending,
      unequipItem.isPending,
      dropItem.isPending,
      sellItem.isPending,
      useConsumable.isPending,
    ]
  );

  const handleEquip = useCallback(
    (entry: InventoryEntry, slot: 'weapon' | 'armor') => {
      equipItem.mutate(
        { characterId, characterItemId: entry.character_item_id, slot },
        {
          onSuccess: (r) => {
            if (r.ok) {
              addHighlight(entry.character_item_id);
              toast.success(`Equipped ${entry.name}`);
            } else {
              toast.error(r.error);
            }
          },
          onError: () => toast.error('Failed to equip'),
        }
      );
    },
    [characterId, equipItem.mutate, addHighlight]
  );

  const handleUnequip = useCallback(
    (entry: InventoryEntry) => {
      unequipItem.mutate(
        { characterId, characterItemId: entry.character_item_id },
        {
          onSuccess: () => {
            addHighlight(entry.character_item_id);
            toast.success(`Unequipped ${entry.name}`);
          },
          onError: () => toast.error('Failed to unequip'),
        }
      );
    },
    [characterId, unequipItem.mutate, addHighlight]
  );

  const handleDrop = useCallback(
    (entry: InventoryEntry, qty?: number) => {
      dropItem.mutate(
        { characterId, characterItemId: entry.character_item_id, quantity: qty },
        {
          onSuccess: () => toast.success('Dropped'),
          onError: () => toast.error('Failed to drop'),
        }
      );
    },
    [characterId, dropItem.mutate]
  );

  const handleSell = useCallback(
    (entry: InventoryEntry) => {
      sellItem.mutate(
        { characterId, characterItemId: entry.character_item_id },
        {
          onSuccess: (r) =>
            r.ok ? toast.success(`Sold ${entry.name}`) : toast.error(r.error),
          onError: () => toast.error('Failed to sell'),
        }
      );
    },
    [characterId, sellItem.mutate]
  );

  const handleUseConsumable = useCallback(
    (entry: InventoryEntry, healAmount: number) => {
      useConsumable.mutate(
        { characterId, characterItemId: entry.character_item_id, healAmount },
        {
          onSuccess: (r) => {
            if (r?.ok)
              toast.success(
                healAmount > 0
                  ? `Used ${entry.name}. Restored ${r.healed ?? healAmount} HP.`
                  : `Used ${entry.name}`
              );
            else toast.error(r?.error);
          },
          onError: () => toast.error('Failed to use'),
        }
      );
    },
    [characterId, useConsumable.mutate]
  );

  return {
    handleEquip,
    handleUnequip,
    handleDrop,
    handleSell,
    handleUseConsumable,
    inventoryPending,
    highlightedIdsArray,
  };
}
