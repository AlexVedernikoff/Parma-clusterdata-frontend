import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '@lib-shared/lib/utils';
import { DatepickerFilterControlProps } from './types';
import {
  FieldDataType,
  PlacementPosition,
} from '@lib-shared/ui/filter-controls-factory/types';
import { DEFAULT_DATE_FORMAT, INTERVAL_FORMAT_REGEX } from '../../lib/constants';
import { getIntervalString } from '../../lib/helpers';

import styles from './datepicker-filter-control.module.css';
import { LabelWithHover } from '../../label-with-hover';
import { renderCustomDate } from '../../custom-date';

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
    fieldDataType,
    onChange,
    showTitle: needShowTitle,
  } = props;
  const [date, setDate] = useState<Dayjs | null>(null);
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dateWithoutTime = defaultValue;
    if (fieldDataType === FieldDataType.DateTime) {
      const parsedDates = defaultValue && defaultValue.match(INTERVAL_FORMAT_REGEX);
      if (parsedDates) {
        dateWithoutTime = parsedDates[1];
      }
    }
    const currentValue = dateWithoutTime && dayjs(dateWithoutTime);

    if (currentValue && currentValue?.isValid()) {
      setDate(currentValue);
    } else {
      setDate(null);
    }
  }, [defaultValue, fieldDataType]);

  const handleChange = (dateValue: Dayjs | null): void => {
    if (!onChange) {
      return;
    }
    if (dateValue) {
      const withDefaultTime = fieldDataType === FieldDataType.DateTime;
      const dateString = withDefaultTime
        ? getIntervalString(dateValue, dateValue, { withDefaultTime })
        : dateValue.format(DEFAULT_DATE_FORMAT);
      onChange(dateString);
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
        {needShowTitle && <LabelWithHover label={label} />}
        <div ref={pickerRef}>
          <DatePicker
            disabledDate={hasDisabled}
            dateRender={renderCustomDate(dateFormat)}
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
