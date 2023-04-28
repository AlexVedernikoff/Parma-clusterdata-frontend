import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { antdLocales, locales, LangType } from '../locale/locale';
import './range-datepicker-filter-control.css';
const { RangePicker } = DatePicker;

type TRangeDatepickerValue = {
  from?: string;
  to?: string;
};

interface IRangeDatepickerProps {
  className?: string;
  dateFormat?: string;
  label?: string;
  locale?: LangType;
  maxDate?: string;
  minDate?: string;
  value?: TRangeDatepickerValue;
  onChange(value: TRangeDatepickerValue): void;
}

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export const RangeDatepickerFilterControl = ({
  className,
  label,
  maxDate,
  minDate,
  value,
  dateFormat = DEFAULT_DATE_FORMAT,
  locale = 'ru',
  onChange,
}: IRangeDatepickerProps): JSX.Element => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
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

  return (
    <div className={classNames('range-datepicker-control__wrapper', className)}>
      {label && <span className="range-datepicker-control__label">{label}:</span>}
      <div className="range-datepicker-control">
        <RangePicker
          className={classNames(!isValid && 'range-datepicker-control__invalid')}
          disabledDate={(current): boolean =>
            (Boolean(minDate) && current.isBefore(minDate, 'date')) ||
            (Boolean(maxDate) && current.isAfter(maxDate, 'date'))
          }
          format={dateFormat}
          locale={antdLocales[locale].DatePicker}
          picker="date"
          value={dateRange}
          onChange={(dates): void => {
            if (dates?.[0] && dates?.[1]) {
              setIsValid(true);
              onChange({
                from: dates[0].format(DEFAULT_DATE_FORMAT),
                to: dates[1].format(DEFAULT_DATE_FORMAT),
              });
            } else {
              setIsValid(false);
            }
          }}
        />
        {!isValid && (
          <div className="range-datepicker-control__validation-msg">{locales[locale].invalidDatesRangeError}</div>
        )}
      </div>
    </div>
  );
};
