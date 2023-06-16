import React from 'react';

import { Table } from 'antd';
import { ColumnType } from 'antd/es/table';

import './table-widget.css';

interface TableWidgetProps {
  // TODO: типизировать таблицу (T - тип строки таблицы, record)
  // columns: ColumnType<T>[];
  columns: ColumnType<object>[];
  dataSource: object[];
  title: string | null;
}

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const { columns, dataSource, title } = props;
  return (
    <Table
      className="table-widget"
      columns={columns}
      dataSource={dataSource}
      title={(): string | null => title}
      size="small"
    />
  );
}
