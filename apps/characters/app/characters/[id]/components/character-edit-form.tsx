'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@repo/ui-components';
import type { Character } from 'shared-types';
import {
  characterFormSchema,
  getDefaultValuesFromCharacter,
  type CharacterFormValues,
} from '@/lib/character/character-form-schema';
import { CharacterFormBase } from '@/lib/character/character-form-base';
import { FormTextField } from '@/lib/form-fields';
import { useClasses } from '@/lib/hooks/use-classes';
import { useRaces } from '@/lib/hooks/use-races';

export type EditFormValues = CharacterFormValues;

interface CharacterEditFormProps {
  character: Character;
  onSave: (data: EditFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  /** When true, omits the page title and reduces padding (for use inside a modal). */
  inModal?: boolean;
}

export function CharacterEditForm({
  character,
  onSave,
  onCancel,
  isPending,
  inModal = false,
}: CharacterEditFormProps) {
  const { data: classes = [] } = useClasses();
  const { data: races = [] } = useRaces();
  const initialValues = getDefaultValuesFromCharacter(character);
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EditFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(characterFormSchema),
  });

  // Sync form only when editing a different character (by id), not on parent re-renders with new ref
  useEffect(() => {
    reset(getDefaultValuesFromCharacter(character));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when character.id changes
  }, [character.id, reset]);

  const onSubmit = handleSubmit((data) => {
    onSave(data);
  });

  return (
    <div className={inModal ? 'pt-2' : 'container mx-auto p-8 max-w-2xl'}>
      {!inModal && (
        <h1 className="text-2xl font-bold mb-6">Edit character</h1>
      )}
      <form onSubmit={onSubmit} className="space-y-6">
        <CharacterFormBase
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          classes={classes}
          races={races}
          includeGold
        />
        <div>
          <p className="text-sm text-muted-foreground mb-1">Used for &quot;What would my character do?&quot;</p>
          <FormTextField
            control={control}
            name="description"
            label="Description"
            placeholder="Physical and personality traits, quirks..."
            error={errors.description?.message}
            multiline
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Your own notes (not shared)</p>
          <FormTextField
            control={control}
            name="notes"
            label="Notes"
            placeholder="Campaign notes, ideas..."
            error={errors.notes?.message}
            multiline
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}