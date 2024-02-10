'use client';
import { banPlayer, kickPlayer } from '@/client';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { selectPlayerList } from '@/providers/server-status-provider';
import { useAsyncList } from '@react-stately/data';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { useAtomSelector } from '@zedux/react';
import { BanIcon, MoreVerticalIcon, UserXIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import type { Player } from '../../../server/palworldManager';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const initialSortDescriptor: SortDescriptor = {
  column: 'name',
  direction: 'ascending',
};

type ColumnKey = keyof Player | 'actions';

export const PlayerTable: FC = () => {
  const playerList = useAtomSelector(selectPlayerList);

  let list = useAsyncList<Player>({
    async load() {
      return {
        items: playerList,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((playerA, playerB) => {
          const sortColumn = sortDescriptor.column as keyof Player;
          let firstValue = playerA[sortColumn];
          let secondValue = playerB[sortColumn];
          let comparison = `${firstValue}` < `${secondValue}` ? -1 : 1;

          if (sortDescriptor.direction === 'descending') {
            comparison *= -1;
          }

          return comparison;
        }),
      };
    },
    getKey: item => item.steamId,
    initialSortDescriptor,
  });

  useEffect(() => {
    list.reload();
  }, [playerList]);

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Steam ID</TableHead>
            <TableHead>Is Online</TableHead>
            <TableHead className="text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playerList.map(player => {
            return (
              <TableRow key={player.name}>
                <TableCell className="font-bold text-foreground">
                  {player.name}
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {player.playerUid}
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {player.steamId}
                </TableCell>
                <TableCell>
                  {player.isOnline ? (
                    <Badge
                      variant="outline"
                      className="inline-flex items-center gap-2 bg-card text-green-500 dark:text-emerald-400"
                    >
                      Online
                    </Badge>
                  ) : (
                    'Offline'
                  )}
                </TableCell>
                <PlayerAction player={player} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

function PlayerAction({ player }: { player: Player }) {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'kick' | 'ban' | null>();

  const performAction = async () => {
    if (selectedAction === 'kick') {
      await kickPlayer(player.steamId);
    } else {
      await banPlayer(player.steamId);
    }
  };

  return (
    <TableCell className="float-end">
      <AlertDialog
        open={open}
        onOpenChange={o => {
          setOpen(o);
          setSelectedAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          <AlertDialogDescription>
            Do you really want to {selectedAction} this player?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => performAction()}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              setOpen(true);
              setSelectedAction('kick');
            }}
            className="gap-2"
          >
            <UserXIcon className="h-5 w-5" /> Kick Player
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              setOpen(true);
              setSelectedAction('ban');
            }}
            className="gap-2 text-destructive hover:!bg-destructive hover:!text-destructive-foreground"
          >
            <BanIcon className="h-5 w-5" />
            Ban Player
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
}
