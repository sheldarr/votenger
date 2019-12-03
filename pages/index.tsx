import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  min-height: calc(100vh - 4rem - 5rem);
  padding: 2rem;
`;

interface Props {
  votes: Vote[];
}

const Home: NextPage<Props> = ({ votes }: Props) => (
  <div>
    <Head>
      <title>Votenger</title>
      <link href="/favicon.ico" rel="icon" />
    </Head>
    <Container>
      <StyledPaper>
        <Grid container>
          <Grid item xs={12}>
            {JSON.stringify(votes)}
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  </div>
);

interface Vote {
  name: string;
}

Home.getInitialProps = async () => {
  const { data: votes } = await axios.get<Vote[]>(
    `${process.env.APP_API_URL}/votes`,
  );

  return {
    votes,
  };
};

export default Home;
