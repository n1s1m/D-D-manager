'use client';

import type { Character } from 'shared-types';
import { Button, Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@repo/ui-components';
import { Pencil } from 'lucide-react';
import { useCharacters } from '@/lib/hooks/use-characters';
import { getEffectiveAC } from '@/lib/character/effective-ac';
import { getEquippedArmor } from '@/lib/character/equipped';
import { CharacterAvatar } from './character-avatar';
import { CharacterStatsCards } from './character-stats-cards';
import { ShopTrigger } from './shop-trigger';

interface CharacterHeaderProps {
  characterId: string;
  onOpenEdit: (character: Character) => void;
}

export function CharacterHeader({ characterId, onOpenEdit }: CharacterHeaderProps) {
  const { getCharacter } = useCharacters();
  const { data: character } = getCharacter(characterId);

  if (!character) return null;

  const inventory = character.inventory ?? [];
  const equippedArmor = getEquippedArmor(inventory);
  const effectiveAC = getEffectiveAC(character, equippedArmor);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <CharacterAvatar character={character} size="xl" editable />
        <div className="border-l pl-4">
          <h1 className="text-2xl font-bold leading-tight flex items-center gap-2">
            {character.name}
            <ShopTrigger characterId={character.id} gold={character.gold ?? 0} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={() => onOpenEdit(character)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit character</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {character.race?.name} {character.class?.name} — Level {character.level}
            {character.class?.hit_die != null && <> · Hit Die d{character.class.hit_die}</>}
          </p>
          <CharacterStatsCards
            character={character}
            effectiveAC={effectiveAC}
            equippedArmorName={equippedArmor?.name ?? null}
          />
        </div>
      </div>
    </div>
  );
}
