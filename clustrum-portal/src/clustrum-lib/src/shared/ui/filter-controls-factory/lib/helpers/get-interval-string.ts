import { Dayjs } from 'dayjs';
import { DEFAULT_DATE_FORMAT, END_TIME, START_TIME } from '../constants';
import { IntervalStringParams } from '../../types';

export const getIntervalString = (
  from: Dayjs,
  to: Dayjs,
  { dateFormat = DEFAULT_DATE_FORMAT, withDefaultTime = false }: IntervalStringParams,
): string => {
  if (withDefaultTime) {
    return `__interval_${from.format(dateFormat)}${START_TIME}_${to.format(
      dateFormat,
    )}${END_TIME}`;
  }

  return `__interval_${from.format(dateFormat)}_${to.format(dateFormat)}`;
};
