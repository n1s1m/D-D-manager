'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui-components';
import { ChevronDown, LogOut } from 'lucide-react';
import { supabase } from 'supabase-client';
import type { User } from '@supabase/supabase-js';

function getUserDisplay(user: User): { name: string; initial: string } {
  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    user.email ||
    'User';
  const initial = name.charAt(0).toUpperCase();
  return { name, initial };
}

export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u ?? null);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const display = user ? getUserDisplay(user) : null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/characters" className="font-semibold">
            Characters
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {display?.initial ?? '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[140px] truncate text-sm">
                  {display?.name ?? 'Loading...'}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{display?.name}</span>
                  {user?.email && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {children}
    </>
  );
}
