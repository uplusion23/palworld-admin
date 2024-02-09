'use client';
import { FC, useEffect } from 'react';
import { atom, AtomGetters, injectAtomGetters, injectEffect, injectStore } from '@zedux/atoms';

import type { ServerStatus } from '../../server/types';
import { getServerStatus } from '../client';
import isEqual from 'react-fast-compare';
import { useAtomInstance } from '@zedux/react';

const defaultServerStatus: ServerStatus = {
  onlinePlayers: 0,
  players: [],
  serverInfo: {
    version: '',
    name: '',
  },
};

export interface ServerStatusContextType extends ServerStatus {}

const serverStatusAtom = atom('serverStatus', () => {
  const store = injectStore<ServerStatusContextType>(defaultServerStatus);
  const { ecosystem } = injectAtomGetters();

  injectEffect(() => {
    const intervalId = setInterval(async () => {
      const { data: newServerStatus, error } = await getServerStatus();
      if (!newServerStatus || error) {
        return;
      }
      ecosystem.batch(() => {
        if (newServerStatus.onlinePlayers !== store.getState().onlinePlayers) {
          store.setStateDeep({ onlinePlayers: newServerStatus.onlinePlayers });
        }
        if (!isEqual(newServerStatus.players, store.getState().players)) {
          store.setStateDeep({ players: newServerStatus.players });
        }
        if (!isEqual(newServerStatus.serverInfo, store.getState().serverInfo)) {
          store.setStateDeep({ serverInfo: newServerStatus.serverInfo });
        }
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return store;
});

export const selectOnlinePlayerCount = ({ get }: AtomGetters) => get(serverStatusAtom).onlinePlayers;
export const selectPlayerList = ({ get }: AtomGetters) => get(serverStatusAtom).players;

export const InitialServerStatusSetter: FC<{ initialServerStatus: ServerStatus | null }> = ({
  initialServerStatus,
}) => {
  const serverStatusInstance = useAtomInstance(serverStatusAtom);

  useEffect(() => {
    if (initialServerStatus) {
      serverStatusInstance.setState(initialServerStatus);
    }
  }, [initialServerStatus]);

  return null;
};
