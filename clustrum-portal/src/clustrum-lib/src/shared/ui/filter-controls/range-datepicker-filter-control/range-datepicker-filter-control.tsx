import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { PickerValue } from './types/picker-value';
import { Range } from './types/range';
import './range-datepicker-filter-control.css';
const { RangePicker } = DatePicker;

export interface RangeDatepickerProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  value?: PickerValue;
  onChange(value: PickerValue): void;
}

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export function RangeDatepickerFilterControl({
  className,
  label,
  maxDate,
  minDate,
  value,
  dateFormat = DEFAULT_DATE_FORMAT,
  onChange,
}: RangeDatepickerProps): JSX.Element {
  const [dateRange, setDateRange] = useState<Range>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    const from = dayjs(value?.from);
    const to = dayjs(value?.to);
    if (isValid && from.isValid() && to.isValid()) {
      setDateRange([from, to]);
    } else {
      setDateRange(null);
    }
  }, [isValid, value]);

  const handleChange = useCallback((values: Range): void => {
    if (values?.[0] && values?.[1]) {
      setIsValid(true);
      onChange({
        from: values[0].format(DEFAULT_DATE_FORMAT),
        to: values[1].format(DEFAULT_DATE_FORMAT),
      });
    } else {
      setIsValid(false);
    }
  }, []);

  return (
    <div className={cn('range-datepicker-control', className)}>
      <label className="range-datepicker-control__label">
        {`${label}:`}
        <div className="range-datepicker-control__picker">
          <RangePicker
            className={cn(!isValid && 'range-datepicker-control__picker--invalid')}
            disabledDate={(current): boolean =>
              (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
              (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
            }
            format={dateFormat}
            locale={ruRU.DatePicker}
            picker="date"
            value={dateRange}
            onChange={handleChange}
          />
          {!isValid && <div className="range-datepicker-control__validation-msg">Укажите обе даты диапазона</div>}
        </div>
      </label>
    </div>
  );
}