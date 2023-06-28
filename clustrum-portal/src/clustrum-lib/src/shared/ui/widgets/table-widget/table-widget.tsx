import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { TableWidgetProps } from './types';

import './table-widget.css';

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const { columns, dataSource, title, totalRowsCount, onPageControlClicker } = props;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    onPageControlClicker(page, pageSize);
  }, [page, pageSize, onPageControlClicker]);

  return (
    <Table
      className="table-widget"
      columns={columns}
      dataSource={dataSource}
      title={(): string | null => title}
      size="small"
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
