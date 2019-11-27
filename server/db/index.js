const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ votes: [] }).write();

const getVotes = () => {
  return db.get('votes').value();
};

module.exports = {
  getVotes,
};
