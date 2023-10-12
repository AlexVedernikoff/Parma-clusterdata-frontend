import { Dayjs } from 'dayjs';
import { DEFAULT_DATE_FORMAT, END_TIME, START_TIME } from '../constants';
import { IntervalStringParams } from '../../types';

export const getIntervalString = (
  from: Dayjs,
  to: Dayjs,
  {
    dateFormat = DEFAULT_DATE_FORMAT,
    withDefaultTime = false,
  }: IntervalStringParams = {},
): string => {
  const [startTime, endTime] = withDefaultTime ? [START_TIME, END_TIME] : ['', ''];

  return `__interval_${from.format(dateFormat)}${startTime}_${to.format(
    dateFormat,
  )}${endTime}`;
};
