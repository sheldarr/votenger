import React from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import CardActions from '@material-ui/core/CardActions';
import CasinoIcon from '@material-ui/icons/Casino';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FlipMove from 'react-flip-move';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import usePoll from '../../../hooks/usePoll';
import useUser from '../../../hooks/useUser';
import useSocket from '../../../hooks/useSocket';
import { REFRESH_VOTE } from '../../api/polls/[id]/vote';
import { RANDOM_GAME } from '../../../components/RandomGameDialog';
import { isUserAdmin } from '../../../auth';
import weightedRandomGame from '../../../utils/weightedRandomGame';
import { Poll } from '../../api/polls';
import Page from '../../../components/Page';

export const URL = (pollId: string) => `/polls/${pollId}`;

const RandomGameFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

interface GameCardProps {
  played: boolean;
}

const GameCard = styled(Card)`
  transition: background-color 0.2s !important;

  ${(props: GameCardProps) =>
    props.played &&
    `
      background-color: #f6e1ff !important;
  `}
`;

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: poll, mutate } = usePoll(router.query.id as string);
  const socket = useSocket(REFRESH_VOTE, () => {
    mutate();
  });

  const games =
    poll?.votes.reduce<Record<string, string[]>>((games, vote) => {
      vote.votedFor.forEach((voteForName) => {
        if (games[voteForName]) {
          return (games[voteForName] = [...games[voteForName], vote.username]);
        }

        games[voteForName] = [vote.username];
      });

      return games;
    }, {}) || {};

  const userAlreadyVoted = (poll: Poll) => {
    return poll.votes.some((vote) => {
      return vote.username === user?.username;
    });
  };

  return (
    <Page title={poll?.name}>
      <Typography gutterBottom align="center" variant="h4">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        {poll?.votes.map((vote) => (
          <Grid item key={vote.id}>
            <Chip color="primary" label={vote.username} />
          </Grid>
        ))}
        <FlipMove typeName={null}>
          {poll &&
            userAlreadyVoted(poll) &&
            Object.entries(games)
              .sort(([, votersA], [, votersB]) => {
                return votersB.length - votersA.length;
              })
              .map(([name, voters]) => (
                <Grid item key={name} xs={12}>
                  <GameCard
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    played={
                      poll.alreadyPlayed.includes(name) ? 'played' : undefined
                    }
                    variant="outlined"
                  >
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Typography component="h2" variant="h6">
                            {voters.length}pt{voters.length !== 1 && 's'} -{' '}
                            {name}
                          </Typography>
                        </Grid>
                        {voters.map((voter) => (
                          <Grid item key={voter}>
                            <Chip color="primary" label={voter} />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                    {isUserAdmin(user?.username) && (
                      <CardActions>
                        <Button
                          color="primary"
                          onClick={() => {
                            axios.post(`/api/polls/${poll.id}/played`, {
                              name,
                            });
                          }}
                        >
                          {poll?.alreadyPlayed.includes(name)
                            ? 'Unplay'
                            : 'Played'}
                        </Button>
                      </CardActions>
                    )}
                  </GameCard>
                </Grid>
              ))}
        </FlipMove>
      </Grid>
      {isUserAdmin(user?.username) && (
        <RandomGameFab
          color="primary"
          onClick={() => {
            const unplayedGames = Object.fromEntries(
              Object.entries(games).filter(([name]) => {
                return !poll.alreadyPlayed.includes(name);
              }),
            );

            socket.emit(RANDOM_GAME, weightedRandomGame(unplayedGames));
          }}
        >
          <CasinoIcon />
        </RandomGameFab>
      )}
    </Page>
  );
};

export default PollPage;
