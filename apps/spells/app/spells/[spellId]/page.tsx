'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui-components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ImageWithPlaceholder,
  Skeleton,
} from '@repo/ui-components';
import { useSpell } from '@/lib/hooks/use-spell';
import { useAddSpellToCharacter } from '@/lib/hooks/use-add-spell-to-character';
import { getPublicStorageUrl as getSpellImageUrl } from 'supabase-client';

function spellLevelLabel(level: number) {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
}

export default function SpellDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const spellId = params.spellId as string;
  const characterId = searchParams.get('characterId');
  const { data: spell, isLoading, error } = useSpell(spellId);
  const addSpell = useAddSpellToCharacter();

  const handleAddToSpellbook = () => {
    if (!spell || !characterId) return;
    addSpell.mutate(
      { characterId, spellId: spell.id },
      {
        onSuccess: () => {
          router.push('/characters');
        },
        onError: () => {},
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 max-w-2xl">
        <Skeleton className="h-8 w-28 mb-6" />
        <Card>
          <Skeleton className="w-full aspect-video rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !spell) {
    return (
      <div className="container mx-auto p-8 max-w-2xl">
        <p className="text-destructive">Spell not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/spells">Back to Spells</Link>
        </Button>
      </div>
    );
  }

  const imageUrl = getSpellImageUrl(spell.image_url);
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={characterId ? `/spells?characterId=${characterId}` : '/spells'}>
            ← Back to Spells
          </Link>
        </Button>
      </div>
      <Card>
        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden bg-muted">
          <ImageWithPlaceholder
            src={imageUrl}
            alt={spell.name}
            placeholder="/placeholder-item.png"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{spell.name}</CardTitle>
          <CardDescription>
            {spellLevelLabel(spell.level)} • {spell.school}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SpellMeta label="Casting time" value={spell.casting_time} />
          <SpellMeta label="Range" value={spell.range} />
          <SpellMeta label="Duration" value={spell.duration} />
          <SpellMeta label="Components" value={spell.components} />
          {spell.material && (
            <SpellMeta label="Material" value={spell.material} />
          )}
          <div>
            <span className="font-semibold text-foreground">Description</span>
            <SpellHtmlContent
              html={spell.description}
              className="mt-2 text-muted-foreground spell-description"
            />
          </div>
          {spell.higher_level && (
            <div>
              <span className="font-semibold text-foreground">At higher levels</span>
              <SpellHtmlContent
                html={spell.higher_level}
                className="mt-2 text-muted-foreground spell-description"
              />
            </div>
          )}
          {characterId && (
            <Button
              className="w-full mt-4"
              onClick={handleAddToSpellbook}
              disabled={addSpell.isPending}
            >
              {addSpell.isPending ? 'Adding...' : 'Add to Spellbook'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SpellMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-foreground">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

/** Renders spell description HTML (from DB) as content. */
function SpellHtmlContent({ html, className }: { html: string; className?: string }) {
  if (!html?.trim()) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      // eslint-disable-next-line react/no-danger
    />
  );
}
