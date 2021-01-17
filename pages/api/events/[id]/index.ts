import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import getDb from '../../../../getDb';
import { Event } from '../../../../getDb/events';

export default (req: NextApiRequest, res: NextApiResponse<Event>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  const event = db
    .get('events')
    .find({ id: id as string })
    .value();

  if (!event) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  res.status(StatusCodes.OK).json(event);
};
