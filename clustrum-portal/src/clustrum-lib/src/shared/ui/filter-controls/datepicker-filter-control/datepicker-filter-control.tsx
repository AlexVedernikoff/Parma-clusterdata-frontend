import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { antdLocales, locales, LangType } from '../locale/locale';
import './datepicker-filter-control.css';

interface IDatepickerProps {
  className?: string;
  dateFormat?: string;
  label?: string;
  locale?: LangType;
  maxDate?: string;
  minDate?: string;
  value?: string;
  onChange(value: string): void;
}

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export const DatepickerFilterControl = ({
  className,
  label,
  maxDate,
  minDate,
  value,
  dateFormat = DEFAULT_DATE_FORMAT,
  locale = 'ru',
  onChange,
}: IDatepickerProps): JSX.Element => {
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

  return (
    <div className={classNames('datepicker-control__wrapper', className)}>
      {label && <span className="datepicker-control__label">{label}:</span>}
      <div className="datepicker-control">
        <DatePicker
          className={classNames(!isValid && 'datepicker-control__invalid')}
          disabledDate={(current): boolean =>
            (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
            (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
          }
          format={dateFormat}
          locale={antdLocales[locale].DatePicker}
          picker="date"
          value={date}
          onChange={(dateValue): void => {
            if (dateValue) {
              setIsValid(true);
              onChange(dateValue.format(DEFAULT_DATE_FORMAT));
            } else {
              setIsValid(false);
            }
          }}
        />
        {!isValid && <div className="datepicker-control__validation-msg">{locales[locale].noDateError}</div>}
      </div>
    </div>
  );
};
