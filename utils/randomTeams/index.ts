import {
  Player,
  PlayerRandomTeamState,
} from '../../pages/events/[id]/dashboard';

export type RandomTeamsResult = [string[], string[]];

const randomTeams = (players: Player[]): RandomTeamsResult => {
  const teams: RandomTeamsResult = [
    players
      .filter(
        (player) => player.randomTeamState === PlayerRandomTeamState.FIRST_TEAM,
      )
      .map((player) => player.name),
    players
      .filter(
        (player) =>
          player.randomTeamState === PlayerRandomTeamState.SECOND_TEAM,
      )
      .map((player) => player.name),
  ];

  const availablePlayers = players.filter(
    (player) => player.randomTeamState === PlayerRandomTeamState.RANDOM,
  );

  let index = 0;

  while (availablePlayers.length > 0) {
    const player =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    teams[index % 2].push(player.name);

    availablePlayers.splice(availablePlayers.indexOf(player), 1);
    index += 1;
  }

  return teams;
};

export default randomTeams;
