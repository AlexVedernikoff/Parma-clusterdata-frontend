import React from 'react';
import ReactDomServer from 'react-dom/server';

// LEGACY
import DateFormat from '../../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/date/date-format';
import { NullAlias } from '../../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/components/Widget/Table/NullAlias';

type CssStyles = {
  [key: string]: string | number;
};

interface Formatter {
  suffix: string;
  prefix: string;
  multiplier: number;
  precision: number;
}

type GridFlowType = 'row' | 'column';

interface Options {
  precision?: number;
  formatter?: Formatter;
  gridFlow?: GridFlowType;
  contentCss?: CssStyles;
}

function camelCaseCss(style: CssStyles = {}): CssStyles {
  return Object.keys(style).reduce((result, key) => {
    const camelCasedKey = key.replace(/-(\w|$)/g, (_, char) => char.toUpperCase());
    result[camelCasedKey] = style[key];
    return result;
  }, {} as CssStyles);
}

function precisionOrDefault(value: number, precision?: number): number {
  if (Number.isInteger(value)) {
    return 0;
  }

  if (precision === null || precision === undefined) {
    return 2;
  }

  return precision;
}

function numberFormatter(value: number, options: Options): string {
  const {
    precision: outerPrecision,
    formatter: {
      suffix = '',
      prefix = '',
      multiplier = 1,
      precision: formatterPrecision,
    } = {},
  } = options;

  let precision;

  if (typeof outerPrecision === 'number') {
    precision = precisionOrDefault(value, outerPrecision);
  } else if (typeof formatterPrecision === 'number') {
    precision = precisionOrDefault(value, formatterPrecision);
  } else {
    precision = precisionOrDefault(value);
  }

  const multiplied = value * multiplier;
  const formatOptions =
    precision === undefined
      ? {}
      : { minimumFractionDigits: precision, maximumFractionDigits: 16 };
  const formatted = new Intl.NumberFormat('ru-RU', formatOptions).format(multiplied);

  return `${prefix}${formatted}${suffix}`;
}

function diffFormatter(value: number, options: Options): JSX.Element {
  const { precision, formatter } = options;
  const diff = numberFormatter(value, { precision, formatter });
  if (value > 0) {
    return (
      <span className="chartkit-table__diff chartkit-table__diff_pos">&#9650;{diff}</span>
    );
  }
  if (value < 0) {
    return (
      <span className="chartkit-table__diff chartkit-table__diff_neg">&#9660;{diff}</span>
    );
  }
  return <span className="chartkit-table__diff">{diff}</span>;
}

function reverseGridFlow(gridFlow: GridFlowType): GridFlowType {
  return gridFlow === 'column' ? 'row' : 'column';
}

function _renderGrid(
  grid: any[],
  options: { gridFlow?: GridFlowType } = {},
): JSX.Element {
  const { gridFlow } = options;
  if (!gridFlow) {
    throw new TypeError('gridFlow не задан.');
  }

  return (
    <div className="grid-wrapper_flow_gridFlow" key={gridFlow}>
      {grid.map(gridItem =>
        Array.isArray(gridItem)
          ? _renderGrid(gridItem, { ...options, gridFlow: reverseGridFlow(gridFlow) })
          : valueFormatter(gridItem.type, gridItem, gridItem),
      )}
    </div>
  );
}

function _resultValue(
  value: any,
  type: string,
  grid: any[],
  options: Options,
  href: string,
  newWindow: boolean,
  hasArray = false,
): JSX.Element | string {
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
        <a
          className="chartkit-table__link"
          href={href}
          target={newWindow ? '_blank' : '_self'}
          rel="noreferrer"
        >
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

export function valueFormatter(
  type: string,
  cell: any = {},
  options: Options = {},
): JSX.Element {
  const {
    value,
    link: { href = '', newWindow = true } = {},
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

  let nullableValue = isNullValue ? NullAlias.NULL : resultValue;
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
      style={camelCaseCss(contentCss)}
      key={value}
    >
      {/* todo Внимание хардкор. Нужно вводить новый тип "ссылка". В принципе в case 'text' есть задатки */}
      <div dangerouslySetInnerHTML={{ __html: nullableValue }} />
    </div>
  );
}
