'use client';

import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui-components';
import { Camera } from 'lucide-react';
import type { Character } from 'shared-types';
import { useUploadCharacterAvatar } from '@/lib/hooks/use-upload-character-avatar';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

interface CharacterAvatarProps {
  character: Pick<Character, 'id' | 'name' | 'avatar_url'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** When true, show "Change" overlay and file upload */
  editable?: boolean;
}

const sizeClasses = {
  sm: 'h-10 w-10 min-h-10 min-w-10 max-h-10 max-w-10 text-xs',
  md: 'h-14 w-14 min-h-14 min-w-14 max-h-14 max-w-14 text-sm',
  lg: 'h-20 w-20 min-h-20 min-w-20 max-h-20 max-w-20 text-lg',
  xl: 'h-full w-full min-h-[100px] min-w-[100px] max-h-[200px] max-w-[200px] text-xl',
};

export function CharacterAvatar({
  character,
  size = 'md',
  editable = false,
}: CharacterAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadCharacterAvatar(character.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
    e.target.value = '';
  };

  const avatarNode = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={character.avatar_url ?? undefined} alt={character.name} />
      <AvatarFallback>{getInitials(character.name)}</AvatarFallback>
    </Avatar>
  );

  if (!editable) {
    return avatarNode;
  }

  return (
    <div className="relative group">
      {avatarNode}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploadAvatar.isPending}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploadAvatar.isPending}
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
        aria-label="Change avatar"
      >
        <Camera className="h-6 w-6 text-white" />
      </button>
      {uploadAvatar.isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 animate-pulse">
          <span className="text-xs text-white">...</span>
        </div>
      )}
    </div>
  );
}
