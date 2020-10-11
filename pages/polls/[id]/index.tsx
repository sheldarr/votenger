import React from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import CasinoIcon from '@material-ui/icons/Casino';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FlipMove from 'react-flip-move';
import Chip from '@material-ui/core/Chip';

import usePoll from '../../../hooks/usePoll';
import useUser from '../../../hooks/useUser';
import useSocket from '../../../hooks/useSocket';
import { VOTE_CREATED } from '../../api/polls/[id]/vote';
import { RANDOM_GAME } from '../../../components/RandomGameDialog';

export const URL = (pollId: string) => `/polls/${pollId}`;

const CloseFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 6rem;
`;

function weightedRandomGame(games: Record<string, string[]>) {
  let sum = 0;
  const r = Math.random();
  const numberOfGames = Object.keys(games).length;

  console.log(r);

  for (const name in games) {
    sum += games[name].length / numberOfGames;
    if (r <= sum) return name;
  }
}

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: poll, mutate } = usePoll(router.query.id as string);
  const socket = useSocket(VOTE_CREATED, () => {
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

  return (
    <Container>
      <Typography gutterBottom align="center" variant="h4">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        {poll?.votes.map((vote) => (
          <Grid item key={vote.id}>
            <Chip color="primary" label={vote.username} />
          </Grid>
        ))}
        <FlipMove typeName={null}>
          {Object.entries(games)
            .sort(([, votersA], [, votersB]) => {
              return votersB.length - votersA.length;
            })
            .map(([name, voters]) => (
              <Grid item key={name} xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Typography component="h2" variant="h6">
                          {voters.length}pt{voters.length !== 1 && 's'} - {name}
                        </Typography>
                      </Grid>
                      {voters.map((voter) => (
                        <Grid item key={voter}>
                          <Chip
                            color="primary"
                            label={voter}
                            variant="outlined"
                          />
                        </Grid>
                      ))}
                    </Grid>
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
            socket.emit(RANDOM_GAME, weightedRandomGame(games));
          }}
        >
          <CasinoIcon />
        </CloseFab>
      )}
    </Container>
  );
};

export default PollPage;
