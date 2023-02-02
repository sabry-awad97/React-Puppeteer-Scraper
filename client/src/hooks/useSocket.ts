import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useActions, useAppSelector } from '../state/hooks';
import { selectScreenshot } from '../state/selectors';
import { IWebsiteTemplate } from '../types';

const WS_URL = 'ws://127.0.0.1:3000';

export const useSocket = () => {
  const { setData, setTerminalOutput, setError, setLoading, setScreenshot } =
    useActions();
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

  useEffect(() => {
    if (readyState === 1) {
      console.log('WebSocket connection established.');
    }
  }, [readyState]);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    const message = JSON.parse(lastMessage.data);

    switch (message.type) {
      case 'browser:start':
        setLoading(true);
        setTerminalOutput(message.payload);
        break;
      case 'page:data':
        setTerminalOutput(`Retrieving ${message.payload.length} new data`);
        setData(message.payload);
        break;
      case 'page:5runs':
        setTerminalOutput(
          `No new data found for 5 consecutive times. \nPlease manually check the page using ChromeDriver`
        );
        break;
      case 'page:screenshot':
        const base64 = message.payload;
        setScreenshot(`data:image/png;base64,${base64}`);

        break;
      case 'dataSave:success':
        setTerminalOutput(`Successfully saved ${message.payload.length} data`);
        setData(message.payload);
        setLoading(false);
        break;
      case 'browser:close':
        setTerminalOutput(message.payload);
        setLoading(false);
        break;
      case 'scraper:error':
        setTerminalOutput(message.payload);
        setError(message.payload);
        setLoading(false);
        break;
      default:
        console.error(`Unhandled message type: ${message.type}`);
        break;
    }
  }, [lastMessage, setData, sendMessage]);

  const startScraping = useCallback(
    (website: IWebsiteTemplate) =>
      sendMessage(
        JSON.stringify({
          type: 'startScraping',
          payload: website,
        })
      ),
    []
  );

  return { startScraping };
};
