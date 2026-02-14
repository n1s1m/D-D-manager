'use client';

import { useCallback } from 'react';
import { getAbilityModifier, getProficiencyBonus, SKILLS_5E } from 'shared-types';
import { useCharacters } from '@/lib/hooks/use-characters';
import { showD20RollToast } from '@/lib/dice-toast';
import { rollD20 } from '@/lib/dice';

interface SkillsProps {
  characterId: string;
}

export function Skills({ characterId }: SkillsProps) {
  const { getCharacter } = useCharacters();
  const { data: character } = getCharacter(characterId);

  const onSkillRoll = useCallback((skillLabel: string, totalMod: number) => {
    showD20RollToast(rollD20(), totalMod, skillLabel);
  }, []);

  if (!character) return null;

  const { stats, level, skill_proficiencies = [] } = character;
  const profBonus = getProficiencyBonus(level);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Skills
        <span className="text-sm text-muted-foreground ml-6">Click to roll 1d20 + modifier</span>
      </h2>
      <div className="space-y-1 text-sm border rounded-md p-2 bg-card ">
        {SKILLS_5E.map((skill) => {
          const abilityMod = getAbilityModifier(stats[skill.ability]);
          const proficient = skill_proficiencies.includes(skill.key);
          const total = abilityMod + (proficient ? profBonus : 0);
          const totalStr = total >= 0 ? `+${total}` : String(total);
          return (
            <button
              key={skill.key}
              type="button"
              onClick={() => onSkillRoll(skill.label, total)}
              className="w-full flex justify-between rounded px-2 py-1.5 text-left hover:bg-muted/50 transition-colors"
            >
              <span>
                {skill.label}
                {proficient && (
                  <span className="text-primary ml-1" title="Proficient">
                    ●
                  </span>
                )}
              </span>
              <span>{totalStr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
