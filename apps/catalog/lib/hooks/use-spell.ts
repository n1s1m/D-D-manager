import { useQuery } from '@tanstack/react-query';
import { spellApi } from '@/lib/spell/api';

export function useSpell(spellId: string) {
  return useQuery(spellApi.getSpellQueryOptions(spellId));
}
