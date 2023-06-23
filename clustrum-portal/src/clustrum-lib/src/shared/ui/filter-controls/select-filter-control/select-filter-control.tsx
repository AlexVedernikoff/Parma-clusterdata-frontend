import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
import { SelectFilterControlProps } from './types';
import { useDebounce } from '@lib-shared/lib/hooks/use-debounce';
import { SelectionAllBtn } from './selection-all-btn';
import { CheckOutlined } from '@ant-design/icons';

import './select-filter-control.css';

export function SelectFilterControl(props: SelectFilterControlProps): JSX.Element {
  const {
    multiselect = false,
    searchable = true,
    value = [],
    content,
    onChange,
    label,
    className,
  } = props;
  const [currentValue, setCurrentValue] = useState<string | string[]>(value);
  const debouncedValue = useDebounce(currentValue, 500);

  const allValues = content.map(({ value }) => value);
  const isClearBtnVisible =
    Array.isArray(currentValue) && allValues.length === currentValue.length;

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className={classNames('select-filter-control', className)}>
      <label className="select-filter-control__label">
        {`${label}:`}
        <Select
          placeholder="Все"
          className="select-filter-control__select"
          mode={multiselect ? 'multiple' : undefined}
          maxTagCount="responsive"
          allowClear={multiselect}
          showSearch={searchable}
          value={currentValue}
          options={content.map(({ title, value }) => ({
            value,
            title,
            key: value,
          }))}
          onChange={setCurrentValue}
          onSelect={(newValue: string): void => {
            if (!multiselect && newValue === currentValue) {
              setCurrentValue([]);
            }
          }}
          dropdownRender={(menu): React.ReactElement => (
            <>
              {multiselect && isClearBtnVisible ? (
                <SelectionAllBtn
                  onClick={(): void => setCurrentValue([])}
                  label="Очистить"
                />
              ) : (
                <SelectionAllBtn
                  onClick={(): void => setCurrentValue(allValues)}
                  label="Выбрать все"
                  icon={<CheckOutlined />}
                />
              )}
              {menu}
            </>
          )}
        />
      </label>
    </div>
  );
}
