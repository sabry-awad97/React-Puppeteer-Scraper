import express from 'express';
import { createServer } from 'http';
import { setupWebSocket } from './server/websocket.js';
const app = express();
const server = createServer(app);

// app.use(express.static('public'));

setupWebSocket(server);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
});

server.listen(3000, async () => {
  console.log(`Server is running on http://localhost:3000`);
});
