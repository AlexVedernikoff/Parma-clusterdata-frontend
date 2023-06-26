import { Options } from '../types';

function precisionOrDefault(value: number, precision?: number): number {
  if (Number.isInteger(value)) {
    return 0;
  }

  if (precision === null || precision === undefined) {
    return 2;
  }

  return precision;
}

export function numberFormatter(value: number, options: Options): string {
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
