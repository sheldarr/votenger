import React from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import GroupIcon from '@material-ui/icons/Group';
import GamesIcon from '@material-ui/icons/Games';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FlipMove from 'react-flip-move';
import Chip from '@material-ui/core/Chip';

import usePoll from '../../../../hooks/usePoll';
import useUser from '../../../../hooks/useUser';
import Page from '../../../../components/Page';

export const URL = (pollId: string) => `/polls/${pollId}/summary`;

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

const SummaryPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [] = useUser();
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

  console.log(games);

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
        <FlipMove typeName={null}>
          {poll &&
            Object.entries(games)
              .sort(([nameA], [nameB]) => {
                return nameA.localeCompare(nameB);
              })
              .map(([name, [inFavour, against]]) => (
                <Grid item key={name} xs={12}>
                  <GameCard played variant="outlined">
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Typography component="h2" variant="h6">
                            {name} {inFavour}/{against}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </GameCard>
                </Grid>
              ))}
        </FlipMove>
      </Grid>
    </Page>
  );
};

export default SummaryPage;
