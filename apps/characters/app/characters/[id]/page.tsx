'use client';

import { useParams } from 'next/navigation';
import { CharacterDetailView } from './character-detail-view';

export default function CharacterDetailPage() {
  const params = useParams();
  const characterId = params.id as string;

  return <CharacterDetailView characterId={characterId} />;
}
