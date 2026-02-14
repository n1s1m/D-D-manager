'use client';

import { useCallback, useRef, useState } from 'react';
import type { Character } from 'shared-types';
import {
  ActionModalPortal,
  AbilityScores,
  CharacterDetailError,
  CharacterHeader,
  DescriptionNotes,
  DiceRollerPopover,
  EditCharacterDialogPortal,
  Inventory,
  Skills,
  WeaponAttackFab,
} from './components';
import { CharacterDetailSkeleton } from './character-detail-skeleton';
import { useCharacterDetailPage } from '@/lib/hooks/use-character-detail-page';
import { Button } from '@repo/ui-components';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CharacterDetailViewProps {
  characterId: string;
}

export function CharacterDetailView({ characterId }: CharacterDetailViewProps) {
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    character: Character | null;
  }>({ open: false, character: null });

  const actionModalOpenRef = useRef<((open: boolean) => void) | undefined>(undefined);
  const onOpenActionModal = useCallback(() => {
    actionModalOpenRef.current?.(true);
  }, []);

  const result = useCharacterDetailPage(characterId);

  const onOpenEdit = useCallback((char: Character) => {
    setEditDialog({ open: true, character: char });
  }, []);

  const onCloseEdit = useCallback(() => {
    setEditDialog((prev) => ({ ...prev, open: false, character: null }));
  }, []);

  if (result.status === 'loading') return <CharacterDetailSkeleton />;
  if (result.status === 'error') return <CharacterDetailError />;

  const { character, equippedWeapon } = result;

  return (
    <>
      <div className="container mx-auto max-w-7xl px-6 pt-8 pb-8">
        <div className="mb-6">
          <Link href="/characters">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to characters
            </Button>
          </Link>
        </div>
        <CharacterHeader characterId={characterId} onOpenEdit={onOpenEdit} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Inventory characterId={characterId} />
            <DescriptionNotes characterId={characterId} />
          </div>
          <div className="flex flex-col gap-6">
            <AbilityScores characterId={characterId} />
            <Skills characterId={characterId} />
          </div>
        </div>
      </div>

      <ActionModalPortal
        openRef={actionModalOpenRef}
        characterId={character.id}
        characterName={character.name}
      />

      <EditCharacterDialogPortal
        open={editDialog.open}
        character={editDialog.character}
        onClose={onCloseEdit}
      />

      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={onOpenActionModal}>
          <Sparkles className="mr-2 h-4 w-4" />
          What would my character do?
        </Button>
        <DiceRollerPopover />
        {equippedWeapon && (
          <WeaponAttackFab weapon={equippedWeapon} stats={character.stats} />
        )}
      </div>
    </>
  );
}
