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

import useGames from '../../../../../hooks/useGames';
import usePoll from '../../../../../hooks/usePoll';
import useUser from '../../../../../hooks/useUser';

import { URL as DASHBOARD_URL } from '../../../../';
import Page from '../../../../../components/Page';

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

  const [selectedForRemoval, setSelectedForRemoval] = useState<string[]>([]);

  const addVote = (vote: string) => {
    setSelectedForRemoval([...selectedForRemoval, vote]);
  };

  const removeVote = (vote: string) => {
    setSelectedForRemoval(
      selectedForRemoval.filter((voted) => {
        return voted !== vote;
      }),
    );
  };

  const playedGames = [
    ...new Set(poll?.votes.flatMap((vote) => vote.votedFor)),
  ].map((playedGame) => {
    return games?.find((game) => {
      return game.name === playedGame;
    });
  });

  return (
    <Page title={`Summarize ${poll?.name}`}>
      <Typography gutterBottom align="center" variant="h2">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        {playedGames?.map((game) => (
          <Grid item key={game.name} lg={4} md={6} xs={12}>
            <GameCard
              toRemove={selectedForRemoval.includes(game.name)}
              variant="outlined"
            >
              <CardContent>
                <Typography gutterBottom component="h2" variant="h6">
                  {game.name}
                </Typography>
                <Typography color="textSecondary">{game.type}</Typography>
              </CardContent>
              <CardActions>
                {selectedForRemoval.includes(game.name) ? (
                  <Button
                    color="primary"
                    onClick={() => {
                      removeVote(game.name);
                    }}
                  >
                    Keep
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    onClick={() => {
                      addVote(game.name);
                    }}
                  >
                    Remove
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
            proposedGames: [],
            selectedForRemoval,
            username: user?.username,
          });

          router.replace(DASHBOARD_URL);
        }}
      >
        <CheckIcon />
      </SummarizeFab>
    </Page>
  );
};

export default PollSummaryPage;
