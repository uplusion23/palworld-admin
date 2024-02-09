'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';

import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';

export const ThemeSwitcher: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      defaultSelected
      size="lg"
      color="success"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      isSelected={theme === 'dark'}
      onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    />
  );
};
