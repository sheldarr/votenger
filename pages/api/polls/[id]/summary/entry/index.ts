import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import getDb from '../../../../../../getDb';
import { WebSocketEvents } from '../../../../../../events';
import { isSummaryEntry, SummaryEntry } from '../../../../../../getDb/polls';

const SummaryEntryApi = (
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

    const poll = db
      .get('polls')
      .find({ id: id as string })
      .value();

    if (!poll.summary) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    const alreadyCreatedEntry = poll.summary.entries.some(
      (existingEntry) => existingEntry.username === entry.username,
    );

    if (alreadyCreatedEntry) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    db.get('polls')
      .find({ id: id as string })
      .assign({
        summary: {
          ...poll.summary,
          entries: [...poll.summary.entries, entry],
        },
      })
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_POLLS);

    return res.status(StatusCodes.OK).send(entry);
  }
};

export default SummaryEntryApi;
