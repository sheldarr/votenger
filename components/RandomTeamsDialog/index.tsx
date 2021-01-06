import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import MouseIcon from '@material-ui/icons/Mouse';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import styled from 'styled-components';

import useSocket from '../../hooks/useSocket';
import { RandomTeamsResult } from '../../utils/randomTeams';
import { WebSocketEvents } from '../../events';

const CenteredListItemText = styled(ListItemText)`
  display: flex;
  justify-content: center;
`;

const RandomTeamsDialog: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [
    [firstTeam, secondTeam],
    setRandomGameResult,
  ] = useState<RandomTeamsResult>([[], []]);

  useSocket<RandomTeamsResult>(WebSocketEvents.RANDOM_TEAMS, (data) => {
    setRandomGameResult(data);
    setIsOpen(true);
  });

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
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
                <CenteredListItemText primary={<MouseIcon />} />
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
                <CenteredListItemText primary={<KeyboardIcon />} />
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
