import { useQuery } from '@tanstack/react-query';
import { classesApi } from '@/lib/classes/api';

export function useClasses() {
  return useQuery(classesApi.getClassesListQueryOptions());
}
