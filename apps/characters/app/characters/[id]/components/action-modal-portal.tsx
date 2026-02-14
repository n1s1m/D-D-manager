'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActionSheet } from './action-sheet';
import { useGenerateCharacterAction } from '@/lib/hooks/use-generate-character-action';

interface ActionModalPortalProps {
  /** Ref that will be set to (open: boolean) => void so the modal can be opened from outside without re-rendering this component's ancestors. */
  openRef: React.MutableRefObject<((open: boolean) => void) | undefined>;
  characterId: string;
  characterName: string;
}

/**
 * Renders the "What would my character do?" modal in a portal.
 * State lives here (sibling of the character detail containers), so opening the modal or typing in it
 * does not re-render the detail content tree.
 */
export function ActionModalPortal({
  openRef,
  characterId,
  characterName,
}: ActionModalPortalProps) {
  const [open, setOpen] = useState(false);
  const generateAction = useGenerateCharacterAction();

  useEffect(() => {
    openRef.current = setOpen;
    return () => {
      openRef.current = undefined;
    };
  }, [openRef]);

  const onGenerate = useCallback(
    (situation: string) =>
      new Promise<string>((resolve, reject) => {
        generateAction.mutate(
          { characterId, situation },
          {
            onSuccess: (data) => resolve(data.text),
            onError: (e) => reject(e),
          }
        );
      }),
    [characterId, generateAction.mutate]
  );

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <ActionSheet
      open={open}
      onOpenChange={setOpen}
      characterName={characterName}
      onGenerate={onGenerate}
      isPending={generateAction.isPending}
    />,
    document.body
  );
}
