import { queryOptions } from '@tanstack/react-query';
import { characterQueryKeys } from '@repo/domain';
import { supabase } from 'supabase-client';
import type { Character } from 'shared-types';

export const characterApi = {
  queryKeys: characterQueryKeys,

  getCharacterQueryOptions: (characterId: string) => {
    return queryOptions({
      queryKey: characterQueryKeys.detail(characterId),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .abortSignal(signal)
          .single();

        if (error) throw error;
        return data as Character;
      },
      enabled: !!characterId,
    });
  },

  getCharactersListQueryOptions: () => {
    return queryOptions({
      queryKey: characterQueryKeys.list(),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .order('created_at', { ascending: false })
          .abortSignal(signal);

        if (error) throw error;
        return (data || []) as Character[];
      },
    });
  },
};
