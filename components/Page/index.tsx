import React from 'react';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import Head from 'next/head';

const StyledContainer = styled(Container)`
  margin-bottom: 3rem;
  margin-top: 3rem;
`;

interface Props {
  title: string;
}

const Page: React.FunctionComponent<Props> = ({ children, title }) => {
  return (
    <StyledContainer>
      <Head>
        <title>{`${title} - Votenger`}</title>
      </Head>
      {children}
    </StyledContainer>
  );
};

export default Page;
