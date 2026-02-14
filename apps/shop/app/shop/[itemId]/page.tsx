'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button, ImageWithPlaceholder } from '@repo/ui-components';
import { ItemDetailSkeleton } from './item-detail-skeleton';
import { useItem } from '@/lib/hooks/use-item';
import { getPublicStorageUrl as getItemImageUrl } from 'supabase-client';

export default function ItemDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const itemId = params.itemId as string;
  const characterId = searchParams.get('characterId');
  const embed = searchParams.get('embed') === 'true';
  const { data: item, isLoading, error } = useItem(itemId);
  const [characterGold, setCharacterGold] = useState<number | null>(null);

  useEffect(() => {
    if (!embed) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CHARACTER_GOLD') {
        setCharacterGold(typeof event.data.gold === 'number' ? event.data.gold : 0);
      }
    };

    window.addEventListener('message', handleMessage);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'REQUEST_GOLD' }, '*');
    }
    return () => window.removeEventListener('message', handleMessage);
  }, [embed]);

  const handleBuy = () => {
    if (!item) return;
    if (embed && window.parent) {
      window.parent.postMessage(
        { type: 'ITEM_SELECTED', item, characterId },
        window.location.origin
      );
    }
  };

  if (isLoading) {
    return <ItemDetailSkeleton />;
  }

  if (error || !item) {
    return <div className="p-8">Item not found</div>;
  }

  const price = Number(item.price);
  const canAfford = characterGold === null || characterGold >= price;

  const imageUrl = getItemImageUrl(item.image_url);
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="relative w-full max-w-sm aspect-square mb-6 rounded-lg overflow-hidden bg-muted">
        <ImageWithPlaceholder
          src={imageUrl}
          alt={item.name}
          placeholder="/placeholder-item.png"
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 24rem"
        />
      </div>
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      {embed && characterId && (
        <p className="text-muted-foreground mb-4">
          Your gold: <strong>{characterGold ?? '…'} gp</strong>
        </p>
      )}
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Type:</span> {item.type}
        </div>
        <div>
          <span className="font-semibold">Price:</span> {price} gp
        </div>
        <div>
          <span className="font-semibold">Description:</span>
          <p className="mt-2">{item.description}</p>
        </div>
        {item.stats && Object.keys(item.stats).length > 0 && (
          <div>
            <span className="font-semibold">Stats:</span>
            <pre className="mt-2 bg-muted p-4 rounded text-sm">
              {JSON.stringify(item.stats, null, 2)}
            </pre>
          </div>
        )}
        {embed ? (
          <Button
            onClick={handleBuy}
            className="w-full"
            disabled={!canAfford}
            title={!canAfford ? 'Not enough gold' : undefined}
          >
            Buy ({price} gp)
          </Button>
        ) : (
          <Button asChild className="w-full">
            <a href={`/shop${characterId ? `?characterId=${characterId}&embed=true` : ''}`}>
              Back to shop
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
