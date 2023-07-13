import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDebounce } from '@lib-shared/lib/hooks';
import classNames from 'classnames';
import { InputFilterControlProps } from './types';

import './input-filter-control.css';

export function InputFilterControl(props: InputFilterControlProps): JSX.Element | null {
  const { label, placeholder, defaultValue = '', onChange, className } = props;
  const [value, setValue] = useState<string>(defaultValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]);

  if (!onChange) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.currentTarget.value);
  };

  const handlePress = (): void => {
    onChange(value);
  };

  return (
    <div className={classNames('input-filter-control', className)}>
      <label className="input-filter-control__label">
        {`${label}:`}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onPressEnter={handlePress}
          className="input-filter-control__input"
        />
      </label>
    </div>
  );
}
