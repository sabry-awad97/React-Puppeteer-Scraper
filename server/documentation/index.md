# Documentation for index.js

This is the entry point of the server application that creates an HTTP server using Express and sets up the WebSocket server using the `setupWebSocket` function from the `websocket.js` file.

This code exports an Express app and an HTTP server, but it does not export any WebSocket server or function. The WebSocket server is set up within the `setupWebSocket` function and is not directly exported. The function is imported and called within the same file, so it does not need to be exported either.
