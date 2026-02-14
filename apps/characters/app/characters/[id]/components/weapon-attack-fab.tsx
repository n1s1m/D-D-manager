'use client';

import { Button, toast } from '@repo/ui-components';
import { Sword } from 'lucide-react';
import { getAbilityModifier } from 'shared-types';
import type { CharacterStats } from 'shared-types';
import type { InventoryEntry } from 'shared-types';
import { showD20RollToast } from '@/lib/dice-toast';
import { rollD20, rollDiceString } from '@/lib/dice';

interface WeaponAttackFabProps {
  weapon: InventoryEntry;
  stats: CharacterStats;
}

export function WeaponAttackFab({ weapon, stats }: WeaponAttackFabProps) {
  const onWeaponAttack = () => {
    const strMod = getAbilityModifier(stats.strength);
    const dexMod = getAbilityModifier(stats.dexterity);
    const hasFinesse = (weapon.stats?.properties as string)?.toLowerCase().includes('finesse');
    const attackMod = hasFinesse ? Math.max(strMod, dexMod) : strMod;
    const roll = rollD20();
    showD20RollToast(roll, attackMod, `${weapon.name} attack`);
    const dmgStr = weapon.stats?.damage as string | undefined;
    if (dmgStr) {
      const { rolls, total } = rollDiceString(dmgStr);
      const dmgMod = hasFinesse ? Math.max(strMod, dexMod) : strMod;
      const dmgTotal = total + dmgMod;
      const modStr = dmgMod >= 0 ? `+${dmgMod}` : String(dmgMod);
      toast(
        <div className="text-sm">
          <span className="font-medium">Damage</span>: {dmgStr} ({rolls.join(' + ')}) {modStr} = <strong>{dmgTotal}</strong>
        </div>,
        { duration: 4000 }
      );
    }
  };

  return (
    <Button variant="outline" onClick={onWeaponAttack}>
      <Sword className="mr-2 h-4 w-4" />
      Roll attack ({weapon.name})
    </Button>
  );
}
