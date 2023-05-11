import React from 'react';

import { Table } from 'antd';

export const TableWidget = (props) => {
  return (
    <Table
      columns={props.columns}
      dataSource={props.dataSource}
      title={props.title}
    />
  );
}
