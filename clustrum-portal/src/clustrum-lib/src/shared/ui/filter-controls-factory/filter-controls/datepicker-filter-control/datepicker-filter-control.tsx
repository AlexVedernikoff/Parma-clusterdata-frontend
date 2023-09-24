import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '@lib-shared/lib/utils';
import { DatepickerFilterControlProps } from './types';
import { PlacementPosition } from '@lib-shared/ui/filter-controls-factory/types';
import { DEFAULT_DATE_FORMAT } from '../../lib/constants';

import styles from './datepicker-filter-control.module.css';
import { LabelWithHover } from '../../labelWithHover';

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
    showTitle: needShowTitle,
  } = props;
  const [date, setDate] = useState<Dayjs | null>(null);
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentValue = defaultValue && dayjs(defaultValue);

    if (currentValue && currentValue?.isValid()) {
      setDate(currentValue);
    } else {
      setDate(null);
      onChange?.('');
    }
  }, [defaultValue]);

  const handleChange = (dateValue: Dayjs | null): void => {
    if (!onChange) {
      return;
    }
    if (dateValue) {
      onChange(dateValue.format(DEFAULT_DATE_FORMAT));
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
    <div className={classNames(styles['datepicker-control'], className)}>
      <label className={styles['datepicker-control__label']}>
        <LabelWithHover label={label} />
        {needShowTitle && `${label}:`}
        <div ref={pickerRef}>
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
