import React from 'react';

import { Table as AntdTable } from 'antd';

export class Table extends React.PureComponent {
  render() {
    return (
      <AntdTable
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        title={this.props.title}
        locale={{ emptyText: 'Нет данных' }}
      />
    );
  }
}
