import { z } from 'zod';

// User
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type UserSchema = z.infer<typeof userSchema>;

// Class and Race
export const classSchema = z.object({
  id: z.string(),
  name: z.string(),
  hit_die: z.number().optional(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type ClassSchema = z.infer<typeof classSchema>;

export const raceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type RaceSchema = z.infer<typeof raceSchema>;

// Character stats
export const characterStatsSchema = z.object({
  strength: z.number(),
  dexterity: z.number(),
  constitution: z.number(),
  intelligence: z.number(),
  wisdom: z.number(),
  charisma: z.number(),
});

// Character
export const characterSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  class_id: z.string(),
  race_id: z.string(),
  level: z.number(),
  background: z.string().optional(),
  stats: characterStatsSchema,
  armor_class: z.number().optional(),
  hit_points_max: z.number().optional(),
  hit_points_current: z.number().optional(),
  speed_ft: z.number().optional(),
  skill_proficiencies: z.array(z.string()).optional(),
  gold: z.number().optional(),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  inventory: z.array(z.any()).default([]),
  created_at: z.string(),
  updated_at: z.string(),
  class: classSchema.optional(),
  race: raceSchema.optional(),
});
export type CharacterSchema = z.infer<typeof characterSchema>;

// Item
export const itemTypeSchema = z.enum(['weapon', 'armor', 'consumable', 'other']);
export type ItemTypeSchema = z.infer<typeof itemTypeSchema>;

export const itemStatsSchema = z.record(z.union([z.string(), z.number(), z.boolean()])).nullable().optional();
export type ItemStatsSchema = z.infer<typeof itemStatsSchema>;

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: itemTypeSchema,
  price: z.number(),
  description: z.string(),
  image_url: z.string().nullable().optional(),
  stats: itemStatsSchema,
  created_at: z.string(),
  updated_at: z.string(),
});
export type ItemSchema = z.infer<typeof itemSchema>;

// Character item
export const characterItemSchema = z.object({
  id: z.string(),
  character_id: z.string(),
  item_id: z.string(),
  quantity: z.number(),
  equipped_slot: z.enum(['weapon', 'armor']).nullable().optional(),
  created_at: z.string(),
});
export type CharacterItemSchema = z.infer<typeof characterItemSchema>;

// Spell
export const spellSchoolSchema = z.enum([
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
]);
export type SpellSchoolSchema = z.infer<typeof spellSchoolSchema>;

export const spellSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number(),
  school: spellSchoolSchema,
  description: z.string(),
  casting_time: z.string(),
  range: z.string(),
  duration: z.string(),
  components: z.string(),
  material: z.string().nullable().optional(),
  higher_level: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type SpellSchema = z.infer<typeof spellSchema>;

// Character spell
export const characterSpellSchema = z.object({
  id: z.string(),
  character_id: z.string(),
  spell_id: z.string(),
  prepared: z.boolean(),
  created_at: z.string(),
});
export type CharacterSpellSchema = z.infer<typeof characterSpellSchema>;

// Array parsers for API responses (Supabase returns unknown)
export const spellsArraySchema = z.array(spellSchema);
export const itemsArraySchema = z.array(itemSchema);
