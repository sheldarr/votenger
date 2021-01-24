import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import update from 'immutability-helper';

import getDb from '../../../../../../getDb';
import { WebSocketEvents } from '../../../../../../events';

const ApplyEventPreparationApi = (
  req: NextApiRequest,
  res: NextApiResponse<void>,
) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    if (event.preparation.appliedAt) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    db.get('events')
      .find({ id: id as string })
      .assign({
        preparation: update(event.preparation, {
          appliedAt: {
            $set: new Date().toISOString(),
          },
        }),
        term: event.preparation.selectedTerm,
        type: event.preparation.selectedEventType,
      })
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).end();
  }
};

export default ApplyEventPreparationApi;
