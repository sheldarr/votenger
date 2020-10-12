export const weightedRandomGame = (games: Record<string, string[]>) => {
  let sum = 0;
  const r = Math.random();
  const numberOfGames = Object.keys(games).length;

  console.log(r);

  for (const name in games) {
    sum += games[name].length / numberOfGames;
    if (r <= sum) return name;
  }
};
