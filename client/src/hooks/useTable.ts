import { useState, useCallback, useMemo } from 'react';
import { IRecord } from '../types';

const useTable = (initialData: IRecord[]) => {
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = useCallback(
    (searchText: string) => {
      setSearchText(searchText);
    },
    [setSearchText]
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleChangePageSize = useCallback(
    (size: number) => {
      setPageSize(size);
    },
    [setPageSize]
  );

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter(item =>
      Object.values(item)
        .map(val => val.toString().toLowerCase())
        .some(val => val.includes(searchText.toLowerCase()))
    );
  }, [data, searchText]);

  const dataPerPage = useMemo(
    () =>
      filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage, pageSize]
  );

  return {
    dataPerPage,
    searchText,
    currentPage,
    pageSize,
    handleSearch,
    handleChangePage,
    handleChangePageSize,
  };
};
