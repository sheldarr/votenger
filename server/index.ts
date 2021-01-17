import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

import logger from './logger';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = Number(process.env.PORT);
const LISTEN_ON_ALL_INTERFACES = '0.0.0.0';

// eslint-disable-next-line prefer-const
let io: Server;

const server = createServer((req, res) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.io = io;

  handle(req, res);
});

io = new Server(server);

io.on('connection', (socket) => {
  socket.on('RANDOM_GAME', (message) => {
    io.emit('RANDOM_GAME', message);
  });
  socket.on('RANDOM_TEAMS', (message) => {
    io.emit('RANDOM_TEAMS', message);
  });
  socket.on('UPDATE_PLAYERS', (message) => {
    io.emit('UPDATE_PLAYERS', message);
  });
});

server.on('error', (error) => {
  logger.error(error);
});

app.prepare().then(() => {
  server.listen(Number(PORT), () => {
    logger.info(
      `> Ready on http://${LISTEN_ON_ALL_INTERFACES}:${PORT} ${process.env.NODE_ENV}`,
    );
  });
});
