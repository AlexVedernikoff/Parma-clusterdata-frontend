import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '../../../lib/utils/should-move-dropdown';
import { DatepickerFilterControlProps } from './types';

import './datepicker-filter-control.css';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const POPUP_WIDTH = 288;

export function DatepickerFilterControl({
  className,
  label,
  maxDate,
  minDate,
  value,
  dateFormat = DEFAULT_DATE_FORMAT,
  onChange,
}: DatepickerFilterControlProps): JSX.Element {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentValue = dayjs(value);
    if (currentValue.isValid()) {
      setDate(currentValue);
    } else {
      setDate(null);
    }
  }, [value]);

  const handleChange = (dateValue: Dayjs | null): void => {
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

  return (
    <div className={classNames('datepicker-control', className)}>
      <label className="datepicker-control__label">
        {`${label}:`}
        <div ref={pickerRef} className="datepicker-control__picker">
          <DatePicker
            disabledDate={(current): boolean =>
              (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
              (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
            }
            format={dateFormat}
            locale={ruRU.DatePicker}
            picker="date"
            placement={shouldMoveCalendar ? 'bottomRight' : 'bottomLeft'}
            value={date}
            onChange={handleChange}
            onOpenChange={handleCalendarPosition}
          />
        </div>
      </label>
    </div>
  );
}
