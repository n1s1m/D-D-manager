'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Item } from 'shared-types';

type BuyItemOptions = {
  onSuccess?: (result: { ok: boolean; error?: string }) => void;
  onError?: () => void;
};

interface UseCharacterShopOptions {
  characterId: string;
  gold: number | undefined;
  onBuyItem: (
    params: { characterId: string; itemId: string },
    options?: BuyItemOptions
  ) => void;
  onPurchaseSuccess: (itemName: string) => void;
  onPurchaseError: (error?: string) => void;
}

export function useCharacterShop({
  characterId,
  gold,
  onBuyItem,
  onPurchaseSuccess,
  onPurchaseError,
}: UseCharacterShopOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shopOpen, setShopOpen] = useState(false);

  const closeShop = useCallback(() => {
    router.push(`/characters/${characterId}`);
    setShopOpen(false);
  }, [router, characterId]);

  const openShop = useCallback(() => {
    router.push(`/characters/${characterId}?shop=open`);
    setShopOpen(true);
  }, [router, characterId]);

  useEffect(() => {
    if (searchParams.get('shop') === 'open') setShopOpen(true);
  }, [searchParams]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REQUEST_GOLD' && event.source) {
        (event.source as Window).postMessage(
          { type: 'CHARACTER_GOLD', gold: gold ?? 0 },
          event.origin
        );
        return;
      }
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'ITEM_SELECTED') {
        const item = event.data.item as Item;
        const targetCharacterId = event.data.characterId as string;
        if (!item?.id || targetCharacterId !== characterId) return;
        onBuyItem(
          { characterId: targetCharacterId, itemId: item.id },
          {
            onSuccess: (result: { ok: boolean; error?: string }) => {
              if (result.ok) {
                closeShop();
                onPurchaseSuccess(item.name);
              } else {
                onPurchaseError(result.error);
              }
            },
            onError: () => onPurchaseError('Purchase failed'),
          }
        );
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [
    characterId,
    gold,
    onBuyItem,
    onPurchaseSuccess,
    onPurchaseError,
    closeShop,
  ]);

  return { shopOpen, openShop, closeShop };
}
