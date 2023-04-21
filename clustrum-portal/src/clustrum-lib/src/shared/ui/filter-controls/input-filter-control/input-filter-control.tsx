import React, { useState, useEffect, FC } from 'react';
import { Input } from 'antd';
import { useDebounce } from '@clustrum-lib/shared/lib/hooks';
import classnames from 'classnames';
import './input-filter-control.css';

interface IInputFilterControl {
  label: string;
  placeholder: string;
  defaultValue: string;
  onChange(str: string): void;
  className: string;
}

export const InputFilterControl: FC<IInputFilterControl> = ({
  label,
  placeholder,
  defaultValue,
  onChange,
  className,
}) => {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    onChange(value);
  }, [debouncedValue]);

  return (
    <div className={classnames('input-filter-control__wrapper', className)}>
      {label && <span className="input-filter-control__label">{label}:</span>}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={({ currentTarget }): void => setValue(currentTarget.value)}
        onPressEnter={(): void => onChange(value)}
      />
    </div>
  );
};

InputFilterControl.displayName = 'InputFilterControl';
