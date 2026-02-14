'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
  toast,
} from '@repo/ui-components';

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterName: string;
  onGenerate: (situation: string) => Promise<string>;
  isPending: boolean;
}

export function ActionSheet({
  open,
  onOpenChange,
  characterName,
  onGenerate,
  isPending,
}: ActionSheetProps) {
  const [situationInput, setSituationInput] = useState('');
  const [actionResult, setActionResult] = useState<string | null>(null);

  const handleGenerate = () => {
    const situation = situationInput.trim();
    if (!situation) {
      toast.error('Describe the situation first');
      return;
    }
    setActionResult(null);
    onGenerate(situation).then(setActionResult).catch((e) => toast.error(e?.message ?? 'Failed'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>What would my character do?</DialogTitle>
          <DialogDescription>
            Describe a situation; GPT will suggest how {characterName} might act based on
            description, background, and notes.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <Label htmlFor="sheet-situation">Situation</Label>
            <Textarea
              id="sheet-situation"
              placeholder="e.g. A stranger offers a deal that seems too good to be true..."
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              className="min-h-[80px] mt-1"
              disabled={isPending}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? 'Generating...' : 'Generate ideas'}
          </Button>
          {actionResult != null && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Ideas</p>
              <p className="text-sm whitespace-pre-wrap">{actionResult}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
