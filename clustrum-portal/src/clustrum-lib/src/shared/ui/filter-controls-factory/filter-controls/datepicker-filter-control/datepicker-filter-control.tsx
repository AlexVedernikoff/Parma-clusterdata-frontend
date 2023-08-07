import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '@lib-shared/lib/utils';
import { DatepickerFilterControlProps } from './types';
import {
  DefaultValueType,
  PlacementPosition,
} from '@lib-shared/ui/filter-controls-factory/types';

import styles from './datepicker-filter-control.module.css';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const POPUP_WIDTH = 288;

export function DatepickerFilterControl(
  props: DatepickerFilterControlProps,
): JSX.Element {
  const {
    className,
    label,
    maxDate,
    minDate,
    defaultValue,
    dateFormat = DEFAULT_DATE_FORMAT,
    onChange,
  } = props;
  const [date, setDate] = useState<Dayjs | null>(null);
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentValue;
    switch (defaultValue?.type) {
      case DefaultValueType.Date:
        currentValue = dayjs(defaultValue.value.from);
        break;

      case DefaultValueType.Relative:
        currentValue = dayjs().subtract(parseInt(defaultValue.value.from), 'day');
        break;

      default:
        currentValue = null;
    }

    if (!currentValue && defaultValue) {
      return;
    }

    if (currentValue?.isValid() && onChange) {
      setDate(currentValue);
      onChange(currentValue.format(DEFAULT_DATE_FORMAT));
    } else {
      setDate(null);
    }
  }, [defaultValue]);

  const handleChange = (dateValue: Dayjs | null): void => {
    if (!onChange) {
      return;
    }
    if (dateValue) {
      setDate(dateValue);
      onChange(dateValue.format(DEFAULT_DATE_FORMAT));
    } else {
      setDate(null);
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
    <div className={classNames(styles['datepicker-control'], className)}>
      <label className={styles['datepicker-control__label']}>
        {`${label}:`}
        <div ref={pickerRef} className={styles['datepicker-control__picker']}>
          <DatePicker
            disabledDate={hasDisabled}
            format={dateFormat}
            locale={ruRU.DatePicker}
            picker="date"
            placement={placementPosition}
            value={date}
            onChange={handleChange}
            onOpenChange={handleCalendarPosition}
          />
        </div>
      </label>
    </div>
  );
}
