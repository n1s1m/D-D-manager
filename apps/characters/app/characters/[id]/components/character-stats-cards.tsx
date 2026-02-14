'use client';

import { memo } from 'react';
import type { Character } from 'shared-types';
import { getProficiencyBonus } from 'shared-types';

interface CharacterStatsCardsProps {
  character: Character;
  effectiveAC: number;
  equippedArmorName?: string | null;
}

export const CharacterStatsCards = memo(function CharacterStatsCards({
  character,
  effectiveAC,
  equippedArmorName,
}: CharacterStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm text-muted-foreground">Gold</div>
        <div className="text-2xl font-bold">{character.gold ?? 0} gp</div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm text-muted-foreground">Armor Class</div>
        <div className="text-2xl font-bold">{effectiveAC}</div>
        {equippedArmorName && (
          <div className="text-xs text-muted-foreground mt-1">({equippedArmorName})</div>
        )}
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm text-muted-foreground">Hit Points</div>
        <div className="text-2xl font-bold">
          {character.hit_points_current ?? 1} / {character.hit_points_max ?? 1}
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm text-muted-foreground">Speed</div>
        <div className="text-2xl font-bold">{character.speed_ft ?? 30} ft</div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm text-muted-foreground">Proficiency</div>
        <div className="text-2xl font-bold">+{getProficiencyBonus(character.level)}</div>
      </div>
    </div>
  );
});
