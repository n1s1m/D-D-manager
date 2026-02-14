/** Shared query keys for character entity. Use in all apps for cache/invalidation consistency. */
export const characterQueryKeys = {
  baseKey: 'character' as const,
  all: ['character'] as const,
  lists: () => ['characters'] as const,
  list: () => characterQueryKeys.lists(),
  details: () => [...characterQueryKeys.all] as const,
  detail: (id: string) => [...characterQueryKeys.details(), id] as const,
};
