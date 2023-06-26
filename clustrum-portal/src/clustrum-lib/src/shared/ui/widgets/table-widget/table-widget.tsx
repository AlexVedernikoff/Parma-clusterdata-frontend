import React from 'react';
import { Table } from 'antd';
import { TableWidgetProps } from './types';

import './table-widget.css';

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const { columns, dataSource, title } = props;

  return (
    <Table
      className="table-widget"
      columns={columns}
      dataSource={dataSource}
      caption={(): string | null => title}
      size="small"
    />
  );
}
