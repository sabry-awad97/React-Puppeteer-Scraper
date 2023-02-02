import { bindActionCreators } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { actions } from './state';
import { AppDispatch, RootState } from './store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const useAppDispatch: () => AppDispatch = useDispatch;

export const useActions = () => {
  const dispatch = useAppDispatch();
  return useMemo(() => bindActionCreators(actions, dispatch), [dispatch]);
};
