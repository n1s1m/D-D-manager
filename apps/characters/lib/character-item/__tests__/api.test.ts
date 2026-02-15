import { describe, it, expect, vi, beforeEach } from 'vitest';
import { characterItemApi } from '../api';

const mockRpc = vi.fn();

vi.mock('supabase-client', () => ({
  supabase: {
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

describe('characterItemApi', () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  describe('buyItem', () => {
    it('calls buy_item RPC and returns ok: true on success', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      const result = await characterItemApi.buyItem({
        characterId: 'char-1',
        itemId: 'item-1',
      });
      expect(mockRpc).toHaveBeenCalledWith('buy_item', {
        p_character_id: 'char-1',
        p_item_id: 'item-1',
      });
      expect(result).toEqual({ ok: true });
    });

    it('returns ok: false and error message on RPC error', async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Not enough gold' },
      });
      const result = await characterItemApi.buyItem({
        characterId: 'char-1',
        itemId: 'item-1',
      });
      expect(result).toEqual({ ok: false, error: 'Not enough gold' });
    });
  });

  describe('sellItem', () => {
    it('calls sell_item RPC and returns ok: true on success', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      const result = await characterItemApi.sellItem({
        characterId: 'char-1',
        characterItemId: 'ci-1',
      });
      expect(mockRpc).toHaveBeenCalledWith('sell_item', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
      });
      expect(result).toEqual({ ok: true });
    });

    it('returns ok: false on error', async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Item not found' },
      });
      const result = await characterItemApi.sellItem({
        characterId: 'char-1',
        characterItemId: 'ci-bad',
      });
      expect(result).toEqual({ ok: false, error: 'Item not found' });
    });
  });

  describe('equipItem', () => {
    it('calls equip_item RPC with slot', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      const result = await characterItemApi.equipItem({
        characterId: 'char-1',
        characterItemId: 'ci-1',
        slot: 'weapon',
      });
      expect(mockRpc).toHaveBeenCalledWith('equip_item', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
        p_slot: 'weapon',
      });
      expect(result).toEqual({ ok: true });
    });

    it('supports armor slot', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      await characterItemApi.equipItem({
        characterId: 'char-1',
        characterItemId: 'ci-2',
        slot: 'armor',
      });
      expect(mockRpc).toHaveBeenCalledWith('equip_item', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-2',
        p_slot: 'armor',
      });
    });
  });

  describe('dropItem', () => {
    it('calls drop_item RPC and returns ok: true', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      const result = await characterItemApi.dropItem({
        characterId: 'char-1',
        characterItemId: 'ci-1',
      });
      expect(mockRpc).toHaveBeenCalledWith('drop_item', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
        p_quantity: 0,
      });
      expect(result).toEqual({ ok: true });
    });

    it('passes quantity when provided', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      await characterItemApi.dropItem({
        characterId: 'char-1',
        characterItemId: 'ci-1',
        quantity: 2,
      });
      expect(mockRpc).toHaveBeenCalledWith('drop_item', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
        p_quantity: 2,
      });
    });
  });

  describe('unequipItem', () => {
    it('calls unequip_item RPC and returns ok: true', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      const result = await characterItemApi.unequipItem({
        characterId: 'char-1',
        characterItemId: 'ci-1',
      });
      expect(mockRpc).toHaveBeenCalledWith('unequip_item', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
      });
      expect(result).toEqual({ ok: true });
    });
  });

  describe('useConsumable', () => {
    it('calls use_consumable RPC and returns ok and healed', async () => {
      mockRpc.mockResolvedValue({
        data: { ok: true, healed: 8 },
        error: null,
      });
      const result = await characterItemApi.useConsumable({
        characterId: 'char-1',
        characterItemId: 'ci-1',
        healAmount: 8,
      });
      expect(mockRpc).toHaveBeenCalledWith('use_consumable', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
        p_heal_amount: 8,
      });
      expect(result).toEqual({ ok: true, healed: 8 });
    });

    it('defaults healAmount to 0', async () => {
      mockRpc.mockResolvedValue({ data: { ok: true }, error: null });
      await characterItemApi.useConsumable({
        characterId: 'char-1',
        characterItemId: 'ci-1',
      });
      expect(mockRpc).toHaveBeenCalledWith('use_consumable', {
        p_character_id: 'char-1',
        p_character_item_id: 'ci-1',
        p_heal_amount: 0,
      });
    });
  });
});
