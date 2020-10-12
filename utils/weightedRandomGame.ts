export const weightedRandomGame = (games: Record<string, string[]>) => {
  const gamesToPick = Object.entries(
    games,
  ).flatMap(([gameName, peopleVotedOnGame]) =>
    peopleVotedOnGame.map((_) => gameName),
  );
  const gameIndex = Math.floor(Math.random() * gamesToPick.length);
  return gamesToPick[gameIndex];
};
