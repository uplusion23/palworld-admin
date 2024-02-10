'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
