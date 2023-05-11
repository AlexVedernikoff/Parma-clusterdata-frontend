import React from 'react';

import { Table } from 'antd';

export const TableWidget = (props) => {
  const locale = {
    emptyText: 'Нет данных',
    triggerDesc: 'Нажмите для сортировки по убыванию',
    triggerAsc: 'Нажмите для сортировки по возрастанию',
    cancelSort: 'Нажмите для отмены сортировки'
  }

  return (
    <Table
      columns={props.columns}
      dataSource={props.dataSource}
      title={props.title}
      locale={locale}
    />
  );
}
