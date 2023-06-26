import React from 'react';
import PropTypes from 'prop-types';

import { TableWidget, createCell } from '@lib-shared/ui/widgets/table-widget';

function camelCaseCss(_style) {
  const style = typeof _style !== 'object' || _style === null ? {} : _style;
  return Object.keys(style || {}).reduce((result, key) => {
    const camelCasedKey = key.replace(/-(\w|$)/g, (_, char) => char.toUpperCase());
    result[camelCasedKey] = style[key];
    return result;
  }, {});
}

const findGroupField = row => {
  for (let f in row) {
    if (row[f].isGroupField) {
      return row[f];
    }
  }

  return null;
};

const getCellValue = cell => {
  if (cell.valueWithoutFormat === null) {
    return FILTER_CONDITION_TYPE.IS_NULL;
  }

  return cell.valueWithoutFormat ? cell.valueWithoutFormat : cell.value;
};

const handleCellClick = (context, row, field, columnName, prevSelectedCell, callback) => {
  if (callback) {
    const groupField = findGroupField(row);
    let paramId = field;
    let cell = groupField;

    // если у нас группированная таблица, то даже если мы кликаем по количеству - фильтруем по показателю
    // если простая таблица - фильтруем по колонке и значению ячейки таблицы
    if (!groupField || !field) {
      paramId = row[columnName].resultShemaId;
      cell = row[columnName];
    }

    if (cell) {
      const { paramId: prevParamId, value: prevCellValue } = prevSelectedCell;
      const cellValue = getCellValue(cell);
      let callbackParams = {
        params: { [paramId]: cellValue },
        paramsForRemoving: [],
      };

      if (prevParamId) {
        if (prevCellValue === cellValue) {
          delete callbackParams.params;
          callbackParams.paramsForRemoving = [prevParamId];
        } else {
          callbackParams.paramsForRemoving = prevParamId !== paramId ? [prevParamId] : [];
        }
      }

      callback(callbackParams);
    }
  }

  const { param } = row[columnName];

  if (param) {
    // через new CustomEvent() не срабатывает
    // на другой стороне слушает jQuery (Backbone?) и видимо ожидает какое-то кастомное событие
    const event = document.createEvent('CustomEvent');

    event.initCustomEvent('table-update', true, true, {
      type: 'update-params',
      values: { name: id, value: param },
    });

    context._domNode.dispatchEvent(event);
  }
};

function getColumnsAndNames({ head, context }, clickCallback, field, prevSelectedCell) {
  return head.reduce(
    (result, column, index) => {
      const { name, type, ...options } = column;
      const columnName = `${index}_name=${name}`;

      const columnData = {
        dataIndex: columnName,
        header: name,
        render: ({ value }) => createCell(type, value, options),
        context,
        field,
        columnName,
        prevSelectedCell,
        clickCallback,
      };

      result.columns.push(columnData);
      result.names.push(columnName);

      return result;
    },
    { columns: [], names: [] },
  );
}

function getTitle(title) {
  return title ? (
    <div className="chartkit-table__title" style={camelCaseCss(title.style)}>
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

  getSelectedCell() {
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
      data: { data: { head, rows = [] } = {}, config: { title } = {} } = {},
    } = this.props;

    if (!head || !rows) {
      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.NO_DATA });
    }

    let groupFieldPosition = -1;
    if (this.props.data.data.groupField) {
      groupFieldPosition = head.findIndex(
        h => h.resultSchemaId === this.props.data.data.groupField,
      );
    }

    const selectedCell = this.getSelectedCell();
    // контекст только для передачи _domNode
    const context = {};

    const { columns, names } = getColumnsAndNames(
      { head, context },
      this.props.onStateAndParamsChange,
      this.props.data.data.groupField,
      selectedCell,
    );

    const renderCell = item => {
      const { type, ...options } = item;
      const cellContent = createCell(type, item, options);
      return cellContent;
    };

    const antdTableColumns = columns.map((col, index) => {
      return {
        title: col.header,
        key: index,
        dataIndex: col.dataIndex,
        render: item => renderCell(item),
        sorter: (row1, row2) => {
          const left = row1[col.dataIndex].value;
          const right = row2[col.dataIndex].value;
          return left > right ? 1 : left < right ? -1 : 0;
        },
        onCell: row => {
          return {
            onClick: () => {
              handleCellClick(
                col.context,
                row,
                col.field,
                col.columnName,
                col.prevSelectedCell,
                col.clickCallback,
              );
            },
          };
        },
      };
    });

    const data = rows.map((row, rowIndex) =>
      row.values
        ? row.values.reduce((result, value, index) => {
            value.isGroupField = index === groupFieldPosition;
            value.resultShemaId = head[index].resultSchemaId;
            result[names[index]] = { value };
            result.key = rowIndex;
            return result;
          }, {})
        : row.cells.reduce((result, value, index) => {
            value.isGroupField = index === groupFieldPosition;
            value.resultShemaId = head[index].resultSchemaId;
            result[names[index]] = value;
            result.key = rowIndex;
            return result;
          }, {}),
    );

    return (
      <div
        className="chartkit-table"
        ref={node => {
          context._domNode = node;
        }}
      >
        <TableWidget
          columns={antdTableColumns}
          dataSource={data}
          title={getTitle(title)}
          {...this.props}
        />
      </div>
    );
  }
}
