import axios from 'axios';
import { NextPage } from 'next';
import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GamesIcon from '@material-ui/icons/Games';
import SettingsIcon from '@material-ui/icons/Settings';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import { useRouter } from 'next/router';

import useEvents from '../../hooks/useEvents';
import useUser from '../../hooks/useUser';
import { isUserAdmin } from '../../auth';
import Page from '../../components/Page';
import { Event } from '../../getDb/events';
import { URL as GAMES_URL } from '../games';
import CreateEventModal from '../../components/CreateEventModal';
import { URL as EVENT_DASHBOARD_URL } from './[id]/dashboard';
import { URL as EVENT_SUMMARY_URL } from './[id]/summary';
import { URL as EVENT_SUMMARY_ENTRY_URL } from './[id]/summary/entry';
import { URL as EVENT_VOTE_URL } from './[id]/vote';
import { URL as PREPARE_EVENT_URL } from './[id]/prepare';

export const URL = '/events';

const Settings = styled(SpeedDial)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { data: events } = useEvents();
  const [user] = useUser();

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [
    isRemoveEventConfirmationModalOpen,
    setIsRemoveEventConfirmationModalOpen,
  ] = useState(false);
  const [eventToRemove, setEventToRemove] = useState<Event | undefined>();

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
                    <Button
                      color="primary"
                      onClick={() => {
                        router.push(PREPARE_EVENT_URL(event.id));
                      }}
                    >
                      Prepare
                    </Button>
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
                    {isUserAdmin(user?.username) && (
                      <Button
                        color="secondary"
                        onClick={() => {
                          setEventToRemove(event);
                          setIsRemoveEventConfirmationModalOpen(true);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Grid item></Grid>
      </Grid>
      <Dialog
        onClose={() => {
          setEventToRemove(undefined);
          setIsRemoveEventConfirmationModalOpen(false);
        }}
        open={isRemoveEventConfirmationModalOpen}
      >
        <DialogTitle>Remove event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to remove event {eventToRemove?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setEventToRemove(undefined);
              setIsRemoveEventConfirmationModalOpen(false);
            }}
          >
            No
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              axios.delete(`/api/events/${eventToRemove?.id}`);

              setEventToRemove(undefined);
              setIsRemoveEventConfirmationModalOpen(false);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {isUserAdmin(user?.username) && (
        <Settings
          ariaLabel="Settings"
          icon={<SpeedDialIcon openIcon={<SettingsIcon />} />}
          onClose={() => {
            setIsSpeedDialOpen(false);
          }}
          onOpen={() => {
            setIsSpeedDialOpen(true);
          }}
          open={isSpeedDialOpen}
        >
          {[
            {
              icon: <AddIcon />,
              name: 'Create event',
              onClick: () => {
                setIsCreateEventModalOpen(true);
              },
            },
            {
              icon: <GamesIcon />,
              name: 'Games',
              onClick: () => {
                router.push(GAMES_URL);
              },
            },
          ].map((action) => (
            <SpeedDialAction
              icon={action.icon}
              key={action.name}
              onClick={action.onClick}
              tooltipTitle={action.name}
            />
          ))}
        </Settings>
      )}
      <CreateEventModal
        onClose={() => {
          setIsCreateEventModalOpen(false);
        }}
        open={isCreateEventModalOpen}
      />
    </Page>
  );
};

export default EventsPage;
