import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import useSwr from 'swr';

import { Poll } from './api/polls';

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  min-height: calc(100vh - 4rem - 5rem);
  padding: 2rem;
`;

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const Home: NextPage = () => {
  const { data: polls, mutate } = useSwr<Poll[]>('/api/polls', fetcher, {
    initialData: [],
  });

  mutate();

  return (
    <div>
      <Head>
        <title>votenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Container>
        <StyledPaper>Polls: {JSON.stringify(polls)}</StyledPaper>
      </Container>
    </div>
  );
};

export default Home;
