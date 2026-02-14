'use client';

import { memo, useState } from 'react';
import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui-components';
import { Dices } from 'lucide-react';
import { DICE_OPTIONS, rollMultiple } from '@/lib/dice';
import { showDiceRollToast } from '@/lib/dice-toast';

export const DiceRollerPopover = memo(function DiceRollerPopover() {
  const [open, setOpen] = useState(false);
  const [diceCount, setDiceCount] = useState(1);
  const [diceType, setDiceType] = useState<string>('6');

  const onRollDice = () => {
    const sides = Number(diceType);
    const count = Math.max(1, Math.min(20, diceCount));
    const { rolls, total } = rollMultiple(count, sides);
    showDiceRollToast(`${count}d${sides}`, rolls, total);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-start justify-start">
          <Dices className="mr-2 h-4 w-4" />
          Roll dice
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end" side="top">
        <div className="space-y-4">
          <div>
            <Label>Dice type</Label>
            <Select value={diceType} onValueChange={setDiceType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DICE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={String(s)}>d{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dice-count">Number of dice</Label>
            <Input
              id="dice-count"
              type="number"
              min={1}
              max={20}
              value={diceCount}
              onChange={(e) => setDiceCount(Number(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
          <Button onClick={onRollDice} className="w-full">Roll</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
