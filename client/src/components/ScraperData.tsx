import { Pagination } from 'antd';
import _ from 'lodash';
import { useContext, useState } from 'react';

import { ThemeContext } from '../contexts/ThemeContext';
import { useDataWithKeys } from '../hooks/useDataWithKeys';
import { usePagination } from '../hooks/usePagination';
import { IRecordWithKey, TCurrentViewRecord, TFilteredKeys } from '../types';
import RecordViewer from './RecordViewer';
import { Table } from './table/Table';

const ScraperData = () => {
  // const scrapedData = useDataPolling('/reviews.json');
  const scrapedData = useDataWithKeys();
  const theme = useContext(ThemeContext);

  const [showModal, setShowModal] = useState(false);
  const [currentViewRecord, setCurrentViewRecord] =
    useState<TCurrentViewRecord | null>(null);

  const [filteredKeys] = useState<TFilteredKeys[]>([
    '_id',
    '__v',
    'key',
    'pageTitle',
    'url',
  ]);

  const {
    currentPage,
    handleChangePage,
    handleChangePageSize,
    paginatedData,
    itemsPerPage,
  } = usePagination(scrapedData);

  const handleViewRecord = (record: IRecordWithKey) => {
    const filteredRecord = _.omit(record, filteredKeys);
    setCurrentViewRecord(filteredRecord);
    setShowModal(true);
  };

  return (
    <>
      {paginatedData.length && (
        <>
          <a style={{ fontSize: 16 }} href={paginatedData[0]['url'] as string}>
            <b>{`${paginatedData[0]['pageTitle']}`}</b>
          </a>

          <div style={{ textAlign: 'center' }}>
            <Pagination
              defaultCurrent={currentPage}
              current={currentPage}
              pageSize={itemsPerPage}
              pageSizeOptions={[5, 10, 20, 30]}
              onChange={handleChangePage}
              onShowSizeChange={handleChangePageSize}
              total={scrapedData.length}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              showSizeChanger
              showQuickJumper
              style={{
                color: theme.primaryColor,
                backgroundColor: theme.backgroundColor,
              }}
            />
          </div>
          <div className="table-responsive">
            <Table
              data={scrapedData}
              dataSource={paginatedData}
              filteredKeys={filteredKeys}
              onViewRecord={record => handleViewRecord(record)}
            />
          </div>

          <>
            <RecordViewer
              record={currentViewRecord!}
              visible={showModal}
              onCancel={() => setShowModal(false)}
            />
          </>
        </>
      )}
    </>
  );
};

export default ScraperData;
