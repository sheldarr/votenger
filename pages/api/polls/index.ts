import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import getDb from '../../../getDb';
import { Game } from '../../../getDb/games';

type GameProposition = Pick<Game, 'name' | 'type'>;

interface SummaryVote {
  proposedGames: GameProposition[];
  username: string;
  votedForRemoval: string[];
}

export interface Summary {
  createdAt: string;
  votes: SummaryVote[];
}

export interface Vote {
  id: string;
  username: string;
  votedFor: string[];
}

export interface Poll {
  alreadyPlayed: string[];
  createdAt: string;
  description: string;
  id: string;
  name: string;
  plannedFor: string;
  summary?: Summary;
  votes: Vote[];
}

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    db.get('polls').push(poll).write();

    return res.status(StatusCodes.OK).send(poll);
  } else {
    const polls: Poll[] = db.get('polls').value();

    res.status(StatusCodes.OK).json(polls);
  }
};
