import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import './table.scss';
import {
  Button,
  Divider,
  Input,
  InputRef,
  Popover,
  Select,
  Table as AntdTable,
  Tag,
  Typography,
} from 'antd';
import { ColumnsType, FilterDropdownProps } from 'antd/es/table/interface';
import React, { useContext, useMemo, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import Fuse from 'fuse.js';
import { ThemeContext } from '../../contexts/ThemeContext';
import { cleanData } from '../../helpers/cleanData';
import { useSelectedRowKeys } from '../../hooks/useSelectedRowKeys';
import { IRecordWithKey, TFilteredKeys } from '../../types';

const { Option } = Select;

interface TableProps {
  data: IRecordWithKey[];
  dataSource: IRecordWithKey[];
  filteredKeys: TFilteredKeys[];
  onViewRecord: (record: IRecordWithKey) => void;
}

export const Table: React.FC<TableProps> = ({
  data,
  dataSource: paginatedData,
  filteredKeys,
  onViewRecord,
}) => {
  const theme = useContext(ThemeContext);
  const [predefinedColors] = useState<string[]>([
    'red',
    'green',
    'blue',
    'purple',
    'yellow',
  ]);

  const {
    selectedRowKeys,
    handleSelectChange,
    filteredData: dataWithSelectedRowKeys,
  } = useSelectedRowKeys(data);

  const [searchText, setSearchText] = useState<React.Key[]>([]);

  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const [dataType, setDataType] = useState<string>('string');

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: () => void,
    columnKey: string,
    dataType: string
  ) => {
    let searchTerms = selectedKeys;
    if (!Array.isArray(searchTerms)) {
      searchTerms = [searchTerms];
    }
    setSearchText(searchTerms);
    confirm();
    setSearchedColumn(columnKey);
    setDataType(dataType);
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters?.();
    setSearchText([]);
  };

  const filterData = (value: string, record: IRecordWithKey, key: string) => {
    if (dataType === 'string') {
      const options = {
        keys: [key],
        threshold: 0.4,
        caseSensitive: false,
      };

      const fuse = new Fuse(paginatedData, options);

      return searchText.some(searchTerm => {
        const result = fuse.search(searchTerm.toString());
        return result.some(searchResult => searchResult.item === record);
      });
    }

    if (dataType === 'number') {
      const value = record[key];
      return searchText.some(
        searchTerm => typeof value === 'number' && value === Number(searchTerm)
      );
    }

    return false;
  };

  const sortData = (
    a: IRecordWithKey,
    b: IRecordWithKey,
    key: keyof IRecordWithKey
  ) => {
    return a[key].toString().localeCompare(b[key].toString());
  };

  const searchInput = useRef<InputRef>(null);

  const columns = useMemo((): ColumnsType<IRecordWithKey> => {
    if (!paginatedData.length) return [];
    const firstRecord = paginatedData[0];

    const keysOfArrays = Object.entries(firstRecord)
      .filter(([key, value]) => Array.isArray(value))
      .map(([key]) => key);

    const getColumnSearchProps = (key: string) => {
      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }: FilterDropdownProps) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={searchInput}
              placeholder={`Search ${key}`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, key, dataType)
              }
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Select
              defaultValue="string"
              style={{ width: 120, marginRight: 8 }}
              onChange={(value: string) => setDataType(value)}
            >
              <Option value="string">String</Option>
              <Option value="number">Number</Option>
            </Select>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, key, dataType)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
                marginRight: 8,
                backgroundColor: theme.primaryColor,
                color: theme.textColor,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
                backgroundColor: theme.secondaryColor,
                color: theme.textColor,
              }}
            >
              Clear
            </Button>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <FilterOutlined
            style={{ color: filtered ? theme.primaryColor : undefined }}
          />
        ),
        onFilter: (value: any, record: IRecordWithKey) =>
          filterData(value, record, key),
        onFilterDropdownOpenChange: (open: boolean) => {
          if (open) {
            setTimeout(() => searchInput.current?.select());
          }
        },
        render: (value: any, obj: IRecordWithKey) => {
          if (keysOfArrays.includes(key)) {
            const tags = obj[key] as string[];
            return tags.filter(Boolean).map((tag, i) => {
              return (
                <Tag
                  color={predefinedColors[i % predefinedColors.length]}
                  key={tag}
                >
                  {tag.toUpperCase()}
                </Tag>
              );
            });
          }

          return searchedColumn === key ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText?.toString()!]}
              autoEscape
              textToHighlight={value.toString()}
            />
          ) : (
            <span>{value.toString()}</span>
          );
        },
      };
    };

    const columns: ColumnsType<IRecordWithKey> = Object.keys(firstRecord)
      .filter(key => !filteredKeys.includes(key as any))
      .map(key => {
        return {
          title: (
            <Typography.Text style={{ color: theme.primaryColor }}>
              {key}
            </Typography.Text>
          ),
          dataIndex: key,
          key: key,
          sorter: (a, b) => sortData(a, b, key),
          ...getColumnSearchProps(key),
        };
      });

    const actionColumn = {
      title: 'Action',
      key: 'action',
      dateIndex: 'action',
      render(text: string, record: IRecordWithKey) {
        return (
          <>
            <Popover content={<p>View Details</p>}>
              <Button onClick={() => onViewRecord(record)}>View</Button>
            </Popover>
          </>
        );
      },
    };

    columns.push(actionColumn);

    return columns;
  }, [paginatedData.length, searchText]);

  const visibleTableData = useMemo(() => {
    const data = dataWithSelectedRowKeys.map(record => {
      const row = {} as any;
      for (const column of columns) {
        const col = column as any;
        if (col.key === 'action') continue;
        if (filteredKeys.includes(col.key)) continue;

        row[col.key] = record[col.dataIndex];
      }

      return row;
    });

    return cleanData(data, filteredKeys);
  }, [dataWithSelectedRowKeys.length, columns]);

  const triggerDownload = (data: any, fileName: string, mimeType: string) => {
    // create a link element to trigger the download
    const link = document.createElement('a');
    link.href = `data:${mimeType};charset=utf-8,` + encodeURIComponent(data);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportDataJSON = () => {
    const json = JSON.stringify(visibleTableData, null, 2);
    const fileName = `${paginatedData[0]['pageTitle']}.json`;
    triggerDownload(json, fileName, 'application/json');
  };

  const exportDataCSV = () => {
    const replacer = (key: string, value: any) =>
      value === null ? '' : Array.isArray(value) ? value.join(', ') : value;
    const header = Object.keys(visibleTableData[0]);
    let csv = visibleTableData.map(row =>
      header
        .map(fieldName => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');
    const fileName = `${paginatedData[0]['pageTitle']}.csv`;
    triggerDownload(csvString, fileName, 'text/csv');
  };

  return (
    <div>
      <Divider style={{ margin: '24px 0' }} />
      <AntdTable
        style={{
          marginTop: 16,
          minWidth: '100vw',
          backgroundColor: theme.backgroundColor,
        }}
        dataSource={paginatedData}
        columns={columns}
        key="key"
        size="middle"
        pagination={false}
        rowClassName={(record, index: number) => {
          if (index % 2 === 0) {
            return 'even-row';
          }
          return 'odd-row';
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: handleSelectChange,
        }}
      />

      <div>
        <Divider />
        <Popover
          content={<Button onClick={exportDataJSON}>Export as JSON</Button>}
          trigger="hover"
        >
          <Button onClick={exportDataJSON}>Export as JSON</Button>
        </Popover>
        <Divider type="vertical" />
        <Popover
          content={<Button onClick={exportDataCSV}>Export as CSV</Button>}
          trigger="hover"
        >
          <Button onClick={exportDataCSV}>Export as CSV</Button>
        </Popover>
      </div>
    </div>
  );
};
