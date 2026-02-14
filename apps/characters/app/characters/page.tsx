'use client';

import Link from 'next/link';
import { Button } from '@repo/ui-components';
import { CharacterAvatar } from './[id]/components/character-avatar';
import { useCharacters } from '@/lib/hooks/use-characters';
import { CharactersListSkeleton } from './characters-list-skeleton';

export default function CharactersPage() {
  const { getList } = useCharacters();
  const { data: characters = [], isLoading, error } = getList();

  if (isLoading) {
    return <CharactersListSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-destructive">Failed to load characters.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Characters</h1>
        <Link href="/characters/new">
          <Button>Create New Character</Button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No characters yet</p>
          <Link href="/characters/new">
            <Button>Create Your First Character</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Link key={character.id} href={`/characters/${character.id}`}>
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer flex gap-4">
                <CharacterAvatar character={character} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold mb-2">{character.name}</h2>
                  <p className="text-muted-foreground mb-2">
                    {character.race?.name} {character.class?.name} - Level {character.level}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>STR: {character.stats.strength}</p>
                    <p>DEX: {character.stats.dexterity}</p>
                    <p>CON: {character.stats.constitution}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
