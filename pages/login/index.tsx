import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

export const URL = '/login';
export const USERNAME_LOCAL_STORAGE_KEY = 'USERNAME';

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const LoginPage: React.FunctionComponent = () => {
  return (
    <Container>
      <StyledPaper>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">Login</Typography>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default LoginPage;
