import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import update from 'immutability-helper';

import getDb from '../../../../../../getDb';
import { WebSocketEvents } from '../../../../../../events';
import { isSummaryEntry, SummaryEntry } from '../../../../../../getDb/events';

const EventSummaryEntryApi = (
  req: NextApiRequest,
  res: NextApiResponse<SummaryEntry>,
) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    const entry = req.body;

    if (!isSummaryEntry(entry)) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    if (!event.summary) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    const alreadyCreatedEntry = event.summary.entries.some(
      (existingEntry) => existingEntry.username === entry.username,
    );

    if (alreadyCreatedEntry) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    db.get('events')
      .find({ id: id as string })
      .assign(
        update(event, {
          summary: {
            entries: { $push: [entry] },
          },
        }),
      )
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).send(entry);
  }
};

export default EventSummaryEntryApi;
