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

import usePoll from '../../../../hooks/usePoll';
import Page from '../../../../components/Page';
import { isUserAdmin } from '../../../../auth';
import useUser from '../../../../hooks/useUser';
import { URL as HOME_URL } from '../../../';

const VoteFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

export const URL = (pollId: string) => `/polls/${pollId}/summary`;

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

const SummaryPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: poll } = usePoll(router.query.id as string);

  const games =
    poll?.summary.entries.reduce<Record<string, [number, number]>>(
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

  const players = poll?.summary.entries.map((entry) => entry.username);

  return (
    <Page title={`${poll?.name} summary`}>
      <Typography gutterBottom align="center" variant="h4">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        <Grid container item justify="space-between" spacing={1} xs={12}>
          <Grid item>
            <Grid container spacing={1}>
              {players?.map((player) => (
                <Grid item key={player}>
                  <Chip color="primary" label={player} />
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
                  label={poll?.summary.entries.length}
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
          {poll &&
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
          {poll &&
            poll.summary.entries
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
        {!poll?.appliedAt && isUserAdmin(user?.username) && (
          <VoteFab
            color="primary"
            disabled={poll?.summary.entries.length < poll?.votes.length}
            onClick={async () => {
              await axios.post(`/api/polls/${router.query.id}/summary/apply`);

              router.replace(HOME_URL);
            }}
          >
            <CheckIcon />
          </VoteFab>
        )}
      </Grid>
    </Page>
  );
};

export default SummaryPage;
