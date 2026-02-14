import { getAbilityModifier } from 'shared-types';

export function getEffectiveAC(
  character: { armor_class?: number; stats?: { dexterity?: number } } | null,
  equippedArmor: { stats?: { ac?: number | string } | null } | null
): number {
  const baseAC = character?.armor_class ?? 10;
  const armorStats = equippedArmor?.stats;
  if (armorStats == null || armorStats.ac == null) return baseAC;
  const ac = armorStats.ac;
  if (typeof ac === 'number') return ac;
  const dexMatch = String(ac).match(/^(\d+)\s*\+\s*Dex/i);
  if (dexMatch?.[1])
    return parseInt(dexMatch[1], 10) + getAbilityModifier(character?.stats?.dexterity ?? 10);
  return parseInt(String(ac), 10) || baseAC;
}
