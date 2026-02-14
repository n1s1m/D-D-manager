'use client';

import { useCallback } from 'react';
import { getAbilityModifier } from 'shared-types';
import type { CharacterStats } from 'shared-types';
import { useCharacters } from '@/lib/hooks/use-characters';
import { showD20RollToast } from '@/lib/dice-toast';
import { rollD20 } from '@/lib/dice';

const ABILITY_KEYS = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
] as const;

interface AbilityScoresProps {
  characterId: string;
}

export function AbilityScores({ characterId }: AbilityScoresProps) {
  const { getCharacter } = useCharacters();
  const { data: character } = getCharacter(characterId);

  const onAbilityRoll = useCallback(
    (key: keyof CharacterStats) => {
      if (!character) return;
      const mod = getAbilityModifier(character.stats[key]);
      const roll = rollD20();
      showD20RollToast(roll, mod, key.charAt(0).toUpperCase() + key.slice(1));
    },
    [character]
  );

  if (!character) return null;

  const { stats } = character;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Ability scores
        <span className="text-sm text-muted-foreground ml-6">Click to roll 1d20 + modifier</span>
      </h2>
      <div className="space-y-2 border rounded-md p-2 bg-card ">
        {ABILITY_KEYS.map((key) => {
          const score = stats[key];
          const mod = getAbilityModifier(score);
          const modStr = mod >= 0 ? `+${mod}` : String(mod);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onAbilityRoll(key)}
              className="w-full flex justify-between capitalize rounded-md px-3 py-2 text-left hover:bg-muted/50 transition-colors"
            >
              <span>{key}</span>
              <span>
                {score} ({modStr})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
