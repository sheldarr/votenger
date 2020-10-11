import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

import { Poll } from '../..';
import { REFRESH_VOTE } from '../vote';
import getDb from '../../../../../getDb';

const PlayedApi = (req: NextApiRequest, res: NextApiResponse<Poll>) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    if (!req.body.name) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poll = db.get('polls').find({ id }).value();

    if (poll.alreadyPlayed.includes(req.body.name)) {
      db.get('polls')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .find({ id })
        .assign({
          alreadyPlayed: poll.alreadyPlayed.filter((name) => {
            return name !== req.body.name;
          }),
        })
        .write();
    } else {
      db.get('polls')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .find({ id })
        .assign({
          alreadyPlayed: [...poll.alreadyPlayed, req.body.name],
        })
        .write();
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(REFRESH_VOTE);

    return res.status(StatusCodes.OK).send(poll);
  }
};

export default PlayedApi;
