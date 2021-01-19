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
    if (
      !req.body.eventTypeToSwitch &&
      !req.body.switchSelectedTerm &&
      !req.body.termProposition &&
      !req.body.termToSwitch &&
      !req.body.username
    ) {
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

    if (req.body.switchSelectedTerm) {
      if (event.preparation.selectedTerm === req.body.switchSelectedTerm) {
        db.get('events')
          .find({ id: id as string })
          .assign({
            preparation: update(event.preparation, {
              selectedTerm: {
                $set: undefined,
              },
            }),
          })
          .write();
      } else {
        db.get('events')
          .find({ id: id as string })
          .assign({
            preparation: update(event.preparation, {
              selectedTerm: {
                $set: req.body.switchSelectedTerm,
              },
            }),
          })
          .write();
      }
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

    if (req.body.eventTypeToSwitch && req.body.username) {
      if (
        event.preparation.eventTypeVotes.some(
          (eventTypeVote) =>
            eventTypeVote.username === req.body.username &&
            eventTypeVote.type === req.body.eventTypeToSwitch,
        )
      ) {
        db.get('events')
          .find({ id: id as string })
          .assign({
            preparation: update(event.preparation, {
              eventTypeVotes: {
                $set: event.preparation.eventTypeVotes.filter(
                  (eventTypeVote) =>
                    eventTypeVote.username !== req.body.username ||
                    eventTypeVote.type !== req.body.eventTypeToSwitch,
                ),
              },
            }),
          })
          .write();
      } else {
        db.get('events')
          .find({ id: id as string })
          .assign({
            preparation: update(event.preparation, {
              eventTypeVotes: {
                $push: [
                  {
                    type: req.body.eventTypeToSwitch,
                    username: req.body.username,
                  },
                ],
              },
            }),
          })
          .write();
      }
    }

    if (req.body.termToSwitch && req.body.username) {
      const termToUpdate = event.preparation.possibleTerms.find(
        (term) => term.date === req.body.termToSwitch,
      );
      const indexOfTermToUpdate = event.preparation.possibleTerms.indexOf(
        termToUpdate,
      );

      if (
        termToUpdate.usernames.some(
          (username) => username === req.body.username,
        )
      ) {
        db.get('events')
          .find({ id: id as string })
          .assign({
            preparation: update(event.preparation, {
              possibleTerms: {
                [indexOfTermToUpdate]: {
                  usernames: {
                    $set: termToUpdate.usernames.filter(
                      (username) => username !== req.body.username,
                    ),
                  },
                },
              },
            }),
          })
          .write();
      } else {
        db.get('events')
          .find({ id: id as string })
          .assign({
            preparation: update(event.preparation, {
              possibleTerms: {
                [indexOfTermToUpdate]: {
                  usernames: {
                    $push: [req.body.username],
                  },
                },
              },
            }),
          })
          .write();
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).send(event);
  }
};
