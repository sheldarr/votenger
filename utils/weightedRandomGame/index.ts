const weightedRandomGame = (games: Record<string, string[]>) => {
  const gamesToPick = Object.entries(
    games,
  ).flatMap(([gameName, peopleVotedOnGame]) =>
    peopleVotedOnGame.map(() => gameName),
  );
  const randomNumber = Math.random();
  const gameIndex = Math.floor(randomNumber * gamesToPick.length);

  console.log(
    `gameIndex: ${gameIndex}; random: ${randomNumber}; gamesToPick length: ${gamesToPick.length}`,
  );

  return gamesToPick[gameIndex];
};

export default weightedRandomGame;
