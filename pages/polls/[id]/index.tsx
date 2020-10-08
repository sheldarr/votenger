import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CheckIcon from '@material-ui/icons/Check';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { checkIfUserIsAdmin, getUsername } from '../../../auth';
import usePoll from '../../../hooks/usePoll';
import { URL as POLL_VOTE_URL } from './vote';

export const URL = (pollId: string) => `/polls/${pollId}`;

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

const CloseFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 6rem;
`;

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();

  const { data: poll } = usePoll(router.query.id as string);

  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsAdmin(checkIfUserIsAdmin());
    setUsername(getUsername());
  });

  const alreadyVoted = poll?.votes.some((vote) => {
    return vote.username === username;
  });

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
          {Object.entries(games)
            .sort(([, scoreA], [, scoreB]) => {
              return scoreB - scoreA;
            })
            .map(([name, score]) => (
              <Grid item key={name} xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography gutterBottom component="h2" variant="h5">
                      {name} - {score}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
        {!alreadyVoted && (
          <VoteFab
            color="primary"
            onClick={() => {
              router.push(POLL_VOTE_URL(poll?.id));
            }}
          >
            <HowToVoteIcon />
          </VoteFab>
        )}
        {isAdmin && (
          <CloseFab
            color="primary"
            onClick={() => {
              console.log('Close');
            }}
          >
            <CheckIcon />
          </CloseFab>
        )}
      </StyledPaper>
    </Container>
  );
};

export default PollPage;
