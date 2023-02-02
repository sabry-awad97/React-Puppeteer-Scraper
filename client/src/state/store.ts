import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { scraperReducer } from './state';

const reducer = combineReducers({ scraper: scraperReducer });
const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default () => store;
