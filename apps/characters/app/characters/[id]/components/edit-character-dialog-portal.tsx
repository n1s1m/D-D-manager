'use client';

import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  toast,
} from '@repo/ui-components';
import type { Character } from 'shared-types';
import { formValuesToUpdatePayload } from '@/lib/character/form-payload';
import { useCharacters } from '@/lib/hooks/use-characters';
import { CharacterEditForm, type EditFormValues } from './character-edit-form';

interface EditCharacterDialogPortalProps {
  open: boolean;
  character: Character | null;
  onClose: () => void;
}

export function EditCharacterDialogPortal({
  open,
  character,
  onClose,
}: EditCharacterDialogPortalProps) {
  const { updateCharacter } = useCharacters();

  const onSave = useCallback(
    (data: EditFormValues) => {
      if (!character) return;
      updateCharacter.mutate(formValuesToUpdatePayload(data, character.id), {
        onSuccess: () => onClose(),
        onError: () => toast.error('Failed to save character'),
      });
    },
    [character, updateCharacter.mutate, onClose]
  );

  if (!open || !character) return null;

  const dialogContent = (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit character</DialogTitle>
        </DialogHeader>
        <CharacterEditForm
          character={character}
          onSave={onSave}
          onCancel={onClose}
          isPending={updateCharacter.isPending}
          inModal
        />
      </DialogContent>
    </Dialog>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(dialogContent, document.body);
}
