import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ votes: [] }).write();

db.get('votes').value();

export const getVotes = async () => {
  return db.get('votes').value();
};
