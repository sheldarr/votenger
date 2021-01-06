import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import getDb from '../../../../../getDb';
import { Vote } from '../../../../../getDb/polls';
import { WebSocketEvents } from '../../../../../events';

const VoteApi = (req: NextApiRequest, res: NextApiResponse<Vote>) => {
  const db = getDb();

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

    const poll = db
      .get('polls')
      .find({ id: id as string })
      .value();

    const alreadyVoted = poll.votes.some(
      (existingVote) => existingVote.username === vote.username,
    );

    if (alreadyVoted) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    db.get('polls')
      .find({ id: id as string })
      .assign({
        votes: [...poll.votes, vote],
      })
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_POLLS);

    return res.status(StatusCodes.OK).send(vote);
  }
};

export default VoteApi;
