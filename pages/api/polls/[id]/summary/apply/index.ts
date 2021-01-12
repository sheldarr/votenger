import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

import getDb from '../../../../../../getDb';
import { WebSocketEvents } from '../../../../../../events';
import { Game, GameState, GameType } from '../../../../../../getDb/games';

const ApplySummaryEntryApi = (
  req: NextApiRequest,
  res: NextApiResponse<void>,
) => {
  const db = getDb();

  const {
    query: { id },
  } = req;

  if (req.method === 'POST') {
    const poll = db
      .get('polls')
      .find({ id: id as string })
      .value();

    if (!poll.summary) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    if (poll.appliedAt) {
      return res.status(StatusCodes.FORBIDDEN).end();
    }

    const gamesToRemove = Object.entries(
      poll.summary.entries.reduce<Record<string, [number, number]>>(
        (games, entry) => {
          entry.gamesDecisions.forEach((gameDecision) => {
            if (!games[gameDecision.name]) {
              games[gameDecision.name] = [0, 0];
            }

            if (gameDecision.decision === 'KEEP') {
              return (games[gameDecision.name][0] += 1);
            }

            return (games[gameDecision.name][1] += 1);
          });

          return games;
        },
        {},
      ),
    )
      .filter(([, [inFavour, against]]) => against > inFavour)
      .map(([game]) => game);

    console.log(`Games to remove: ${gamesToRemove}`);

    gamesToRemove.forEach((gameName) => {
      db.get('games')
        .find({ name: gameName })
        .assign({ state: GameState.REMOVED })
        .write();
    });

    const newGames = poll.summary.entries
      .flatMap((entry) => entry.proposedGames)
      .map<Game>((proposition) => ({
        id: uuidv4(),
        name: proposition,
        state: GameState.AVAILABLE,
        type: GameType.UNKNOWN,
      }));

    console.log(`Games to add: ${newGames}`);

    db.get('games')
      .push(...newGames)
      .write();

    db.get('polls')
      .find({ id: id as string })
      .assign(
        update(poll, {
          appliedAt: { $set: new Date().toString() },
        }),
      )
      .write();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.io.emit(WebSocketEvents.REFRESH_POLLS);

    return res.status(StatusCodes.OK).send();
  }
};

export default ApplySummaryEntryApi;
