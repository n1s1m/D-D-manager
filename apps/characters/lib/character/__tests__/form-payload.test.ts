import { describe, it, expect } from 'vitest';
import {
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
} from '../form-payload';
import { characterFormDefaultValues } from '../character-form-schema';

describe('formValuesToCreatePayload', () => {
  it('maps form values to create payload with stats', () => {
    const form = {
      ...characterFormDefaultValues,
      name: 'Gimli',
      level: 4,
      class_id: 'cls-1',
      race_id: 'race-1',
      strength: 14,
      dexterity: 10,
      constitution: 16,
      intelligence: 8,
      wisdom: 12,
      charisma: 10,
      armor_class: 16,
      hit_points_max: 38,
      hit_points_current: 38,
      speed_ft: 25,
    };
    const payload = formValuesToCreatePayload(form);
    expect(payload.name).toBe('Gimli');
    expect(payload.level).toBe(4);
    expect(payload.class_id).toBe('cls-1');
    expect(payload.race_id).toBe('race-1');
    expect(payload.stats).toEqual({
      strength: 14,
      dexterity: 10,
      constitution: 16,
      intelligence: 8,
      wisdom: 12,
      charisma: 10,
    });
    expect(payload.armor_class).toBe(16);
    expect(payload.hit_points_max).toBe(38);
    expect(payload.hit_points_current).toBe(38);
    expect(payload.speed_ft).toBe(25);
    expect(payload.skill_proficiencies).toEqual([]);
    expect('id' in payload).toBe(false);
    expect('user_id' in payload).toBe(false);
  });

  it('converts empty background to undefined', () => {
    const form = { ...characterFormDefaultValues, background: '' };
    const payload = formValuesToCreatePayload(form);
    expect(payload.background).toBeUndefined();
  });
});

describe('formValuesToUpdatePayload', () => {
  it('maps form values to update payload with id', () => {
    const form = {
      ...characterFormDefaultValues,
      name: 'Updated',
      level: 6,
      gold: 200,
      class_id: 'cls-2',
      race_id: 'race-2',
      description: 'New desc',
      notes: 'New notes',
    };
    const payload = formValuesToUpdatePayload(form, 'char-123');
    expect(payload.id).toBe('char-123');
    expect(payload.name).toBe('Updated');
    expect(payload.level).toBe(6);
    expect(payload.gold).toBe(200);
    expect(payload.class_id).toBe('cls-2');
    expect(payload.race_id).toBe('race-2');
    expect(payload.description).toBe('New desc');
    expect(payload.notes).toBe('New notes');
    expect(payload.stats).toBeDefined();
  });

  it('converts empty description/notes to null', () => {
    const form = { ...characterFormDefaultValues, description: '', notes: '' };
    const payload = formValuesToUpdatePayload(form, 'char-1');
    expect(payload.description).toBeNull();
    expect(payload.notes).toBeNull();
  });
});
