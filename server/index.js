const { createServer } = require('http');
const url = require('url');
const { join } = require('path');
const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./logger');
const initializeAxios = require('./axios');

const getVotes = require('./api/votes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handleByNext = app.getRequestHandler();

const APP_PORT = Number(process.env.APP_PORT);
const LISTEN_ON_ALL_INTERFACES = '0.0.0.0';

initializeAxios();

const handleByExpress = express();

handleByExpress.use(bodyParser.json());
handleByExpress.use((req, res, next) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  if (pathname.startsWith('/api')) {
    logger.info(
      `INTERNAL REQUEST: ${String(req.method).toUpperCase()} ${
        req.url
      } ${JSON.stringify(req.body)} ${JSON.stringify(req.headers)}`,
    );
  }

  next();
});

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith('/api')) {
      handleByExpress.get('/api/votes', getVotes);

      return handleByExpress(req, res);
    }

    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, '.next', pathname);

      return app.serveStatic(req, res, filePath);
    }

    handleByNext(req, res);
  }).listen(APP_PORT, LISTEN_ON_ALL_INTERFACES, (err) => {
    if (err) {
      logger.error(err);
      throw err;
    }

    logger.info(
      `> Ready on http://${LISTEN_ON_ALL_INTERFACES}:${APP_PORT} ${process.env.NODE_ENV}`,
    );
  });
});
