import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import useSocket from '../../hooks/useSocket';
import { RandomGameResult } from '../../types/RandomGameResult';
import { WebSocketEvents } from '../../events';

const MainListItem = styled(ListItem)`
  justify-content: center !important;
`;

const RandomGameDialog: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [randomGameResult, setRandomGameResult] = useState<RandomGameResult>();

  useSocket<RandomGameResult>(WebSocketEvents.RANDOM_GAME, (data) => {
    setRandomGameResult(data);
    setIsOpen(true);
  });

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={() => {
        setRandomGameResult(undefined);
        setIsOpen(false);
        setIsExpanded(false);
      }}
      open={isOpen}
    >
      <DialogContent>
        <List dense>
          <MainListItem
            button
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <Typography component="h2" variant="h6">
              🎊 {randomGameResult?.winner.name} 🎉
            </Typography>
          </MainListItem>
          <Collapse unmountOnExit in={isExpanded} timeout="auto">
            <List dense>
              <ListItem>
                <ListItemText
                  primary={`Winner index: ${randomGameResult?.winner.index}`}
                />
              </ListItem>
              {Object.entries(randomGameResult?.games || {}).map(
                ([gameName, gameMeta], index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${gameName} ${(gameMeta.chances * 100).toFixed(
                        2,
                      )}% (${gameMeta.firstIndex} - ${gameMeta.lastIndex})`}
                    />
                  </ListItem>
                ),
              )}
            </List>
          </Collapse>
        </List>
        <List dense></List>
      </DialogContent>
    </Dialog>
  );
};

export default RandomGameDialog;
