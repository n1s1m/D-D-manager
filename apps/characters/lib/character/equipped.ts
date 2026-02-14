import type { InventoryEntry } from 'shared-types';

export function getEquippedWeapon(
  inventory: InventoryEntry[]
): InventoryEntry | undefined {
  return inventory.find(
    (e) => e.type === 'weapon' && e.equipped_slot === 'weapon'
  );
}

export function getEquippedArmor(
  inventory: InventoryEntry[]
): InventoryEntry | null {
  const entry = inventory.find(
    (e) => e.type === 'armor' && e.equipped_slot === 'armor'
  );
  return entry ?? null;
}
