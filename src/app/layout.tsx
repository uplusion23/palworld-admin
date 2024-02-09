import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import './globals.css';
import { Providers } from './Providers';
import { Header } from './Header';
import { getServerStatus } from '../client';
import { InitialServerStatusSetter } from './ServerStatusProvider';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        <Providers>
          <InitialServerStatusSetter initialServerStatus={initialServerStatus} />
          <div className="relative flex flex-col">
            <Header />
            <main className="px-6 flex gap-4 flex-col pb-16 flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
