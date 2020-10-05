import { NextApiRequest, NextApiResponse } from 'next';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ polls: [] }).write();

export interface Poll {
  id: string;
}

export default (req: NextApiRequest, res: NextApiResponse<Poll[]>) => {
  const polls: Poll[] = db.get('polls').value();

  res.status(200).json(polls);
};
