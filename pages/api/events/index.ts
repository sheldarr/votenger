import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import getDb from '../../../getDb';
import { Event } from '../../../getDb/events';

export default (
  req: NextApiRequest,
  res: NextApiResponse<Event[] | Event | string>,
) => {
  const db = getDb();

  if (req.method === 'GET') {
    const events = db.get('events').value();

    return res.status(StatusCodes.OK).json(events);
  }

  if (req.method === 'POST') {
    if (!req.body.name) {
      return res.status(StatusCodes.BAD_REQUEST).send([]);
    }

    const createdAt = new Date().toISOString();

    const event: Event = {
      alreadyPlayedGames: [],
      createdAt,
      id: uuidv4(),
      name: req.body.name,
      preparation: {
        createdAt,
        eventTypeVotes: [],
        possibleTerms: [],
      },
      votes: [],
    };

    db.get('events').push(event).write();

    return res.status(StatusCodes.OK).send(event);
  }

  return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
};
