import { Suspense } from 'react';
import {
  PrefetchCrossZoneLinks,
  PrefetchCrossZoneLinksProvider,
} from '@vercel/microfrontends/next/client';
import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toolbar } from './client-scripts';
import { QueryProvider } from '@repo/query-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' });

export const metadata = {
  title: 'D&D Catalog — Items & Spells',
  description: 'Browse items and spells for your D&D characters',
};

function LayoutLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading…</div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${plusJakarta.variable}`}>
        <QueryProvider>
          <PrefetchCrossZoneLinksProvider>
            <Suspense fallback={<LayoutLoadingFallback />}>{children}</Suspense>
          </PrefetchCrossZoneLinksProvider>
          <PrefetchCrossZoneLinks />
          <SpeedInsights />
          <Analytics />
          <Toolbar />
        </QueryProvider>
      </body>
    </html>
  );
}
