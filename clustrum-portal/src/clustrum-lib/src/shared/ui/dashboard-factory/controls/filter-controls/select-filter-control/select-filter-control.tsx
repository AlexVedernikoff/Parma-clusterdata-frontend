import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Select, SelectProps } from 'antd';
import { OptionsTypes, SelectFilterControlProps } from './types';
import { useDebounce } from '@lib-shared/lib/hooks';
import { SelectionAllBtn } from './selection-all-btn';
import { CheckOutlined } from '@ant-design/icons';

import styles from './select-filter-control.module.css';

export function SelectFilterControl(props: SelectFilterControlProps): JSX.Element {
  const {
    multiselect = false,
    searchable = true,
    defaultValue = [],
    content,
    onChange,
    label,
    className,
  } = props;
  const [currentValue, setCurrentValue] = useState<string | string[]>(defaultValue);
  const debouncedValue = useDebounce(currentValue, 500);

  const allValues = content.map(({ value }) => value);
  const isClearBtnVisible =
    Array.isArray(currentValue) && allValues.length === currentValue.length;

  useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]);

  const handleSelect = (newValue: string): void => {
    if (!multiselect && newValue === currentValue) {
      setCurrentValue([]);
    }
  };

  const getOptions = (): OptionsTypes[] =>
    content.map(({ title, value }) => ({
      value,
      title,
      key: value,
    }));

  const getDropdown = (menu: JSX.Element): JSX.Element => {
    return (
      <>
        {multiselect && isClearBtnVisible ? (
          <SelectionAllBtn onClick={(): void => setCurrentValue([])} label="Очистить" />
        ) : (
          <SelectionAllBtn
            onClick={(): void => setCurrentValue(allValues)}
            label="Выбрать все"
            icon={<CheckOutlined />}
          />
        )}
        {menu}
      </>
    );
  };

  const mode: SelectProps['mode'] = multiselect ? 'multiple' : undefined;

  return (
    <div className={classNames(styles['select-filter-control'], className)}>
      <label className={styles['select-filter-control__label']}>
        {`${label}:`}
        <Select
          placeholder="Все"
          className={styles['select-filter-control__select']}
          mode={mode}
          maxTagCount="responsive"
          allowClear={multiselect}
          showSearch={searchable}
          value={currentValue}
          options={getOptions()}
          onChange={setCurrentValue}
          onSelect={handleSelect}
          dropdownRender={getDropdown}
        />
      </label>
    </div>
  );
}
