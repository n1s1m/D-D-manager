// User types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Class and Race (reference tables)
export interface Class {
  id: string;
  name: string;
  /** Hit die size: 6, 8, 10, or 12 (d6, d8, d10, d12) */
  hit_die?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/** D&D 5e: ability modifier = floor((score - 10) / 2) */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** D&D 5e: proficiency bonus by level (1–4: +2, 5–8: +3, 9–12: +4, 13–16: +5, 17–20: +6) */
export function getProficiencyBonus(level: number): number {
  return Math.min(6, Math.floor((level - 1) / 4) + 2);
}

export interface Race {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Character types (D&D 5e sheet: AC, HP, speed, skills)
export interface Character {
  id: string;
  user_id: string;
  name: string;
  class_id: string;
  race_id: string;
  level: number;
  background?: string;
  stats: CharacterStats;
  /** Armor Class */
  armor_class?: number;
  /** Maximum hit points */
  hit_points_max?: number;
  /** Current hit points */
  hit_points_current?: number;
  /** Speed in feet (e.g. 30) */
  speed_ft?: number;
  /** Skill keys the character is proficient in (for skill modifier = ability_mod + proficiency) */
  skill_proficiencies?: string[];
  /** Gold (gp) for buying items in shop */
  gold?: number;
  /** Character description (for AI "What would my character do?") */
  description?: string | null;
  /** User notes for the character */
  notes?: string | null;
  /** Public URL of character avatar image (Supabase Storage) */
  avatar_url?: string | null;
  /** Items owned (from character_items join); may be empty array if not loaded */
  inventory: InventoryEntry[];
  created_at: string;
  updated_at: string;
  // Joined from FK (when selected with classes/races)
  class?: Class;
  race?: Race;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

/** D&D 5e skill key and linked ability (for modifier = getAbilityModifier(ability) + proficiency if proficient) */
export type SkillAbilityKey = keyof CharacterStats;

export const SKILLS_5E: { key: string; label: string; ability: SkillAbilityKey }[] = [
  { key: 'acrobatics', label: 'Acrobatics', ability: 'dexterity' },
  { key: 'animal_handling', label: 'Animal Handling', ability: 'wisdom' },
  { key: 'arcana', label: 'Arcana', ability: 'intelligence' },
  { key: 'athletics', label: 'Athletics', ability: 'strength' },
  { key: 'deception', label: 'Deception', ability: 'charisma' },
  { key: 'history', label: 'History', ability: 'intelligence' },
  { key: 'insight', label: 'Insight', ability: 'wisdom' },
  { key: 'intimidation', label: 'Intimidation', ability: 'charisma' },
  { key: 'investigation', label: 'Investigation', ability: 'intelligence' },
  { key: 'medicine', label: 'Medicine', ability: 'wisdom' },
  { key: 'nature', label: 'Nature', ability: 'intelligence' },
  { key: 'perception', label: 'Perception', ability: 'wisdom' },
  { key: 'performance', label: 'Performance', ability: 'charisma' },
  { key: 'persuasion', label: 'Persuasion', ability: 'charisma' },
  { key: 'religion', label: 'Religion', ability: 'intelligence' },
  { key: 'sleight_of_hand', label: 'Sleight of Hand', ability: 'dexterity' },
  { key: 'stealth', label: 'Stealth', ability: 'dexterity' },
  { key: 'survival', label: 'Survival', ability: 'wisdom' },
];

// Item types
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  description: string;
  /** Storage path (e.g. item-images/slug.png) or full URL */
  image_url?: string | null;
  stats?: ItemStats | null;
  created_at: string;
  updated_at: string;
}

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'other';

export interface ItemStats {
  damage?: string;
  ac?: number;
  [key: string]: any;
}

// Character Item (junction table)
export interface CharacterItem {
  id: string;
  character_id: string;
  item_id: string;
  quantity: number;
  equipped_slot?: 'weapon' | 'armor' | null;
  created_at: string;
}

/** Item in character inventory (item + quantity + character_items row id and equipped state) */
export type InventoryEntry = Item & {
  quantity: number;
  character_item_id: string;
  equipped_slot?: 'weapon' | 'armor' | null;
};

// Spell types
export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: SpellSchool;
  description: string;
  casting_time: string;
  range: string;
  duration: string;
  components: string;
  material?: string;
  higher_level?: string;
  /** Storage path (e.g. spell-images/slug.png) or full URL */
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

// Character Spell (spellbook junction)
export interface CharacterSpell {
  id: string;
  character_id: string;
  spell_id: string;
  prepared: boolean;
  created_at: string;
}

// Zod schemas (re-export for validation)
export {
  userSchema,
  classSchema,
  raceSchema,
  characterStatsSchema,
  characterSchema,
  itemTypeSchema,
  itemStatsSchema,
  itemSchema,
  characterItemSchema,
  spellSchoolSchema,
  spellSchema,
  characterSpellSchema,
  spellsArraySchema,
  itemsArraySchema,
} from './schemas';
export type { SpellSchema, ItemSchema } from './schemas';
