import { Skeleton } from '@repo/ui-components/skeleton';

export function ItemDetailSkeleton() {
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Skeleton className="w-full max-w-sm aspect-square rounded-lg mb-6" />
      <Skeleton className="h-9 w-3/4 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
