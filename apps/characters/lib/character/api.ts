import { queryOptions } from '@tanstack/react-query';
import { characterQueryKeys } from '@repo/domain';
import { getCurrentUser } from 'supabase-client';
import { supabase } from 'supabase-client';
import type { Character, Item } from 'shared-types';

export const characterApi = {
  queryKeys: characterQueryKeys,

  getCharacterQueryOptions: (characterId: string) => {
    return queryOptions({
      queryKey: characterQueryKeys.detail(characterId),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('characters')
          .select(
            '*, class:classes(id, name, hit_die), race:races(id, name), character_items(id, quantity, equipped_slot, item:items(*))'
          )
          .eq('id', characterId)
          .abortSignal(signal)
          .single();

        if (error) throw error;

        const raw = data as Character & {
          character_items?: Array<{
            id: string;
            quantity: number;
            equipped_slot: 'weapon' | 'armor' | null;
            item: Item;
          }>;
        };
        const items = (raw.character_items ?? []).map((ci) => ({
          ...ci.item,
          quantity: ci.quantity,
          character_item_id: ci.id,
          equipped_slot: ci.equipped_slot ?? null,
        }));
        const inventory = items.sort((a, b) =>
          a.character_item_id.localeCompare(b.character_item_id)
        );
        const { character_items: _, ...rest } = raw;
        return { ...rest, inventory, gold: raw.gold ?? 0 } as Character;
      },
      enabled: !!characterId,
    });
  },

  getCharactersListQueryOptions: () => {
    return queryOptions({
      queryKey: characterQueryKeys.list(),
      queryFn: async ({ signal }) => {
        const { data, error } = await supabase
          .from('characters')
          .select('*, class:classes(id, name, hit_die), race:races(id, name)')
          .order('created_at', { ascending: false })
          .abortSignal(signal);

        if (error) throw error;
        return (data || []) as Character[];
      },
    });
  },

  createCharacter: async (
    characterData: Omit<
      Character,
      'id' | 'user_id' | 'created_at' | 'updated_at' | 'class' | 'race' | 'inventory'
    >
  ) => {
    const user = await getCurrentUser(supabase);

    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name: characterData.name,
        class_id: characterData.class_id,
        race_id: characterData.race_id,
        level: characterData.level,
        background: characterData.background ?? null,
        stats: characterData.stats as object,
        armor_class: characterData.armor_class ?? 10,
        hit_points_max: characterData.hit_points_max ?? 10,
        hit_points_current: characterData.hit_points_current ?? 10,
        speed_ft: characterData.speed_ft ?? 30,
        skill_proficiencies: characterData.skill_proficiencies ?? [],
      })
      .select()
      .single();

    if (error) throw error;
    return data as Character;
  },

  updateCharacter: async (payload: Partial<Character> & { id: string }) => {
    const { id, class: _c, race: _r, inventory: _i, ...dbData } = payload as Partial<Character> & {
      id: string;
    };
    // Supabase UUID columns reject empty string; coerce to null
    const uuidFields = ['class_id', 'race_id'] as const;
    for (const key of uuidFields) {
      if (key in dbData && (dbData[key] as string) === '') {
        (dbData as Record<string, unknown>)[key] = null;
      }
    }
    const { data, error } = await supabase
      .from('characters')
      .update(dbData)
      .eq('id', id)
      .select('*, class:classes(id, name, hit_die), race:races(id, name)')
      .single();

    if (error) throw error;
    return data as Character;
  },

  deleteCharacter: async (characterId: string) => {
    const { error } = await supabase.from('characters').delete().eq('id', characterId);
    if (error) throw error;
  },
};
