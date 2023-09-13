import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '@lib-shared/lib/utils';
import { Range, RangeDatepickerFilterControlProps } from './types';
import {
  DefaultValueType,
  PlacementPosition,
} from '@lib-shared/ui/filter-controls-factory/types';

import styles from './range-datepicker-filter-control.module.css';

const { RangePicker } = DatePicker;
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const RANGE_PLACEHOLDER: [string, string] = ['От дд.мм.гггг', 'До дд.мм.гггг'];
const POPUP_WIDTH = 576;

// eslint-disable-next-line max-lines-per-function
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
    let from;
    let to;

    if (!defaultValue) {
      setDateRange(null);
      return;
    }

    switch (defaultValue?.type) {
      case DefaultValueType.Date:
      case DefaultValueType.DefaultRanges:
        from = dayjs(defaultValue.value.from);
        to = dayjs(defaultValue.value.to);
        break;

      case DefaultValueType.Relative:
        from = dayjs().subtract(parseInt(defaultValue.value.from), 'day');
        to = dayjs().add(parseInt(defaultValue.value.to), 'day');
        break;

      default:
        from = null;
        to = null;
    }

    if (from?.isValid() && to?.isValid() && onChange) {
      setDateRange([from, to]);
      onChange({
        from: `__inter${from.format(DEFAULT_DATE_FORMAT)}`,
        to: to.format(DEFAULT_DATE_FORMAT),
      });
    }
  }, [defaultValue]);

  const handleChange = (values: Range): void => {
    if (!onChange) {
      return;
    }
    if (values?.[0] && values?.[1]) {
      setDateRange([values[0], values[1]]);
      onChange({
        from: `__interval_${values[0].format(DEFAULT_DATE_FORMAT)}`,
        to: values[1].format(DEFAULT_DATE_FORMAT),
      });
    } else {
      setDateRange(null);
      onChange({
        from: '',
        to: '',
      });
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
        {needShowTitle && `${label}:`}
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
