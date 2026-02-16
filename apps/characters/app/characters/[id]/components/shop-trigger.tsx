'use client';

import { Suspense, lazy } from 'react';
import { Button, toast, Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@repo/ui-components';
import { Store } from 'lucide-react';
import { useCharacterItems } from '@/lib/hooks/use-character-items';
import { useCharacterShop } from '@/lib/hooks/use-character-shop';

const ShopModal = lazy(() =>
  import('./shop-modal').then((m) => ({ default: m.ShopModal }))
);

interface ShopTriggerProps {
  characterId: string;
  gold: number;
}

export function ShopTrigger({ characterId, gold }: ShopTriggerProps) {
  const { buyItem } = useCharacterItems();
  const { shopOpen, openShop, closeShop } = useCharacterShop({
    characterId,
    gold,
    onBuyItem: buyItem.mutate,
    onPurchaseSuccess: (itemName) => toast.success(`Purchased ${itemName}`),
    onPurchaseError: (error) => toast.error(error ?? 'Purchase failed'),
  });

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" onClick={openShop} aria-label="Open shop">
              <Store className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open shop</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {shopOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading shop…</div>
            </div>
          }
        >
          <ShopModal
            open={shopOpen}
            characterId={characterId}
            gold={gold}
            onClose={closeShop}
            isPendingBuy={buyItem.isPending}
          />
        </Suspense>
      )}
    </>
  );
}
