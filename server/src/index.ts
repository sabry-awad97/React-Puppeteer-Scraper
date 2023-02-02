import { WebSocketServer, RawData } from 'ws';
import { createServer } from 'http';
import { EventEmitter } from 'events';

import { ParallelScraper } from './lib/ParallelScraper.js';
import { DataHandler } from './lib/DataHandler.js';
import database from './database/Database.js';

const server = createServer();
const ws = new WebSocketServer({ server });

const concurrency = 1;
class ScraperEvents extends EventEmitter {}
const scraperEvents = new ScraperEvents();
scraperEvents.setMaxListeners(0);
const dataHandler = new DataHandler();
const scraper = new ParallelScraper(concurrency, dataHandler);
await scraper.start();

dataHandler.on('browser:start', () => {
  scraperEvents.emit('browser:start', {
    type: 'browser:start',
    payload: 'Browser launched successfully',
  });
});

dataHandler.on('browser:close', () => {
  scraperEvents.emit('browser:close', {
    type: 'browser:close',
    payload: 'Browser closed successfully',
  });
});

dataHandler.on('error', error => {
  scraperEvents.emit('error', {
    type: 'scraper:error',
    payload: `An error occurred: ${error.message}`,
  });
});

dataHandler.on('page:5runs', data => {
  scraperEvents.emit('page:5runs', {
    type: 'page:5runs',
    payload: data,
  });
});

dataHandler.on('page:screenshot', (screenshot) => {
  scraperEvents.emit('page:screenshot', {
    type: 'page:screenshot',
    payload: screenshot.toString("base64"),
  });
});

dataHandler.on('page:data', data => {
  scraperEvents.emit('page:data', {
    type: 'page:data',
    payload: data,
  });
});

dataHandler.on('dataSave:success', data => {
  scraperEvents.emit('dataSave:success', {
    type: 'dataSave:success',
    payload: data,
  });
});

ws.on('connection', socket => {
  console.log(`Received a new connection.`);

  scraperEvents.on('browser:start', message => {
    socket.send(JSON.stringify(message));
  });

  scraperEvents.on('browser:close', message => {
    socket.send(JSON.stringify(message));
  });

  scraperEvents.on('error', message => {
    socket.send(JSON.stringify(message));
  });

  scraperEvents.on('page:5runs', message => {
    socket.send(JSON.stringify(message));
  });

  scraperEvents.on('page:data', message => {
    socket.send(JSON.stringify(message));
  });

  scraperEvents.on('page:screenshot', screenshot => {
    socket.send(JSON.stringify(screenshot));
  });

  scraperEvents.on('dataSave:success', message => {
    socket.send(JSON.stringify(message));
  });

  socket.on('message', async buffer => {
    handleIncomingMessage(buffer);
  });

  const handleIncomingMessage = async (buffer: RawData) => {
    const data = JSON.parse(buffer.toString());
    switch (data.type) {
      case 'startScraping':
        await database.connect('new_reviews');
        scraper.scrapeWebsite(data.payload);
        break;
      default:
        break;
    }
  };
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
});

server.listen(3000, async () => {
  console.log(`Server started on port ${3000}`);
});
