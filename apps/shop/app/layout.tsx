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
  title: 'D&D Shop - Item Marketplace',
  description: 'Browse and purchase items for your D&D characters',
};

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
            {children}
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
