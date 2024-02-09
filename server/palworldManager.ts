import { getPlayers, getServerInfo, RconPlayer, ServerInfo } from './rcon';
import { logger } from './logger';

export interface Player extends RconPlayer {
  isOnline: boolean;
}

export const players: Record<string, Player> = {};
export const serverInfo: ServerInfo = {
  version: '',
  name: '',
};
let updateInterval: NodeJS.Timeout;

export const updatePlayers = async () => {
  logger.silly('Updating players');
  const rconPlayers = await getPlayers();

  Object.keys(players).forEach((steamId) => {
    players[steamId].isOnline = false;
  });

  rconPlayers.forEach((player) => {
    players[player.steamId] = {
      ...player,
      isOnline: true,
    };
  });
};

export const startAutoUpdates = () => {
  getServerInfo()
    .then((info) => {
      serverInfo.version = info.version;
      serverInfo.name = info.name;

      return updatePlayers();
    })
    .then(() => {
      updateInterval = setInterval(updatePlayers, 5000);
    });
};
