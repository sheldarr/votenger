import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import getDb from '../../../getDb';
import { Game } from '../../../getDb/games';

export default (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  const db = getDb();

  const games = db.get('games').value();

  res.status(StatusCodes.OK).json(games);
};
