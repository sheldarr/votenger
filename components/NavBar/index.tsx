import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import useUser from '../../hooks/useUser';

const StyledAppBar = styled(AppBar)`
  margin-bottom: 3rem;
`;

const NavBar: React.FunctionComponent = () => {
  const [user] = useUser();

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Votenger {user?.username ? `- ${user.username}` : ''}
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;
