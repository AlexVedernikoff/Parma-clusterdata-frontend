import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '@lib-shared/lib/utils';
import { Range, RangeDatepickerFilterControlProps } from './types';

import './range-datepicker-filter-control.css';

const { RangePicker } = DatePicker;
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const POPUP_WIDTH = 576;

export function RangeDatepickerFilterControl({
  className,
  label,
  maxDate,
  minDate,
  value,
  dateFormat = DEFAULT_DATE_FORMAT,
  onChange,
}: RangeDatepickerFilterControlProps): JSX.Element {
  const [dateRange, setDateRange] = useState<Range>(null);
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value?.from && value?.to) {
      const from = dayjs(value.from);
      const to = dayjs(value.to);
      if (from.isValid() && to.isValid()) {
        setDateRange([from, to]);
        return;
      }
    }
    setDateRange(null);
  }, [value]);

  useEffect(() => {
    onChange({
      from: value?.from ? dayjs(value.from).format(DEFAULT_DATE_FORMAT) : '',
      to: value?.to ? dayjs(value.to).format(DEFAULT_DATE_FORMAT) : '',
    });
  }, []);

  const handleChange = (values: Range): void => {
    if (values?.[0] && values?.[1]) {
      onChange({
        from: values[0].format(DEFAULT_DATE_FORMAT),
        to: values[1].format(DEFAULT_DATE_FORMAT),
      });
    } else {
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

  return (
    <div className={classNames('range-datepicker-control', className)}>
      <label className="range-datepicker-control__label">
        {`${label}:`}
        <div ref={pickerRef} className="range-datepicker-control__picker">
          <RangePicker
            disabledDate={(current): boolean =>
              (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
              (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
            }
            format={dateFormat}
            locale={ruRU.DatePicker}
            picker="date"
            placement={shouldMoveCalendar ? 'bottomRight' : 'bottomLeft'}
            value={dateRange}
            onChange={handleChange}
            onOpenChange={handleCalendarPosition}
          />
        </div>
      </label>
    </div>
  );
}
