import { useMutation, useQueryClient } from '@tanstack/react-query';
import { characterQueryKeys } from '@repo/domain';
import { supabase } from 'supabase-client';

export function useAddItemToCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      itemId,
      quantity = 1,
    }: {
      characterId: string;
      itemId: string;
      quantity?: number;
    }) => {
      const { data, error } = await supabase
        .from('character_items')
        .insert({
          character_id: characterId,
          item_id: itemId,
          quantity,
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
