'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaintbrushIcon, SunIcon, MoonIcon, ComputerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <PaintbrushIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => setTheme('light')}
          className="flex items-center gap-2"
        >
          <SunIcon className="h-5 w-5" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme('dark')}
          className="flex items-center gap-2"
        >
          <MoonIcon className="h-5 w-5" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme('system')}
          className="flex items-center gap-2"
        >
          <ComputerIcon className="h-5 w-5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
