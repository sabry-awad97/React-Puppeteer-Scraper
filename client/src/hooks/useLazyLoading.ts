import { useEffect, useRef, useState } from 'react';

export const useLazyLoading = <T>(data: T[]) => {
  const [dataPerPage, setDataPerPage] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!observer) {
      const newObserver = new IntersectionObserver(onIntersection, {
        root: tableRef.current,
        rootMargin: '0px',
        threshold: 1.0,
      });

      setObserver(newObserver);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [observer]);

  useEffect(() => {
    setDataPerPage(
      data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    );
    if (observer) {
      observer.observe(tableRef.current!);
    }
  }, [data, observer, currentPage, pageSize]);

  const onIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading) {
        setIsLoading(true);
        setCurrentPage(currentPage => currentPage + 1);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  const resetCurrentPage = () => {
    setCurrentPage(1);
  };

  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    resetCurrentPage();
  };

  return {
    dataPerPage,
    pageSize,
    currentPage,
    isLoading,
    tableRef,
    handleChangePageSize,
  };
};
