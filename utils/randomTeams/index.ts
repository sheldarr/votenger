export type RandomTeamsResult = [string[], string[]];

const randomTeams = (players: string[]): RandomTeamsResult => {
  const teams: RandomTeamsResult = [[], []];

  let index = 0;

  while (players.length > 0) {
    const player = players[Math.floor(Math.random() * players.length)];

    teams[index % 2].push(player);

    players.splice(players.indexOf(player), 1);
    index += 1;
  }

  return teams;
};

export default randomTeams;
