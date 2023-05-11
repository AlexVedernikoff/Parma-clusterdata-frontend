import React from 'react';

import { Table } from 'antd';

export class TableWidget extends React.PureComponent {
  render() {
    return (
      <Table
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        title={this.props.title}
        locale={{ emptyText: 'Нет данных' }}
      />
    );
  }
}
