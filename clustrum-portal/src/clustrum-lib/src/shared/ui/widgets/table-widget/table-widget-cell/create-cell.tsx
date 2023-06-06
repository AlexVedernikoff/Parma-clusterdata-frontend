import React from 'react';
import ReactDomServer from 'react-dom/server';

// LEGACY
import DateFormat from '../../../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/date/date-format';
import { Options, GridFlow, Cell, NULL_ALIAS } from '../types';
import { camelCaseCss, numberFormatter } from '../lib';
import { diffFormatter } from '.';

function reverseGridFlow(gridFlow: GridFlow): GridFlow {
  return gridFlow === 'column' ? 'row' : 'column';
}

function renderGrid(grid: Cell[], options: Options = {}): JSX.Element {
  const { gridFlow } = options;
  if (!gridFlow) {
    throw new TypeError('gridFlow не задан.');
  }

  return (
    <div className="grid-wrapper_flow_gridFlow" key={gridFlow}>
      {grid.map(gridItem =>
        Array.isArray(gridItem)
          ? renderGrid(gridItem, { ...options, gridFlow: reverseGridFlow(gridFlow) })
          : createCell(gridItem.type, gridItem, options),
      )}
    </div>
  );
}

function getResultValue(cell: Cell, options: Options): JSX.Element | string {
  if (cell.hasArray) {
    if (cell.value === null) {
      return '';
    }

    if (!Array.isArray(cell.value)) {
      return cell.value;
    }

    return cell.value
      .filter(val => val !== null)
      .map(val => getResultValue({ ...cell, value: val }, options))
      .join('<br/>');
  }

  let resultValue = cell.value;

  switch (cell.type.toLowerCase()) {
    case 'grid':
      return renderGrid(cell.grid, options);
    case 'string':
    case 'text':
      resultValue = cell.link?.href ? (
        <a
          className="chartkit-table__link"
          href={cell.link.href}
          target={cell.link.newWindow ? '_blank' : '_self'}
          rel="noreferrer"
        >
          {resultValue}
        </a>
      ) : (
        resultValue
      );
      break;
    case 'datetime':
    case 'date': {
      const dateFormat = new DateFormat(resultValue, cell.type);
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
      const diff = diffFormatter(resultValue[1], options);
      resultValue = (
        <div>
          {number} {diff}
        </div>
      );
      break;
    }
    case 'diff_only':
      resultValue = diffFormatter(resultValue, options);
      break;
  }

  return resultValue;
}

export function createCell(
  type: string,
  cell: Cell = {} as Cell,
  options: Options = {},
): JSX.Element {
  // TODO: тип ячейки приходит в двух экземплярах: отдельно и в данных самой
  // ячейки. Надо бы разобраться в клиентском коде и убрать дублирование
  if (type !== cell.type) {
    throw new Error('Переданы несогласованные типы ячейки!');
  }

  const resultValue = getResultValue(cell, options);

  const resultSchemaIdClass = cell ? cell.resultShemaId || '' : '';
  const isNullValue =
    [NULL_ALIAS, null].includes(cell.valueWithAlias) &&
    [NULL_ALIAS, null].includes(cell.value);
  const isNullClass = isNullValue ? 'is_null' : '';

  let nullableValue = isNullValue ? NULL_ALIAS : resultValue;
  // Т.к. `dangerouslySetInnerHTML` (см. ниже) понимает только `string`, то
  // преобразуем JSX.Element → string:
  if (typeof nullableValue !== 'string') {
    nullableValue = ReactDomServer.renderToStaticMarkup(nullableValue);
  }

  const extraClasses = [resultSchemaIdClass, isNullClass];

  return (
    <div
      className={`chartkit-table__content chartkit-table__content_${type} ${extraClasses.join(
        ' ',
      )}`}
      style={camelCaseCss(options.contentCss)}
      key={cell.value}
    >
      {/* todo Внимание хардкор. Нужно вводить новый тип "ссылка". В принципе в case 'text' есть задатки */}
      <div dangerouslySetInnerHTML={{ __html: nullableValue }} />
    </div>
  );
}
