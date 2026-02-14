import { Skeleton } from '@repo/ui-components/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto p-8">
      <Skeleton className="h-9 w-48 mb-6" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
