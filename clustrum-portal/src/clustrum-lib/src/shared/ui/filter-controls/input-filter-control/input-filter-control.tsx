import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDebounce } from '@lib-shared/lib/hooks/use-debounce';
import classNames from 'classnames';
import { InputFilterControlProps } from './types';

import './input-filter-control.css';

export function InputFilterControl({
  label,
  placeholder,
  defaultValue = '',
  onChange,
  className,
}: InputFilterControlProps): JSX.Element {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className={classNames('input-filter-control', className)}>
      <label className="input-filter-control__label">
        {`${label}:`}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={({ currentTarget }): void => setValue(currentTarget.value)}
          onPressEnter={(): void => onChange(value)}
          className="input-filter-control__input"
        />
      </label>
    </div>
  );
}
