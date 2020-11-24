import { NextPage } from 'next';
import React from 'react';
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
import { isUserAdmin } from '../auth';
import Page from '../components/Page';
import { URL as POLL_URL } from './polls/[id]';
import { URL as POLL_VOTE_URL } from './polls/[id]/vote';
import { URL as CREATE_POLL_URL } from './polls/create';
import { Poll } from './api/polls';

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

  const userAlreadyVoted = (poll: Poll) => {
    return poll.votes.some((vote) => {
      return vote.username === user?.username;
    });
  };

  return (
    <Page title="Polls">
      <Grid container spacing={1}>
        {polls
          ?.sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new Date(b.plannedFor) - new Date(a.plannedFor);
          })
          .map((poll) => (
            <Grid item key={poll.id} xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography gutterBottom component="h2" variant="h6">
                    {poll.name} (
                    {format(new Date(poll.plannedFor), 'dd/MM/yyyy')})
                  </Typography>
                  <Typography color="textSecondary">
                    {poll.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {userAlreadyVoted(poll) ? (
                    <Button
                      color="primary"
                      onClick={() => {
                        router.push(POLL_URL(poll.id));
                      }}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() => {
                        router.push(POLL_VOTE_URL(poll.id));
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
      {isUserAdmin(user?.username) && (
        <AddPollFab
          color="primary"
          onClick={() => {
            router.push(CREATE_POLL_URL);
          }}
        >
          <AddIcon />
        </AddPollFab>
      )}
    </Page>
  );
};

export default Home;
