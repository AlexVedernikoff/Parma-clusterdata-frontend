/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { TableWidgetProps } from './types';
import './table-widget.css';
import { useSelector } from 'react-redux';

enum ESortDir {
  ASC = 'ascend',
  DESC = 'descend',
}

interface ESortMapItem {
  [key: string]: keyof typeof ESortDir;
}

interface ESortMap {
  [key: string]: ESortMapItem;
}

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
    paginateInfo: { page: initPage, pageSize: initPageSize },
  } = props;

  const [page, setPage] = useState(initPage);
  const [pageSize, setPageSize] = useState(initPageSize);
  const [sortMapState, setSortMapState] = useState<ESortMap>(intialMapState);
  // функция configureStore в проекте не имеет типизации, поэтому ставим state: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortData = useSelector((state: any) => state.visualization?.sort);

  console.log('sortData = ', sortData);

  useEffect(() => {
    const { sortMap } = sortMapState;

    const sortMapUpdate = sortData.reduce(
      (acc: ESortMapItem, el: typeof sortData[number]) => {
        acc[el.title] = el.direction;
        return acc;
      },
      {},
    );
    console.log('sortMapUpdate =  ', sortMapUpdate);

    const differenceValue: ESortMapItem = {};
    for (const key in sortMapUpdate) {
      if (sortMapUpdate[key] !== sortMap[key]) {
        differenceValue[key] = sortMapUpdate[key];
      }
    }

    setSortMapState({ sortMap: sortMapUpdate, differenceValue });
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
      // sortOrder: sortOrder && ESortDir[sortOrder],
      className: 'table-widget-column',
    };

    if (sortOrder) {
      itemTable.sortOrder = ESortDir[sortOrder];
    }

    return itemTable;
  });

  const changeHandler = (page: number, pageSize: number): void => {
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
        current: initPage + 1,
        defaultPageSize: 10,
        showTotal: (total: number): string => `Всего: ${total}`,
        onChange: changeHandler,
      }}
      onChange={onChange}
    />
  );
}
