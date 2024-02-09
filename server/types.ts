import { Player } from './palworldManager';
import { ServerInfo } from './rcon';

export interface ServerStatus {
  onlinePlayers: number;
  players: Player[];
  serverInfo: ServerInfo;
}
