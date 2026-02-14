import { useQuery } from '@tanstack/react-query';
import { characterApi } from '@/lib/character/api';

export function useCharacter(characterId: string) {
  return useQuery(characterApi.getCharacterQueryOptions(characterId));
}
