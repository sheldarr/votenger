import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';

import useGames from '../../../../hooks/useGames';
import useEvent from '../../../../hooks/useEvent';
import useUser from '../../../../hooks/useUser';

import { URL as EVENT_DASHBOARD_URL } from '../dashboard';
import Page from '../../../../components/Page';

export const URL = (eventId: string) => `/events/${eventId}/vote`;

const VoteFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const EventVotePage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  const { data: event } = useEvent(router.query.id as string);
  const { data: allGames } = useGames();

  const games =
    allGames?.filter((game) => game.forEventType === event.type) || [];

  const [votedFor, setVotedFor] = useState<string[]>([]);

  const votesLeft = Number(process.env.NEXT_PUBLIC_MAX_VOTES) - votedFor.length;

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
    <Page title={`Vote for ${event?.name}`}>
      <Typography gutterBottom align="center" variant="h2">
        {event?.name}
      </Typography>
      <Grid container spacing={1}>
        {games?.map((game) => (
          <Grid item key={game.name} lg={4} md={6} xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography gutterBottom component="h2" variant="h6">
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
          await axios.post(`/api/events/${router.query.id}/vote`, {
            username: user?.username,
            votedFor,
          });

          router.replace(EVENT_DASHBOARD_URL(router.query.id as string));
        }}
      >
        {votesLeft > 0 ? votesLeft : <CheckIcon />}
      </VoteFab>
    </Page>
  );
};

export default EventVotePage;
