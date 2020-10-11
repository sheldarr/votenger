const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let io;

const server = createServer((req, res) => {
  req.io = io;

  handle(req, res);
});

io = require('socket.io')(server);

app.prepare().then(() => {
  server.listen(Number(process.env.PORT), (err) => {
    if (err) throw err;

    console.log(`> Ready on localhost ${process.env.PORT}`);
  });
});
