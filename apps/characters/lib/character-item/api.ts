import { supabase } from 'supabase-client';

export const characterItemApi = {
  buyItem: async ({
    characterId,
    itemId,
  }: {
    characterId: string;
    itemId: string;
  }): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.rpc('buy_item', {
      p_character_id: characterId,
      p_item_id: itemId,
    });
    if (error) return { ok: false, error: error.message };
    return (data as { ok: boolean; error?: string }) ?? { ok: false, error: 'Unknown error' };
  },

  sellItem: async ({
    characterId,
    characterItemId,
  }: {
    characterId: string;
    characterItemId: string;
  }): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.rpc('sell_item', {
      p_character_id: characterId,
      p_character_item_id: characterItemId,
    });
    if (error) return { ok: false, error: error.message };
    return (data as { ok: boolean; error?: string }) ?? { ok: false, error: 'Unknown error' };
  },

  equipItem: async ({
    characterId,
    characterItemId,
    slot,
  }: {
    characterId: string;
    characterItemId: string;
    slot: 'weapon' | 'armor';
  }): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.rpc('equip_item', {
      p_character_id: characterId,
      p_character_item_id: characterItemId,
      p_slot: slot,
    });
    if (error) return { ok: false, error: error.message };
    return (data as { ok: boolean; error?: string }) ?? { ok: false, error: 'Unknown error' };
  },

  dropItem: async ({
    characterId,
    characterItemId,
    quantity = 0,
  }: {
    characterId: string;
    characterItemId: string;
    quantity?: number;
  }): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.rpc('drop_item', {
      p_character_id: characterId,
      p_character_item_id: characterItemId,
      p_quantity: quantity,
    });
    if (error) return { ok: false, error: error.message };
    return (data as { ok: boolean; error?: string }) ?? { ok: true };
  },

  unequipItem: async ({
    characterId,
    characterItemId,
  }: {
    characterId: string;
    characterItemId: string;
  }): Promise<{ ok: boolean; error?: string }> => {
    const { data, error } = await supabase.rpc('unequip_item', {
      p_character_id: characterId,
      p_character_item_id: characterItemId,
    });
    if (error) return { ok: false, error: error.message };
    return (data as { ok: boolean; error?: string }) ?? { ok: true };
  },

  useConsumable: async ({
    characterId,
    characterItemId,
    healAmount = 0,
  }: {
    characterId: string;
    characterItemId: string;
    healAmount?: number;
  }): Promise<{ ok: boolean; error?: string; healed?: number }> => {
    const { data, error } = await supabase.rpc('use_consumable', {
      p_character_id: characterId,
      p_character_item_id: characterItemId,
      p_heal_amount: healAmount,
    });
    if (error) return { ok: false, error: error.message };
    return (data as { ok: boolean; error?: string; healed?: number }) ?? { ok: true };
  },
};
