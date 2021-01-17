import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { v4 as uuidv4 } from 'uuid';

import { Game, LAN_PARTY_GAMES } from './games';
import { Poll } from './polls';
import { Event, EventType, EventTypeEnum } from './events';

interface Database {
  events: Event[];
  games: {
    [K in EventType]: Game[];
  };
  polls: Poll[];
}

const getDb = () => {
  const adapter = new FileSync<Database>('db.json');
  const db = low(adapter);

  db.defaults({
    events: [],
    games: {
      [EventTypeEnum.BOARD_GAME_PARTY]: [],
      [EventTypeEnum.COUCH_PARTY]: [],
      [EventTypeEnum.LAN_PARTY]: LAN_PARTY_GAMES.map((game) => ({
        ...game,
        id: uuidv4(),
      })),
      [EventTypeEnum.RPG]: [],
    },
    polls: [],
  }).write();

  return db;
};

export default getDb;
