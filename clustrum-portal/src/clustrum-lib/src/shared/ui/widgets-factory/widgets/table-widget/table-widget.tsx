import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { TableWidgetProps } from './types';

import './table-widget.css';

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const { columns, dataSource, title, totalRowsCount, onPageControlClicker } = props;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  return (
    <Table
      className="table-widget"
      columns={modifyColums}
      dataSource={dataSource}
      size="small"
      showSorterTooltip={false}
      title={(): string | null => title}
      scroll={{ y: '80%' }}
      pagination={{
        total: Number(totalRowsCount),
        defaultPageSize: 10,
        showTotal: (total: number): string => `Всего: ${total}`,
        onChange: (page: number, pageSize: number): void => {
          setPage(page - 1);
          setPageSize(pageSize);
        },
      }}
    />
  );
}
