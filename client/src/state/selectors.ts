import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

const selectReducer = (state: RootState) => state.scraper;

export const selectScrapeStatus = createSelector(
  [selectReducer],
  ({ scrapeStatus }) => scrapeStatus
);

export const selectScrapedData = createSelector(
  [selectReducer],
  ({ data: scrapedData }) => scrapedData
);

export const selectErrorMessage = createSelector(
  [selectReducer],
  ({ error: errorMessage }) => errorMessage
);

export const selectLoading = createSelector(
  [selectReducer],
  ({ loading }) => loading
);

export const selectTerminalOutput = createSelector(
  [selectReducer],
  ({ terminalOutput }) => terminalOutput
);
export const selectScreenshot = createSelector(
  [selectReducer],
  ({ screenshot }) => screenshot
);
