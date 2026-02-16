'use client';

import { memo } from 'react';
import { Button, toast } from '@repo/ui-components';
import type { InventoryEntry } from 'shared-types';
import type { useCharacterItems } from '@/lib/hooks/use-character-items';
import { rollDiceString } from '@/lib/dice';

const HIGHLIGHT_CLASS =
  'border-primary ring-2 ring-primary/60 ring-offset-2 ring-offset-background';

type CharacterItemsMutations = ReturnType<typeof useCharacterItems>;

export interface InventoryItemProps {
  entry: InventoryEntry;
  characterId: string;
  isHighlighted: boolean;
  equipItem: CharacterItemsMutations['equipItem'];
  unequipItem: CharacterItemsMutations['unequipItem'];
  dropItem: CharacterItemsMutations['dropItem'];
  sellItem: CharacterItemsMutations['sellItem'];
  useConsumable: CharacterItemsMutations['useConsumable'];
  addHighlight: (id: string) => void;
  pending: {
    equip: boolean;
    unequip: boolean;
    drop: boolean;
    sell: boolean;
    consumable: boolean;
  };
}

export const InventoryItem = memo(function InventoryItem({
  entry,
  characterId,
  isHighlighted,
  equipItem,
  unequipItem,
  dropItem,
  sellItem,
  useConsumable,
  addHighlight,
  pending,
}: InventoryItemProps) {
  const handleEquip = (slot: 'weapon' | 'armor') => {
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
  };

  const handleUnequip = () => {
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
  };

  const handleDrop = () => {
    dropItem.mutate(
      { characterId, characterItemId: entry.character_item_id },
      {
        onSuccess: () => toast.success('Dropped'),
        onError: () => toast.error('Failed to drop'),
      }
    );
  };

  const handleSell = () => {
    sellItem.mutate(
      { characterId, characterItemId: entry.character_item_id },
      {
        onSuccess: (r) =>
          r.ok ? toast.success(`Sold ${entry.name}`) : toast.error(r.error),
        onError: () => toast.error('Failed to sell'),
      }
    );
  };

  const handleUseConsumable = (healAmount: number) => {
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
  };

  return (
    <li
      className={`border rounded-lg p-4 bg-card transition-[box-shadow,border-color] ${isHighlighted ? HIGHLIGHT_CLASS : ''}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{entry.name}</span>
            <span className="text-muted-foreground text-sm">×{entry.quantity}</span>
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
                onClick={handleUnequip}
                disabled={pending.unequip}
              >
                Unequip
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEquip('weapon')}
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
                onClick={handleUnequip}
                disabled={pending.unequip}
              >
                Unequip
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEquip('armor')}
                disabled={pending.equip}
              >
                Equip
              </Button>
            ))}
          {entry.type === 'consumable' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUseConsumable(rollDiceString('2d4').total + 2)}
              disabled={pending.consumable}
            >
              Use (2d4+2 HP)
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSell}
            disabled={pending.sell}
          >
            Sell
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDrop}
            disabled={pending.drop}
            className="text-destructive hover:text-destructive"
          >
            Drop
          </Button>
        </div>
      </div>
    </li>
  );
});
