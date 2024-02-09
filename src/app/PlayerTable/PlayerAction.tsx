import { FC, Key, useCallback } from 'react';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';

import type { Player } from '../../../server/palworldManager';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { useConfirmationModal } from '../../components/ConfirmationModal';
import { banPlayer, kickPlayer } from '../../client';

export const PlayerAction: FC<{ player: Player }> = ({ player }) => {
  const { ConfirmationModal, openModal } = useConfirmationModal();
  const handleDropdownAction = useCallback(
    (key: Key) => {
      const action = key as 'kick' | 'ban';

      openModal(async () => {
        if (action === 'kick') {
          await kickPlayer(player.steamId);
        } else {
          await banPlayer(player.steamId);
        }
      });
    },
    [player.steamId],
  );

  return (
    <>
      <ConfirmationModal>Are you sure?</ConfirmationModal>
      <div className="relative flex justify-end items-center gap-2">
        <Dropdown title="Player actions">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <VerticalDotsIcon className="text-default-300" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu onAction={handleDropdownAction} title="Player actions" aria-label="Player Actions">
            <DropdownItem startContent="→🚪" key="kick" title="Kick">
              Kick
            </DropdownItem>
            <DropdownItem color="danger" className="text-danger" startContent="🔨" key="ban" title="Ban">
              Ban
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};
