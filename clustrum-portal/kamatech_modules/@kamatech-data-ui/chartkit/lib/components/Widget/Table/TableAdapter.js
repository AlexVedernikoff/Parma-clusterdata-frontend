import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Table, valueFormatter } from '@clustrum-lib/shared/ui/widgets';

const b = block('chartkit-table');

function _camelCaseCss(_style) {
  const style = typeof _style !== 'object' || _style === null ? {} : _style;
  return Object.keys(style || {}).reduce((result, key) => {
    const camelCasedKey = key.replace(/-(\w|$)/g, (dashChar, char) => char.toUpperCase());
    result[camelCasedKey] = style[key];
    return result;
  }, {});
}

function _generateName({ id = 'id', name = 'name', shift, level, index }) {
  return `${level}_${shift}_${index}_id=${id}_name=${name}`;
}

function _getColumnsAndNames({ head, context, level = 0, shift = 0 }, clickCallback, field, prevSelectedCell) {
  return head.reduce(
    (result, column, index) => {
      if (column.sub) {
        const { columns, names } = _getColumnsAndNames(
          {
            head: column.sub,
            context,
            level: level + 1,
            shift: index,
          },
          clickCallback,
          field,
          prevSelectedCell,
        );
        const columnName = _generateName({ id: column.id, name: column.name, level, shift, index });
        result.columns.push({
          name: columnName,
          header: <span className={b('head-cell')}>{column.name}</span>,
          customStyle: ({ row, header, name }) => {
            if (header) {
              return _camelCaseCss(column.css);
            }
            return _camelCaseCss((row[name] && row[name].css) || undefined);
          },
          align: DataTable.CENTER,
          sub: columns,
        });
        result.names = result.names.concat(names);
      } else {
        const { id, name, type, css: columnCss, resultSchemaId, ...options } = column;
        const columnName = _generateName({ id, name, level, shift, index });

        const columnData = {
          name: columnName,
          header: <span className={b('head-cell')}>{name}</span>,
          className: b('cell', { type }),
          render: ({ value }) => valueFormatter(type, value, options),
          customStyle: ({ row, header, name }) => {
            if (header) {
              return _camelCaseCss(columnCss);
            }
            return _camelCaseCss((row[name] && row[name].css) || undefined);
          },
          sortAccessor: row =>
            Array.isArray(row[columnName].value)
              ? row[columnName].value[0]
              : row[columnName].valueWithoutFormat
                ? row[columnName].valueWithoutFormat
                : row[columnName].value,
          onClick: ({ row }, { name: columnName }) => {
            handleCellClick(context, row, field, columnName, prevSelectedCell, clickCallback);
          },
          sortable: type !== 'grid',
          resultSchemaId,
        };

        result.columns.push(columnData);
        result.names.push(columnName);
      }

      return result;
    },
    { columns: [], names: [] },
  );
}

function _getTitle(title) {
  return title ? (
    <div className={b('title')} style={_camelCaseCss(title.style)}>
      {title.text || title}
    </div>
  ) : null;
}

export class TableAdapter extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      data: PropTypes.object,
      config: PropTypes.object,
    }).isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onStateAndParamsChange: PropTypes.func.isRequired,
    onPageControlClick: PropTypes.func.isRequired,
    paginateInfo: PropTypes.object,
    ownWidgetParams: PropTypes.instanceOf(Map),
    onOrderByClickInWizard: PropTypes.func,
  };
  groupField;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  componentDidUpdate(prevProps) {
    // костыль для того, чтобы таблица не обновлялась два раза и не сбрасывался Loader
    if (this.props.data.data !== prevProps.data.data) {
      this.props.onLoad();
    }
  }

  componentDidCatch(error) {
    this.props.onError({ error });
  }

  _getSelectedCell() {
    const { ownWidgetParams } = this.props;
    const selectedCell = {
      paramId: '',
      value: null,
    };

    if (ownWidgetParams) {
      for (const param of ownWidgetParams) {
        selectedCell.paramId = param[0];
        selectedCell.value = param[1];

        break;
      }
    }

    return selectedCell;
  }

  render() {
    const {
      data: { data: { head, rows = [], total = [] } = {}, config: { title, sort, order, settings } = {} } = {},
      orderBy,
    } = this.props;

    if (!head || !rows) {
      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.NO_DATA });
    }

    let groupFieldPosition = -1;
    if (this.props.data.data.groupField) {
      groupFieldPosition = head.findIndex(h => h.resultSchemaId === this.props.data.data.groupField);
    }

    const selectedCell = this._getSelectedCell();
    // контекст только для передачи _domNode
    const context = {};

    const { columns, names } = _getColumnsAndNames(
      { head, context },
      this.props.onStateAndParamsChange,
      this.props.data.data.groupField,
      selectedCell,
    );

    const renderCell = item => {
      const { type, ...options } = item;
      const cellContent = valueFormatter(type, item, options);
      return cellContent;
    };

    const antdTableColumns = columns.map((col, index) => {
      return {
        title: col.header.props.children,
        key: index,
        dataIndex: col.name,
        render: item => renderCell(item),
        sorter: col.sortAccessor,
      };
    });

    const data = rows.map(row =>
      row.values
        ? row.values.reduce((result, value, index) => {
          value.isGroupField = index === groupFieldPosition;
          value.resultShemaId = head[index].resultSchemaId;
          result[names[index]] = { value };
          return result;
        }, {})
        : row.cells.reduce((result, value, index) => {
          value.isGroupField = index === groupFieldPosition;
          value.resultShemaId = head[index].resultSchemaId;
          result[names[index]] = value;
          return result;
        }, {}),
    );

    return (
      <div
        className={b()}
        ref={node => {
          context._domNode = node;
        }}
      >
        <Table columns={antdTableColumns} dataSource={data} title={_getTitle(title)} {...this.props} />
      </div>
    );
  }
}
