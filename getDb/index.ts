import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const getDb = () => {
  const adapter = new FileSync('db.json');
  const db = low(adapter);

  db.defaults({ polls: [] }).write();

  return db;
};

export default getDb;
