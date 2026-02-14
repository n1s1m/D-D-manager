import { z } from 'zod';
import type { Character } from 'shared-types';

export const characterFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.coerce.number().int().min(1, 'Level must be 1–20').max(20),
  gold: z.coerce.number().min(0, 'Gold cannot be negative'),
  armor_class: z.coerce.number().int().min(0),
  hit_points_max: z.coerce.number().int().min(1),
  hit_points_current: z.coerce.number().int().min(0),
  speed_ft: z.coerce.number().int().min(0),
  class_id: z.string(),
  race_id: z.string(),
  background: z.string().optional(),
  strength: z.coerce.number().int().min(1, '1–30').max(30),
  dexterity: z.coerce.number().int().min(1).max(30),
  constitution: z.coerce.number().int().min(1).max(30),
  intelligence: z.coerce.number().int().min(1).max(30),
  wisdom: z.coerce.number().int().min(1).max(30),
  charisma: z.coerce.number().int().min(1).max(30),
  description: z.string(),
  notes: z.string(),
});

export type CharacterFormValues = z.infer<typeof characterFormSchema>;

export const characterFormDefaultValues: CharacterFormValues = {
  name: '',
  level: 1,
  gold: 100,
  armor_class: 10,
  hit_points_max: 10,
  hit_points_current: 10,
  speed_ft: 30,
  class_id: '',
  race_id: '',
  background: '',
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  description: '',
  notes: '',
};

export function getDefaultValuesFromCharacter(character: Character): CharacterFormValues {
  return {
    ...characterFormDefaultValues,
    name: character.name,
    level: character.level,
    gold: character.gold ?? 0,
    armor_class: character.armor_class ?? 10,
    hit_points_max: character.hit_points_max ?? 10,
    hit_points_current: character.hit_points_current ?? 10,
    speed_ft: character.speed_ft ?? 30,
    class_id: character.class_id ?? '',
    race_id: character.race_id ?? '',
    background: character.background ?? '',
    strength: character.stats.strength,
    dexterity: character.stats.dexterity,
    constitution: character.stats.constitution,
    intelligence: character.stats.intelligence,
    wisdom: character.stats.wisdom,
    charisma: character.stats.charisma,
    description: character.description ?? '',
    notes: character.notes ?? '',
  };
}
