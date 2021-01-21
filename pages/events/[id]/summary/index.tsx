import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import GroupIcon from '@material-ui/icons/Group';
import GamesIcon from '@material-ui/icons/Games';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';

import useEvent from '../../../../hooks/useEvent';
import Page from '../../../../components/Page';
import { isUserAdmin } from '../../../../auth';
import useUser from '../../../../hooks/useUser';
import { URL as EVENTS_URL } from '../../';
import sortByCurrentUserAndThenAlphabetically from '../../../../utils/sortByCurrentUserAndThenAlphabetically';

const VoteFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

export const URL = (eventId: string) => `/events/${eventId}/summary`;

interface GameCardProps {
  forRemoval: boolean;
}

const GameCard = styled(Card)`
  transition: background-color 0.2s !important;

  ${(props: GameCardProps) =>
    props.forRemoval &&
    `
      border-color: #f50057 !important;
      color: #f50057 !important;
  `}

  ${(props: GameCardProps) =>
    !props.forRemoval &&
    `
      border-color: ${green[500]} !important;
      color: ${green[500]} !important;
  `}
`;

const Score = styled.div`
  align-items: center;
  display: flex;
`;

const EventSummaryPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: event } = useEvent(router.query.id as string);

  const games =
    event?.summary.entries.reduce<Record<string, [number, number]>>(
      (games, entry) => {
        entry.gamesDecisions.forEach((gameDecision) => {
          if (!games[gameDecision.name]) {
            games[gameDecision.name] = [0, 0];
          }

          if (gameDecision.decision === 'KEEP') {
            return (games[gameDecision.name][0] += 1);
          }

          return (games[gameDecision.name][1] += 1);
        });

        return games;
      },
      {},
    ) || {};

  const players = event?.summary.entries.map((entry) => entry.username);

  return (
    <Page title={`${event?.name} summary`}>
      <Typography gutterBottom align="center" variant="h4">
        {event?.name}
      </Typography>
      <Grid container spacing={1}>
        <Grid container item justify="space-between" spacing={1} xs={12}>
          <Grid item>
            <Grid container spacing={1}>
              {players
                ?.sort(sortByCurrentUserAndThenAlphabetically(user?.username))
                .map((player) => (
                  <Grid item key={player}>
                    <Chip
                      color="primary"
                      label={player}
                      variant={
                        player === user?.username ? 'default' : 'outlined'
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
                  label={event?.summary.entries.length}
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
        <Grid item>
          <Typography gutterBottom component="h2" variant="h4">
            Vox Populi
          </Typography>
        </Grid>
        <Grid container spacing={1}>
          {event &&
            Object.entries(games)
              .sort(([nameA], [nameB]) => {
                return nameA.localeCompare(nameB);
              })
              .map(([name, [inFavour, against]]) => (
                <Grid item key={name} lg={4} md={6} xs={12}>
                  <GameCard forRemoval={against > inFavour} variant="outlined">
                    <CardContent>
                      <Typography gutterBottom component="h2" variant="h6">
                        {name}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Score>
                        {[...Array(inFavour).keys()].map((index) => (
                          <AddCircleOutlineIcon
                            key={index}
                            style={{ color: green[500] }}
                          />
                        ))}
                        {[...Array(against).keys()].map((index) => (
                          <RemoveCircleOutlineIcon
                            color="secondary"
                            key={index}
                          />
                        ))}
                      </Score>
                    </CardActions>
                  </GameCard>
                </Grid>
              ))}
        </Grid>
        <Grid item>
          <Typography gutterBottom component="h2" variant="h4">
            New propositions
          </Typography>
        </Grid>
        <Grid container item spacing={1}>
          {event &&
            event.summary.entries
              .flatMap((entry) => entry.proposedGames)
              .sort((gameA, gameB) => {
                return gameA.localeCompare(gameB);
              })
              .map((game) => (
                <Grid item key={game} lg={4} md={6} xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography component="h2" variant="h6">
                        {game}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
        {!event?.appliedAt && isUserAdmin(user?.username) && (
          <VoteFab
            color="primary"
            disabled={event?.summary.entries.length < event?.votes.length}
            onClick={async () => {
              await axios.post(`/api/events/${router.query.id}/summary/apply`);

              router.replace(EVENTS_URL);
            }}
          >
            <CheckIcon />
          </VoteFab>
        )}
      </Grid>
    </Page>
  );
};

export default EventSummaryPage;
