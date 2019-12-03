import axios from 'axios';
import React from 'react';
import App from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { PageTransition } from 'next-page-transitions';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

axios.defaults.timeout = 5000;

import NavBar from '../components/NavBar';

import { URL, USERNAME_LOCAL_STORAGE_KEY } from './login';

class CustomApp extends App<WithRouterProps> {
  componentDidMount() {
    const username = localStorage.getItem(USERNAME_LOCAL_STORAGE_KEY);

    if (!username) {
      this.props.router.push(URL);
    }
  }
  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <>
        <CssBaseline />
        <NavBar />
        <PageTransition
          classNames="page-transition"
          key={router.route}
          timeout={300}
        >
          <Component {...pageProps} />
        </PageTransition>
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
  }
}

export default withRouter(CustomApp);
