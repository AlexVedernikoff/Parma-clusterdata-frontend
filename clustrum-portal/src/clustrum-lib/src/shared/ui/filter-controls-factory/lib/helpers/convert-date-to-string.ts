import dayjs from 'dayjs';
import { DateParams, DefaultValueType } from '../../types';
import { DEFAULT_DATE_FORMAT } from '../constants';
import { getIntervalString } from './get-interval-string';

export const convertDateToString = (date: DateParams, isRange?: boolean): string => {
  let from;
  let to;

  switch (date?.type) {
    case DefaultValueType.Date:
    case DefaultValueType.DefaultRanges:
      from = date.value.from && dayjs(date.value.from);
      to = date.value.to && dayjs(date.value.to);
      break;
    case DefaultValueType.Relative:
      from = date.value.from && dayjs().subtract(parseInt(date.value.from), 'day');
      to = date.value.to && dayjs().add(parseInt(date.value.to), 'day');
      break;
    default:
      from = null;
      to = null;
  }

  if ((isRange || isRange === undefined) && from && to) {
    return getIntervalString(from, to);
  }

  return from ? from.format(DEFAULT_DATE_FORMAT) : '';
};
