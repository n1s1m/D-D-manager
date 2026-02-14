import { useQuery } from '@tanstack/react-query';
import { itemApi } from '@/lib/item/api';

export function useItem(itemId: string) {
  return useQuery(itemApi.getItemQueryOptions(itemId));
}
