import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import useSwr from 'swr';

import { checkIfUserIsAdmin, getUsername } from '../../auth';
import { Poll } from '../api/polls';
import { Game } from '../api/games';

export const URL = '/polls';

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const PollPage: React.FunctionComponent = () => {
  const router = useRouter();

  const { data: poll, mutate: mutatePoll } = useSwr<Poll | undefined>(
    `/api/polls/${router.query.id}`,
    fetcher,
  );
  const { data: games, mutate: mutateGames } = useSwr<Game[]>(
    '/api/games',
    fetcher,
    {
      initialData: [],
    },
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsAdmin(checkIfUserIsAdmin());
    setUsername(getUsername());
  });

  mutatePoll();
  mutateGames();

  const userAlreadyVoted = (game: Game) => {
    return !!poll?.votes.find((vote) => {
      return (
        vote.username === username &&
        vote.votes.find((vote) => {
          return vote.votedFor === game.name;
        })
      );
    });
  };

  return (
    <Container>
      <StyledPaper>
        <Typography gutterBottom align="center" variant="h5">
          {poll?.name}
        </Typography>
        {games.map((game) => (
          <Card key={game.name} variant="outlined">
            <CardContent>
              <Typography gutterBottom component="h2" variant="h5">
                {game.name}
              </Typography>
              <Typography color="textSecondary">{game.type}</Typography>
            </CardContent>
            <CardActions>
              {!userAlreadyVoted(game) && <Button color="primary">Vote</Button>}
            </CardActions>
          </Card>
        ))}
      </StyledPaper>
    </Container>
  );
};

export default PollPage;
