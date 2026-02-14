import { useMutation, useQueryClient } from '@tanstack/react-query';
import { characterQueryKeys } from '@repo/domain';
import { supabase } from 'supabase-client';

export function useAddSpellToCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      spellId,
      prepared = false,
    }: {
      characterId: string;
      spellId: string;
      prepared?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('character_spells')
        .insert({
          character_id: characterId,
          spell_id: spellId,
          prepared,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: characterQueryKeys.detail(variables.characterId),
      });
      queryClient.invalidateQueries({ queryKey: characterQueryKeys.list() });
    },
  });
}
