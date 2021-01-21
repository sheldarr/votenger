import React, { useEffect, useState } from 'react';
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
import update from 'immutability-helper';
import TextField from '@material-ui/core/TextField';

import useGames from '../../../../../hooks/useGames';
import useEvent from '../../../../../hooks/useEvent';
import useUser from '../../../../../hooks/useUser';

import { URL as EVENT_SUMMARY_URL } from '..';
import Page from '../../../../../components/Page';
import { Decision, GameDecision } from '../../../../../getDb/polls';
import { Game } from '../../../../../getDb/games';

export const URL = (eventId: string) => `/evens/${eventId}/summary/entry`;

const SummarizeFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

interface GameCardProps {
  toRemove: boolean;
}

const GameCard = styled(Card)`
  transition: all 0.2s !important;

  ${(props: GameCardProps) =>
    props.toRemove &&
    `
      border-color: #f50057 !important;
      color: #f50057 !important;
  `}
`;

const EventSummaryEntryPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  const { data: event } = useEvent(router.query.id as string);
  const { data: games } = useGames();

  const [playedGames, setPlayedGames] = useState<Game[] | undefined>();
  const [gamesDecisions, setGamesDecisions] = useState<
    GameDecision[] | undefined
  >();
  const [gamesPropositions, setGamesProposistions] = useState<string[]>(
    Array(process.env.NEXT_PUBLIC_NUMBER_OF_GAMES_PROPOSITIONS).fill(''),
  );

  useEffect(() => {
    games &&
      event?.votes &&
      setPlayedGames(
        event?.alreadyPlayedGames.map((playedGame) => {
          return games?.find((game) => game.name === playedGame);
        }),
      );
  }, [games, event]);

  useEffect(() => {
    playedGames &&
      setGamesDecisions(
        playedGames.map((game) => ({
          decision: 'KEEP',
          name: game.name,
        })),
      );
  }, [playedGames]);

  const handlePropositionChange = (proposition: string, index: number) => {
    setGamesProposistions(
      update(gamesPropositions, {
        [index]: {
          $set: proposition,
        },
      }),
    );
  };

  const findGameDecision = (name: string) => {
    return gamesDecisions.find((gameDecision) => gameDecision.name === name);
  };

  const changeDecision = (name: string, decision: Decision) => {
    const index = gamesDecisions.findIndex(
      (gameDecision) => gameDecision.name === name,
    );

    setGamesDecisions(
      update(gamesDecisions, {
        [index]: {
          decision: { $set: decision },
        },
      }),
    );
  };

  return (
    <Page title={`Summarize ${event?.name}`}>
      <Typography gutterBottom align="center" variant="h2">
        {event?.name}
      </Typography>
      <Grid container spacing={1}>
        {gamesDecisions &&
          playedGames.map((game) => (
            <Grid item key={game.name} lg={4} md={6} xs={12}>
              <GameCard
                toRemove={findGameDecision(game.name)?.decision === 'REMOVE'}
                variant="outlined"
              >
                <CardContent>
                  <Typography gutterBottom component="h2" variant="h6">
                    {game.name}
                  </Typography>
                  <Typography color="textSecondary">{game.type}</Typography>
                </CardContent>
                <CardActions>
                  {findGameDecision(game.name).decision === 'KEEP' ? (
                    <Button
                      color="secondary"
                      onClick={() => {
                        changeDecision(game.name, 'REMOVE');
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() => {
                        changeDecision(game.name, 'KEEP');
                      }}
                    >
                      Keep
                    </Button>
                  )}
                </CardActions>
              </GameCard>
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={1}>
        <Grid item>
          <Typography gutterBottom component="h2" variant="h4">
            New propositions
          </Typography>
        </Grid>
        <Grid container item spacing={1}>
          {gamesPropositions.map((proposition, index) => (
            <TextField
              fullWidth
              id={`proposition-${index}`}
              inputProps={{ maxLength: 48 }}
              key={index}
              label={`Proposition ${index + 1}`}
              margin="normal"
              onChange={(event) =>
                handlePropositionChange(event.target.value, index)
              }
              value={proposition}
            />
          ))}
        </Grid>
      </Grid>
      <SummarizeFab
        color="primary"
        disabled={gamesPropositions?.some((proposition) => !proposition)}
        onClick={async () => {
          await axios.post(`/api/events/${router.query.id}/summary/entry`, {
            gamesDecisions,
            proposedGames: gamesPropositions,
            username: user?.username,
          });

          router.replace(EVENT_SUMMARY_URL(event.id));
        }}
      >
        <CheckIcon />
      </SummarizeFab>
    </Page>
  );
};

export default EventSummaryEntryPage;
