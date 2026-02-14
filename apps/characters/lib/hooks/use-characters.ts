import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { characterApi } from '@/lib/character/api';
import type { Character } from 'shared-types';

function useCharacterQuery(characterId: string) {
  return useQuery(characterApi.getCharacterQueryOptions(characterId));
}

function useCharactersListQuery() {
  return useQuery(characterApi.getCharactersListQueryOptions());
}

export function useCharacters() {
  const queryClient = useQueryClient();

  const createCharacter = useMutation({
    mutationFn: characterApi.createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.list() });
    },
  });

  const updateCharacter = useMutation({
    mutationFn: (payload: Partial<Character> & { id: string }) =>
      characterApi.updateCharacter(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.list() });
      queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.detail(data.id) });
    },
  });

  const deleteCharacter = useMutation({
    mutationFn: characterApi.deleteCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.list() });
    },
  });

  return {
    getList: useCharactersListQuery,
    getCharacter: useCharacterQuery,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  };
}
