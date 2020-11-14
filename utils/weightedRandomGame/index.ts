import { RandomGameResult } from '../../types/RandomGameResult';

const weightedRandomGame = (
  games: Record<string, string[]>,
): RandomGameResult => {
  const gamesToPick = Object.entries(
    games,
  ).flatMap(([gameName, peopleVotedOnGame]) =>
    peopleVotedOnGame.map(() => gameName),
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

export default weightedRandomGame;
