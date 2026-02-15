'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui-components';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Catalog app error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
      <p className="max-w-md text-center text-muted-foreground">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    </div>
  );
}
