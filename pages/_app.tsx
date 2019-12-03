import axios from 'axios';
import React from 'react';
import App from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { PageTransition } from 'next-page-transitions';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

axios.defaults.timeout = 5000;

import NavBar from '../components/NavBar';

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <CssBaseline />
        <NavBar />
        <PageTransition classNames="page-transition" timeout={300}>
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

export default CustomApp;
