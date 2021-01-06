import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import GAMES, { Game } from './games';
import { Poll } from './polls';

interface Database {
  games: Game[];
  polls: Poll[];
}

const getDb = () => {
  const adapter = new FileSync<Database>('db.json');
  const db = low(adapter);

  db.defaults({ games: GAMES, polls: [] }).write();

  return db;
};

export default getDb;
