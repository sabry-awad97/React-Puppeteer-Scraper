import React, { useState } from 'react';

export const useSelectedRowKeys = <T extends { key: number }>(data: T[]) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const filteredData = data.filter(record =>
    !selectedRowKeys.length ? true : selectedRowKeys.includes(record.key)
  );

  return { selectedRowKeys, handleSelectChange, filteredData };
};
