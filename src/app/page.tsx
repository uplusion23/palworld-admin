import { PlayerTable } from '@/components/player-table/player-table';

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-mono text-2xl text-muted-foreground">Players</h2>
      <PlayerTable />
    </div>
  );
}
