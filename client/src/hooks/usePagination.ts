import { useMemo, useState } from 'react';

export const usePagination = <T>(data: T[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setPageSize] = useState(5);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangePageSize = (current: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  return {
    currentPage,
    handleChangePage,
    handleChangePageSize,
    paginatedData,
    itemsPerPage,
  };
};
