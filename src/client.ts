import { edenTreaty } from '@elysiajs/eden';
import type { App } from '../server';

export const client = edenTreaty<App>('http://localhost:2093/');

export const getServerStatus = () => client.api.status.get();

export const kickPlayer = (steamId: string) => client.api.kick[steamId].put();

export const banPlayer = (steamId: string) => client.api.ban[steamId].put();
