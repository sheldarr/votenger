import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import GAMES from './games';

const getDb = () => {
  const adapter = new FileSync('db.json');
  const db = low(adapter);

  db.defaults({ games: GAMES, polls: [] }).write();

  return db;
};

export default getDb;
