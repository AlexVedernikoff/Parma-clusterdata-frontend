import { Dayjs } from 'dayjs';
import { DEFAULT_DATE_FORMAT } from '../constants';

export const getIntervalString = (
  from: Dayjs,
  to: Dayjs,
  dateFormat: string = DEFAULT_DATE_FORMAT,
): string => `__interval_${from.format(dateFormat)}_${to.format(dateFormat)}`;
