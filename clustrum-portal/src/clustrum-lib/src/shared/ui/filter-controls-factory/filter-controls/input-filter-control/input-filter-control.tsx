import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDebounce } from '@lib-shared/lib/hooks';
import classNames from 'classnames';
import { InputFilterControlProps } from './types';

import styles from './input-filter-control.module.css';
import { LabelWithHover } from '../../labelWithHover';

export function InputFilterControl(props: InputFilterControlProps): JSX.Element | null {
  const {
    label,
    placeholder,
    defaultValue = '',
    onChange,
    className,
    showTitle: needShowTitle,
  } = props;
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
    <div className={classNames(styles['input-filter-control'], className)}>
      <label className={styles['input-filter-control__label']}>
        {needShowTitle && <LabelWithHover label={label} />}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onPressEnter={handlePress}
        />
      </label>
    </div>
  );
}
