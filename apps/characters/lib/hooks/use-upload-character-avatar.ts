'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@repo/ui-components';
import { supabase } from 'supabase-client';
import { characterApi } from '@/lib/character/api';

function getAvatarApiUrl(characterId: string): string {
  if (typeof window === 'undefined') return `/api/characters/${characterId}/avatar`;
  const path = window.location.pathname;
  const base = path.startsWith('/characters') ? '/characters' : '';
  return `${base}/api/characters/${characterId}/avatar`;
}

export function useUploadCharacterAvatar(characterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(getAvatarApiUrl(characterId), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Upload failed');
      }
      return res.json() as Promise<{ avatar_url: string }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.detail(characterId) });
      queryClient.invalidateQueries({ queryKey: characterApi.queryKeys.list() });
      toast.success('Avatar updated');
    },
    onError: (e: Error) => {
      toast.error(e.message ?? 'Failed to upload avatar');
    },
  });
}
