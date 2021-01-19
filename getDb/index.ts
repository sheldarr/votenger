import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { v4 as uuidv4 } from 'uuid';

import { Game, LAN_PARTY_GAMES } from './games';
import { Poll } from './polls';
import { Event } from './events';

interface Database {
  eventTypes: string[];
  events: Event[];
  games: Game[];
  polls: Poll[];
}

const getDb = () => {
  const adapter = new FileSync<Database>('db.json');
  const db = low(adapter);

  db.defaults({
    eventTypes: ['Board Game Party', 'Couch Party', 'LAN Party', 'RPG'],
    events: [],
    games: [
      ...LAN_PARTY_GAMES.map((game) => ({
        ...game,
        id: uuidv4(),
      })),
    ],
    polls: [],
  }).write();

  return db;
};

export default getDb;
