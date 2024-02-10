import ThemeSwitcher from '@/components/navigation/theme-switcher';
import { BoltIcon } from 'lucide-react';
import { OnlinePlayerCount } from '@/components/player-counter/online-player-count';

export default function Navigation() {
  return (
    <div className="fixed left-0 top-0 h-20 w-full bg-card">
      <div className="mx-auto flex h-full w-full max-w-screen-sm items-center justify-between sm:px-8 lg:max-w-screen-2xl">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <BoltIcon className="text-colorful-foreground h-5 w-5" />
            <span className="font-mono text-lg font-bold tracking-wide">
              Palworld Admin
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <OnlinePlayerCount />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
