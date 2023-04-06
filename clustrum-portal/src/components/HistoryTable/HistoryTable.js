import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import DataTable from '@kamatech-data-ui/dt100/lib';
import ContainerLoader from './../ContainerLoader/ContainerLoader';
import { i18n } from '@kamatech-data-ui/clustrum';

const b = block('preview-table');

class HistoryTable extends React.Component {
  static defaultProps = {};

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  _collator = new Intl.Collator(undefined, {
    numeric: true,
  });

  get textPreviewLoader() {
    const { history: { readyPreview } = {} } = this.props;

    switch (readyPreview.toLowerCase()) {
      case 'pending':
        return i18n('dataset.dataset-editor.modify', 'label_materialization-preview');
      case 'loading':
      default:
        return i18n('dataset.dataset-editor.modify', 'label_loading-dataset-preview');
    }
  }

  excludedColumns = ['datasetId', 'revisionId'];

  getTableData() {
    const { history: { data = [] } = {} } = this.props;

    try {
      const rows = data.map((row, index) =>
        Object.assign(
          {
            positionIndex: index + 1,
          },
          row,
        ),
      );
      const columns = Object.keys(data[0])
        .filter(column => !this.excludedColumns.includes(column))
        .reduce((columnsTable, column) => {
          columnsTable.push({
            name: column,
            header: i18n('dataset.dataset-history', column),
          });

          return columnsTable;
        }, []);

      columns.unshift({
        name: 'positionIndex',
        header: '#',
      });

      return {
        columns: this.handleColumns(columns),
        rows,
        startIndex: 0,
      };
    } catch (error) {
      return {
        columns: [],
        rows: [],
        startIndex: 0,
      };
    }
  }

  sortRows = columnName => ({ row: rowCurrent }, { row: rowNext }) => {
    const valueCurrent = rowCurrent[columnName];
    const valueNext = rowNext[columnName];

    return this._collator.compare(valueCurrent, valueNext);
  };

  handleColumns(columns) {
    return columns.map(column => {
      const { header, name: columnName } = column;

      const sortAscending = this.sortRows(columnName);

      return {
        ...column,
        header: <div className={b('header')}>{header}</div>,
        className: b('column'),
        render: ({ value }) => value,
        sortAscending,
        customStyle: ({ header }) => {
          const generalStyle = {
            paddingTop: '0',
            paddingBottom: '0',
          };

          if (header) {
            return {
              ...generalStyle,
              background: 'var(--color-base-area)',
              borderTop: '1px solid var(--color-divider)',
              borderBottom: '1px solid var(--color-divider)',
            };
          }
        },
      };
    });
  }

  getErrorMessage = () => {
    return i18n('dataset.dataset-editor.modify', 'label_request-dataset-history-error');
  };

  render() {
    const { history: { isLoading, readyPreview } = {} } = this.props;

    const isDisplayError = ['failed'].includes(readyPreview);

    if (isLoading) {
      return (
        <div className={b()}>
          <div className={b('loader')}>
            <ContainerLoader size="m" text={this.textPreviewLoader} />
          </div>
        </div>
      );
    }

    if (isDisplayError) {
      return (
        <div className={b()}>
          <div className={b('error')}>
            <span className={b('error-msg-text')}>{this.getErrorMessage()}</span>
          </div>
        </div>
      );
    }

    const { columns, rows } = this.getTableData();

    const isNoData = rows.length === 0;

    return (
      <div className={b({ 'align-center': isNoData })}>
        <DataTable
          columns={columns}
          data={rows}
          emptyDataMessage={i18n('dataset.dataset-editor.modify', 'label_no-data')}
          settings={{
            stickyHead: DataTable.FIXED,
            stickyTop: 0,
            syncHeadOnResize: true,
            highlightRows: true,
            stripedRows: false,
            displayIndices: false,
          }}
          rowClassName={() => b('row')}
          theme={'preview-dataset'}
        />
      </div>
    );
  }
}

export default HistoryTable;