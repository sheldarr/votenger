import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import { getUsername } from '../../auth';

const Logo = styled.div`
  flex-grow: 1;
`;

const NavBar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const currentUsername = getUsername();

    setUsername(currentUsername);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Logo>
          <Typography variant="h6">Votenger</Typography>
        </Logo>
        <Typography variant="h6">{username}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
