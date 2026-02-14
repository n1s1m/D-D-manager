import type { Character, CharacterStats } from 'shared-types';
import type { CharacterFormValues } from './character-form-schema';

export type CreateCharacterPayload = Omit<
  Character,
  'id' | 'user_id' | 'created_at' | 'updated_at' | 'class' | 'race' | 'inventory'
>;

export function formValuesToCreatePayload(data: CharacterFormValues): CreateCharacterPayload {
  const stats: CharacterStats = {
    strength: data.strength,
    dexterity: data.dexterity,
    constitution: data.constitution,
    intelligence: data.intelligence,
    wisdom: data.wisdom,
    charisma: data.charisma,
  };
  return {
    name: data.name,
    class_id: data.class_id,
    race_id: data.race_id,
    level: data.level,
    background: data.background || undefined,
    armor_class: data.armor_class,
    hit_points_max: data.hit_points_max,
    hit_points_current: data.hit_points_current,
    speed_ft: data.speed_ft,
    skill_proficiencies: [],
    stats,
  };
}

export function formValuesToUpdatePayload(
  data: CharacterFormValues,
  characterId: string
): Partial<Character> & { id: string } {
  const stats: CharacterStats = {
    strength: data.strength,
    dexterity: data.dexterity,
    constitution: data.constitution,
    intelligence: data.intelligence,
    wisdom: data.wisdom,
    charisma: data.charisma,
  };
  return {
    id: characterId,
    name: data.name,
    level: data.level,
    gold: data.gold,
    armor_class: data.armor_class,
    hit_points_max: data.hit_points_max,
    hit_points_current: data.hit_points_current,
    speed_ft: data.speed_ft,
    class_id: data.class_id,
    race_id: data.race_id,
    stats,
    description: data.description || null,
    notes: data.notes || null,
  };
}
