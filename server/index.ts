import { Elysia, t } from 'elysia';

import { banPlayer, executeCommand, kickPlayer } from './rcon';
import { logger } from './logger';
import { players, serverInfo, startAutoUpdates } from './palworldManager';
import { ServerStatus } from './types';

startAutoUpdates();

const app = new Elysia({ prefix: '/api' })
  .onRequest(({ request }) => {
    const path = request.url.split('/api')[1];
    logger.debug(`${request.method} /api${path}`);
  })
  .get('/status', async (): Promise<ServerStatus> => {
    const sortedPlayers = Object.values(players).sort((playerA, playerB) => {
      if (playerA.isOnline && !playerB.isOnline) {
        return -1;
      } else if (!playerA.isOnline && playerB.isOnline) {
        return 1;
      }

      return playerA.name.localeCompare(playerB.name);
    });
    const onlinePlayers = sortedPlayers.filter((player) => player.isOnline).length;

    return {
      onlinePlayers,
      players: sortedPlayers,
      serverInfo,
    };
  })
  .post(
    '/command',
    async ({ body }) => {
      return await executeCommand(body.command);
    },
    {
      body: t.Object({
        command: t.String(),
      }),
    },
  )
  .put(
    '/ban/:steamId',
    async ({ params }) => {
      return await banPlayer(params.steamId);
    },
    {
      params: t.Object({
        steamId: t.String(),
      }),
    },
  )
  .put(
    '/kick/:steamId',
    async ({ params }) => {
      return await kickPlayer(params.steamId);
    },
    {
      params: t.Object({
        steamId: t.String(),
      }),
    },
  )
  .listen(4508);

export type App = typeof app;

console.log(`🦊 Palworld Admin API is running at ${app.server?.hostname}:${app.server?.port}`);
