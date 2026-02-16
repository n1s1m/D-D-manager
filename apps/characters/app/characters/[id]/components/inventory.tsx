'use client';

import { useMemo } from 'react';
import { useCharacters } from '@/lib/hooks/use-characters';
import { useCharacterItems } from '@/lib/hooks/use-character-items';
import { useInventoryHighlight } from '@/lib/hooks/use-inventory-highlight';
import { InventoryItem } from './inventory-item';

interface InventoryProps {
  characterId: string;
}

export function Inventory({ characterId }: InventoryProps) {
  const { getCharacter } = useCharacters();
  const { data: character } = getCharacter(characterId);
  const inventory = character?.inventory ?? [];

  const { equipItem, unequipItem, dropItem, sellItem, useConsumable } = useCharacterItems();
  const { highlightedIdsArray, addHighlight } = useInventoryHighlight(inventory);

  const pending = useMemo(
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

  if (!character) return null;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-2 mb-6">
        <h2 className="text-2xl font-semibold">Inventory</h2>
      </div>
      {inventory.length === 0 ? (
        <p className="text-muted-foreground">No items yet</p>
      ) : (
        <ul className="space-y-3">
          {inventory.map((entry) => (
            <InventoryItem
              key={entry.character_item_id}
              entry={entry}
              characterId={characterId}
              isHighlighted={highlightedIdsArray.includes(entry.character_item_id)}
              equipItem={equipItem}
              unequipItem={unequipItem}
              dropItem={dropItem}
              sellItem={sellItem}
              useConsumable={useConsumable}
              addHighlight={addHighlight}
              pending={pending}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
