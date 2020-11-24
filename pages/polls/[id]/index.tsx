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
import { REFRESH_VOTE } from '../../api/polls/[id]/vote';
import { RANDOM_GAME } from '../../../components/RandomGameDialog';
import { isUserAdmin } from '../../../auth';
import { Poll } from '../../api/polls';
import Page from '../../../components/Page';
import { RANDOM_TEAMS } from '../../../components/RandomTeamsDialog';
import randomTeams from '../../../utils/randomTeams';
import exponentialWeightedRandomGame from '../../../utils/exponentialWeightedRandomGame';
import linearWeightedRandomGame from '../../../utils/linearWeightedRandomGame';

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

enum UserRandomTeamState {
  FIRST_TEAM = 'FIRST_TEAM',
  SECOND_TEAM = 'SECONDS_TEAM',
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE',
}

interface User {
  name: string;
  randomTeamState: UserRandomTeamState;
}

const RandomTeamStateIcon: Record<UserRandomTeamState, React.ReactElement> = {
  EXCLUDE: <BlockIcon />,
  FIRST_TEAM: <MouseIcon />,
  INCLUDE: <CasinoIcon />,
  SECONDS_TEAM: <KeyboardIcon />,
};

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: poll, mutate } = usePoll(router.query.id as string);
  const socket = useSocket(REFRESH_VOTE, () => {
    mutate();
  });

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

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(
      poll?.votes.map((vote) => ({
        name: vote.username,
        randomTeamState: UserRandomTeamState.INCLUDE,
      })) ?? [],
    );
  }, [poll?.votes]);

  const switchUserRandaomTeamState = (user: User) => {
    const userIndex = users.indexOf(user);
    let nextRandomTeamState: UserRandomTeamState = user.randomTeamState;

    switch (user.randomTeamState) {
      case UserRandomTeamState.EXCLUDE:
        nextRandomTeamState = UserRandomTeamState.INCLUDE;
        break;
      case UserRandomTeamState.INCLUDE:
        nextRandomTeamState = UserRandomTeamState.FIRST_TEAM;
        break;
      case UserRandomTeamState.FIRST_TEAM:
        nextRandomTeamState = UserRandomTeamState.SECOND_TEAM;
        break;
      case UserRandomTeamState.SECOND_TEAM:
        nextRandomTeamState = UserRandomTeamState.EXCLUDE;
        break;
    }

    setUsers(
      update(users, {
        [userIndex]: {
          randomTeamState: { $set: nextRandomTeamState },
        },
      }),
    );
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
              {users.map((user) => (
                <Grid item key={user.name}>
                  <Chip
                    color="primary"
                    icon={RandomTeamStateIcon[user.randomTeamState]}
                    label={user.name}
                    onClick={() => switchUserRandaomTeamState(user)}
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
                  RANDOM_GAME,
                  linearWeightedRandomGame(unplayedGames),
                );
                break;
              case 'exponential':
                socket.emit(
                  RANDOM_GAME,
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
            socket.emit(
              RANDOM_TEAMS,
              randomTeams(poll?.votes.map((vote) => vote.username)),
            );
          }}
        >
          <GroupIcon />
        </RandomTeamsFab>
      )}
    </Page>
  );
};

export default PollPage;
