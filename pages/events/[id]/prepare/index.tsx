import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DatePicker } from '@material-ui/pickers';
import Box from '@material-ui/core/Box';
import { format } from 'date-fns';

import useEvent from '../../../../hooks/useEvent';
import Page from '../../../../components/Page';
import useUser from '../../../../hooks/useUser';
import useEventTypes from '../../../../hooks/useEventTypes';

export const URL = (eventId: string) => `/events/${eventId}/prepare`;

const PrepareEventPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: eventTypes } = useEventTypes();
  const { data: event } = useEvent(router.query.id as string);
  const [isNewTermPickerOpen, setIsNewTermPickerOpen] = useState(false);

  const votedForTerms =
    event?.preparation.possibleTerms.flatMap(
      (possibleTerm) => possibleTerm.usernames,
    ) || [];
  const votedForEventType =
    event?.preparation.eventTypeVotes.flatMap(
      (eventTypeVote) => eventTypeVote.username,
    ) || [];

  console.log(votedForTerms, votedForEventType);

  const players = [...votedForTerms, ...votedForEventType];

  const addTermProposition = (termProposition: string) => {
    axios.put(`/api/events/${router.query.id}/preparation`, {
      termProposition,
    });
  };

  const switchTerm = (termToSwitch: string) => {
    axios.put(`/api/events/${router.query.id}/preparation`, {
      termToSwitch,
      username: user.username,
    });
  };

  return (
    <Page title={`${event?.name} preparation`}>
      <Typography gutterBottom align="center" variant="h4">
        {event?.name}
      </Typography>
      <Grid container spacing={1}>
        <Box paddingBottom={3}>
          <Grid container item spacing={1}>
            {players?.sort().map((player) => (
              <Grid item key={player}>
                <Chip color="primary" label={player} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Grid container item spacing={1} xs={12}>
          <Typography gutterBottom variant="h4">
            Term
          </Typography>
          <Button color="primary" onClick={() => setIsNewTermPickerOpen(true)}>
            Add term
          </Button>
          <DatePicker
            disablePast
            TextFieldComponent={() => null}
            onChange={(term) => addTermProposition(term.toISOString())}
            onClose={() => setIsNewTermPickerOpen(false)}
            onOpen={() => setIsNewTermPickerOpen(true)}
            open={isNewTermPickerOpen}
            value={undefined}
          />
        </Grid>
        {event?.preparation.possibleTerms.map((possibleTerm) => (
          <Grid container item key={possibleTerm.date} spacing={1} xs={12}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={possibleTerm.usernames.some(
                      (username) => username === user.username,
                    )}
                    color="primary"
                    name={possibleTerm.date}
                    onChange={() => {
                      switchTerm(possibleTerm.date);
                    }}
                  />
                }
                label={format(new Date(possibleTerm.date), 'dd.MM.yyyy')}
              />
            </Grid>
            {possibleTerm.usernames.sort().map((username) => (
              <Grid item key={username}>
                <Chip color="primary" label={username} />
              </Grid>
            ))}
          </Grid>
        ))}
        <Grid container item spacing={1} xs={12}>
          <Typography gutterBottom variant="h4">
            Type
          </Typography>
        </Grid>
        {eventTypes &&
          eventTypes.map((eventType) => (
            <Grid container item key={eventType} spacing={1} xs={12}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={event?.preparation.eventTypeVotes.some(
                        (eventTypeVote) =>
                          eventTypeVote.username === user.username,
                      )}
                      color="primary"
                      name={eventType}
                      onChange={() => {
                        // switchTerm(possibleTerm.date);
                      }}
                    />
                  }
                  label={eventType}
                />
              </Grid>
              {event?.preparation.eventTypeVotes
                .filter((eventTypeVote) => eventTypeVote.type === eventType)
                .map((eventTypeVote) => eventTypeVote.username)
                .sort()
                .map((username) => (
                  <Grid item key={username}>
                    <Chip color="primary" label={username} />
                  </Grid>
                ))}
            </Grid>
          ))}
        {eventTypes &&
          eventTypes.map((eventType) => (
            <Grid item key={eventType} xs={12}></Grid>
          ))}
      </Grid>
    </Page>
  );
};

export default PrepareEventPage;
