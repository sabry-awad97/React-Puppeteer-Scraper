# Documentation for websocket

This code sets up a WebSocket server that listens for connections and handles incoming messages. It uses the `ws` package to create the WebSocket server, and the `events` package to handle events.

The `setupWebSocket` function takes a `server` parameter, which is an instance of the `http.Server` class. It creates a new instance of the `WebSocketServer` class and passes the `server` instance to it to create the WebSocket server.

It then creates an instance of the `ScraperEvents` class, which extends the `EventEmitter` class to handle events. It also creates an instance of the `DataHandler` class and an instance of the `ParallelScraper` class.

The `ParallelScraper` class is responsible for scraping the website in parallel. It takes a `concurrency` parameter, which specifies the number of pages to scrape simultaneously. It also takes a `dataHandler` parameter, which is an instance of the `DataHandler` class that is used to handle the scraped data.

The `DataHandler` class is responsible for handling the scraped data. It emits events when certain actions occur, such as when the browser is started or closed, when an error occurs, when a page has been scraped 5 times, when a screenshot is taken, when data is extracted from a page, and when data is successfully saved to the database.

The `setupWebSocket` function sets up listeners for these events and emits messages to the WebSocket clients when the events occur.

The `ws.on('connection', socket => {...})` block sets up listeners for incoming messages from the WebSocket clients. It listens for the `startScraping` message, which is sent when the client wants to start scraping a website. When this message is received, the `ParallelScraper` instance is started and the website is scraped.

The `database.connect` function is called to connect to the database before scraping begins. This function is not shown in this code, but it is assumed to be a function that connects to the database and returns a connection object.
