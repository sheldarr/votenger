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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import useGames from '../../hooks/useGames';
import useEvent from '../../hooks/useEvent';
import useUser from '../../hooks/useUser';

import Page from '../../components/Page';
import { Game } from '../../getDb/games';

export const URL = '/games';

const SummarizeFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

interface GameCardProps {
  toRemove: boolean;
}

const GamesPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();
  const { data: games } = useGames();

  const [
    isRemoveGameConfirmationModalOpen,
    setIsRemoveGameConfirmationModalOpen,
  ] = useState(false);
  const [gameToRemove, setGameToRemove] = useState<Game | undefined>();

  return (
    <Page title="Games">
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography gutterBottom align="center" variant="h2">
            Games
          </Typography>
        </Grid>
        <Grid item>
          <Grid container item spacing={1}>
            {games &&
              games
                .sort((gameA, gameB) => gameA.name.localeCompare(gameB.name))
                .map((game) => (
                  <Grid item key={game.name} lg={4} md={6} xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography gutterBottom component="h2" variant="h6">
                          {game.name}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          component="p"
                          variant="body2"
                        >
                          {game.forEventType}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          component="p"
                          variant="body2"
                        >
                          {game.type}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          component="p"
                          variant="body2"
                        >
                          {game.state}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          color="secondary"
                          onClick={() => {
                            setGameToRemove(game);
                            setIsRemoveGameConfirmationModalOpen(true);
                          }}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        onClose={() => {
          setGameToRemove(undefined);
          setIsRemoveGameConfirmationModalOpen(false);
        }}
        open={isRemoveGameConfirmationModalOpen}
      >
        <DialogTitle>Remove event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to remove event {gameToRemove?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setGameToRemove(undefined);
              setIsRemoveGameConfirmationModalOpen(false);
            }}
          >
            No
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              axios.delete(`/api/games/${gameToRemove?.id}`);

              setGameToRemove(undefined);
              setIsRemoveGameConfirmationModalOpen(false);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default GamesPage;
