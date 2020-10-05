import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { getUsername } from '../../auth';

const NavBar: React.FunctionComponent = () => {
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUsername(getUsername());
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">votenger</Typography>
        <Typography variant="h6">{username}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
