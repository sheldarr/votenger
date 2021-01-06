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

import useGames from '../../../../../hooks/useGames';
import usePoll from '../../../../../hooks/usePoll';
import useUser from '../../../../../hooks/useUser';

import { URL as SUMMARY_URL } from '..';
import Page from '../../../../../components/Page';
import { Decision, GameDecision } from '../../../../../getDb/polls';

export const URL = (pollId: string) => `/polls/${pollId}/summary/entry`;

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

const PollSummaryPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  const { data: poll } = usePoll(router.query.id as string);
  const { data: games } = useGames();

  const [gamesDecisions, setGamesDecisions] = useState<GameDecision[]>([]);

  const playedGames = [
    ...new Set(poll?.votes.flatMap((vote) => vote.votedFor)),
  ].map((playedGame) => {
    return games?.find((game) => game.name === playedGame);
  });

  useEffect(() => {
    setGamesDecisions(
      games?.map((game) => ({
        decision: 'KEEP',
        name: game.name,
      })),
    );
  }, [playedGames]);

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
    <Page title={`Summarize ${poll?.name}`}>
      <Typography gutterBottom align="center" variant="h2">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        {playedGames?.map((game) => (
          <Grid item key={game.name} lg={4} md={6} xs={12}>
            <GameCard
              toRemove={findGameDecision(game.name).decision === 'REMOVE'}
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
      <SummarizeFab
        color="primary"
        onClick={async () => {
          await axios.post(`/api/polls/${router.query.id}/summary/entry`, {
            gamesDecisions,
            proposedGames: [],
            username: user?.username,
          });

          router.replace(SUMMARY_URL(poll.id));
        }}
      >
        <CheckIcon />
      </SummarizeFab>
    </Page>
  );
};

export default PollSummaryPage;
