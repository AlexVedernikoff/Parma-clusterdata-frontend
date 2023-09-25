import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '@lib-shared/lib/utils';
import { Range, RangeDatepickerFilterControlProps } from './types';
import { PlacementPosition } from '@lib-shared/ui/filter-controls-factory/types';
import { getIntervalString } from '../../lib/helpers';
import { DEFAULT_DATE_FORMAT } from '../../lib/constants';

import styles from './range-datepicker-filter-control.module.css';
import { LabelWithHover } from '../../label-with-hover';

const { RangePicker } = DatePicker;
const RANGE_PLACEHOLDER: [string, string] = ['От дд.мм.гггг', 'До дд.мм.гггг'];
const POPUP_WIDTH = 576;
const intervalFormat = /^__interval_(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})$/;

export function RangeDatepickerFilterControl(
  props: RangeDatepickerFilterControlProps,
): JSX.Element {
  const {
    className,
    label,
    maxDate,
    minDate,
    defaultValue,
    dateFormat = DEFAULT_DATE_FORMAT,
    onChange,
    showTitle: needShowTitle,
  } = props;
  const [dateRange, setDateRange] = useState<Range>(null);
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsedDates = defaultValue?.length && defaultValue.match(intervalFormat);

    if (!parsedDates) {
      setDateRange(null);
      onChange?.('');
      return;
    }

    const from = dayjs(parsedDates[1]);
    const to = dayjs(parsedDates[2]);

    if (from?.isValid() && to?.isValid() && onChange) {
      setDateRange([from, to]);
    }
  }, [defaultValue]);

  const handleChange = (values: Range): void => {
    if (!onChange) {
      return;
    }
    if (values?.[0] && values?.[1]) {
      onChange(getIntervalString(values[0], values[1]));
    } else {
      onChange('');
    }
  };

  const handleCalendarPosition = (isOpening: boolean): void => {
    if (isOpening) {
      setShouldMoveCalendar(shouldMoveDropdown(pickerRef?.current, POPUP_WIDTH));
    }
  };

  const hasDisabled = (current: Dayjs): boolean => {
    return (
      (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
      (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
    );
  };

  const placementPosition = shouldMoveCalendar
    ? PlacementPosition.BottomRight
    : PlacementPosition.BottomLeft;

  return (
    <div className={classNames(styles['range-datepicker-control'], className)}>
      <label className={styles['range-datepicker-control__label']}>
        {needShowTitle && <LabelWithHover label={label} />}
        <div ref={pickerRef}>
          <RangePicker
            disabledDate={hasDisabled}
            format={dateFormat}
            locale={ruRU.DatePicker}
            picker="date"
            placement={placementPosition}
            placeholder={RANGE_PLACEHOLDER}
            value={dateRange}
            onChange={handleChange}
            onOpenChange={handleCalendarPosition}
          />
        </div>
      </label>
    </div>
  );
}
