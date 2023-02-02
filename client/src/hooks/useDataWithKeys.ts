import { useMemo } from 'react';
import { useAppSelector } from '../state/hooks';
import { selectScrapedData } from '../state/selectors';
import { IRecordWithKey } from '../types';

export const useDataWithKeys = () => {
  const scrapedData = useAppSelector(selectScrapedData);
  return useMemo(
    () =>
      scrapedData.map((record, index) => ({
        ...record,
        key: index,
      })) as IRecordWithKey[],
    [scrapedData.length]
  );
};
