import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDebounce } from '../../../lib/hooks/use-debounce/use-debounce';
import classnames from 'classnames';
import './input-filter-control.css';

export interface InputFilterControlProps {
  className?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?(str: string): void;
}

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
    onChange?.(value);
  }, [debouncedValue]);

  return (
    <div className={classnames('input-filter-control__wrapper', className)}>
      <label className="input-filter-control__label">
        {label ? <span className="input-filter-control__label-text">{`${label}:`}</span> : ''}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={({ currentTarget }): void => setValue(currentTarget.value)}
          onPressEnter={(): void => onChange?.(value)}
          className="input-filter-control__input"
        />
      </label>
    </div>
  );
}
