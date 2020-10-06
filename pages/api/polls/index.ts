import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ polls: [] }).write();

export interface UserVote {
  votedAt: string;
  votedFor: string;
}

export interface Vote {
  id: string;
  username: string;
  votes: UserVote[];
}

export interface Poll {
  createdAt: string;
  id: string;
  name: string;
  votes: Vote[];
}

export default (req: NextApiRequest, res: NextApiResponse<Poll[] | Poll>) => {
  if (req.method === 'POST') {
    if (!req.body.name) {
      return res.status(StatusCodes.BAD_REQUEST).send([]);
    }

    const poll = {
      createdAt: new Date().toString(),
      id: uuidv4(),
      name: req.body.name,
      votes: [],
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    db.get('polls').push(poll).write();

    return res.status(StatusCodes.OK).send(poll);
  } else {
    const polls: Poll[] = db.get('polls').value();

    res.status(StatusCodes.OK).json(polls);
  }
};
