import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import getDb from '../../../../../getDb';
import { Event } from '../../../../../getDb/events';
import { WebSocketEvents } from '../../../../../events';

const ToggleEventGameApi = (
  req: NextApiRequest,
  res: NextApiResponse<Event>,
) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    if (!req.body.name) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const event = db
      .get('events')
      .find({ id: id as string })
      .value();

    if (event.alreadyPlayedGames.includes(req.body.name)) {
      db.get('events')
        .find({ id: id as string })
        .assign({
          alreadyPlayedGames: event.alreadyPlayedGames.filter((name) => {
            return name !== req.body.name;
          }),
        })
        .write();
    } else {
      db.get('events')
        .find({ id: id as string })
        .assign({
          alreadyPlayedGames: [...event.alreadyPlayedGames, req.body.name],
        })
        .write();
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_EVENTS);

    return res.status(StatusCodes.OK).send(event);
  }
};

export default ToggleEventGameApi;
