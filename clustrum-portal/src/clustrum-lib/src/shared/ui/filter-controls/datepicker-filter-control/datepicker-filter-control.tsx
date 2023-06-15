import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { DatePicker } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { shouldMoveDropdown } from '../../../lib/utils/should-move-dropdown/should-move-dropdown';
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
const POPUP_WIDTH = 288;

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
  const [shouldMoveCalendar, setShouldMoveCalendar] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentValue = dayjs(value);
    if (isValid && currentValue.isValid()) {
      setDate(currentValue);
    } else {
      setDate(null);
    }
  }, [isValid, value]);

  const handleChange = (dateValue: Dayjs | null): void => {
    if (dateValue) {
      setIsValid(true);
      onChange(dateValue.format(DEFAULT_DATE_FORMAT));
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className={cn('datepicker-control', className)}>
      <label className="datepicker-control__label">
        {`${label}:`}
        <div ref={pickerRef} className="datepicker-control__picker">
          <DatePicker
            className={cn(!isValid && 'datepicker-control__picker--invalid')}
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
            onOpenChange={(isOpening): void => {
              if (isOpening) {
                setShouldMoveCalendar(
                  shouldMoveDropdown(pickerRef?.current, POPUP_WIDTH),
                );
              }
            }}
          />
          {!isValid && (
            <div className="datepicker-control__validation-msg">Укажите дату</div>
          )}
        </div>
      </label>
    </div>
  );
}
