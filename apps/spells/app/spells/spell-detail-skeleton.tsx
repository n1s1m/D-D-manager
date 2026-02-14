import { Card, CardContent, CardHeader } from '@repo/ui-components/card';
import { Skeleton } from '@repo/ui-components/skeleton';

export function SpellDetailSkeleton() {
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Skeleton className="h-8 w-28 mb-6" />
      <Card>
        <Skeleton className="w-full aspect-video rounded-t-lg" />
        <CardHeader>
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}
