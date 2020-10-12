export const weightedRandomGame = (games: Record<string, string[]>) => {
  const randomNumber = Math.random();
  const numberOfGames = Object.keys(games).length;
  const allVotesNumber = Object.values(games).reduce(
    (votesSum, peopleVotedOnGame) => votesSum + peopleVotedOnGame.length,
    0,
  );
  const rangeForOneVote = 1 / (allVotesNumber || numberOfGames);

  let gameLowestNumber = 0;
  for (const name in games) {
    const votesNumberForGame = games[name].length;
    const gameHighestNumber =
      gameLowestNumber + votesNumberForGame * rangeForOneVote;
    if (randomNumber < gameHighestNumber) {
      console.log(
        `gameHighestNumber: ${gameHighestNumber}; name: ${name}; random: ${randomNumber}`,
      );
      return name;
    }

    gameLowestNumber = gameHighestNumber;
  }

  throw new Error('Your algorithm of drawing the game sucks!!!');
};
