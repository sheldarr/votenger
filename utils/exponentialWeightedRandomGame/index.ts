export interface RandomGameResult {
  games: {
    [gameName: string]: {
      chances: number;
      firstIndex: number;
      lastIndex: number;
    };
  };
  winner: {
    index: number;
    name: string;
  };
}

const BASE = 2;

const exponentialWeightedRandomGame = (
  games: Record<string, string[]>,
): RandomGameResult => {
  const gamesToPick = Object.entries(games).flatMap(
    ([gameName, peopleVotedOnGame]) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [...Array(Math.pow(BASE, peopleVotedOnGame.length - 1)).keys()].map(
        () => gameName,
      ),
  );

  const randomNumber = Math.random();
  const winnerIndex = Math.floor(randomNumber * gamesToPick.length);

  const allGamesChances = Object.keys(games).reduce((gamesRanges, gameName) => {
    gamesRanges[gameName] = {
      chances:
        gamesToPick.filter((game) => {
          return game === gameName;
        }).length / gamesToPick.length,
      firstIndex: gamesToPick.indexOf(gameName),
      lastIndex: gamesToPick.lastIndexOf(gameName),
    };

    return gamesRanges;
  }, {});

  return {
    games: allGamesChances,
    winner: {
      index: winnerIndex,
      name: gamesToPick[winnerIndex],
    },
  };
};

export default exponentialWeightedRandomGame;
