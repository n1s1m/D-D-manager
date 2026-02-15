import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rollD,
  rollD20,
  rollMultiple,
  rollDiceString,
  DICE_OPTIONS,
} from '../dice';

describe('rollD', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 1 when random is 0', () => {
    expect(rollD(20)).toBe(1);
  });

  it('returns max value when random is just below 1', () => {
    (Math.random as ReturnType<typeof vi.fn>).mockReturnValue(0.9999999999);
    expect(rollD(20)).toBe(20);
  });

  it('returns value in [1, sides] for d6', () => {
    (Math.random as ReturnType<typeof vi.fn>).mockReturnValue(0.5);
    const result = rollD(6);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });
});

describe('rollD20', () => {
  it('returns number in 1..20', () => {
    for (let i = 0; i < 50; i++) {
      const r = rollD20();
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(20);
    }
  });
});

describe('rollMultiple', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns count dice and correct sum (all 1s)', () => {
    const { rolls, total } = rollMultiple(3, 6);
    expect(rolls).toHaveLength(3);
    expect(rolls.every((r) => r === 1)).toBe(true);
    expect(total).toBe(3);
  });

  it('returns correct sum for 2d6 with fixed random', () => {
    let callCount = 0;
    vi.mocked(Math.random).mockImplementation(() => {
      callCount++;
      return callCount <= 2 ? 0.5 : 0; // first two: middle of range
    });
    const { rolls, total } = rollMultiple(2, 6);
    expect(rolls).toHaveLength(2);
    expect(total).toBe(rolls[0]! + rolls[1]!);
  });
});

describe('rollDiceString', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses "2d6" and returns rolls + total (no modifier)', () => {
    const result = rollDiceString('2d6');
    expect(result.rolls).toHaveLength(2);
    expect(result.total).toBe(2); // 1+1
  });

  it('parses "1d20+5" and adds modifier', () => {
    const result = rollDiceString('1d20+5');
    expect(result.rolls).toHaveLength(1);
    expect(result.rolls[0]).toBe(1);
    expect(result.total).toBe(1 + 5);
  });

  it('parses "2d6+3" with modifier', () => {
    const result = rollDiceString('2d6+3');
    expect(result.rolls).toHaveLength(2);
    expect(result.total).toBe(result.rolls[0]! + result.rolls[1]! + 3);
  });

  it('returns empty rolls and 0 total for invalid string', () => {
    expect(rollDiceString('invalid')).toEqual({ rolls: [], total: 0 });
    expect(rollDiceString('d20')).toEqual({ rolls: [], total: 0 });
    expect(rollDiceString('2d')).toEqual({ rolls: [], total: 0 });
    expect(rollDiceString('')).toEqual({ rolls: [], total: 0 });
  });

  it('trims whitespace', () => {
    const result = rollDiceString('  1d20  ');
    expect(result.rolls).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeLessThanOrEqual(20);
  });

  it('clamps count to 0..100', () => {
    const r = rollDiceString('200d6');
    expect(r.rolls.length).toBeLessThanOrEqual(100);
  });

  it('clamps sides to 1..100', () => {
    const r = rollDiceString('1d500');
    expect(r.rolls[0]).toBeGreaterThanOrEqual(1);
    expect(r.rolls[0]).toBeLessThanOrEqual(100);
  });
});

describe('DICE_OPTIONS', () => {
  it('contains 4, 6, 8, 10, 12, 20', () => {
    expect(DICE_OPTIONS).toEqual([4, 6, 8, 10, 12, 20]);
  });
});
