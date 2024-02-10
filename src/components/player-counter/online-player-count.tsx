'use client';
import { FC, Suspense } from 'react';
import { useAtomSelector } from '@zedux/react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { selectOnlinePlayerCount } from '@/providers/server-status-provider';

export const OnlinePlayerCount: FC = () => {
  const onlinePlayerCount = useAtomSelector(selectOnlinePlayerCount);
  return (
    <Suspense>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline">{onlinePlayerCount} Online</Badge>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={35}>
          Players online
        </TooltipContent>
      </Tooltip>
    </Suspense>
  );
};
