import React from 'react';
import ReactDomServer from 'react-dom/server';

import { Options, GridFlow, Cell, NULL_ALIAS, DateType } from '../types';
import { camelCaseCss, numberFormatter } from '../lib';
import { diffFormatter } from '.';
import { renderDate, renderDiff, renderText, toJsxElement } from './cell-renders';

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

function renderArray(cell: Cell, options: Options): JSX.Element {
  if (cell.value === null) {
    return <></>;
  }

  if (!Array.isArray(cell.value)) {
    return toJsxElement(cell.value);
  }

  return (
    <>
      {cell.value
        .filter(val => val !== null)
        .map(val => getResultValue({ ...cell, value: val }, options))
        .join('<br/>')}
    </>
  );
}

function getResultValue(cell: Cell, options: Options): JSX.Element {
  if (cell.hasArray) {
    return renderArray(cell, options);
  }

  switch (cell.type.toLowerCase()) {
    case 'grid':
      return renderGrid(cell.grid, options);
    case 'string':
    case 'text':
      return renderText(cell);
    case 'datetime':
    case 'date':
      return renderDate(cell.value as Date, cell.type as DateType);
    case 'integer':
    case 'float':
    case 'double':
    case 'long':
    case 'number':
      return toJsxElement(numberFormatter(cell.value as number, options));
    case 'diff': {
      return renderDiff(cell.value as number[], options);
    }
    case 'diff_only':
      return diffFormatter(cell.value as number, options);
    default:
      return toJsxElement(cell.value);
  }
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
    [NULL_ALIAS, null].includes(cell.valueWithAlias as string | null) &&
    [NULL_ALIAS, null].includes(cell.value as string | null);

  let nullableValue = isNullValue ? NULL_ALIAS : resultValue;
  // Т.к. `dangerouslySetInnerHTML` (см. ниже) понимает только `string`, то
  // преобразуем JSX.Element → string:
  if (typeof nullableValue !== 'string') {
    nullableValue = ReactDomServer.renderToStaticMarkup(nullableValue);
  }

  const isNullClass = isNullValue ? 'is_null' : '';
  const extraClasses = [resultSchemaIdClass, isNullClass];

  return (
    <div
      className={`chartkit-table__content chartkit-table__content_${type} ${extraClasses.join(
        ' ',
      )}`}
      style={camelCaseCss(options.contentCss)}
      key={cell.value?.toString()}
    >
      {/* todo Внимание хардкор. Нужно вводить новый тип "ссылка". В принципе в case 'text' есть задатки */}
      <div dangerouslySetInnerHTML={{ __html: nullableValue }} />
    </div>
  );
}
