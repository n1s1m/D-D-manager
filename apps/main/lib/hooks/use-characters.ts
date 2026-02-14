import { useQuery } from '@tanstack/react-query';
import { characterApi } from '@/lib/character/api';

export function useCharacters() {
  return useQuery(characterApi.getCharactersListQueryOptions());
}
