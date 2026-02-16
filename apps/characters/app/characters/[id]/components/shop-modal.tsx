'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@repo/ui-components';

interface ShopModalProps {
  open: boolean;
  characterId: string;
  gold: number;
  onClose: () => void;
  isPendingBuy?: boolean;
}

export function ShopModal({ open, characterId, gold, onClose, isPendingBuy = false }: ShopModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendToIframe = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CHARACTER_GOLD', gold },
        window.location.origin
      );
      iframeRef.current.contentWindow.postMessage(
        { type: 'BUY_PENDING', pending: isPendingBuy },
        window.location.origin
      );
    }
  }, [gold, isPendingBuy]);

  useEffect(() => {
    if (open) sendToIframe();
  }, [open, sendToIframe]);

  useEffect(() => {
    if (!open || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'BUY_PENDING', pending: isPendingBuy },
      window.location.origin
    );
  }, [open, isPendingBuy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl h-[90vh] relative">
        <Button variant="ghost" className="absolute top-4 right-4 z-10" onClick={onClose}>
          Close
        </Button>
        <iframe
          ref={iframeRef}
          src={`/shop?characterId=${characterId}&embed=true`}
          className="w-full h-full border-0 rounded-lg"
          title="Shop"
          onLoad={sendToIframe}
        />
      </div>
    </div>
  );
}
