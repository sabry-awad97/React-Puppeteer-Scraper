import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { IRecordWithKey } from '../types';

interface SearchConfig {
  keys: string[];
  threshold: number;
  caseSensitive: boolean;
}

const useAdvancedSearch = (data: IRecordWithKey[], config: SearchConfig) => {
  const [searchText, setSearchText] = useState<string[]>([]);
  const [dataType, setDataType] = useState<string>('string');
  const [filteredData, setFilteredData] = useState<IRecordWithKey[]>(data);

  useEffect(() => {
    if (!searchText.length) {
      setFilteredData(data);
      return;
    }
    const fuse = new Fuse(data, config);
    const filteredData = searchText.flatMap(term => fuse.search(term));
    setFilteredData(filteredData.map(r => r.item));
  }, [searchText, data, config]);

  const handleSearch = (selectedKeys: string[], dataType: string) => {
    setSearchText(selectedKeys);
    setDataType(dataType);
  };

  const handleReset = () => {
    setSearchText([]);
  };

  return { filteredData, handleSearch, handleReset };
};
