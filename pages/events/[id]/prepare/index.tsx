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
import { green } from '@material-ui/core/colors';
import styled from 'styled-components';

import useEvent from '../../../../hooks/useEvent';
import Page from '../../../../components/Page';
import useUser from '../../../../hooks/useUser';
import useEventTypes from '../../../../hooks/useEventTypes';
import { isUserAdmin } from '../../../../auth';

export const URL = (eventId: string) => `/events/${eventId}/prepare`;

interface CustomCheckboxProps {
  selected: boolean;
}

const CustomCheckbox = styled(Checkbox)`
  transition: background-color 0.2s !important;

  ${(props: CustomCheckboxProps) =>
    props.selected &&
    `
      color: ${green[500]} !important;
  `}
`;

const PrepareEventPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: eventTypes } = useEventTypes();
  const { data: event } = useEvent(router.query.id as string);
  const [isNewTermPickerOpen, setIsNewTermPickerOpen] = useState(false);

  const sortByCurrentUserAndThenAlphabetically = (a: string, b: string) => {
    if (a === user.username) {
      return -1;
    }

    return a.localeCompare(b);
  };

  const votedForTerms =
    event?.preparation.possibleTerms.flatMap(
      (possibleTerm) => possibleTerm.usernames,
    ) || [];
  const votedForEventType =
    event?.preparation.eventTypeVotes.flatMap(
      (eventTypeVote) => eventTypeVote.username,
    ) || [];

  const players = [...new Set([...votedForEventType, ...votedForTerms])];

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

  const switchEventType = (eventTypeToSwitch: string) => {
    axios.put(`/api/events/${router.query.id}/preparation`, {
      eventTypeToSwitch: eventTypeToSwitch,
      username: user.username,
    });
  };

  const switchSelectedTerm = (termProposition: string) => {
    axios.put(`/api/events/${router.query.id}/preparation`, {
      switchSelectedTerm: termProposition,
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
            {players
              ?.sort(sortByCurrentUserAndThenAlphabetically)
              .map((player) => (
                <Grid item key={player}>
                  <Chip
                    color="primary"
                    label={player}
                    variant={player === user.username ? 'default' : 'outlined'}
                  />
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
                  <CustomCheckbox
                    checked={possibleTerm.usernames.some(
                      (username) => username === user.username,
                    )}
                    color="primary"
                    disabled={!!event?.preparation.selectedTerm}
                    name={possibleTerm.date}
                    onChange={() => {
                      switchTerm(possibleTerm.date);
                    }}
                    selected={
                      event?.preparation.selectedTerm === possibleTerm.date
                    }
                  />
                }
                label={format(new Date(possibleTerm.date), 'dd.MM.yyyy')}
              />
              {isUserAdmin(user?.username) && (
                <Button
                  color="primary"
                  disabled={
                    event?.preparation.selectedTerm &&
                    possibleTerm.date !== event?.preparation.selectedTerm
                  }
                  onClick={() => {
                    switchSelectedTerm(possibleTerm.date);
                  }}
                >
                  {event?.preparation.selectedTerm === possibleTerm.date
                    ? 'Unselect'
                    : 'Select'}
                </Button>
              )}
            </Grid>
            {possibleTerm.usernames
              .sort(sortByCurrentUserAndThenAlphabetically)
              .map((username) => (
                <Grid item key={username}>
                  <Chip
                    color="primary"
                    label={username}
                    variant={
                      username === user.username ? 'default' : 'outlined'
                    }
                  />
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
                    <CustomCheckbox
                      checked={event?.preparation.eventTypeVotes.some(
                        (eventTypeVote) =>
                          eventTypeVote.username === user.username &&
                          eventTypeVote.type === eventType,
                      )}
                      color="primary"
                      disabled={!!event?.preparation.selectedEventType}
                      name={eventType}
                      onChange={() => {
                        switchEventType(eventType);
                      }}
                      selected={
                        event?.preparation.selectedEventType === eventType
                      }
                    />
                  }
                  label={eventType}
                />
              </Grid>
              {event?.preparation.eventTypeVotes
                .filter((eventTypeVote) => eventTypeVote.type === eventType)
                .sort((a, b) => {
                  return sortByCurrentUserAndThenAlphabetically(
                    a.username,
                    b.username,
                  );
                })
                .map((eventTypeVote) => eventTypeVote.username)
                .map((username) => (
                  <Grid item key={`${eventType}-${username}`}>
                    <Chip
                      color="primary"
                      label={username}
                      variant={
                        username === user.username ? 'default' : 'outlined'
                      }
                    />
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
