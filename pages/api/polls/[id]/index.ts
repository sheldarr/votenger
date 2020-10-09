import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { Poll } from '..';

export default (req: NextApiRequest, res: NextApiResponse<Poll>) => {
  const adapter = new FileSync('db.json');
  const db = low(adapter);

  db.defaults({ polls: [] }).write();

  const {
    query: { id },
  } = req;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const poll = db.get('polls').find({ id }).value();

  if (!poll) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  res.status(StatusCodes.OK).json(poll);
};
