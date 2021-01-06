import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import getDb from '../../../getDb';
import { Poll } from '../../../getDb/polls';

export default (req: NextApiRequest, res: NextApiResponse<Poll[] | Poll>) => {
  const db = getDb();

  if (req.method === 'POST') {
    if (!req.body.name || !req.body.plannedFor) {
      return res.status(StatusCodes.BAD_REQUEST).send([]);
    }

    const poll: Poll = {
      alreadyPlayed: [],
      createdAt: new Date().toString(),
      description: req.body.description,
      id: uuidv4(),
      name: req.body.name,
      plannedFor: req.body.plannedFor,
      votes: [],
    };

    db.get('polls').push(poll).write();

    return res.status(StatusCodes.OK).send(poll);
  } else {
    const polls = db.get('polls').value();

    res.status(StatusCodes.OK).json(polls);
  }
};
