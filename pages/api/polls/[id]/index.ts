import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import getDb from '../../../../getDb';
import { Poll } from '../../../../getDb/polls';

export default (req: NextApiRequest, res: NextApiResponse<Poll>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  const poll = db
    .get('polls')
    .find({ id: id as string })
    .value();

  if (!poll) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  res.status(StatusCodes.OK).json(poll);
};
