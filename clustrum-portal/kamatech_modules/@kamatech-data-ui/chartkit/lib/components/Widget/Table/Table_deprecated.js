// TODO: Код не используется и должен быть удалён после того, как новый виджет обретёт
// полную функциональность. Сейчас этот код оставлен в качестве базы знаний о прошлом
import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '@kamatech-data-ui/dt100/lib';
import block from 'bem-cn-lite';
import ErrorDispatcher, {
  ERROR_TYPE,
} from '../../../modules/error-dispatcher/error-dispatcher';
import { KamatechNavigationPageControl } from '../../../../../../kamatech-ui/components';
import DateFormat from '../../../modules/date/date-format';
import { FILTER_CONDITION_TYPE } from '../../../../../../../src/constants/FilterConditionType';
import { NullAlias } from './NullAlias';
import { WidgetType } from '@lib-shared/ui/widgets-factory/types';

const DATE_FORMAT_BY_SCALE = {
  d: 'DD.MM.YYYY',
  w: 'DD.MM.YYYY',
  m: 'MMMM YYYY',
  h: 'DD.MM.YYYY HH:mm',
  i: 'DD.MM.YYYY HH:mm',
  s: 'DD.MM.YYYY HH:mm:ss',
  q: 'YYYY',
  y: 'YYYY',
};

const b = block('chartkit-table');

function _camelCaseCss(_style) {
  const style = typeof _style !== 'object' || _style === null ? {} : _style;
  return Object.keys(style || {}).reduce((result, key) => {
    const camelCasedKey = key.replace(/-(\w|$)/g, (dashChar, char) => char.toUpperCase());
    result[camelCasedKey] = style[key];
    return result;
  }, {});
}

export function numberFormatter(
  value,
  {
    precision: outerPrecision,
    formatter: {
      suffix = '',
      prefix = '',
      multiplier = 1,
      precision: formatterPrecision,
    } = {},
  },
) {
  if (typeof value !== 'number') {
    return value;
  }

  let precision;

  if (typeof outerPrecision === 'number') {
    precision = precisionOrDefault(value, outerPrecision);
  } else if (typeof formatterPrecision === 'number') {
    precision = precisionOrDefault(value, formatterPrecision);
  } else {
    precision = precisionOrDefault(value);
  }

  const multiplied = value * multiplier;
  const fixedValue = precision === undefined ? multiplied : multiplied.toFixed(precision);
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: precision,
    maximumFractionDigits: 16,
  }).format(fixedValue);

  return `${prefix}${formatted}${suffix}`;
}

function precisionOrDefault(value, precision) {
  if (Number.isInteger(value)) {
    return 0;
  }

  if (precision === null || precision === undefined) {
    return 2;
  }

  return precision;
}

function _diffFormatter(value, { precision, diff_formatter: formatter }) {
  const diff = numberFormatter(value, { precision, formatter });
  if (value > 0) {
    return <span className={b('diff', { pos: true })}>&#9650;{diff}</span>;
  }
  if (value < 0) {
    return <span className={b('diff', { neg: true })}>&#9660;{diff}</span>;
  }
  return <span className={b('diff')}>{diff}</span>;
}

function _reverseGridFresultValueow(gridFlow) {
  return gridFlow === 'column' ? 'row' : 'column';
}

function _renderGrid(grid, options = {}) {
  const { gridFlow } = options;
  return (
    <div className={b('grid-wrapper', { flow: gridFlow })} key={gridFlow}>
      {grid.map(gridItem =>
        Array.isArray(gridItem)
          ? _renderGrid(gridItem, { ...options, gridFlow: _reverseGridFlow(gridFlow) })
          : _valueFormatter(gridItem.type, gridItem, gridItem),
      )}
    </div>
  );
}

export function _valueFormatter(type, cell = {}, options = {}) {
  const {
    value,
    link: { href, newWindow = true } = {},
    grid,
    valueWithAlias,
    hasArray,
  } = cell;
  const { contentCss } = options;

  const resultValue = _resultValue(value, type, grid, options, href, newWindow, hasArray);

  const resultSchemaIdClass = cell ? cell.resultShemaId || '' : '';
  const isNullValue =
    [NullAlias.NULL, null].includes(valueWithAlias) &&
    [NullAlias.NULL, null].includes(value);
  const isNullClass = isNullValue ? 'is_null' : '';

  const nullableValue = isNullValue ? NullAlias.NULL : resultValue;

  const extraClasses = [resultSchemaIdClass, isNullClass];

  return (
    <div
      className={b('content', { [type]: true }) + ` ${extraClasses.join(' ')} `}
      style={_camelCaseCss(contentCss)}
      key={value}
    >
      {/* todo Внимание хардкор. Нужно вводить новый тип "ссылка". В принципе в case 'text' есть задатки */}
      <div dangerouslySetInnerHTML={{ __html: nullableValue }} />
    </div>
  );
}

function _resultValue(value, type, grid, options, href, newWindow, hasArray) {
  let resultValue = value;

  if (hasArray) {
    if (value === null) {
      return '';
    }

    if (!Array.isArray(value)) {
      return value;
    }

    return value
      .filter(val => val !== null)
      .map(val => _resultValue(val, type, grid, options, href, newWindow))
      .join('<br/>');
  }

  switch (type.toLowerCase()) {
    case 'grid':
      return _renderGrid(grid, options);
    case 'string':
    case 'text':
      resultValue = href ? (
        <a className={b('link')} href={href} target={newWindow ? '_blank' : '_self'}>
          {resultValue}
        </a>
      ) : (
        numberFormatter(resultValue, options)
      );
      break;
    case 'datetime':
    case 'date': {
      const dateFormat = new DateFormat(resultValue, type);
      if (dateFormat.isNotValidDate()) {
        break;
      }

      resultValue = dateFormat.date();
      break;
    }
    case 'integer':
    case 'float':
    case 'double':
    case 'long':
    case 'number':
      resultValue = numberFormatter(resultValue, options);
      break;
    case 'diff': {
      const number = numberFormatter(resultValue[0], options);
      const diff = _diffFormatter(resultValue[1], options);
      resultValue = (
        <div>
          {number} {diff}
        </div>
      );
      break;
    }
    case 'diff_only':
      resultValue = _diffFormatter(resultValue, options);
      break;
  }

  return resultValue;
}

function _generateName({ id = 'id', name = 'name', shift, level, index }) {
  return `${level}_${shift}_${index}_id=${id}_name=${name}`;
}

function _getIdFromGeneratedName(generatedName) {
  const matched = generatedName.match(/id=(.*)_name=/);
  return matched ? matched[1] : generatedName;
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

function _getColumnsAndNames(
  { head, context, level = 0, shift = 0 },
  clickCallback,
  field,
  prevSelectedCell,
) {
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
        const columnName = _generateName({
          id: column.id,
          name: column.name,
          level,
          shift,
          index,
        });
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
          render: ({ value }) => _valueFormatter(type, value, options),
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
            handleCellClick(
              context,
              row,
              field,
              columnName,
              prevSelectedCell,
              clickCallback,
            );
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

export class Table_deprecated extends React.PureComponent {
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
      data: {
        data: { head, rows = [], total = [] } = {},
        config: { title, sort, order, settings } = {},
        widgetType,
      } = {},
      orderBy,
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

    const selectedCell = this._getSelectedCell();
    const selectedRow =
      selectedCell.paramId && selectedCell.value !== null
        ? { [selectedCell.paramId]: selectedCell.value }
        : null;
    // контекст только для передачи _domNode
    const context = {};

    const { columns, names } = _getColumnsAndNames(
      { head, context },
      this.props.onStateAndParamsChange,
      this.props.data.data.groupField,
      selectedCell,
    );

    let initialSortOrder;
    if (sort) {
      const nameIndex = names.findIndex(
        generatedName => _getIdFromGeneratedName(generatedName) === sort,
      );
      if (nameIndex !== -1) {
        initialSortOrder = {
          columnId: names[nameIndex],
          order: order === 'asc' ? DataTable.ASCENDING : DataTable.DESCENDING,
        };
      }
    }

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
            result[names[index]] = value;
            return result;
          }, {}),
    );

    const summary = total
      ? total.map(row =>
          row.cells.reduce((result, value, index) => {
            value.isGroupField = index === groupFieldPosition;
            value.resultShemaId = head[index].resultSchemaId;
            result[names[index]] = value;
            return result;
          }, {}),
        )
      : null;

    const name = columns && columns[0] && columns[0].name;
    if (name && summary && summary[0][name]) {
      summary[0][name].value = 'Общий итог';
      summary[0][name].type = 'STRING';
    }

    const footerData = summary ? summary : null;

    return (
      <div
        className={b()}
        ref={node => {
          context._domNode = node;
        }}
      >
        {_getTitle(title)}
        <DataTable
          columns={columns}
          data={data}
          footerData={footerData}
          emptyDataMessage="Нет данных" // TODO: добавить перевод
          settings={{
            displayIndices: false,
            highlightRows: true,
            headerMod: 'multiline',
            // пляшет ширина колонок, если не фиксированная, поэтому включаем только если очень надо
            dynamicRender: data.length > 1000,
            ...settings,
          }}
          theme="chartkit"
          initialSortOrder={initialSortOrder}
          selectedRow={selectedRow}
          orderBy={orderBy}
          onStateAndParamsChange={this.props.onStateAndParamsChange}
          onOrderByClickInWizard={this.props.onOrderByClickInWizard}
        />
        {widgetType === WidgetType.Table && (
          <KamatechNavigationPageControl
            page={this.props.paginateInfo.page}
            pageSize={this.props.paginateInfo.pageSize}
            rowsCount={this.props.data.data.rowsCount}
            dataLength={data.length}
            onStateAndParamsChange={this.props.onStateAndParamsChange}
            onClick={this.props.onPageControlClick}
          />
        )}
      </div>
    );
  }
}

export { DATE_FORMAT_BY_SCALE };
