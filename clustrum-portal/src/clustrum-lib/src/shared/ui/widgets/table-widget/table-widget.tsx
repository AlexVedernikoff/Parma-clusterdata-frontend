import React from 'react';

import { Table } from 'antd';

interface TableWidgetProps {
  // TODO: типизировать таблицу (T - тип строки таблицы, record)
  // columns: ColumnType<T>[];
  columns: any;
  dataSource: object[];
  title: string;
}

export const TableWidget = (props: TableWidgetProps) => {
  const { columns, dataSource, title } = props;
  return <Table columns={columns} dataSource={dataSource} title={() => title} />;
};
