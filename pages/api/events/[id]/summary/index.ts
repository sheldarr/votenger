import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

import getDb from '../../../../../getDb';
import { WebSocketEvents } from '../../../../../events';
import { Event, Summary } from '../../../../../getDb/events';

const EventSummaryApi = (req: NextApiRequest, res: NextApiResponse<Event>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method !== 'POST') {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  const event = db
    .get('events')
    .find({ id: id as string })
    .value();

  if (!event) {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  if (event.summary) {
    return res.status(StatusCodes.FORBIDDEN).end();
  }

  const summary: Summary = {
    createdAt: new Date().toISOString(),
    entries: [],
  };

  db.get('events')
    .find({ id: id as string })
    .assign({
      summary,
    })
    .write();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.io.emit(WebSocketEvents.REFRESH_EVENTS);

  return res.status(StatusCodes.OK).send(event);
};

export default EventSummaryApi;
