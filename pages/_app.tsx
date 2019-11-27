import axios from 'axios';
import React from 'react';
import App from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

axios.defaults.timeout = 5000;

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <CssBaseline />
        <Component {...pageProps} />;
      </>
    );
  }
}

export default CustomApp;
