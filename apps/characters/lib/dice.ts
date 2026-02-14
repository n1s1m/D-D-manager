/** Roll a single die with given number of sides (e.g. 20 for d20). */
export function rollD(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/** Roll 1d20. */
export function rollD20(): number {
  return rollD(20);
}

/** Roll multiple dice and return array of results and sum. */
export function rollMultiple(count: number, sides: number): { rolls: number[]; total: number } {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollD(sides));
  }
  return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
}

/** Parse "2d6" or "1d8" and roll, optionally add modifier from "2d6+3". */
export function rollDiceString(diceStr: string): { rolls: number[]; total: number } {
  const match = diceStr.trim().match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i);
  if (!match) return { rolls: [], total: 0 };
  const count = Math.min(100, Math.max(0, parseInt(match[1], 10)));
  const sides = Math.min(100, Math.max(1, parseInt(match[2], 10)));
  const mod = match[3] ? parseInt(match[3], 10) : 0;
  const { rolls, total } = rollMultiple(count, sides);
  return { rolls, total: total + mod };
}

export const DICE_OPTIONS = [4, 6, 8, 10, 12, 20] as const;
export type DiceType = (typeof DICE_OPTIONS)[number];
