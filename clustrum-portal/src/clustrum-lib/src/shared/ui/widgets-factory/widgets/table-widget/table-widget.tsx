/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { TableWidgetProps } from './types';
import { selectNeedUniqueRows } from '../../../../../../../reducers/visualization';
import './table-widget.css';
import { useSelector } from 'react-redux';
import { ESortDir, ISortMap, ISortMapItem } from './types/table-widget-types';

const intialMapState = {
  differenceValue: {},
  sortMap: {},
};

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const {
    columns,
    dataSource,
    title,
    totalRowsCount,
    onPageControlClicker,
    // *****
    paginateInfo: { page: initPage },
    // paginateInfo: { page: initPage, pageSize: initPageSize },
    // *****
  } = props;

  const [initPageState, setInitPageState] = useState(initPage + 1);
  // *****

  const [page, setPage] = useState(initPageState);
  const [pageSize, setPageSize] = useState(10);

  // const [page, setPage] = useState(initPage);
  // const [pageSize, setPageSize] = useState(initPageSize);

  // *****

  const isNeedUniqueRows = useSelector(state => selectNeedUniqueRows(state));

  useEffect(() => {
    setInitPageState(1);

    if (isNeedUniqueRows) {
      setInitPageState(1);
    }
  }, [pageSize, isNeedUniqueRows]);
  const [sortMapState, setSortMapState] = useState<ISortMap>(intialMapState);
  // функция configureStore в проекте не имеет типизации, поэтому ставим state: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortData = useSelector((state: any) => state.visualization?.sort);

  console.log('sortData = ', sortData);

  useEffect(() => {
    setSortMapState(({ sortMap }) => {
      const sortMapUpdate = sortData.reduce(
        (acc: ISortMapItem, el: typeof sortData[number]) => {
          acc[el.title] = el.direction;
          return acc;
        },
        {},
      );

      console.log('sortMapUpdate =  ', sortMapUpdate);

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

    console.log('differenceValue = ', differenceValue);

    const sortOrder: keyof typeof ESortDir | undefined =
      typeof item.title === 'string' && item.title in differenceValue
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
    setInitPageState(page);
    setPage(page - 1);
    setPageSize(pageSize);
  };

  console.log('sortMapFull = ', sortMapState);

  const onChange = (): void => {
    setSortMapState(intialMapState);
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
        current: initPageState,
        // current: initPage + 1,
        defaultPageSize: 10,
        showTotal: (total: number): string => `Всего: ${total}`,
        onChange: changeHandler,
      }}
      onChange={onChange}
    />
  );
}
