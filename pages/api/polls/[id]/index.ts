import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import { Poll } from '..';
import getDb from '../../../../getDb';

export default (req: NextApiRequest, res: NextApiResponse<Poll>) => {
  const db = getDb();

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
