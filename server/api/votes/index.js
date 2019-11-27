const db = require('../../db');

module.exports = (req, res) => {
  const votes = db.getVotes();

  return res.send(votes);
};
