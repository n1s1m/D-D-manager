import { queryOptions } from '@tanstack/react-query';
import { supabase } from 'supabase-client';
import type { Class } from 'shared-types';

export const classesApi = {
  baseKey: 'classes' as const,

  queryKeys: {
    all: ['classes'] as const,
    list: () => [...classesApi.queryKeys.all] as const,
  },

  getClassesListQueryOptions: () => {
    return queryOptions({
      queryKey: classesApi.queryKeys.list(),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('classes')
          .select('id, name, hit_die')
          .order('name', { ascending: true })
          .abortSignal(signal);

        if (error) throw error;
        return (data || []) as Class[];
      },
    });
  },
};
