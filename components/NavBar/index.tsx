import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import useUser from '../../hooks/useUser';
import { URL as LOGIN_PAGE_URL } from '../../pages/login';

const StyledAppBar = styled(AppBar)`
  margin-bottom: 3rem;
`;

const LogoutIconButton = styled(IconButton)`
  color: #fff !important;
`;

const NavBar: React.FunctionComponent = () => {
  const router = useRouter();
  const [user, , remove] = useUser();

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Typography variant="h6">Votenger</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {user?.username ? `${user?.username}` : ''}
              {user?.username && (
                <LogoutIconButton
                  onClick={() => {
                    remove();

                    router.push(LOGIN_PAGE_URL);
                  }}
                >
                  <ExitToAppIcon />
                </LogoutIconButton>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;
