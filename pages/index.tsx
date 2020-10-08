import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';

import { useRouter } from 'next/router';

import usePolls from '../hooks/usePolls';
import useUser from '../hooks/useUser';
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
  const [user] = useUser();

  return (
    <div>
      <Head>
        <title>Votenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Container>
        <StyledPaper>
          <Grid container spacing={1}>
            {polls
              ?.sort((a, b) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((poll) => (
                <Grid item key={poll.id} xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography gutterBottom component="h2" variant="h5">
                        {poll.name} (
                        {format(new Date(poll.createdAt), 'dd/MM/yyyy')})
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
                </Grid>
              ))}
          </Grid>
        </StyledPaper>
        {user?.isAdmin && (
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
