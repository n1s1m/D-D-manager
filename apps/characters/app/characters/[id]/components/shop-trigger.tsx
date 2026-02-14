'use client';

import { Button, toast, Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@repo/ui-components';
import { Store } from 'lucide-react';
import { ShopModal } from './shop-modal';
import { useCharacterItems } from '@/lib/hooks/use-character-items';
import { useCharacterShop } from '@/lib/hooks/use-character-shop';

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
      <ShopModal
        open={shopOpen}
        characterId={characterId}
        gold={gold}
        onClose={closeShop}
      />
    </>
  );
}
