import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import CardActions from '@material-ui/core/CardActions';
import CasinoIcon from '@material-ui/icons/Casino';
import GroupIcon from '@material-ui/icons/Group';
import GamesIcon from '@material-ui/icons/Games';
import BlockIcon from '@material-ui/icons/Block';
import MouseIcon from '@material-ui/icons/Mouse';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FlipMove from 'react-flip-move';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import update from 'immutability-helper';

import usePoll from '../../../hooks/usePoll';
import useUser from '../../../hooks/useUser';
import useSocket from '../../../hooks/useSocket';
import { isUserAdmin } from '../../../auth';
import Page from '../../../components/Page';
import randomTeams from '../../../utils/randomTeams';
import exponentialWeightedRandomGame from '../../../utils/exponentialWeightedRandomGame';
import linearWeightedRandomGame from '../../../utils/linearWeightedRandomGame';
import { Poll } from '../../../getDb/polls';
import { WebSocketEvents } from '../../../events';

export const URL = (pollId: string) => `/polls/${pollId}`;

const RandomGameFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const RandomTeamsFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 6rem;
`;

interface GameCardProps {
  played: boolean;
}

const GameCard = styled(Card)`
  transition: background-color 0.2s !important;

  ${(props: GameCardProps) =>
    props.played &&
    `
      background-color: #f6e1ff !important;
  `}
`;

export enum PlayerRandomTeamState {
  FIRST_TEAM = 'FIRST_TEAM',
  SECOND_TEAM = 'SECONDS_TEAM',
  RANDOM = 'RANDOM',
  EXCLUDE = 'EXCLUDE',
}

export interface Player {
  name: string;
  randomTeamState: PlayerRandomTeamState;
}

const RandomTeamStateIcon: Record<PlayerRandomTeamState, React.ReactElement> = {
  EXCLUDE: <BlockIcon />,
  FIRST_TEAM: <MouseIcon />,
  RANDOM: <CasinoIcon />,
  SECONDS_TEAM: <KeyboardIcon />,
};

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: poll } = usePoll(router.query.id as string);

  const games =
    poll?.votes.reduce<Record<string, string[]>>((games, vote) => {
      vote.votedFor.forEach((voteForName) => {
        if (games[voteForName]) {
          return (games[voteForName] = [...games[voteForName], vote.username]);
        }

        games[voteForName] = [vote.username];
      });

      return games;
    }, {}) || {};

  const userAlreadyVoted = (poll: Poll) => {
    return poll.votes.some((vote) => {
      return vote.username === user?.username;
    });
  };

  const [players, setPlayers] = useState<Player[]>([]);

  const socket = useSocket<Player[]>(
    WebSocketEvents.UPDATE_PLAYERS,
    (players) => {
      setPlayers(players);
    },
  );

  useEffect(() => {
    setPlayers(
      poll?.votes.map((vote) => ({
        name: vote.username,
        randomTeamState: PlayerRandomTeamState.RANDOM,
      })) ?? [],
    );
  }, [poll?.votes]);

  const switchUserRandomTeamState = (user: Player) => {
    const userIndex = players.indexOf(user);
    let nextRandomTeamState: PlayerRandomTeamState = user.randomTeamState;

    switch (user.randomTeamState) {
      case PlayerRandomTeamState.EXCLUDE:
        nextRandomTeamState = PlayerRandomTeamState.RANDOM;
        break;
      case PlayerRandomTeamState.RANDOM:
        nextRandomTeamState = PlayerRandomTeamState.FIRST_TEAM;
        break;
      case PlayerRandomTeamState.FIRST_TEAM:
        nextRandomTeamState = PlayerRandomTeamState.SECOND_TEAM;
        break;
      case PlayerRandomTeamState.SECOND_TEAM:
        nextRandomTeamState = PlayerRandomTeamState.EXCLUDE;
        break;
    }

    const newPlayers = update(players, {
      [userIndex]: {
        randomTeamState: { $set: nextRandomTeamState },
      },
    });

    setPlayers(newPlayers);

    socket.emit(WebSocketEvents.UPDATE_PLAYERS, newPlayers);
  };

  return (
    <Page title={poll?.name}>
      <Typography gutterBottom align="center" variant="h4">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        <Grid container item justify="space-between" spacing={1} xs={12}>
          <Grid item>
            <Grid container spacing={1}>
              {players.map((user) => (
                <Grid item key={user.name}>
                  <Chip
                    color="primary"
                    icon={RandomTeamStateIcon[user.randomTeamState]}
                    label={user.name}
                    onClick={() => switchUserRandomTeamState(user)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  color="primary"
                  icon={<GroupIcon />}
                  label={poll?.votes.length}
                />
              </Grid>
              <Grid item>
                <Chip
                  color="primary"
                  icon={<GamesIcon />}
                  label={Object.keys(games).length}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <FlipMove typeName={null}>
          {poll &&
            userAlreadyVoted(poll) &&
            Object.entries(games)
              .sort(([, votersA], [, votersB]) => {
                return votersB.length - votersA.length;
              })
              .map(([name, voters]) => (
                <Grid item key={name} xs={12}>
                  <GameCard
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    played={
                      poll.alreadyPlayed.includes(name) ? 'played' : undefined
                    }
                    variant="outlined"
                  >
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Typography component="h2" variant="h6">
                            {voters.length}pt{voters.length !== 1 && 's'} -{' '}
                            {name}
                          </Typography>
                        </Grid>
                        {voters.map((voter) => (
                          <Grid item key={voter}>
                            <Chip color="primary" label={voter} />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                    {isUserAdmin(user?.username) && (
                      <CardActions>
                        <Button
                          color="primary"
                          onClick={() => {
                            axios.post(`/api/polls/${poll.id}/played`, {
                              name,
                            });
                          }}
                        >
                          {poll?.alreadyPlayed.includes(name)
                            ? 'Unplay'
                            : 'Played'}
                        </Button>
                      </CardActions>
                    )}
                  </GameCard>
                </Grid>
              ))}
        </FlipMove>
      </Grid>
      {isUserAdmin(user?.username) && (
        <RandomGameFab
          color="primary"
          onClick={() => {
            const unplayedGames = Object.fromEntries(
              Object.entries(games).filter(([name]) => {
                return !poll.alreadyPlayed.includes(name);
              }),
            );

            console.info(
              `Selected random game alogorithm: ${process.env.NEXT_PUBLIC_RANDOM_GAME_IMPLEMENTATION}`,
            );
            switch (process.env.NEXT_PUBLIC_RANDOM_GAME_IMPLEMENTATION) {
              case 'linear':
                socket.emit(
                  WebSocketEvents.RANDOM_GAME,
                  linearWeightedRandomGame(unplayedGames),
                );
                break;
              case 'exponential':
                socket.emit(
                  WebSocketEvents.RANDOM_GAME,
                  exponentialWeightedRandomGame(unplayedGames),
                );
                break;
              default:
                console.error('No valid random game algorithm selected');
            }
          }}
        >
          <CasinoIcon />
        </RandomGameFab>
      )}
      {isUserAdmin(user?.username) && (
        <RandomTeamsFab
          color="primary"
          onClick={() => {
            socket.emit(WebSocketEvents.RANDOM_TEAMS, randomTeams(players));
          }}
        >
          <GroupIcon />
        </RandomTeamsFab>
      )}
    </Page>
  );
};

export default PollPage;
