import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import getDb from '../../../getDb';

export default (req: NextApiRequest, res: NextApiResponse<string[]>) => {
  const db = getDb();

  const eventTypes = db.get('eventTypes').value();

  res.status(StatusCodes.OK).json(eventTypes);
};
