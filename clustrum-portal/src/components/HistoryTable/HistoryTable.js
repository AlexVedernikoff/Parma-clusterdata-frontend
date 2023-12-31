import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import DataTable from '@kamatech-data-ui/dt100/lib';
import ContainerLoader from './../ContainerLoader/ContainerLoader';

const b = block('preview-table');

class HistoryTable extends React.Component {
  static defaultProps = {};

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  _collator = new Intl.Collator(undefined, {
    numeric: true,
  });

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
      const columnHeader = {
        resultSchemaId: 'Идентификатор поля',
        resultSchemaTitle: 'Наименование поля',
        revisionTime: 'Дата и время изменения',
        verificationRulesPrevious: 'Предыдущее значение правил',
        verificationRulesCurrent: 'Текущее значение правил',
      };
      const columns = Object.keys(data[0])
        .filter(column => !this.excludedColumns.includes(column))
        .reduce((columnsTable, column) => {
          columnsTable.push({
            name: column,
            header: columnHeader[column],
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
    return 'Ошибка: не удалось загрузить данные о версионности';
  };

  render() {
    const { history: { isLoading, readyPreview } = {} } = this.props;

    const isDisplayError = ['failed'].includes(readyPreview);

    if (isLoading) {
      return (
        <div className={b()}>
          <div className={b('loader')}>
            <ContainerLoader size="m" text="Загрузка данных для предпросмотра" />
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
          emptyDataMessage="Нет данных"
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
