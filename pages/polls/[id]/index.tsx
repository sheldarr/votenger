import React from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import CasinoIcon from '@material-ui/icons/Casino';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FlipMove from 'react-flip-move';

import usePoll from '../../../hooks/usePoll';
import useUser from '../../../hooks/useUser';

export const URL = (pollId: string) => `/polls/${pollId}`;

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const CloseFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 6rem;
`;

function weightedRandomGame(games: Record<string, number>) {
  let sum = 0;
  const r = Math.random();
  const numberOfGames = Object.keys(games).length;

  console.log(r);

  for (const name in games) {
    sum += games[name] / numberOfGames;
    if (r <= sum) return name;
  }
}

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  const { data: poll } = usePoll(router.query.id as string);

  const games =
    poll?.votes.reduce<Record<string, number>>((games, vote) => {
      vote.votedFor.forEach((vote) => {
        if (games[vote]) {
          return (games[vote] += 1);
        }

        games[vote] = 1;
      });

      return games;
    }, {}) || {};

  return (
    <Container>
      <StyledPaper>
        <Typography gutterBottom align="center" variant="h2">
          {poll?.name}
        </Typography>
        <Grid container spacing={1}>
          <FlipMove typeName={null}>
            {Object.entries(games)
              .sort(([, scoreA], [, scoreB]) => {
                return scoreB - scoreA;
              })
              .map(([name, score]) => (
                <Grid item key={name} xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography gutterBottom component="h2" variant="h5">
                        {score}pt{score !== 1 && 's'} - {name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </FlipMove>
        </Grid>
        {user?.isAdmin && (
          <CloseFab
            color="primary"
            onClick={() => {
              console.log(weightedRandomGame(games));
            }}
          >
            <CasinoIcon />
          </CloseFab>
        )}
      </StyledPaper>
    </Container>
  );
};

export default PollPage;
