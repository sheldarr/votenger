import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

interface Props {
  votes: Vote[];
}

const Home: NextPage<Props> = ({ votes }: Props) => (
  <Box>
    <main>Votes: {JSON.stringify(votes)}</main>
    <Button variant="contained" color="primary">
      Create Vote
    </Button>
  </Box>
);

interface Vote {
  name: string;
}

Home.getInitialProps = async () => {
  const { data: votes } = await axios.get<Vote[]>(
    `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}:${process.env.APP_PORT}/api/votes`,
  );

  return {
    votes,
  };
};

export default Home;
