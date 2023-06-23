import isPlainObject from 'lodash/isPlainObject';
import moment from 'moment';
import { FILTER_TYPES } from '../../../../constants/constants';

export const DATE_FORMAT = 'YYYY-MM-DD';

const itervalToString = (from, to) => {
  return `__interval_${moment(from).format(DATE_FORMAT)}_${moment(to).format(
    DATE_FORMAT,
  )}`;
};

const dateToString = date => {
  return moment(date).format(DATE_FORMAT);
};

const getAfterDate = (first, second) => (moment(first).isAfter(second) ? first : second);

const getBeforeDate = (first, second) => (moment(first).isAfter(second) ? second : first);

// eslint-disable-next-line complexity
const formatDefaultToString = (defaultValue, control) => {
  const { acceptableValues, isRange } = control;
  const { type, value: { from, to } = {} } = defaultValue;
  switch (type) {
    case FILTER_TYPES.AcceptableFrom: // always isRange = false
      return acceptableValues && acceptableValues.from
        ? dateToString(acceptableValues.from)
        : '';
    case FILTER_TYPES.AcceptableTo: // always isRange = false
      return acceptableValues && acceptableValues.to
        ? dateToString(acceptableValues.to)
        : '';
    case FILTER_TYPES.AcceptableFullInterval: // always isRange = true
      return acceptableValues && acceptableValues.from && acceptableValues.to
        ? itervalToString(acceptableValues.from, acceptableValues.to)
        : '';
    case FILTER_TYPES.DefaultRanges:
    case FILTER_TYPES.Date:
      if (isRange) {
        const fromDate =
          acceptableValues && acceptableValues.from
            ? getAfterDate(from, acceptableValues.from)
            : from;
        const toDate =
          acceptableValues && acceptableValues.to
            ? getBeforeDate(to, acceptableValues.to)
            : to;
        return itervalToString(fromDate, toDate);
      } else {
        return dateToString(from);
      }
    case FILTER_TYPES.Relative: // что делать при acceptableValues?
      if (isRange) {
        return itervalToString(
          moment().subtract(from, 'days'),
          moment().subtract(to, 'days'),
        );
      } else {
        return dateToString(moment().subtract(from, 'days'));
      }
    default:
      return '';
  }
};

export function prerenderMiddleware(item) {
  const { defaults, data } = item;
  const defaultsKeys = Object.keys(defaults);
  if (defaultsKeys.some(key => isPlainObject(defaults[key]))) {
    const { control } = data;
    return {
      ...item,
      defaults: defaultsKeys.reduce((acc, key) => {
        const value = defaults[key];
        acc[key] = isPlainObject(value) ? formatDefaultToString(value, control) : value;
        return acc;
      }, {}),
    };
  }
  return item;
}
