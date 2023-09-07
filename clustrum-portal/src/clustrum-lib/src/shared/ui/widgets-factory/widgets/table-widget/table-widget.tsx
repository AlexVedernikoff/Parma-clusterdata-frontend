/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { TableWidgetProps } from './types';
import { TableProps } from 'antd/es/table';
import { createStructuredSelector } from 'reselect';

import './table-widget.css';
import { SortOrder } from 'antd/es/table/interface';
import { connect, useSelector } from 'react-redux';
import { selectVisualization } from '../../../../../../../reducers/visualization';

enum ESortDir {
  ASC = 'ascend',
  DESC = 'descend',
}

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
  const [sortMap, setSortMap] = useState<any>({});
  const [sortMap01, setSortMap01] = useState<any>({});
  // функция configureStore в проекте не имеет типизации, поэтому ставим state: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortData = useSelector((state: any) => state.visualization.sort);

  useEffect(() => {
    const sortMapUpdate = sortData.reduce((acc: any, el: any) => {
      acc[el.title] = el.direction;
      return acc;
    }, {});
    console.log('sortMapUpdate =  ', sortMapUpdate);

    const res: any = {};
    for (const key in sortMapUpdate) {
      if (sortMapUpdate[key] !== sortMap[key]) {
        res[key] = sortMapUpdate[key];
      }
    }
    setSortMap01(res);

    //   setSortMap((sortMapPrev: any) => {
    //     const res: any = {};
    //     for (const key in sortMapUpdate) {
    //       if (sortMapUpdate[key] !== sortMapPrev[key]) {
    //         res[key] = sortMapUpdate[key];
    //       }
    //     }
    //     return res;
    //   });
    // }, [sortData]);
    setSortMap(sortMapUpdate);
  }, [sortData]);

  useEffect(() => {
    onPageControlClicker(page, pageSize);
  }, [page, pageSize, onPageControlClicker]);

  const modifyColums = columns.map(item => {
    const title = typeof item.title === 'function' ? item.title({}) : item.title;

    // console.log('item = ', item);

    const sortOrder: keyof typeof ESortDir | undefined =
      typeof item.title === 'string' && item.title in sortMap01
        ? sortMap01[item.title]
        : undefined;
    // console.log('sortOrder = ', sortOrder);
    // console.log('ESortDir[sord] = ', sortOrder && ESortDir[sortOrder]);

    const res = {
      ...item,
      title: <Tooltip title={title}>{title}</Tooltip>,
      // defaultSortOrder: sortOrder && ESortDir[sortOrder],
      // sortOrder: sortOrder && ESortDir[sortOrder],
      // sortDirections: ['ascend', 'descend', 'ascend'] as SortOrder[],
      //  sorter: (a: any, b: any) => a - b,
      className: 'table-widget-column',
    };

    if (sortOrder) {
      res.sortOrder = ESortDir[sortOrder];
      // res.defaultSortOrder = ESortDir[sortOrder];
    }

    return res;
  });

  const changeHandler = (page: number, pageSize: number): void => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  // console.log("props table-widjet = ", props)
  // console.log("sortData = ", sortData)
  console.log('sortMap = ', sortMap);
  console.log('sortMap 01 = ', sortMap01);

  console.log('columns = ', modifyColums);
  // console.log('dataSource = ', dataSource);

  // eslint-disable-next-line max-params
  // const onChange: TableProps<any>['onChange'] = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  //   setSortMap({});
  // };
  const onChange = (): void => {
    setSortMap({});
    setSortMap01({});
  };

  return (
    <Table
      // key={Math.random()}
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
      // sortDirections= {['ascend', 'descend', 'ascend']}
      onChange={onChange}
    />
  );
}
