import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from '@material-ui/core/styles';

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const styledComponentsStyleSheet = new ServerStyleSheet();
    const materialUiStyleSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentsStyleSheet.collectStyles(
              materialUiStyleSheets.collect(<App {...props} />),
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {materialUiStyleSheets.getStyleElement()}
            {styledComponentsStyleSheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledComponentsStyleSheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta content="#3f51b5" name="theme-color" />
          <link href="/manifest.json" rel="manifest" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
