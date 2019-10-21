import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';

interface Props {
  votes: Vote[];
}

const Home: NextPage<Props> = ({ votes }: Props) => (
  <main>Votes: {JSON.stringify(votes)}</main>
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
