import React from 'react';

import DateFormat from '@kamatech-data-ui/chartkit/lib/modules/date/date-format';
import { NullAlias } from '@kamatech-data-ui/chartkit/lib/components/Widget/Table/NullAlias';

function _camelCaseCss(_style) {
  const style = typeof _style !== 'object' || _style === null ? {} : _style;
  return Object.keys(style || {}).reduce((result, key) => {
    const camelCasedKey = key.replace(/-(\w|$)/g, (dashChar, char) => char.toUpperCase());
    result[camelCasedKey] = style[key];
    return result;
  }, {});
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

function numberFormatter(
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

function _diffFormatter(value, { precision, diff_formatter: formatter }) {
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

function _reverseGridFlow(gridFlow) {
  return gridFlow === 'column' ? 'row' : 'column';
}

function _renderGrid(grid, options = {}) {
  const { gridFlow } = options;
  return (
    <div className="grid-wrapper_flow_gridFlow" key={gridFlow}>
      {grid.map(gridItem =>
        Array.isArray(gridItem)
          ? _renderGrid(gridItem, { ...options, gridFlow: _reverseGridFlow(gridFlow) })
          : valueFormatter(gridItem.type, gridItem, gridItem),
      )}
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
        <a
          className="chartkit-table__link"
          href={href}
          target={newWindow ? '_blank' : '_self'}
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

export function valueFormatter(type, cell = {}, options = {}) {
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
      className={`chartkit-table__content chartkit-table__content_${type} ${extraClasses.join(
        ' ',
      )}`}
      style={_camelCaseCss(contentCss)}
      key={value}
    >
      {/* todo Внимание хардкор. Нужно вводить новый тип "ссылка". В принципе в case 'text' есть задатки */}
      <div dangerouslySetInnerHTML={{ __html: nullableValue }} />
    </div>
  );
}
