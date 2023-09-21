import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { TableWidgetProps } from './types';
import { selectNeedUniqueRows } from '../../../../../../../reducers/visualization';

import './table-widget.css';

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
    setInitPageState(0);

    if (isNeedUniqueRows) {
      setInitPageState(0);
    }
  }, [pageSize, isNeedUniqueRows]);

  useEffect(() => {
    onPageControlClicker(page, pageSize);
  }, [page, pageSize, onPageControlClicker]);

  const modifyColums = columns.map(item => {
    const title = typeof item.title === 'function' ? item.title({}) : item.title;

    return {
      ...item,
      title: <Tooltip title={title}>{title}</Tooltip>,
      className: 'table-widget-column',
    };
  });

  const changeHandler = (page: number, pageSize: number): void => {
    setInitPageState(page - 1);
    setPage(page - 1);
    setPageSize(pageSize);
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
      }}
    />
  );
}
