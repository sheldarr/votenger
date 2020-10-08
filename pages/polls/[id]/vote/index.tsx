import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import useSwr from 'swr';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';

import { getUsername } from '../../../../auth';
import { Poll } from '../../../api/polls';
import { Game } from '../../../api/games';

import { URL as POLL_URL } from '..';

export const URL = (pollId: string) => `/polls/${pollId}/vote`;

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const VoteFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const MAX_VOTES = 4;

const PollVotePage: React.FunctionComponent = () => {
  const router = useRouter();

  const { data: poll, mutate: mutatePoll } = useSwr<Poll | undefined>(
    router.query.id && `/api/polls/${router.query.id}`,
    fetcher,
  );
  const { data: games, mutate: mutateGames } = useSwr<Game[]>(
    '/api/games',
    fetcher,
    {
      initialData: [],
    },
  );
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [votedFor, setVotedFor] = useState<string[]>([]);

  const votesLeft = MAX_VOTES - votedFor.length;

  useEffect(() => {
    setUsername(getUsername());
  });

  mutatePoll();
  mutateGames();

  const addVote = (vote: string) => {
    setVotedFor([...votedFor, vote]);
  };

  const removeVote = (vote: string) => {
    setVotedFor(
      votedFor.filter((voted) => {
        return voted !== vote;
      }),
    );
  };

  return (
    <Container>
      <StyledPaper>
        <Typography gutterBottom align="center" variant="h2">
          {poll?.name}
        </Typography>
        <Grid container spacing={1}>
          {games.map((game) => (
            <Grid item key={game.name} xs={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography gutterBottom component="h2" variant="h5">
                    {game.name}
                  </Typography>
                  <Typography color="textSecondary">{game.type}</Typography>
                </CardContent>
                <CardActions>
                  {votedFor.includes(game.name) ? (
                    <Button
                      color="secondary"
                      onClick={() => {
                        removeVote(game.name);
                      }}
                    >
                      Unvote
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      disabled={votesLeft === 0}
                      onClick={() => {
                        addVote(game.name);
                      }}
                    >
                      Vote
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <VoteFab
          color="primary"
          disabled={votesLeft > 0}
          onClick={async () => {
            await axios.post(`/api/polls/${router.query.id}/vote`, {
              username,
              votedFor,
            });

            router.replace(POLL_URL(router.query.id));
          }}
        >
          {votesLeft > 0 ? votesLeft : <CheckIcon />}
        </VoteFab>
      </StyledPaper>
    </Container>
  );
};

export default PollVotePage;