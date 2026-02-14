'use client';

import type { ChangeEvent } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast, TextareaAutosize } from '@repo/ui-components';
import { useCharacters } from '@/lib/hooks/use-characters';

const SAVE_DEBOUNCE_MS = 500;

interface SaveOnBlurFieldProps {
  title: string;
  value: string | null;
  onSave: (value: string | null) => void;
  placeholder: string;
}

function SaveOnBlurField({ title, value, onSave, placeholder }: SaveOnBlurFieldProps) {
  const [local, setLocal] = useState(value ?? '');
  const latestRef = useRef(local);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  latestRef.current = local;

  useEffect(() => {
    setLocal(value ?? '');
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const flushDebounce = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const scheduleSave = () => {
    flushDebounce();
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      const trimmed = (latestRef.current ?? '').trim() || null;
      if ((trimmed ?? '') !== (value ?? '')) {
        onSave(trimmed);
      }
    }, SAVE_DEBOUNCE_MS);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocal(e.target.value);
    scheduleSave();
  };

  const handleBlur = () => {
    flushDebounce();
    const trimmed = local.trim() || null;
    if ((trimmed ?? '') !== (value ?? '')) {
      onSave(trimmed);
    }
  };

  return (
    <div className="md:col-span-2">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <TextareaAutosize
        value={local}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="rounded-lg border bg-card p-4"
        minRows={3}
      />
    </div>
  );
}

const MemoizedDescriptionField = memo(SaveOnBlurField);
const MemoizedNotesField = memo(SaveOnBlurField);

interface DescriptionNotesProps {
  characterId: string;
}

export function DescriptionNotes({ characterId }: DescriptionNotesProps) {
  const { getCharacter, updateCharacter } = useCharacters();
  const { data: character } = getCharacter(characterId);

  const onSaveDescription = useCallback(
    (value: string | null) => {
      updateCharacter.mutate(
        { id: characterId, description: value },
        { onError: () => toast.error('Failed to save description') }
      );
    },
    [characterId, updateCharacter]
  );

  const onSaveNotes = useCallback(
    (value: string | null) => {
      updateCharacter.mutate(
        { id: characterId, notes: value },
        { onError: () => toast.error('Failed to save notes') }
      );
    },
    [characterId, updateCharacter]
  );

  if (!character) return null;

  return (
    <>
      <MemoizedDescriptionField
        title="Description"
        value={character.description ?? null}
        onSave={onSaveDescription}
        placeholder="Physical and personality traits, quirks..."
      />
      <MemoizedNotesField
        title="Notes"
        value={character.notes ?? null}
        onSave={onSaveNotes}
        placeholder="Campaign notes, ideas..."
      />
    </>
  );
}
