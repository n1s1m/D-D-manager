import { useQuery } from '@tanstack/react-query';
import { racesApi } from '@/lib/races/api';

export function useRaces() {
  return useQuery(racesApi.getRacesListQueryOptions());
}
