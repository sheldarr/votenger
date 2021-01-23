import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import getDb from '../../../../getDb';
import { Event } from '../../../../getDb/events';
import { WebSocketEvents } from '../../../../events';

export default (req: NextApiRequest, res: NextApiResponse<Event | string>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'GET') {
    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    return res.status(StatusCodes.OK).json(event);
  }

  if (req.method === 'DELETE') {
    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    db.get('events')
      .remove({ id: id as string })
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }

  return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
};
