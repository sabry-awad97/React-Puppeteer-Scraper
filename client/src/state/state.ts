import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IField, IRecord } from '../types';

interface ScraperState {
  loading: boolean;
  scrapeStatus: string;
  error: null | string;
  screenshot: null | string;
  data: IRecord[];
  terminalOutput: string[];
}

const initialState: ScraperState = {
  loading: false,
  scrapeStatus: '',
  error: null,
  data: [],
  terminalOutput: [],
  screenshot: null,
};

export const scraperSlice = createSlice({
  name: 'scraper',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<IRecord[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<null | string>) => {
      state.error = action.payload;
    },
    setTerminalOutput: (state, action: PayloadAction<string>) => {
      state.terminalOutput.push(action.payload);
    },
    setScreenshot: (state, action: PayloadAction<string | null>) => {
      state.screenshot = action.payload;
    },
  },
});

export const scraperReducer = scraperSlice.reducer;

export const actions = scraperSlice.actions;
