import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { supabase } from 'supabase-client';

/** When running behind microfrontends proxy, API is under /characters; when standalone, use /api */
const getApiUrl = () => {
  if (typeof window === 'undefined') return '/api/generate-character-action';
  const path = window.location.pathname;
  return path.startsWith('/characters') ? '/characters/api/generate-character-action' : '/api/generate-character-action';
};

export function useGenerateCharacterAction() {
  return useMutation({
    mutationFn: async ({
      characterId,
      situation,
    }: {
      characterId: string;
      situation: string;
    }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }
      try {
        const res = await axios.post<{ text: string }>(getApiUrl(), { characterId, situation }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        return res.data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.data && typeof e.response.data === 'object' && 'error' in e.response.data) {
          throw new Error(String((e.response.data as { error: unknown }).error));
        }
        throw e;
      }
    },
  });
}
