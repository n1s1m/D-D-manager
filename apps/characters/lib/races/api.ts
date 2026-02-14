import { queryOptions } from '@tanstack/react-query';
import { supabase } from 'supabase-client';
import type { Race } from 'shared-types';

export const racesApi = {
  baseKey: 'races' as const,

  queryKeys: {
    all: ['races'] as const,
    list: () => [...racesApi.queryKeys.all] as const,
  },

  getRacesListQueryOptions: () => {
    return queryOptions({
      queryKey: racesApi.queryKeys.list(),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('races')
          .select('id, name')
          .order('name', { ascending: true })
          .abortSignal(signal);

        if (error) throw error;
        return (data || []) as Race[];
      },
    });
  },
};
