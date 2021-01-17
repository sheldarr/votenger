import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DatePicker } from '@material-ui/pickers';

import useEvent from '../../../../hooks/useEvent';
import Page from '../../../../components/Page';
import useUser from '../../../../hooks/useUser';

export const URL = (eventId: string) => `/events/${eventId}/prepare`;

const PrepareEventPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: event } = useEvent(router.query.id as string);
  const [possibleTerms, setPossibleTerms] = useState([]);
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

  return (
    <Page title={`${event?.name} preparation`}>
      <Typography gutterBottom align="center" variant="h4">
        {event?.name}
      </Typography>
      <Grid container spacing={1}>
        <Grid container item justify="space-between" spacing={1} xs={12}>
          <Grid item>
            <Grid container spacing={1}>
              {players?.map((player) => (
                <Grid item key={player}>
                  <Chip color="primary" label={player} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h4">
            Term
          </Typography>
        </Grid>
        <Grid item>
          <Button color="primary" onClick={() => setIsNewTermPickerOpen(true)}>
            Add term
          </Button>
          <DatePicker
            disablePast
            TextFieldComponent={() => null}
            onChange={(newTerm) => {
              setPossibleTerms([...possibleTerms, newTerm.toISOString()]);
            }}
            onClose={() => setIsNewTermPickerOpen(false)}
            onOpen={() => setIsNewTermPickerOpen(true)}
            open={isNewTermPickerOpen}
            value={undefined}
          />
        </Grid>
        {possibleTerms
          .sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return new Date(b.date) - new Date(a.date);
          })
          .map((possibleTerm) => (
            <Grid item key={possibleTerm.date}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked
                    color="primary"
                    name={possibleTerm.date}
                    onChange={(value) => {
                      console.log(value);
                    }}
                  />
                }
                label={possibleTerm}
              />
            </Grid>
          ))}
      </Grid>
    </Page>
  );
};

export default PrepareEventPage;
