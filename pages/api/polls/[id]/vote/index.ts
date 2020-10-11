import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { Vote } from '../..';
import getDb from '../../../../../getDb';

export const REFRESH_VOTE = 'REFRESH_VOTE';

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(REFRESH_VOTE);

    return res.status(StatusCodes.OK).send(vote);
  }
};

export default VoteApi;
