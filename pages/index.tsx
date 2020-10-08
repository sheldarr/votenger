import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';

import { useRouter } from 'next/router';
import { checkIfUserIsAdmin } from '../auth';

import usePolls from '../hooks/usePolls';
import { URL as POLL_URL } from './polls/[id]';
import { URL as CREATE_POLL_URL } from './polls/create';

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  min-height: calc(100vh - 4rem - 5rem);
  padding: 2rem;
`;

export const URL = '/';

const AddPollFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const Home: NextPage = () => {
  const router = useRouter();
  const { data: polls } = usePolls();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(checkIfUserIsAdmin());
  });

  return (
    <div>
      <Head>
        <title>votenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Container>
        <StyledPaper>
          {polls?.map((poll) => (
            <Card key={poll.id} variant="outlined">
              <CardContent>
                <Typography gutterBottom component="h2" variant="h5">
                  {poll.name} ({format(new Date(poll.createdAt), 'MM/dd/yyyy')})
                </Typography>
                <Typography color="textSecondary">
                  {poll.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  onClick={() => {
                    router.push(POLL_URL(poll.id));
                  }}
                >
                  Vote
                </Button>
              </CardActions>
            </Card>
          ))}
        </StyledPaper>
        {isAdmin && (
          <AddPollFab
            color="primary"
            onClick={() => {
              router.push(CREATE_POLL_URL);
            }}
          >
            <AddIcon />
          </AddPollFab>
        )}
      </Container>
    </div>
  );
};

export default Home;
