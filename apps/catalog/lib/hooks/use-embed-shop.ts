'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Item } from 'shared-types';

/**
 * Subscribes to parent window postMessage for CHARACTER_GOLD when embed is true,
 * and requests gold on mount. Returns current gold or null.
 */
export function useEmbedCharacterGold(embed: boolean): number | null {
  const [characterGold, setCharacterGold] = useState<number | null>(null);

  useEffect(() => {
    if (!embed) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CHARACTER_GOLD') {
        setCharacterGold(typeof event.data.gold === 'number' ? event.data.gold : 0);
      }
    };

    window.addEventListener('message', handleMessage);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'REQUEST_GOLD' }, '*');
    }
    return () => window.removeEventListener('message', handleMessage);
  }, [embed]);

  return characterGold;
}

/**
 * Returns a callback to notify parent window about item selection when in embed mode.
 */
export function useEmbedBuy(
  embed: boolean,
  characterId: string | null
): (item: Item) => void {
  return useCallback(
    (item: Item) => {
      if (embed && window.parent) {
        window.parent.postMessage(
          { type: 'ITEM_SELECTED', item, characterId },
          window.location.origin
        );
      }
    },
    [embed, characterId]
  );
}
