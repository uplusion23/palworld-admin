'use client';
import { FC, Suspense } from 'react';
import { selectOnlinePlayerCount } from './ServerStatusProvider';
import { useAtomSelector } from '@zedux/react';

export const OnlinePlayerCount: FC = () => {
  const onlinePlayerCount = useAtomSelector(selectOnlinePlayerCount);
  return (
    <Suspense>
      <span>{onlinePlayerCount} online</span>
    </Suspense>
  );
};
