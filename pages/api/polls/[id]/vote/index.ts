import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { Vote } from '../..';

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ polls: [] }).write();

export default (req: NextApiRequest, res: NextApiResponse<Vote>) => {
  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    if (!req.body.username || !req.body.votedFor) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const vote: Vote = {
      id: uuidv4(),
      username: req.body.username,
      votedFor: req.body.votedFor,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poll = db.get('polls').find({ id }).value();

    db.get('polls')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .find({ id })
      .assign({
        votes: [...poll.votes, vote],
      })
      .write();

    return res.status(StatusCodes.OK).send(vote);
  }
};
