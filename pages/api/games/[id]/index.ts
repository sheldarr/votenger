import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { WebSocketEvents } from '../../../../events';

import getDb from '../../../../getDb';
import { Game } from '../../../../getDb/games';

export default (req: NextApiRequest, res: NextApiResponse<Game | string>) => {
  const {
    query: { id },
  } = req;

  const db = getDb();

  if (req.method === 'GET') {
    const game = db
      .get('games')
      .find({ id: id as string })
      .value();

    return res.status(StatusCodes.OK).json(game);
  }

  if (req.method === 'DELETE') {
    const game = db
      .get('games')
      .find({ id: id as string })
      .value();

    if (!game) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    db.get('games')
      .remove({ id: id as string })
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_GAMES);

    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }

  return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
};
