import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import { Poll, Summary } from '../..';
import getDb from '../../../../../getDb';
import { WebSocketEvents } from '../../../../../events';

const SummaryApi = (req: NextApiRequest, res: NextApiResponse<Poll>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method !== 'POST') {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const poll: Poll = db.get('polls').find({ id }).value();

  if (!poll) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  if (poll.summary) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  const summary: Summary = {
    createdAt: new Date().toString(),
    votes: [],
  };

  db.get('polls')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .find({ id })
    .assign({
      summary,
    })
    .write();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.io.emit(WebSocketEvents.REFRESH_POLLS);

  return res.status(StatusCodes.OK).send(poll);
};

export default SummaryApi;
