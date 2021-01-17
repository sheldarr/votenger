import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import update from 'immutability-helper';
import { isSameDay } from 'date-fns';

import getDb from '../../../../../getDb';
import { Event } from '../../../../../getDb/events';
import { WebSocketEvents } from '../../../../../events';

export default (req: NextApiRequest, res: NextApiResponse<Event | string>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'PUT') {
    if (!req.body.termProposition) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ReasonPhrases.BAD_REQUEST);
    }

    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    if (event.preparation.appliedAt) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ReasonPhrases.BAD_REQUEST);
    }

    if (
      req.body.termProposition &&
      event.preparation.possibleTerms.every(
        (possibleTerm) =>
          !isSameDay(
            new Date(req.body.termProposition),
            new Date(possibleTerm.date),
          ),
      )
    ) {
      db.get('events')
        .find({ id: id as string })
        .assign({
          preparation: update(event.preparation, {
            possibleTerms: {
              $push: [{ date: req.body.termProposition, usernames: [] }],
            },
          }),
        })
        .write();
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).send(event);
  }
};
