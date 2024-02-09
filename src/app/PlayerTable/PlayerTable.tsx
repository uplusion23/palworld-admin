'use client';
import { FC, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from '@nextui-org/react';
import { useAsyncList } from '@react-stately/data';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { Chip } from '@nextui-org/react';

import { selectPlayerList } from '../ServerStatusProvider';
import type { Player } from '../../../server/palworldManager';
import { PlayerAction } from './PlayerAction';
import { useAtomSelector } from '@zedux/react';

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
    getKey: (item) => item.steamId,
    initialSortDescriptor,
  });

  useEffect(() => {
    list.reload();
  }, [playerList]);

  const renderCell = useCallback((player: Player, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'actions':
        return <PlayerAction player={player} />;
      case 'isOnline':
        return player.isOnline ? (
          <Chip color="success" size="sm" variant="dot">
            Online
          </Chip>
        ) : (
          <Chip color="danger" size="sm" variant="dot">
            Offline
          </Chip>
        );
      default:
        return getKeyValue(player, columnKey);
    }
  }, []);

  return (
    <Table
      aria-label="Player table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        table: 'min-h-[90px]',
        thead: '',
      }}
    >
      <TableHeader>
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="playerUid" allowsSorting>
          ID
        </TableColumn>
        <TableColumn key="steamId" allowsSorting>
          Steam ID
        </TableColumn>
        <TableColumn key="isOnline" allowsSorting>
          Is Online
        </TableColumn>
        <TableColumn key="actions">Actions</TableColumn>
      </TableHeader>
      <TableBody items={list.items} loadingContent={<Spinner label="Loading..." />} emptyContent="No players yet">
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey as keyof Player)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
