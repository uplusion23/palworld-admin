import { Rcon } from './yamrc';

const rconClient = new Rcon(
  process.env.RCON_HOST || 'localhost',
  !process.env.RCON_PORT || isNaN(parseInt(process.env.RCON_PORT)) ? 25575 : parseInt(process.env.RCON_PORT),
  process.env.RCON_PASSWORD || 'password',
);

export const getRconClient = async () => {
  if (!rconClient.isConnected() || !rconClient.isAuthenticated()) {
    await rconClient.connect();
  }

  return rconClient;
};

export const executeCommand = async (command: string) => {
  const client = await getRconClient();
  return await client.send(command);
};

export const banPlayer = async (steamId: string) => {
  return await executeCommand(`BanPlayer ${steamId}`);
};

export const kickPlayer = async (steamId: string) => {
  return await executeCommand(`KickPlayer ${steamId}`);
};

export interface RconPlayer {
  name: string;
  playerUid: string;
  steamId: string;
}

export const getPlayers = async (): Promise<RconPlayer[]> => {
  const response = await executeCommand('ShowPlayers');
  const responseLines = response.payload.split('\n');
  return responseLines
    .map<RconPlayer | undefined>((line) => {
      if (line === 'name,playeruid,steamid' || line === '') {
        return undefined;
      }
      const data = line.split(',');
      if (data.length !== 3) {
        return undefined;
      }

      return {
        name: data[0],
        playerUid: data[1],
        steamId: data[2],
      };
    })
    .filter<RconPlayer>((player): player is RconPlayer => player !== undefined);
};

export interface ServerInfo {
  version: string;
  name: string;
}

export const getServerInfo = async (): Promise<ServerInfo> => {
  const response = await executeCommand('Info');

  const regex = /Server\[(.*?)] (.*?)\n/i;
  const matches = regex.exec(response.payload);
  if (!Array.isArray(matches) || matches.length !== 3) {
    throw new Error('Failed to parse server info');
  }

  return {
    version: matches[1],
    name: matches[2],
  };
};
