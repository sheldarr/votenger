import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import useUser from '../../hooks/useUser';

const NavBar: React.FunctionComponent = () => {
  const [user] = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Votenger {user?.username ? `- ${user.username}` : ''}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
