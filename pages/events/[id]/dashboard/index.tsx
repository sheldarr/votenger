import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
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
import SettingsIcon from '@material-ui/icons/Settings';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import useEvent from '../../../../hooks/useEvent';
import useUser from '../../../../hooks/useUser';
import useSocket from '../../../../hooks/useSocket';
import { isUserAdmin } from '../../../../auth';
import Page from '../../../../components/Page';
import randomTeams from '../../../../utils/randomTeams';
import exponentialWeightedRandomGame from '../../../../utils/exponentialWeightedRandomGame';
import linearWeightedRandomGame from '../../../../utils/linearWeightedRandomGame';
import { Event } from '../../../../getDb/events';
import { WebSocketEvents } from '../../../../events';

export const URL = (eventId: string) => `/events/${eventId}/dashboard`;

interface GameCardProps {
  played: boolean;
}

const Settings = styled(SpeedDial)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

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

const EventDashboardPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: event } = useEvent(router.query.id as string);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const games =
    event?.votes.reduce<Record<string, string[]>>((games, vote) => {
      vote.votedFor.forEach((voteForName) => {
        if (games[voteForName]) {
          return (games[voteForName] = [...games[voteForName], vote.username]);
        }

        games[voteForName] = [vote.username];
      });

      return games;
    }, {}) || {};

  const userAlreadyVoted = (event: Event) => {
    return event.votes.some((vote) => {
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
      event?.votes.map((vote) => ({
        name: vote.username,
        randomTeamState: PlayerRandomTeamState.RANDOM,
      })) ?? [],
    );
  }, [event?.votes]);

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
    <Page title={event?.name}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography gutterBottom align="center" variant="h4">
            {event?.name} {event?.summary && '(closed)'}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container item justify="space-between" spacing={1}>
            <Grid item>
              <Grid container spacing={1}>
                {players
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((player) => (
                    <Grid item key={player.name}>
                      <Chip
                        color="primary"
                        icon={RandomTeamStateIcon[player.randomTeamState]}
                        label={player.name}
                        onClick={() => switchUserRandomTeamState(player)}
                        variant={
                          player.name === user?.username
                            ? 'default'
                            : 'outlined'
                        }
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
                    label={event?.votes.length}
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
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <FlipMove typeName={null}>
              {event &&
                userAlreadyVoted(event) &&
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
                          event.alreadyPlayedGames.includes(name)
                            ? 'played'
                            : undefined
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
                            {voters
                              .sort((a, b) => a.localeCompare(b))
                              .map((voter) => (
                                <Grid item key={voter}>
                                  <Chip
                                    color="primary"
                                    label={voter}
                                    variant={
                                      voter === user?.username
                                        ? 'default'
                                        : 'outlined'
                                    }
                                  />
                                </Grid>
                              ))}
                          </Grid>
                        </CardContent>
                        {isUserAdmin(user?.username) && !event?.summary && (
                          <CardActions>
                            <Button
                              color="primary"
                              onClick={() => {
                                axios.post(`/api/events/${event.id}/played`, {
                                  name,
                                });
                              }}
                            >
                              {event?.alreadyPlayedGames.includes(name)
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
        </Grid>
      </Grid>
      {isUserAdmin(user?.username) && (
        <Settings
          ariaLabel="Settings"
          icon={<SpeedDialIcon openIcon={<SettingsIcon />} />}
          onClose={() => {
            setIsSpeedDialOpen(false);
          }}
          onOpen={() => {
            setIsSpeedDialOpen(true);
          }}
          open={isSpeedDialOpen}
        >
          {[
            {
              icon: <CasinoIcon />,
              name: 'Random Game',
              onClick: () => {
                const unplayedGames = Object.fromEntries(
                  Object.entries(games).filter(([name]) => {
                    return !event.alreadyPlayedGames.includes(name);
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
              },
            },
            {
              icon: <GroupIcon />,
              name: 'Random Teams',
              onClick: () => {
                socket.emit(WebSocketEvents.RANDOM_TEAMS, randomTeams(players));
              },
            },
          ].map((action) => (
            <SpeedDialAction
              icon={action.icon}
              key={action.name}
              onClick={action.onClick}
              tooltipTitle={action.name}
            />
          ))}
        </Settings>
      )}
    </Page>
  );
};

export default EventDashboardPage;
