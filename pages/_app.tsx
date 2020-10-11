import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { PageTransition } from 'next-page-transitions';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import NavBar from '../components/NavBar';
import RandomGameDialog from '../components/RandomGameDialog';
import { URL as LOGIN_PAGE_URL } from '../pages/login';
import useUser from '../hooks/useUser';

const VotengerApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [user] = useUser();

  useEffect(() => {
    const redirectToLoginIfNotLoggedIn = () => {
      if (!user && router.pathname !== LOGIN_PAGE_URL) {
        router.push(LOGIN_PAGE_URL);
      }
    };

    redirectToLoginIfNotLoggedIn();
  }, []);

  const theme = createMuiTheme({
    palette: {
      primary: { main: '#9400d3' },
    },
  });

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Votenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <ThemeProvider theme={theme}>
        <NavBar />
        <PageTransition
          classNames="page-transition"
          key={router.route}
          timeout={300}
        >
          <Component {...pageProps} />
        </PageTransition>
        <RandomGameDialog />
      </ThemeProvider>
      <style global jsx>{`
        .page-transition-enter {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity 300ms, transform 300ms;
        }
        .page-transition-exit {
          opacity: 1;
        }
        .page-transition-exit-active {
          opacity: 0;
          transition: opacity 300ms;
        }
      `}</style>
    </>
  );
};

export default VotengerApp;
