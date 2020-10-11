import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import useSocket from '../../hooks/useSocket';

export const RANDOM_GAME = 'RANDOM_GAME';

const RandomGameDialog: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [randomGame, setRandomGame] = useState('');

  useSocket(RANDOM_GAME, (message) => {
    setRandomGame(message);
    setIsOpen(true);
  });

  return (
    <Dialog
      onClose={() => {
        setRandomGame('');
        setIsOpen(false);
      }}
      open={isOpen}
    >
      <DialogTitle>{randomGame}</DialogTitle>
    </Dialog>
  );
};

export default RandomGameDialog;
