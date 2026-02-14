'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@vercel/microfrontends/next/client';
import { supabase } from 'supabase-client';
import { Button } from '@repo/ui-components';
import { MainPageSkeleton } from './main-page-skeleton';
import type { User } from 'shared-types';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      setLoading(false);

      // TODO: Fetch user data from database
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email || '',
        created_at: authUser.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <MainPageSkeleton />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">D&D Character Manager</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email}!
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/characters">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2">Characters</h2>
            <p className="text-muted-foreground">
              Manage your D&D characters, view stats, and edit character sheets.
            </p>
          </div>
        </Link>

        <Link href="/shop">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2">Shop</h2>
            <p className="text-muted-foreground">
              Browse items and equipment for your characters.
            </p>
          </div>
        </Link>

        <Link href="/spells">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2">Spells</h2>
            <p className="text-muted-foreground">
              Browse spells and add them to your character spellbook.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
