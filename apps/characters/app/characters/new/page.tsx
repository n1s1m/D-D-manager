'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Skeleton } from '@repo/ui-components';
import {
  characterFormSchema,
  characterFormDefaultValues,
  type CharacterFormValues,
} from '@/lib/character/character-form-schema';
import { CharacterFormBase } from '@/lib/character/character-form-base';
import { formValuesToCreatePayload } from '@/lib/character/form-payload';
import { FormTextField } from '@/lib/form-fields';
import { useCharacters } from '@/lib/hooks/use-characters';
import { useClasses } from '@/lib/hooks/use-classes';
import { useRaces } from '@/lib/hooks/use-races';

export default function NewCharacterPage() {
  const router = useRouter();
  const { createCharacter } = useCharacters();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: races = [], isLoading: racesLoading } = useRaces();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CharacterFormValues>({
    defaultValues: characterFormDefaultValues,
    resolver: zodResolver(characterFormSchema),
  });

  const onSubmit = (data: CharacterFormValues) => {
    createCharacter.mutate(formValuesToCreatePayload(data), {
      onSuccess: (character) => {
        router.push(`/characters/${character.id}`);
      },
    });
  };

  const loading = classesLoading || racesLoading;

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Create New Character</h1>
        <Skeleton className="h-96 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Create New Character</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CharacterFormBase
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          classes={classes}
          races={races}
          includeGold={false}
        />
        <FormTextField
          control={control}
          name="background"
          label="Background"
          placeholder="Optional"
          error={errors.background?.message}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={createCharacter.isPending}>
            {createCharacter.isPending ? 'Creating...' : 'Create Character'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/characters')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
