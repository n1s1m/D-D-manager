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
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' });

export const metadata = {
  title: 'D&D Characters',
  description: 'Manage your D&D characters and character sheets',
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
          <Toaster theme="dark" richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
