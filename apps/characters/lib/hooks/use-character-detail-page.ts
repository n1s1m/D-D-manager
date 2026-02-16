'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui-components';
import { getAbilityModifier } from 'shared-types';
import type { Character, CharacterStats, InventoryEntry } from 'shared-types';
import { getEffectiveAC } from '@/lib/character/effective-ac';
import { getEquippedArmor, getEquippedWeapon } from '@/lib/character/equipped';
import { showD20RollToast } from '@/lib/dice-toast';
import { rollD20 } from '@/lib/dice';
import { useCharacters } from '@/lib/hooks/use-characters';

export type CharacterDetailPageStatus = 'loading' | 'error' | 'success';

export interface CharacterDetailPageSuccess {
  status: 'success';
  character: Character;
  inventory: InventoryEntry[];
  effectiveAC: number;
  equippedArmor: ReturnType<typeof getEquippedArmor>;
  equippedWeapon: ReturnType<typeof getEquippedWeapon>;
  onAbilityRoll: (key: keyof CharacterStats) => void;
  onSkillRoll: (skillLabel: string, totalMod: number) => void;
  onSaveDescription: (value: string | null) => void;
  onSaveNotes: (value: string | null) => void;
}

export interface CharacterDetailPageLoading {
  status: 'loading';
}

export interface CharacterDetailPageError {
  status: 'error';
}

export type CharacterDetailPageResult =
  | CharacterDetailPageSuccess
  | CharacterDetailPageLoading
  | CharacterDetailPageError;

export function useCharacterDetailPage(characterId: string): CharacterDetailPageResult {
  const router = useRouter();
  const { getCharacter, updateCharacter } = useCharacters();
  const { data: character, isLoading, error } = getCharacter(characterId);

  const inventory = character?.inventory ?? [];

  const onAbilityRoll = useCallback(
    (key: keyof CharacterStats) => {
      if (!character) return;
      const mod = getAbilityModifier(character.stats[key]);
      const roll = rollD20();
      showD20RollToast(roll, mod, key.charAt(0).toUpperCase() + key.slice(1));
    },
    [character]
  );

  const onSkillRoll = useCallback((skillLabel: string, totalMod: number) => {
    showD20RollToast(rollD20(), totalMod, skillLabel);
  }, []);

  const onSaveDescription = useCallback(
    (value: string | null) => {
      updateCharacter.mutate(
        { id: characterId, description: value },
        { onError: () => toast.error('Failed to save description') }
      );
    },
    [characterId, updateCharacter.mutate]
  );

  const onSaveNotes = useCallback(
    (value: string | null) => {
      updateCharacter.mutate(
        { id: characterId, notes: value },
        { onError: () => toast.error('Failed to save notes') }
      );
    },
    [characterId, updateCharacter.mutate]
  );

  const equippedWeapon = getEquippedWeapon(inventory);
  const equippedArmor = getEquippedArmor(inventory);
  const effectiveAC = character
    ? getEffectiveAC(character, equippedArmor)
    : 0;

  if (isLoading) return { status: 'loading' };
  if (error || !character) return { status: 'error' };

  return {
    status: 'success',
    character,
    inventory,
    effectiveAC,
    equippedArmor,
    equippedWeapon,
    onAbilityRoll,
    onSkillRoll,
    onSaveDescription,
    onSaveNotes
  };
}
