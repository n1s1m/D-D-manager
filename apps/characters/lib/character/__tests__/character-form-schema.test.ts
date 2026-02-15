import { describe, it, expect } from 'vitest';
import type { Character } from 'shared-types';
import {
  characterFormSchema,
  characterFormDefaultValues,
  getDefaultValuesFromCharacter,
} from '../character-form-schema';

describe('characterFormSchema', () => {
  const validBase = {
    name: 'Aragorn',
    level: 5,
    gold: 100,
    armor_class: 14,
    hit_points_max: 40,
    hit_points_current: 35,
    speed_ft: 30,
    class_id: 'cls-1',
    race_id: 'race-1',
    background: 'Ranger',
    strength: 16,
    dexterity: 14,
    constitution: 15,
    intelligence: 10,
    wisdom: 12,
    charisma: 10,
    description: '',
    notes: '',
  };

  it('accepts valid form values', () => {
    const result = characterFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = characterFormSchema.safeParse({ ...validBase, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('name'))).toBe(true);
    }
  });

  it('rejects level below 1', () => {
    const result = characterFormSchema.safeParse({ ...validBase, level: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects level above 20', () => {
    const result = characterFormSchema.safeParse({ ...validBase, level: 21 });
    expect(result.success).toBe(false);
  });

  it('rejects negative gold', () => {
    const result = characterFormSchema.safeParse({ ...validBase, gold: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects stat below 1', () => {
    const result = characterFormSchema.safeParse({ ...validBase, strength: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects stat above 30', () => {
    const result = characterFormSchema.safeParse({ ...validBase, wisdom: 31 });
    expect(result.success).toBe(false);
  });

  it('coerces string numbers to numbers', () => {
    const result = characterFormSchema.safeParse({
      ...validBase,
      level: '5' as unknown as number,
      gold: '100' as unknown as number,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.level).toBe(5);
      expect(result.data.gold).toBe(100);
    }
  });
});

describe('characterFormDefaultValues', () => {
  it('has required keys and sensible defaults', () => {
    expect(characterFormDefaultValues.name).toBe('');
    expect(characterFormDefaultValues.level).toBe(1);
    expect(characterFormDefaultValues.gold).toBe(100);
    expect(characterFormDefaultValues.strength).toBe(10);
    expect(characterFormDefaultValues.class_id).toBe('');
    expect(characterFormDefaultValues.race_id).toBe('');
  });
});

describe('getDefaultValuesFromCharacter', () => {
  const mockCharacter: Character = {
    id: 'char-1',
    user_id: 'user-1',
    name: 'Legolas',
    class_id: 'cls-2',
    race_id: 'race-2',
    level: 8,
    background: 'Elf',
    stats: {
      strength: 12,
      dexterity: 18,
      constitution: 14,
      intelligence: 14,
      wisdom: 14,
      charisma: 12,
    },
    armor_class: 15,
    hit_points_max: 60,
    hit_points_current: 55,
    speed_ft: 35,
    gold: 250,
    description: 'Elven archer',
    notes: 'Player notes',
    inventory: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  };

  it('maps character to form values', () => {
    const values = getDefaultValuesFromCharacter(mockCharacter);
    expect(values.name).toBe('Legolas');
    expect(values.level).toBe(8);
    expect(values.gold).toBe(250);
    expect(values.armor_class).toBe(15);
    expect(values.strength).toBe(12);
    expect(values.dexterity).toBe(18);
    expect(values.description).toBe('Elven archer');
    expect(values.notes).toBe('Player notes');
  });

  it('fills missing optional fields with defaults', () => {
    const minimal: Character = {
      ...mockCharacter,
      gold: undefined,
      armor_class: undefined,
      hit_points_max: undefined,
      hit_points_current: undefined,
      speed_ft: undefined,
      description: undefined,
      notes: undefined,
    };
    const values = getDefaultValuesFromCharacter(minimal);
    expect(values.gold).toBe(0);
    expect(values.armor_class).toBe(10);
    expect(values.hit_points_max).toBe(10);
    expect(values.hit_points_current).toBe(10);
    expect(values.speed_ft).toBe(30);
    expect(values.description).toBe('');
    expect(values.notes).toBe('');
  });
});
