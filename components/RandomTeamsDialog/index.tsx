import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import MouseIcon from '@material-ui/icons/Mouse';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import useSocket from '../../hooks/useSocket';
import { RandomTeamsResult } from '../../utils/randomTeams';

export const RANDOM_TEAMS = 'RANDOM_TEAMS';

const RandomTeamsDialog: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [[firstTeam, secondTeam], setRandomGameResult] = useState<
    RandomTeamsResult
  >([[], []]);

  useSocket<RandomTeamsResult>(RANDOM_TEAMS, (data) => {
    setRandomGameResult(data);
    setIsOpen(true);
  });

  return (
    <Dialog
      onClose={() => {
        setRandomGameResult([[], []]);
        setIsOpen(false);
      }}
      open={isOpen}
    >
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List dense>
              <ListItem>
                <ListItemText primary={<MouseIcon />} />
              </ListItem>
              {firstTeam.map((player, index) => (
                <ListItem key={player}>
                  <ListItemText primary={`${index + 1}. ${player}`} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <List dense>
              <ListItem>
                <ListItemText primary={<KeyboardIcon />} />
              </ListItem>
              {secondTeam.map((player, index) => (
                <ListItem key={player}>
                  <ListItemText primary={`${index + 1}. ${player}`} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RandomTeamsDialog;
