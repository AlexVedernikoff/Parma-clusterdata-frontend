import React from 'react';

import { Table } from 'antd';

import './table-widget.css';

export interface TableWidgetProps {
  // TODO: типизировать таблицу (T - тип строки таблицы, record)
  // columns: ColumnType<T>[];
  columns: any;
  dataSource: object[];
  title: string | null;
}

export const TableWidget = (props: TableWidgetProps): JSX.Element => {
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
};
