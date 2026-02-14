'use client';

import { memo } from 'react';
import { Button } from '@repo/ui-components';
import type { InventoryEntry } from 'shared-types';
import { useCharacters } from '@/lib/hooks/use-characters';
import { useCharacterInventoryActions } from '@/lib/hooks/use-character-inventory-actions';
import { rollDiceString } from '@/lib/dice';

const HIGHLIGHT_CLASS =
  'border-primary ring-2 ring-primary/60 ring-offset-2 ring-offset-background';

interface InventoryProps {
  characterId: string;
}

export function Inventory({ characterId }: InventoryProps) {
  const { getCharacter } = useCharacters();
  const { data: character } = getCharacter(characterId);
  const inventory = character?.inventory ?? [];

  const {
    handleEquip,
    handleUnequip,
    handleDrop,
    handleSell,
    handleUseConsumable,
    inventoryPending,
    highlightedIdsArray,
  } = useCharacterInventoryActions(characterId, inventory);

  if (!character) return null;

  return (
    <InventoryContent
      inventory={inventory}
      highlightedItemIds={highlightedIdsArray}
      onEquip={handleEquip}
      onUnequip={handleUnequip}
      onDrop={handleDrop}
      onSell={handleSell}
      onUseConsumable={handleUseConsumable}
      pending={inventoryPending}
    />
  );
}

interface InventoryContentProps {
  inventory: InventoryEntry[];
  highlightedItemIds: string[];
  onEquip: (entry: InventoryEntry, slot: 'weapon' | 'armor') => void;
  onUnequip: (entry: InventoryEntry) => void;
  onDrop: (entry: InventoryEntry, qty?: number) => void;
  onSell: (entry: InventoryEntry) => void;
  onUseConsumable: (entry: InventoryEntry, healAmount: number) => void;
  pending: {
    equip: boolean;
    unequip: boolean;
    drop: boolean;
    sell: boolean;
    consumable: boolean;
  };
}

const InventoryContent = memo(function InventoryContent({
  inventory,
  highlightedItemIds,
  onEquip,
  onUnequip,
  onDrop,
  onSell,
  onUseConsumable,
  pending,
}: InventoryContentProps) {
  return (
    <div>
      <div className="flex flex-wrap items-start gap-2 mb-6">
        <h2 className="text-2xl font-semibold">Inventory</h2>
      </div>
      {inventory.length === 0 ? (
        <p className="text-muted-foreground">No items yet</p>
      ) : (
        <ul className="space-y-3">
          {inventory.map((entry) => {
            const isHighlighted = highlightedItemIds.includes(entry.character_item_id);
            return (
              <li
                key={entry.character_item_id}
                className={`border rounded-lg p-4 bg-card transition-[box-shadow,border-color] ${isHighlighted ? HIGHLIGHT_CLASS : ''}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{entry.name}</span>
                      {entry.quantity > 1 && (
                        <span className="text-muted-foreground text-sm">×{entry.quantity}</span>
                      )}
                      <span className="text-xs uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {entry.type}
                      </span>
                      {entry.equipped_slot && (
                        <span className="text-xs uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Equipped ({entry.equipped_slot})
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                    {entry.stats && Object.keys(entry.stats).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.stats.damage && (
                          <span>Damage: {String(entry.stats.damage)}</span>
                        )}
                        {entry.stats.ac != null && (
                          <span className="ml-2">AC: {String(entry.stats.ac)}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {entry.type === 'weapon' &&
                      (entry.equipped_slot === 'weapon' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnequip(entry)}
                          disabled={pending.unequip}
                        >
                          Unequip
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEquip(entry, 'weapon')}
                          disabled={pending.equip}
                        >
                          Equip
                        </Button>
                      ))}
                    {entry.type === 'armor' &&
                      (entry.equipped_slot === 'armor' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnequip(entry)}
                          disabled={pending.unequip}
                        >
                          Unequip
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEquip(entry, 'armor')}
                          disabled={pending.equip}
                        >
                          Equip
                        </Button>
                      ))}
                    {entry.type === 'consumable' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const heal = rollDiceString('2d4').total + 2;
                          onUseConsumable(entry, heal);
                        }}
                        disabled={pending.consumable}
                      >
                        Use (2d4+2 HP)
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSell(entry)}
                      disabled={pending.sell}
                    >
                      Sell
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDrop(entry)}
                      disabled={pending.drop}
                      className="text-destructive hover:text-destructive"
                    >
                      Drop
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
