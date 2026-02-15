import type { RefObject } from 'react';

interface LoadMoreSentinelProps {
  loadMoreRef: RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
}

/**
 * Shared "load more" trigger and loading indicator for infinite lists (shop, spells).
 */
export function LoadMoreSentinel({ loadMoreRef, isFetchingNextPage }: LoadMoreSentinelProps) {
  return (
    <div
      ref={loadMoreRef}
      className="min-h-8 flex items-center justify-center py-4"
      aria-hidden
    >
      {isFetchingNextPage && (
        <p className="text-muted-foreground text-sm">Loading more...</p>
      )}
    </div>
  );
}
