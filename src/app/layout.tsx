import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter as FontSans, Space_Mono } from 'next/font/google';
import Navigation from '@/components/navigation/navigation';
import { InitialServerStatusSetter } from '@/providers/server-status-provider';
import { getServerStatus } from '../client';
import { Providers } from './Providers';
import './globals.css';
import { cn } from '@/lib/utils';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Palworld Admin',
  description: 'Palworld Admin',
};
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { data: initialServerStatus } = await getServerStatus();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'm-0 flex h-full min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-background p-0 pt-32 font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>
          <InitialServerStatusSetter
            initialServerStatus={initialServerStatus}
          />
          <Navigation />
          <main className="mx-auto flex h-full w-full max-w-screen-sm grow flex-col sm:px-8 lg:max-w-screen-2xl">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
