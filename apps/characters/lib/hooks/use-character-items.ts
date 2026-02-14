import { useMutation, useQueryClient } from '@tanstack/react-query';
import { characterApi } from '@/lib/character/api';
import { characterItemApi } from '@/lib/character-item/api';

function invalidateCharacter(queryClient: ReturnType<typeof useQueryClient>, characterId: string) {
  queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.detail(characterId) });
}

function invalidateCharacterAndList(
  queryClient: ReturnType<typeof useQueryClient>,
  characterId: string
) {
  invalidateCharacter(queryClient, characterId);
  queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.list() });
}

export function useCharacterItems() {
  const queryClient = useQueryClient();

  const buyItem = useMutation({
    mutationFn: characterItemApi.buyItem,
    onSuccess: (result, variables) => {
      if (result.ok) invalidateCharacterAndList(queryClient, variables.characterId);
    },
  });

  const sellItem = useMutation({
    mutationFn: characterItemApi.sellItem,
    onSuccess: (result, variables) => {
      if (result.ok) invalidateCharacterAndList(queryClient, variables.characterId);
    },
  });

  const equipItem = useMutation({
    mutationFn: characterItemApi.equipItem,
    onSuccess: (result, variables) => {
      if (result.ok) invalidateCharacter(queryClient, variables.characterId);
    },
  });

  const dropItem = useMutation({
    mutationFn: characterItemApi.dropItem,
    onSuccess: (_, variables) => {
      invalidateCharacter(queryClient, variables.characterId);
    },
  });

  const unequipItem = useMutation({
    mutationFn: characterItemApi.unequipItem,
    onSuccess: (_, variables) => {
      invalidateCharacter(queryClient, variables.characterId);
    },
  });

  const useConsumable = useMutation({
    mutationFn: characterItemApi.useConsumable,
    onSuccess: (result, variables) => {
      if (result?.ok) invalidateCharacter(queryClient, variables.characterId);
    },
  });

  return {
    buyItem,
    sellItem,
    equipItem,
    dropItem,
    unequipItem,
    useConsumable,
  };
}
