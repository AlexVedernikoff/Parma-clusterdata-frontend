import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Select, SelectProps } from 'antd';
import { OptionsTypes, SelectFilterControlProps } from './types';
import { useDebounce } from '@lib-shared/lib/hooks';
import { SelectionAllBtn } from './selection-all-btn';
import styles from './select-filter-control.module.css';
import { LabelWithHover } from '../../label-with-hover';

export function SelectFilterControl(props: SelectFilterControlProps): JSX.Element {
  const {
    multiselect = false,
    searchable = true,
    defaultValue = [],
    content,
    onChange,
    label,
    className,
    showTitle: needShowTitle,
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
      onChange(debouncedValue ?? []);
    }
  }, [debouncedValue, onChange]);

  useEffect(() => {
    if (!multiselect && typeof defaultValue !== 'string') {
      setCurrentValue(defaultValue[0]);
    }
  }, [defaultValue, multiselect]);

  const handleSelect = (newValue: string): void => {
    if (!multiselect && newValue === currentValue) {
      setCurrentValue([]);
    }
  };

  const handleChange = (values: string | string[] | undefined): void => {
    setCurrentValue(values ?? []);
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
        {multiselect && (
          <SelectionAllBtn
            allValues={allValues}
            showClearButton={isClearBtnVisible}
            onClick={setCurrentValue}
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
        {needShowTitle && <LabelWithHover label={label} />}
        <Select
          allowClear
          placeholder="Все"
          className={styles['select-filter-control__select']}
          mode={mode}
          maxTagCount="responsive"
          showSearch={searchable}
          value={currentValue}
          options={getOptions()}
          onChange={handleChange}
          onSelect={handleSelect}
          dropdownRender={getDropdown}
        />
      </label>
    </div>
  );
}
