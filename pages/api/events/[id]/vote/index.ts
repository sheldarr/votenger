import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import getDb from '../../../../../getDb';
import { Vote } from '../../../../../getDb/events';
import { WebSocketEvents } from '../../../../../events';

const EventVoteApi = (req: NextApiRequest, res: NextApiResponse<Vote>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    if (!req.body.username || !req.body.votedFor) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const vote: Vote = {
      createdAt: new Date().toISOString(),
      id: uuidv4(),
      username: req.body.username,
      votedFor: req.body.votedFor,
    };

    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    const alreadyVoted = event.votes.some(
      (existingVote) => existingVote.username === vote.username,
    );

    if (alreadyVoted) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    db.get('events')
      .find({ id: id as string })
      .assign({
        votes: [...event.votes, vote],
      })
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).send(vote);
  }
};

export default EventVoteApi;
