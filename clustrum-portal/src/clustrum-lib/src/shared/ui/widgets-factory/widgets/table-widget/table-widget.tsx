import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { TableWidgetProps } from './types';
import { selectNeedUniqueRows } from '../../../../../../../reducers/visualization';
import './table-widget.css';
import { useSelector } from 'react-redux';
import { ESortDir, ISortMap, ISortMapItem } from './types/table-widget-types';

const INITIAL_MAP_STATE = {
  differenceValue: {},
  sortMap: {},
};

const FIRST_PAGE_INDEX = 0;

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const {
    columns,
    dataSource,
    title,
    totalRowsCount,
    onPageControlClicker,
    paginateInfo: { page: initPage },
  } = props;

  const [initPageState, setInitPageState] = useState(initPage);
  const [page, setPage] = useState(initPageState);
  const [pageSize, setPageSize] = useState(10);
  const isNeedUniqueRows = useSelector(state => selectNeedUniqueRows(state));

  useEffect(() => {
    setInitPageState(FIRST_PAGE_INDEX);

    if (isNeedUniqueRows) {
      setInitPageState(FIRST_PAGE_INDEX);
    }
  }, [pageSize, isNeedUniqueRows]);
  const [sortMapState, setSortMapState] = useState<ISortMap>(INITIAL_MAP_STATE);
  // функция configureStore в проекте не имеет типизации, поэтому ставим state: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortData = useSelector((state: any) => state.visualization?.sort);

  useEffect(() => {
    setSortMapState(({ sortMap }) => {
      const sortMapUpdate = sortData.reduce(
        (acc: ISortMapItem, el: typeof sortData[number]) => {
          acc[el.title] = el.direction;
          return acc;
        },
        {},
      );

      const differenceValue: ISortMapItem = {};
      for (const key in sortMapUpdate) {
        if (sortMapUpdate[key] !== sortMap[key]) {
          differenceValue[key] = sortMapUpdate[key];
        }
      }
      return { sortMap: sortMapUpdate, differenceValue };
    });
  }, [sortData]);

  useEffect(() => {
    onPageControlClicker(page, pageSize);
  }, [page, pageSize, onPageControlClicker]);

  const modifyColums = columns.map(item => {
    const title = typeof item.title === 'function' ? item.title({}) : item.title;
    const { differenceValue } = sortMapState;

    const sortOrder: keyof typeof ESortDir | undefined =
      // eslint-disable-next-line no-prototype-builtins
      typeof item.title === 'string' && differenceValue.hasOwnProperty(item.title)
        ? differenceValue[item.title]
        : undefined;

    const itemTable = {
      ...item,
      title: <Tooltip title={title}>{title}</Tooltip>,
      className: 'table-widget-column',
    };

    if (sortOrder) {
      itemTable.sortOrder = ESortDir[sortOrder];
    }

    return itemTable;
  });

  const changeHandler = (page: number, pageSize: number): void => {
    setInitPageState(page - 1);
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const handleChange = (): void => {
    setSortMapState(INITIAL_MAP_STATE);
  };

  return (
    <Table
      className="table-widget"
      columns={modifyColums}
      dataSource={dataSource}
      size="small"
      showSorterTooltip={false}
      title={(): string | null => title}
      scroll={{ y: '100%' }}
      pagination={{
        total: Number(totalRowsCount),
        current: initPageState + 1,
        defaultPageSize: 10,
        showTotal: (total: number): string => `Всего: ${total}`,
        onChange: changeHandler,
        showSizeChanger: true,
      }}
      onChange={handleChange}
    />
  );
}
