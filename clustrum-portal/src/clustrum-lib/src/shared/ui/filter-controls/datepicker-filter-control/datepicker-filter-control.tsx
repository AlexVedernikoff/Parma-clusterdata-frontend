import React, { useEffect, useState, useCallback } from 'react';
import cn from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import './datepicker-filter-control.css';

export interface DatepickerProps {
  className?: string;
  dateFormat?: string;
  label: string;
  maxDate?: string;
  minDate?: string;
  value?: string;
  onChange(value: string): void;
}

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export function DatepickerFilterControl({
  className,
  label,
  maxDate,
  minDate,
  value,
  dateFormat = DEFAULT_DATE_FORMAT,
  onChange,
}: DatepickerProps): JSX.Element {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    const currentValue = dayjs(value);
    if (isValid && currentValue.isValid()) {
      setDate(currentValue);
    } else {
      setDate(null);
    }
  }, [isValid, value]);

  const handleChange = useCallback((dateValue: Dayjs | null): void => {
    if (dateValue) {
      setIsValid(true);
      onChange(dateValue.format(DEFAULT_DATE_FORMAT));
    } else {
      setIsValid(false);
    }
  }, []);

  return (
    <div className={cn('datepicker-control', className)}>
      <label className="datepicker-control__label">
        {`${label}:`}
        <div className="datepicker-control__picker">
          <DatePicker
            className={cn(!isValid && 'datepicker-control__picker--invalid')}
            disabledDate={(current): boolean =>
              (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
              (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
            }
            format={dateFormat}
            locale={ruRU.DatePicker}
            picker="date"
            value={date}
            onChange={handleChange}
          />
          {!isValid && (
            <div className="datepicker-control__validation-msg">Укажите дату</div>
          )}
        </div>
      </label>
    </div>
  );
}
