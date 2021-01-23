import axios from 'axios';
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

import useEvents from '../../hooks/useEvents';
import useUser from '../../hooks/useUser';
import { isUserAdmin } from '../../auth';
import Page from '../../components/Page';
import { Event } from '../../getDb/events';
import { URL as EVENT_DASHBOARD_URL } from './[id]/dashboard';
import { URL as EVENT_SUMMARY_URL } from './[id]/summary';
import { URL as EVENT_SUMMARY_ENTRY_URL } from './[id]/summary/entry';
import { URL as EVENT_VOTE_URL } from './[id]/vote';
import { URL as CREATE_EVENT_URL } from './create';
import { URL as PREPARE_EVENT_URL } from './[id]/prepare';

export const URL = '/events';

const AddEventFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { data: events } = useEvents();
  const [user] = useUser();

  const userAlreadyVoted = (event: Event) => {
    return event.votes.some((vote) => {
      return vote.username === user?.username;
    });
  };

  const userAlreadyCreatedSummaryEntry = (event: Event) => {
    return event.summary.entries.some((entry) => {
      return entry.username === user?.username;
    });
  };

  return (
    <Page title="Events">
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography gutterBottom align="center" variant="h4">
            Events
          </Typography>
        </Grid>
        <Grid container item direction="column" spacing={1}>
          {events
            ?.sort((a, b) => {
              if (a.term && b.term) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return new Date(b.term) - new Date(a.term);
              }

              return -1;
            })
            .map((event) => (
              <Grid item key={event.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography gutterBottom component="h2" variant="h6">
                      {event.name}
                      {event.type && ` ${event.type}`}
                      {event.term &&
                        ` (${format(new Date(event.term), 'dd.MM.yyyy')})`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {!event.preparation.appliedAt && (
                      <Button
                        color="primary"
                        onClick={() => {
                          router.push(PREPARE_EVENT_URL(event.id));
                        }}
                      >
                        Prepare
                      </Button>
                    )}
                    {userAlreadyVoted(event) && (
                      <Button
                        color="primary"
                        onClick={() => {
                          router.push(EVENT_DASHBOARD_URL(event.id));
                        }}
                      >
                        Dashboard
                      </Button>
                    )}
                    {event.preparation.appliedAt &&
                      !event.summary &&
                      !userAlreadyVoted(event) && (
                        <Button
                          color="primary"
                          onClick={() => {
                            router.push(EVENT_VOTE_URL(event.id));
                          }}
                        >
                          Vote
                        </Button>
                      )}
                    {event.summary &&
                      userAlreadyVoted(event) &&
                      !userAlreadyCreatedSummaryEntry(event) && (
                        <Button
                          color="primary"
                          onClick={() => {
                            router.push(EVENT_SUMMARY_ENTRY_URL(event.id));
                          }}
                        >
                          Summarize
                        </Button>
                      )}
                    {event.summary &&
                      userAlreadyVoted(event) &&
                      userAlreadyCreatedSummaryEntry(event) && (
                        <Button
                          color="primary"
                          onClick={() => {
                            router.push(EVENT_SUMMARY_URL(event.id));
                          }}
                        >
                          Summary
                        </Button>
                      )}
                    {!event.summary &&
                      !!event.votes.length &&
                      isUserAdmin(user?.username) && (
                        <Button
                          color="primary"
                          onClick={() => {
                            axios.post(`/api/events/${event.id}/summary`);
                          }}
                        >
                          Create summary
                        </Button>
                      )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Grid item></Grid>
      </Grid>
      {isUserAdmin(user?.username) && (
        <AddEventFab
          color="primary"
          onClick={() => {
            router.push(CREATE_EVENT_URL);
          }}
        >
          <AddIcon />
        </AddEventFab>
      )}
    </Page>
  );
};

export default EventsPage;
